import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { FormWrapper } from "@/components/auth/FormWrapper";
import { useAuth } from "@/context/AuthContext";

const SignUpPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (
    values: { name: string; email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setError("");

    try {
      await register(values.name, values.email, values.password);
      navigate("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.log("Signup error:", err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

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
