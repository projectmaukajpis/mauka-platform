import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import { searchAPI, SearchResult, SearchOptions } from '../lib/api';
import { Filter, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'semantic' | 'hybrid'>('hybrid');
  const [filters, setFilters] = useState({
    type: '',
    verified: false
  });

  // Perform search when query changes
  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, searchMode, filters]);

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchOptions: SearchOptions = {
        k: 20,
        mode: searchMode,
        filter: {}
      };

      // Apply filters
      if (filters.type) {
        searchOptions.collection = `${filters.type}_profiles`;
      }
      if (filters.verified) {
        searchOptions.filter = { verified: true };
      }

      const response = await searchAPI.search(query, searchOptions);
      setResults(response.results);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterName === 'verified' ? !prev[filterName] : ''
    }));
  };

  const setTypeFilter = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type === type ? '' : type
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for volunteers, NGOs, or programs..."
            className="max-w-2xl mx-auto"
            autoFocus
          />
          
          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Filters:</span>
            </div>
            
            <button
              onClick={() => setSearchMode(searchMode === 'semantic' ? 'hybrid' : 'semantic')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                searchMode === 'hybrid'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="h-3 w-3 inline mr-1" />
              {searchMode === 'hybrid' ? 'Smart Search' : 'Semantic Only'}
            </button>
            
            <button
              onClick={() => setTypeFilter('volunteer')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.type === 'volunteer'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Volunteers
            </button>
            
            <button
              onClick={() => setTypeFilter('ngo')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.type === 'ngo'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              NGOs
            </button>
            
            <button
              onClick={() => toggleFilter('verified')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.verified
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified Only
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLoading ? 'Searching...' : `Search results for "${query}"`}
            </h1>
            {!isLoading && results.length > 0 && (
              <p className="text-gray-600 mt-1">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        <ResultsList
          results={results}
          isLoading={isLoading}
          error={error}
          query={query}
        />

        {/* Empty state when no query */}
        {!query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Discover Amazing Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Search for volunteers with specific skills, NGOs working in your area of interest, 
              or programs making a difference in communities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleSearch('teaching')}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                Teaching
              </button>
              <button
                onClick={() => handleSearch('healthcare')}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
              >
                Healthcare
              </button>
              <button
                onClick={() => handleSearch('environment')}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
              >
                Environment
              </button>
              <button
                onClick={() => handleSearch('education Mumbai')}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
              >
                Education in Mumbai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
