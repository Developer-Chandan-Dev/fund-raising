// src/components/EmptyState.tsx
// import {Button} from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  small?: boolean;
}

const EmptyState = ({ 
  title, 
  description, 
  action, 
  small = false 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${small ? 'py-8' : 'py-16'}`}>
      <div className={`${small ? 'w-16 h-16' : 'w-24 h-24'} bg-gray-100 rounded-full flex items-center justify-center mb-4`}>
        <svg
          className={`${small ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className={`${small ? 'text-lg' : 'text-xl'} font-medium text-gray-900 mb-2`}>
        {title}
      </h3>
      <p className={`${small ? 'text-sm' : 'text-base'} text-gray-500 text-center mb-4 max-w-md`}>
        {description}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;