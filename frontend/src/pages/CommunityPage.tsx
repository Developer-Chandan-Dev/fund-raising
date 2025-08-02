// src/pages/CommunityPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useCommunity from '@/hooks/useCommunity';
import MemberSkeleton from '@/components/dashboard/skeletons/MemberSkeleton';
import PostSkeleton from '@/components/dashboard/skeletons/PostSkeleton';
import EmptyState from '@/components/dashboard/EmptyState';
import apiService from '@/api/client';
import { useAuth } from '@/context/AuthContext';

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');

  const { user } = useAuth();

  const { 
    members, 
    posts, 
    loading, 
    error,
    fetchMembers,
    fetchPosts,
    likePost 
  } = useCommunity();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      await apiService.createPost(newPostContent);
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Intern Community</h1>
        
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search members by name, role or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
        >
          All Members
        </Button>
        <Button
          variant={activeTab === 'online' ? 'default' : 'outline'}
          onClick={() => setActiveTab('online')}
        >
          Online Now
        </Button>
        <Button
          variant={activeTab === 'top' ? 'default' : 'outline'}
          onClick={() => setActiveTab('top')}
        >
          Top Contributors
        </Button>
      </div>

      {loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <MemberSkeleton key={index} />
            ))}
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {error && (
        <EmptyState
          title="Error loading community"
          description={error}
          action={
            <Button onClick={() => { fetchMembers(); fetchPosts(); }}>
              Try Again
            </Button>
          }
        />
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredMembers && filteredMembers?.length !== 0 && filteredMembers?.length > 0 ? (
              filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>
                        {member.role} at {member.company}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {member.contributions} contributions
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => apiService.followUser(member.id)}
                      >
                        Follow
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="No members found"
                  description="Try adjusting your search query"
                />
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Start a discussion..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>

              {posts && posts?.length !== 0 && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={post.author.avatarUrl} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{post.author.name}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1">{post.content}</p>
                        <div className="flex space-x-4 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => likePost(post.id)}
                          >
                            {post.isLiked ? 'Liked' : 'Like'} ({post.likes})
                          </Button>
                          <Button variant="ghost" size="sm">
                            Comment ({post.comments})
                          </Button>
                          <Button variant="ghost" size="sm">
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No discussions yet"
                  description="Be the first to start a conversation!"
                  small
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CommunityPage;