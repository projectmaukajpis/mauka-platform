import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Command } from 'lucide-react';
import { debouncedSearch, SearchOptions } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search for volunteers, NGOs, or programs...',
  className = '',
  autoFocus = false,
  showShortcut = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(searchQuery.trim());
      }

      // Reset loading state after navigation
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Optional: Trigger search as user types (with debouncing)
    if (newQuery.length >= 3) {
      setIsLoading(true);
      debouncedSearch(
        newQuery,
        { k: 5, mode: 'hybrid' },
        (result, error) => {
          setIsLoading(false);
          if (result && !error) {
            // Could show instant results here
            console.log('Instant search results:', result);
          }
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* Keyboard shortcut hint */}
        {showShortcut && !query && !isFocused && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded">
              <Command className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </div>
        )}
      </div>

      {/* Search button (optional, for mobile) */}
      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="ml-3 inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Search
      </button>
    </form>
  );
}
