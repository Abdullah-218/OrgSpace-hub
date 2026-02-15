import { cn, getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ 
  src, 
  alt, 
  name,
  size = 'md',
  status,
  className 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };
  
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };
  
  const initials = getInitials(name || alt);
  const bgColor = getAvatarColor(name || alt);
  
  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={cn(
            'rounded-full object-cover',
            sizes[size]
          )}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Fallback with initials */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium text-white',
          sizes[size],
          bgColor,
          src && 'hidden'
        )}
      >
        {initials}
      </div>
      
      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

// Avatar Group
Avatar.Group = ({ children, max = 3, className }) => {
  const items = Array.isArray(children) ? children : [children];
  const visible = items.slice(0, max);
  const remaining = items.length - max;
  
  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      
      {remaining > 0 && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-sm font-medium text-gray-600 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;