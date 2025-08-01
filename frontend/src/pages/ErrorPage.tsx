import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const errorMessages = {
    404: {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved.",
      action: "Go to Homepage"
    },
    401: {
      title: "Unauthorized",
      description: "You need to be logged in to access this page.",
      action: "Login"
    },
    403: {
      title: "Forbidden",
      description: "You don't have permission to access this resource.",
      action: "Request Access"
    },
    500: {
      title: "Server Error",
      description: "Something went wrong on our end. We're working to fix it.",
      action: "Try Again"
    }
  };

  const errorConfig = errorMessages[status as keyof typeof errorMessages] || {
    title: "Error",
    description: errorMessage,
    action: "Go Home"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="destructive" className="mb-6">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle className="text-2xl font-bold">{status} | {errorConfig.title}</AlertTitle>
          <AlertDescription className="mt-2 text-lg">
            {errorConfig.description}
          </AlertDescription>
        </Alert>
        
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 text-center">
              We're sorry for the inconvenience. Here's what you can do:
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/">
                  {errorConfig.action}
                </Link>
              </Button>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/support">Contact Support</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Error code: {status}</p>
              <p className="mt-2 bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
                {errorMessage}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;