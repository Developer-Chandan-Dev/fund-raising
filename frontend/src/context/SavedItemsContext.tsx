import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type SavedItemsContextType } from "@/types/savedItems";
import axios from "axios";
import { useAuth } from "./AuthContext";
import apiService from "@/api/client";

export const SavedItemsContext = createContext<
  SavedItemsContextType | undefined
>(undefined);

export const SavedItemsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const savedCount = savedIds.length;

  // Load saved IDs on mount or when user changes
  useEffect(() => {
    const fetchSavedIds = async () => {
      if (!user?._id) {
        setSavedIds([]);
        return;
      }

      try {
        const response = await apiService.savedCampaigns();

        // Type-safe extraction of saved campaigns
        const savedData = response.data?.savedCampaigns?.[0]?.savedCampaigns;

        // Ensure we have an array and convert all IDs to strings
        const processedIds = Array.isArray(savedData)
          ? savedData.map((id) => id?.toString()).filter(Boolean)
          : [];

        setSavedIds(processedIds);
      } catch (error) {
        console.error("Failed to fetch saved campaigns:", error);
        setSavedIds([]); // Reset on error
      }
    };

    fetchSavedIds();
  }, [user?._id]);

  const toggleSaved = async (campaignId: string) => {
    if (!user?._id) return; // Early return here is fine - not a hook

    try {
      // Optimistic update
      setSavedIds((prev) =>
        prev.includes(campaignId)
          ? prev.filter((_id) => _id !== campaignId)
          : [...prev, campaignId]
      );

      // API call to toggle saved status
      await apiService.saveCampaign(campaignId);
    } catch (error) {
      console.error("Failed to toggle saved status:", error);
      // Revert on error
      setSavedIds((prev) =>
        prev.includes(campaignId)
          ? prev.filter((_id) => _id !== campaignId)
          : [...prev, campaignId]
      );
    }
  };

  const isItemSaved = (_id: string) => {
    return savedIds.includes(_id);
  };

  const clearAll = async () => {
    if (!user?._id) return; // Early return here is fine - not a hook

    try {
      await axios.delete("/api/users/clear-saved");
      setSavedIds([]);
    } catch (error) {
      console.error("Failed to clear saved items:", error);
    }
  };

  return (
    <SavedItemsContext.Provider
      value={{
        savedIds,
        savedCount,
        toggleSaved,
        isItemSaved,
        clearAll,
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
};
