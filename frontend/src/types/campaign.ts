// Shared interface that both frontend and backend can use
export interface ICampaign {
  _id: string; // Use string instead of Types.ObjectId in frontend
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  category: string;
  status: string;
  imageUrl?: string;
  creator: string; // Changed from Types.ObjectId to string
  donors: IDonor[];
  likes: string[]; // Array of user IDs (strings)
  saves: string[]; // Array of user IDs (strings)
  endDate?: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IDonor {
  user: string | null; // Use string instead of Types.ObjectId
  amount: number;
  message: string;
  anonymous: boolean;
  date: string | Date;
}