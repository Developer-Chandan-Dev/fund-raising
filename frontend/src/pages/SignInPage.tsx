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

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await login(values.email, values.password);
      console.log(res);
      navigate("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  console.log("Error: ", error);
  return (
    <FormWrapper
      title="Welcome back"
      description="Enter your credentials to access your account"
      footerText="Don't have an account?"
      footerLink="/auth/signup"
      footerLinkText="Sign up"
    >
      <AuthForm type="signin" onSubmit={handleSubmit} isLoading={isLoading} />
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </FormWrapper>
  );
};

export default SignInPage;
