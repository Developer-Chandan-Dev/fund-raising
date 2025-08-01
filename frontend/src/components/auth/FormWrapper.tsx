import { motion } from 'framer-motion';

interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export const FormWrapper = ({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText
}: FormWrapperProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Section - Branding/Info */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-12 flex-col justify-between">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Your Brand</h1>
            <p className="text-xl opacity-90">
              Transform your workflow with our platform
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <blockquote className="text-lg italic">
            "This service has completely changed how we work. Incredible experience!"
          </blockquote>
          <p className="mt-4">— Jane Doe, CEO at Company</p>
        </motion.div>
      </div>
      
      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          </div>
          
          {children}
          
          <motion.div 
            className="mt-8 text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {footerText}{' '}
            <a 
              href={footerLink} 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {footerLinkText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};