import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { FormWrapper } from '@/components/auth/FormWrapper';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const SignUpPage = () => {
  const [isLoading, setIsLoading ] = useState(false);
  const { isAuthenticated, register } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    await register(values.name, values.email, values.password)
    setIsLoading(false);
  }
  return (
    <FormWrapper
      title="Create an account"
      description="Get started with our platform"
      footerText="Already have an account?"
      footerLink="/signin"
      footerLinkText="Sign in"
    >
      <AuthForm 
        type="signup" 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </FormWrapper>
  );
};

export default SignUpPage;