// src/controllers/userController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User, { IUser } from '../models/User';
import Campaign, { ICampaign } from '../models/Campaign';

// Extend Express Request type to include user
declare module 'express' {
  interface Request {
    user?: IUser;
    campaign?: ICampaign;
  }
}

// @desc    Follow/unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const isFollowing = currentUser.following.some(id =>
      id.equals(userToFollow._id)
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => !id.equals(userToFollow._id)
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => !id.equals(currentUser._id)
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ isFollowing: !isFollowing });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save/unsave campaign
// @route   POST /api/campaigns/:id/save
// @access  Private
export const saveCampaign = async (req: Request, res: Response) => {
  try {
    // const {}
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

  // Validate campaign ID
    if (!req.params.id || !Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid campaign ID' });
    }

    const campaign = await Campaign.findById(req.params.id); // Simplified find
    const user = await User.findById(req.user._id);

    if (!campaign || !user) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Explicitly type cast campaign._id to Types.ObjectId
    const campaignId = campaign._id as Types.ObjectId;

    const isSaved = user.savedCampaigns.some((id: Types.ObjectId) =>
      id.equals(campaignId)
    );

    if (isSaved) {
      user.savedCampaigns = user.savedCampaigns.filter(
        (id: Types.ObjectId) => !id.equals(campaignId)
      );
    } else {
      user.savedCampaigns.push(campaignId);
    }

    await user.save();

    res.json({ isSaved: !isSaved });
  } catch (error) {
    console.error('Save campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Contribute to campaign
// @route   POST /api/campaigns/:id/contribute
// @access  Private
export const contributeToCampaign = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { amount, message, anonymous } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {  // Fixed typo from 'campaign' to 'campaign'
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    // Create donor object with proper typing
    const donor = {
      user: anonymous ? null : req.user._id,  // Use null instead of undefined
      amount: parsedAmount,
      message: message || '',
      anonymous: anonymous || false,
      date: new Date()  // Add current date
    };

    // Add donation
    campaign.donors.push(donor);

    // Update raised amount
    campaign.raisedAmount += parsedAmount;

    // Update user contributions if not anonymous
    if (!anonymous) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.contributions += 1;
        await user.save();
      }
    }

    await campaign.save();

    res.json({
      raisedAmount: campaign.raisedAmount,
      progress: (campaign.raisedAmount / campaign.goalAmount) * 100,
    });
  } catch (error) {
    console.error('Contribution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};