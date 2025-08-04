// src/components/ContributeModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import apiService from "@/api/client";
import { toast } from "sonner";
import isAxiosError from "@/utility/isAxiosError";

interface ContributeModalProps {
  campaignId: string;
  campaignTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDonationSuccess: () => void; // Callback for success
}

const ContributeModal = ({
  campaignId,
  campaignTitle,
  open,
  onOpenChange,
  onDonationSuccess,
}: ContributeModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Donation processing...");

    try {
      await apiService.donateToCampaign(campaignId, {
        amount,
        message,
        anonymous,
      });
      // Show success message
      toast.success("Donation added successfully!", { id: toastId });
      // Refresh campaign data
      setAmount(0);
      setMessage("");
      setAnonymous(false);
      onDonationSuccess(); // Call the success callback
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add donation");
      }
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Support {campaignTitle}</DialogTitle>
          <DialogDescription>
            Your contribution will help make this campaign successful.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="amount" className="py-2">
              Contribution Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="50.00"
            />
          </div>

          <div>
            <Label htmlFor="message" className="py-2">
              Encouraging Message (Optional)
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Keep up the great work!"
            />
          </div>
          <div className="flex items-center mb-4">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={() => setAnonymous(!anonymous)}
            />
            <Label htmlFor="anonymous" className="ml-2">
              Donate anonymously
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleContribute} disabled={!amount || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Contribute"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributeModal;
