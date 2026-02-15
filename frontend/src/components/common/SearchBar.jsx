import { useState } from 'react';
import { cn } from '../../utils/helpers';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  onChange,
  value,
  className 
}) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200 outline-none"
        />

        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;