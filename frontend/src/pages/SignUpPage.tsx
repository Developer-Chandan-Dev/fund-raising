import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { FormWrapper } from "@/components/auth/FormWrapper";
import { useAuth } from "@/context/AuthContext";

const SignUpPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: { name: string; email: string; password: string }
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await register(values.name, values.email, values.password);
      if (res?.success === true) {
        navigate("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred. Please try again.");
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
      title="Create an account"
      description="Get started with our platform"
      footerText="Already have an account?"
      footerLink="/auth/signin"
      footerLinkText="Sign in"
    >
      <AuthForm type="signup" onSubmit={handleSubmit} isLoading={isLoading} />
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </FormWrapper>
  );
};

export default SignUpPage;
