import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { FormWrapper } from "@/components/auth/FormWrapper";
import { useAuth } from "@/context/AuthContext";

const SignInPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
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
      {error && (
        <div className="text-red-500 text-center mt-4">
          {error}
        </div>
      )}
    </FormWrapper>
  );
};

export default SignInPage;