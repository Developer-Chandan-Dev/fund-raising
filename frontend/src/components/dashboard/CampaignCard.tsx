// src/components/CampaignCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import apiService from "@/api/client";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  category?: string;
  status?: "active" | "completed";
  imageUrl?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  showStatus?: boolean;
}

const CampaignCard = ({ campaign, showStatus = false }: CampaignCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
  );

  const handleSave = async () => {
    try {
      await apiService.saveCampaign(campaign._id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const handleLike = async () => {
    try {
      await apiService.likeCampaign(campaign._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking campaign:", error);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative">
        <div className="bg-gray-200 border-dashed overflow-hidden w-full h-48">
          <img src={campaign.imageUrl} className="w-full h-full" />
        </div>
        {showStatus && (
          <Badge
            variant={campaign.status === "completed" ? "default" : "secondary"}
            className="absolute top-2 right-2"
          >
            {campaign.status === "completed" ? "Completed" : "Active"}
          </Badge>
        )}
        {campaign.category && (
          <Badge className="absolute top-2 left-2">{campaign.category}</Badge>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        <div className="mt-auto">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                Raised: ${campaign.raisedAmount.toLocaleString()}
              </span>
              <span className="text-gray-600">
                Goal: ${campaign.goalAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-right text-xs text-gray-500 mt-1">
              {progress}% funded
            </div>
          </div>

          <div className="flex justify-between">
            <Link to={`/campaigns/${campaign._id}`}>
              <Button size="sm">View Details</Button>
            </Link>

            <div className="flex space-x-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="icon"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="icon"
                onClick={handleSave}
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
