// src/controllers/campaignController.ts
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloudinary';
import fs from 'fs/promises';
import User from '../models/User';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query: any = {};

    if (status && ['active', 'completed', 'draft'].includes(status as string)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const campaigns = await Campaign.find(query)
      .populate('creator', 'name avatarUrl')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort('-createdAt');

    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalCount: total,
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:
// @access  Public
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'name avatarUrl')
      .populate('donors.user', 'name avatarUrl');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create campaign
// @route   POST /api/campaigns
// @access  Private/Admin
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, description, goalAmount, category, endDate } = req.body;

    // Validate required fields
    if (!title || !description || !goalAmount || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (isNaN(goalAmount) || goalAmount <= 0) {
      return res.status(400).json({ message: 'Goal amount must be a positive number' });
    }

    // Handle image upload to Cloudinary if file exists
    let imageData = {};
    if (req.file) {
      try {
        const { public_id, secure_url } = await uploadToCloudinary(req.file.path);
        imageData = {
          imageUrl: secure_url,
          public_id,
        };
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ message: 'Failed to upload image' });
      }
    }

    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      category,
      endDate,
      creator: req.user?._id,
      status: 'active',
      ...imageData,
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);

    // Cleanup Cloudinary upload if campaign creation fails
    if (req.file?.filename) {
      await deleteFromCloudinary(req.file.filename).catch(console.error);
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private/Admin
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Authorization check
    const creatorId = campaign.creator.toString();
    const userId = req.user._id.toString();

    if (creatorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Handle image update
    let newImageData = {};
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (campaign.public_id) {
          await deleteFromCloudinary(campaign.public_id);
        }

        // Upload new image to Cloudinary
        const { public_id, secure_url } = await uploadToCloudinary(req.file.path);
        newImageData = {
          imageUrl: secure_url,
          public_id,
        };

        // Clean up the temporary file
        await fs.unlink(req.file.path).catch(console.error);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ message: 'Failed to update image' });
      }
    }

    // Update fields
    const { title, description, goalAmount, category, endDate, status } = req.body;

    // Validate goalAmount if provided
    if (goalAmount && (isNaN(goalAmount) || goalAmount <= 0)) {
      return res.status(400).json({ message: 'Goal amount must be a positive number' });
    }

    // Update campaign document
    const updatedData = {
      title: title || campaign.title,
      description: description || campaign.description,
      goalAmount: goalAmount || campaign.goalAmount,
      category: category || campaign.category,
      endDate: endDate || campaign.endDate,
      status: status || campaign.status,
      ...newImageData,
    };

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedCampaign);
  } catch (error) {
    console.error('Update campaign error:', error);

    // Cleanup newly uploaded image if update fails
    if (req.file?.path) {
      // Delete from Cloudinary if uploaded but update failed
      if (req.file.filename) {
        await deleteFromCloudinary(req.file.filename).catch(console.error);
      }
      // Delete temporary file
      await fs.unlink(req.file.path).catch(console.error);
    }

    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private/Admin
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Authorization check
    const creatorId = campaign.creator.toString();
    const userId = req.user._id.toString();

    if (creatorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated image from Cloudinary if exists
    if (campaign.public_id) {
      try {
        await deleteFromCloudinary(campaign.public_id);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with campaign deletion even if image deletion fails
      }
    }

    // Delete all related data (donations, etc.)
    await Promise.all([
      campaign.deleteOne(),
      // Add other related deletions here if needed
      // Example: Donation.deleteMany({ campaign: campaign._id })
    ]);

    res.json({
      success: true,
      message: 'Campaign and associated data removed successfully',
      deletedCampaignId: campaign._id
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error during campaign deletion'
    });
  }
};

// src/controllers/donationController.ts
export const donateToCampaign = async (req: Request, res: Response) => {
  console.log('--- DONATE ENDPOINT HIT ---'); // Add this
  console.log('Request body:', req.body); // Add this
  console.log('Request params:', req.params); // Add this
  console.log('User:', req.user); // Add this


  try {
    const { amount, message, anonymous } = req.body;
    const { campaignId } = req.params;

    // Basic validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid donation amount' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (!anonymous && !req.user) {
      return res.status(401).json({ message: 'Authentication required for non-anonymous donations' });
    }

    // Create donation record
    const donation = {
      user: anonymous ? null : (req.user?._id ?? null),  // Now definitely not undefined
      amount: Number(amount),
      message: message || '',
      anonymous: Boolean(anonymous),
      date: new Date()
    };

    // Update campaign
    campaign.donors.push(donation);
    campaign.raisedAmount += donation.amount;

    // Update donors count if not anonymous
    if (!anonymous && req.user) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $inc: { contributions: 1 } },
          { new: true } // optional: returns the updated document
        );
        console.log('Updated user contributions:', updatedUser?.contributions);
      } catch (userUpdateError) {
        console.error('Error updating user contributions:', userUpdateError);
      }
    }

    await campaign.save();

    res.json({
      success: true,
      message: 'Thank you for your donation!',
      donation,
      newRaisedAmount: campaign.raisedAmount
    });

  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ message: 'Failed to process donation' });
  }
};
