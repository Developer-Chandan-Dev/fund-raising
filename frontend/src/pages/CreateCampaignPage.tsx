// src/pages/CreateCampaignPage.tsx
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface CampaignFormData {
  title: string;
  description: string;
  goalAmount: number;
  category: string;
  endDate: string;
  image?: FileList;
}

const CreateCampaignPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignFormData>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CampaignFormData) => {
    setIsLoading(true);
    try {
      // In a real app, you would upload the image and create the campaign
      console.log('Creating campaign:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/admin');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="Help Interns Learn New Skills"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            rows={5}
            placeholder="Explain what this campaign is about and how the funds will be used..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="goalAmount">Goal Amount ($)</Label>
            <Input
              id="goalAmount"
              type="number"
              {...register('goalAmount', { 
                required: 'Goal amount is required',
                min: { value: 100, message: 'Minimum goal is $100' }
              })}
            />
            {errors.goalAmount && <p className="text-red-500 text-sm mt-1">{errors.goalAmount.message}</p>}
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate', { required: 'End date is required' })}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a category</option>
            <option value="education">Education</option>
            <option value="housing">Housing</option>
            <option value="career">Career Development</option>
            <option value="community">Community Building</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <Label htmlFor="image">Campaign Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register('image')}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Upload a high-quality image that represents your campaign
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignPage;