// src/pages/AdminDashboardPage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart4, Users, DollarSign, ArrowRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const stats = [
    {
      title: "Total Campaigns",
      value: 24,
      change: "+3",
      icon: BarChart4,
      color: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: 342,
      change: "+12",
      icon: Users,
      color: "bg-green-100",
    },
    {
      title: "Total Donations",
      value: "$24,520",
      change: "+$1,240",
      icon: DollarSign,
      color: "bg-purple-100",
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      title: "Summer Internship Program",
      status: "Active",
      raised: "$34,250",
      goal: "$50,000",
    },
    {
      id: 2,
      title: "Tech Skill Development",
      status: "Active",
      raised: "$12,750",
      goal: "$25,000",
    },
    {
      id: 3,
      title: "Mentorship Program",
      status: "Completed",
      raised: "$15,000",
      goal: "$15,000",
    },
    {
      id: 4,
      title: "Intern Housing Initiative",
      status: "Draft",
      raised: "$0",
      goal: "$30,000",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage campaigns, users, and platform settings
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/create-campaign">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    {stat.title}
                  </h3>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="text-gray-700" size={20} />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <span className="ml-2 text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Campaigns
              </h2>
              <Button>
                View all campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Raised
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.raised}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.goal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </a>
                        <a href="#" className="text-red-600 hover:text-red-900">
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mr-4" />
                  <div>
                    <p className="font-medium">
                      John Doe donated $50 to Summer Internship Program
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
