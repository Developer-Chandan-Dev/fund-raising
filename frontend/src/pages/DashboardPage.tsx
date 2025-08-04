// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import CampaignCard from "@/components/dashboard/CampaignCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart4, BadgeDollarSign, Users, ArrowRight } from "lucide-react";
import useCampaigns from "@/hooks/useCampaigns";
import CampaignSkeleton from "@/components/dashboard/skeletons/CampaignSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import apiService from "@/api/client";

const DashboardPage = () => {
  const [stats] = useState({
    activeCampaigns: 12,
    tasksCompleted: 24,
    contributions: 8,
  });

  const { campaigns, loading, error, fetchCampaigns } = useCampaigns({
    limit: 3,
    status: "active",
  });

  useEffect(() => {
    fetchCampaigns({ limit: 3, status: "active" });
  }, []);

  const fetchCardData = async () => {
    try {
      const response = await apiService.getCardData();
      console.log(response);
    } catch (error) {
      console.log("Failed to getting card data", error);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-50 px-4 py-8 sm:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Intern!</h1>
            <p className="text-blue-100 max-w-2xl">
              You've made a difference in 8 campaigns so far. Keep supporting
              fellow interns!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Active Campaigns
                </h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart4 className="text-blue-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.activeCampaigns}</p>
              <p className="text-sm text-gray-500 mt-1">+2 from last week</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Tasks Completed
                </h3>
                <div className="bg-green-100 p-2 rounded-lg">
                  <BadgeDollarSign className="text-green-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.tasksCompleted}</p>
              <p className="text-sm text-gray-500 mt-1">+5 from last week</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Your Contributions
                </h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="text-purple-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.contributions}</p>
              <p className="text-sm text-gray-500 mt-1">+3 from last week</p>
            </div>
          </div>

          {/* Active Campaigns Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-xl font-bold text-gray-800">
                Active Campaigns
              </h2>
              <Button variant="outline">
                View all campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CampaignSkeleton key={index} />
                ))}
              </div>
            )}

            {error && (
              <EmptyState
                title="Error loading campaigns"
                description={error}
                action={
                  <Button onClick={() => fetchCampaigns()}>Try Again</Button>
                }
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Your Progress
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Fundraising Skills
                  </span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Networking
                  </span>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Campaign Management
                  </span>
                  <span className="text-sm font-medium text-gray-700">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
