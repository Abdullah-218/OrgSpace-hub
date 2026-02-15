import { cn } from '../../utils/helpers';

// Spinner
const Loading = ({ size = 'md', text, className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <svg 
        className={cn('animate-spin text-primary-600', sizes[size])}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {text && (
        <p className="mt-3 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Full page loading
Loading.Page = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loading size="xl" text={text} />
  </div>
);

// Skeleton loader
Loading.Skeleton = ({ className, count = 1, height = 'h-4' }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'animate-pulse bg-gray-200 rounded',
          height,
          className,
          i > 0 && 'mt-2'
        )}
      />
    ))}
  </>
);

// Card skeleton
Loading.CardSkeleton = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-3 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    ))}
  </>
);

// Blog card skeleton
Loading.BlogCardSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Image */}
          <div className="h-48 bg-gray-200" />
          
          {/* Content */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
            
            {/* Meta */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export default Loading;