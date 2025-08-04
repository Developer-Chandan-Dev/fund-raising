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
  // Auth endpoints
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => apiClient.post('/auth/register', { name, email, password }),

  // Campaign endpoints
  getCampaigns: (params = {}) => apiClient.get('/campaigns', { params }),
  getCampaignById: (id: string) => apiClient.get(`/campaigns/${id}`),
  createCampaign: (data: FormData) => apiClient.post('/campaigns', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data', // Required for file uploads
    }
  }),

  donateToCampaign: (campaignId: string, data: {
    amount: number;
    message?: string;
    anonymous?: boolean;
  }) => apiClient.post(`/donations/${campaignId}`, data),

  // Community endpoints
  getCommunityMembers: (params = {}) => apiClient.get('/community/members', { params, withCredentials: true }),
  getCommunityPosts: (params = {}) => apiClient.get('/community/posts', { params, withCredentials: true }),
  createPost: (content: string) => apiClient.post('/community/posts', { content }, { withCredentials: true }),
  likePost: (postId: string) => apiClient.post(`/community/posts/${postId}/like`, { withCredentials: true }),

  // User endpoints
  followUser: (userId: string) => apiClient.post(`/users/${userId}/follow`, { withCredentials: true }),
  saveCampaign: (campaignId: string) => apiClient.post(`/campaigns/${campaignId}/save`, { withCredentials: true }),
  likeCampaign: (campaignId: string) => apiClient.post(`/campaigns/${campaignId}/like`, { withCredentials: true }),
};

export default apiService;