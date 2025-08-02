// src/api/client.ts
import axios from 'axios';
// import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API endpoints
const apiService = {
  // Campaign endpoints
  getCampaigns: (params = {}) => apiClient.get('/campaigns', { params }),
  getCampaignById: (id: string) => apiClient.get(`/campaigns/${id}`),
  createCampaign: (data: FormData) => apiClient.post('/campaigns', data),
  
  // Community endpoints
  getCommunityMembers: (params = {}) => apiClient.get('/community/members', { params }),
  getCommunityPosts: (params = {}) => apiClient.get('/community/posts', { params }),
  createPost: (content: string) => apiClient.post('/community/posts', { content }),
  likePost: (postId: string) => apiClient.post(`/community/posts/${postId}/like`),
  
  // User endpoints
  followUser: (userId: string) => apiClient.post(`/users/${userId}/follow`),
  saveCampaign: (campaignId: string) => apiClient.post(`/campaigns/${campaignId}/save`),
  likeCampaign: (campaignId: string) => apiClient.post(`/campaigns/${campaignId}/like`),
};

export default apiService;