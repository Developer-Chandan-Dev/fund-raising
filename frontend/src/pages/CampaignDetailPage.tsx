// src/pages/CampaignDetailPage.tsx
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Share2, Heart, DollarSign } from "lucide-react";
import ContributeModal from "@/components/dashboard/ContributeModal";
import { useState } from "react";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  // In a real app, this would come from an API
  const campaign = {
    id: id,
    title: "Summer Internship Program",
    description:
      "This campaign aims to provide 50 interns with a comprehensive summer program that includes housing, learning resources, and networking opportunities. The program will help interns gain valuable experience and skills to jumpstart their careers.",
    goalAmount: 50000,
    raisedAmount: 34250,
    donors: 127,
    daysLeft: 24,
    organizer: {
      name: "Tech Education Foundation",
      joined: "March 2023",
      campaigns: 5,
    },
  };

  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
  );

  return (
    <>
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
              <div className="bg-gray-200 border-2 border-dashed w-full h-80" />

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
                    <p className="text-2xl font-bold">{campaign.donors}</p>
                    <p className="text-sm text-gray-600">Donors</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      ${campaign.raisedAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Raised</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{campaign.daysLeft}</p>
                    <p className="text-sm text-gray-600">Days left</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">24</p>
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

            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                About the Organizer
              </h2>
              <div className="flex items-start">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
                <div>
                  <h3 className="font-bold text-lg">
                    {campaign.organizer.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Joined {campaign.organizer.joined} •{" "}
                    {campaign.organizer.campaigns} campaigns
                  </p>
                  <p className="text-gray-700">
                    We're a non-profit organization dedicated to helping interns
                    succeed in their careers through education and resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ContributeModal
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        open={isContributeModalOpen}
        onOpenChange={setIsContributeModalOpen}
      />
    </>
  );
};

export default CampaignDetailPage;
