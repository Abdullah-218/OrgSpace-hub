import { cn } from '../../utils/helpers';

const Textarea = ({ 
  label,
  name,
  placeholder,
  value = '',
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showCount = false,
  className,
  ...props 
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label 
            htmlFor={name} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {showCount && maxLength && (
          <span className={cn(
            'text-sm',
            value.length > maxLength ? 'text-red-600' : 'text-gray-500'
          )}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 outline-none resize-none',
          'focus:ring-2 focus:ring-primary-100',
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
            : 'border-gray-300 focus:border-primary-500',
          disabled && 'bg-gray-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;