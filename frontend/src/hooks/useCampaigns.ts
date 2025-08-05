// src/hooks/useCampaigns.ts
import { useState, useEffect } from 'react';
import apiService from '@/api/client';
import type { ICampaign } from '@/types/campaign';

interface UseCampaignsResult {
  campaigns: ICampaign[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchCampaigns: (params?: Record<string, unknown>) => Promise<void>;
}

const useCampaigns = (initialParams = {}): UseCampaignsResult => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCampaigns = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCampaigns(params);
      setCampaigns(response.data.campaigns);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      setError('Failed to fetch campaigns. Please try again.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(initialParams);
  }, []);

  return { campaigns, loading, error, totalCount, fetchCampaigns };
};

export default useCampaigns;