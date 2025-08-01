import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { FormWrapper } from '@/components/auth/FormWrapper';
import { useAuth } from '@/context/AuthContext';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, login} = useAuth();

    if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    await login(values.email, values.password)
    setIsLoading(false);
  }

  return (
    <FormWrapper
      title="Welcome back"
      description="Enter your credentials to access your account"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >
      <AuthForm 
        type="signin" 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </FormWrapper>
  );
};

export default SignInPage;