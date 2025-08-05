// src/pages/CampaignPage.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Filter } from "lucide-react";
import CampaignCard from "@/components/dashboard/CampaignCard";
import useCampaigns from "@/hooks/useCampaigns";
import CampaignSkeleton from "@/components/dashboard/skeletons/CampaignSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import type { ICampaign } from "@/types/campaign";

const CampaignPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 9;

  const { campaigns, loading, error, totalCount, fetchCampaigns } =
    useCampaigns({
      page,
      limit,
      status: filter === "all" ? undefined : filter,
      search: searchQuery || undefined,
    });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCampaigns({
        page: 1,
        limit,
        status: filter === "all" ? undefined : filter,
        search: searchQuery || undefined,
      });
      setPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">All Campaigns</h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {filter === "all" && "All Campaigns"}
                {filter === "active" && "Active Only"}
                {filter === "completed" && "Completed"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Campaigns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("active")}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CampaignSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          title="Error loading campaigns"
          description={error}
          action={<Button onClick={() => fetchCampaigns()}>Try Again</Button>}
        />
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns &&
              campaigns?.length !== 0 &&
              campaigns.map((campaign, index) => (
                <CampaignCard
                  key={index}
                  campaign={campaign as ICampaign}
                  showStatus={true}
                />
              ))}
          </div>

          {campaigns?.length === 0 && (
            <EmptyState
              title="No campaigns found"
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : filter === "active"
                  ? "There are currently no active campaigns"
                  : "No campaigns match your filters"
              }
            />
          )}

          {totalCount > limit && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {page > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </Button>
                )}
                {Array.from({ length: Math.ceil(totalCount / limit) }).map(
                  (_, index) => (
                    <Button
                      key={index}
                      variant={page === index + 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  )
                )}
                {page < Math.ceil(totalCount / limit) && (
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignPage;
