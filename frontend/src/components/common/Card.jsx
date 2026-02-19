import { cn } from '../../utils/helpers';

const Card = ({ 
  children, 
  className,
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200',
        hover && 'hover:shadow-md hover:border-gray-300 cursor-pointer',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header
Card.Header = ({ children, className }) => (
  <div className={cn('mb-4 pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

// Card Title
Card.Title = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

// Card Description
Card.Description = ({ children, className }) => (
  <p className={cn('text-sm text-gray-600 mt-1', className)}>
    {children}
  </p>
);

// Card Body
Card.Body = ({ children, className }) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

// Card Footer
Card.Footer = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);

export default Card;