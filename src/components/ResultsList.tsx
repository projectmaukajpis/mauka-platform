import React from 'react';
import { SearchResult } from '../lib/api';
import { MapPin, Users, Building2, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultsListProps {
  results: SearchResult[];
  isLoading?: boolean;
  error?: string | null;
  query?: string;
}

function ResultSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-18"></div>
      </div>
    </div>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'volunteer':
      return <Users className="h-5 w-5" />;
    case 'ngo':
      return <Building2 className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'volunteer':
      return 'bg-blue-100 text-blue-800';
    case 'ngo':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getScoreColor(score: number) {
  if (score >= 0.9) return 'text-green-600';
  if (score >= 0.7) return 'text-blue-600';
  if (score >= 0.5) return 'text-orange-600';
  return 'text-gray-600';
}

export default function ResultsList({ results, isLoading, error, query }: ResultsListProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <ResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {query 
            ? `We couldn't find any matches for "${query}". Try different keywords or browse our categories.`
            : 'Start searching to find volunteers, NGOs, and programs.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <Link to={result.url} className="block p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {result.title}
                  </h3>
                  {result.verified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="ml-1 text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                    <span className="capitalize">{result.type}</span>
                  </div>
                  
                  {result.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{result.location}</span>
                    </div>
                  )}
                  
                  <div className={`font-medium ${getScoreColor(result.score)}`}>
                    {Math.round(result.score * 100)}% match
                  </div>
                </div>
              </div>
              
              <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {result.snippet}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {result.skills && result.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              
              {result.interests && result.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
              
              {result.focus_areas && result.focus_areas.slice(0, 3).map((area, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
