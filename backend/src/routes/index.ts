// src/routes/index.ts
import express from 'express';
import {
  register,
  login,
  getMe,
} from '../controllers/authController';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  donateToCampaign,
  recentCampaigns,
} from '../controllers/campaignController';
import {
  getCommunityMembers,
  getCommunityPosts,
  createPost,
  likePost,
} from '../controllers/communityController';
import {
  followUser,
  saveCampaign,
  contributeToCampaign,
} from '../controllers/userController';

import { protect, admin } from '../middleware/auth';
import upload from '../middleware/upload';
import { validateImage } from '../middleware/validateImage';
import { cardData } from '../controllers/dashboardController';

const router = express.Router();

// Authentication routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// Campaign routes
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaign);
router.post('/campaigns', protect, admin, upload.single("image"), validateImage, createCampaign);
router.put('/campaigns/:id', protect, admin, upload.single("image"), validateImage, updateCampaign);
router.delete('/campaigns/:id', protect, admin, deleteCampaign);
router.get('/recent/campaigns', protect, recentCampaigns);
router.post('/donations/:campaignId', protect, donateToCampaign);

// Dashboard Card details
router.get('/cards', protect, cardData);

// Community routes
router.get('/community/members', getCommunityMembers);
router.get('/community/posts', getCommunityPosts);
router.post('/community/posts', protect, createPost);
router.post('/community/posts/:id/like', protect, likePost);

// User interaction routes
router.post('/users/:id/follow', protect, followUser);
router.post('/campaigns/:id/save', protect, saveCampaign);
router.post('/campaigns/:id/contribute', protect, contributeToCampaign);

export default router;