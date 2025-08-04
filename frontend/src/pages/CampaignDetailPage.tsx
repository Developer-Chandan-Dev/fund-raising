import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Share2, Heart, DollarSign } from "lucide-react";
import ContributeModal from "@/components/dashboard/ContributeModal";
import { useEffect, useState } from "react";
import apiService from "@/api/client";
import { type ICampaign } from "@/types/campaign"; // Use our shared interface

const CampaignDetailPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger

  const { id } = useParams<{ id: string }>();
  const [isContributeModalOpen, setIsContributeModalOpen] =
    useState<boolean>(false);

  const fetchCampaign = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCampaignById(id);
      if (response.status === 200) {
        setCampaign(response.data);
      } else {
        setError("Failed to fetch campaign data");
      }
    } catch (error) {
      setError("Failed to fetch campaign. Please try again.");
      console.error("Error fetching campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id, refreshKey]);

   const handleDonationSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!campaign) return <div>Campaign not found</div>;

  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
  );

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-80 object-cover"
              />
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {campaign.title}
                </h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{campaign.description}</p>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Raised: ${campaign.raisedAmount.toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    Goal: ${campaign.goalAmount.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {progress}% funded
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{campaign.donors.length}</p>
                  <p className="text-sm text-gray-600">Donors</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    ${campaign.raisedAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Raised</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {campaign.endDate
                      ? Math.ceil(
                          (new Date(campaign.endDate).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Days left</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{campaign.likes.length}</p>
                  <p className="text-sm text-gray-600">Supporters</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setIsContributeModalOpen(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donate Now
                </Button>
                <Button variant="outline" className="flex-1">
                  Share Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ContributeModal
        campaignId={campaign._id.toString()}
        campaignTitle={campaign.title}
        open={isContributeModalOpen}
        onOpenChange={setIsContributeModalOpen}
        onDonationSuccess={handleDonationSuccess} // Pass callback
      />
    </div>
  );
};

export default CampaignDetailPage;
