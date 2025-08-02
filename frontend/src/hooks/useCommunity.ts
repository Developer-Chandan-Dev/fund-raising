// src/hooks/useCommunity.ts
import { useState, useEffect } from 'react';
import apiService from '@/api/client';

interface CommunityMember {
  id: string;
  name: string;
  role: string;
  company: string;
  contributions: number;
  avatarUrl: string;
  skills: string[];
  isOnline: boolean;
}

interface CommunityPost {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
}

interface UseCommunityResult {
  members: CommunityMember[];
  posts: CommunityPost[];
  loading: boolean;
  error: string | null;
  fetchMembers: (params?: Record<string, unknown>) => Promise<void>;
  fetchPosts: (params?: Record<string, unknown>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

const useCommunity = (): UseCommunityResult => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiService.getCommunityMembers(params);
      setMembers(response.data.members);
    } catch (err) {
      setError('Failed to fetch community members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiService.getCommunityPosts(params);
      setPosts(response.data.posts);
    } catch (err) {
      setError('Failed to fetch community posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      await apiService.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            } 
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchMembers(), fetchPosts()]);
  }, []);

  return { members, posts, loading, error, fetchMembers, fetchPosts, likePost };
};

export default useCommunity;