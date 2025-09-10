import axios from 'axios';
import { supabase } from '../config/supabase';

const envBase = import.meta.env.VITE_API_URL;
const API_BASE_URL = envBase?.startsWith('http')
  ? envBase
  : `${window.location.origin}${envBase || '/api'}`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export interface NearbyNGO {
  id: string;
  title: string;
  organization_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  description: string;
  skills_required: string[];
  time_commitment: string;
  verified: boolean;
}

export interface NearbyVolunteer {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  skills: string[];
  bio: string;
  availability: string;
  verified: boolean;
}

export interface PostingWithDistance {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  skills_required: string[];
  tags: string[];
  organization: {
    name: string;
    verified: boolean;
  };
}

// Location-based matching API functions
export const matchAPI = {
  /**
   * Find nearby NGOs for volunteers
   */
  async findNearbyNGOs(lat: number, lng: number, radiusKm: number = 25): Promise<NearbyNGO[]> {
    try {
      const response = await apiClient.get<{ success: boolean; results: NearbyNGO[] }>(
        `/match/nearby-ngos?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error finding nearby NGOs:', error);
      return [];
    }
  },

  /**
   * Find nearby volunteers for a specific posting
   */
  async findNearbyVolunteers(postingId: string): Promise<NearbyVolunteer[]> {
    try {
      const response = await apiClient.get<{ success: boolean; results: NearbyVolunteer[] }>(
        `/match/nearby-volunteers?postingId=${postingId}`
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error finding nearby volunteers:', error);
      return [];
    }
  },

  /**
   * Search postings with location and filters
   */
  async searchPostings(
    lat: number, 
    lng: number, 
    radiusKm: number = 25, 
    tags: string[] = []
  ): Promise<PostingWithDistance[]> {
    try {
      const tagsParam = tags.length > 0 ? `&tags=${tags.join(',')}` : '';
      const response = await apiClient.get<{ success: boolean; results: PostingWithDistance[] }>(
        `/postings?near=${lat},${lng}&radiusKm=${radiusKm}${tagsParam}`
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error searching postings:', error);
      return [];
    }
  }
};

// Search interface and debounced search function
export interface SearchOptions {
  k?: number; // number of results to return
  mode?: 'semantic' | 'keyword' | 'hybrid'; // search mode
  collection?: string; // specific collection to search in
  filter?: Record<string, any>; // additional filters
}

export interface SearchResult {
  id: string;
  type: 'volunteer' | 'ngo' | 'posting';
  title: string;
  description: string;
  location?: string;
  score: number;
}

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

// Search API functions
export const searchAPI = {
  /**
   * Perform search with various options and filters
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    try {
      const { k = 20, mode = 'hybrid', collection, filter } = options;
      
      let url = `/search?q=${encodeURIComponent(query)}&k=${k}&mode=${mode}`;
      
      if (collection) {
        url += `&collection=${collection}`;
      }
      
      if (filter && Object.keys(filter).length > 0) {
        url += `&filter=${encodeURIComponent(JSON.stringify(filter))}`;
      }
      
      const response = await apiClient.get<{ success: boolean; results: SearchResult[] }>(url);
      return response.data.results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};

// Debounced search function
export const debouncedSearch = debounce(
  async (
    query: string,
    options: SearchOptions = {},
    callback: (result: SearchResult[] | null, error?: Error) => void
  ) => {
    try {
      const results = await searchAPI.search(query, options);
      callback(results);
    } catch (error) {
      console.error('Search error:', error);
      callback(null, error instanceof Error ? error : new Error('Search failed'));
    }
  },
  300
);

export { apiClient };