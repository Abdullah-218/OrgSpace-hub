import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

const Dropdown = ({ trigger, children, align = 'left', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[12rem] rounded-lg bg-white shadow-lg border border-gray-200 py-1 animate-fade-in',
            alignments[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.Item = ({ children, onClick, icon, className }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors',
      className
    )}
  >
    {icon && <span className="text-gray-400">{icon}</span>}
    {children}
  </button>
);

Dropdown.Divider = () => <div className="my-1 border-t border-gray-200" />;

export default Dropdown;