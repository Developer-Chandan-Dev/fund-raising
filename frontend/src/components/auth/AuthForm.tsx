import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";

type SigninValues = { email: string; password: string };
type SignupValues = { name: string; email: string; password: string };

type CommonHelpers = {
  setSubmitting: (isSubmitting: boolean) => void;
};

type AuthFormProps =
  | {
      type: "signin";
      isLoading: boolean;
      onSubmit: (values: SigninValues, helpers: CommonHelpers) => void | Promise<void>;
    }
  | {
      type: "signup";
      isLoading: boolean;
      onSubmit: (values: SignupValues, helpers: CommonHelpers) => void | Promise<void>;
    };

const AuthForm = (props: AuthFormProps) => {
  const isSignUp = props.type === "signup";

  const initialValues: SigninValues | SignupValues = isSignUp
    ? { name: "", email: "", password: "" }
    : { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short!").required("Required"),
    ...(isSignUp && {
      name: Yup.string().min(3, "Too short!").required("Required"),
    }),
  });

  return (
    <Formik
      initialValues={initialValues as any}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit as any} // safe because union aligned with type
    >
      {() => (
        <Form className="space-y-6">
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label htmlFor="name">Name</Label>
              <Field as={Input} name="name" placeholder="John Doe" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </motion.div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Field
              as={Input}
              name="email"
              type="email"
              placeholder="hello@example.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Field
              as={Input}
              name="password"
              type="password"
              placeholder="••••••••"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={props.isLoading}>
            {props.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
