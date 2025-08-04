// types/auth.ts
export interface LoginResponse {
  success: boolean;
  message?: string;
  // Add other fields your login might return
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

