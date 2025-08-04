// src/controllers/communityController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { Types } from 'mongoose';

// @desc    Get community members
// @route   GET /api/community/members
// @access  Public
export const getCommunityMembers = async (req: Request, res: Response) => {
  try {
    const { search, online, top } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    if (online === 'true') {
      // Users active in last 15 minutes
      query.lastSeen = { $gte: new Date(Date.now() - 15 * 60 * 1000) };
    }

    let sort = {};
    if (top === 'true') {
      sort = { contributions: -1 };
    }

    const members = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(50);

    res.json({ members });
  } catch (error) {
    console.error('Get community members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get community posts
// @route   GET /api/community/posts
// @access  Public
export const getCommunityPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatarUrl')
      .sort('-createdAt')
      .limit(20);

    res.json({ posts });
  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Please provide post content' });
    }

    const post = await Post.create({
      content,
      author: req.user?._id,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/unlike post
// @route   POST /api/community/posts/:id/like
// @access  Private
export const likePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Convert both IDs to string for reliable comparison
    const userId = req.user._id.toString();
    const isLiked = post.likes.some(likeId => likeId.toString() === userId);

    if (isLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (likeId: Types.ObjectId) => likeId.toString() !== userId
      );
    } else {
      // Add like
      post.likes.push(new Types.ObjectId(userId));
    }

    await post.save();

    res.json({ 
      likes: post.likes.length, 
      isLiked: !isLiked 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};