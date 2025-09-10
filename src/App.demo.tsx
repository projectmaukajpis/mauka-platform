import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

// Authentication Context
interface User {
  id: string;
  name: string;
  email: string;
  userType: 'volunteer' | 'ngo';
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on load
    const storedUser = localStorage.getItem('mauka_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login - in real app, this would hit your auth API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        userType: email.includes('ngo') ? 'ngo' : 'volunteer',
        profileComplete: true
      };
      
      setUser(mockUser);
      localStorage.setItem('mauka_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mauka_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Navigation Component
function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-blue-600">Mauka</span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/matches" className="text-gray-700 hover:text-blue-600">AI Matches</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Home Page Component
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            🚀 Mauka Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Volunteer Matching Platform
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Connect passionate volunteers with meaningful NGO opportunities using advanced AI matching algorithms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">For Volunteers</h2>
              <p className="text-gray-600 mb-6">
                Discover NGOs that perfectly match your skills, interests, and availability using our AI-powered recommendation system
              </p>
              <Link
                to="/signup?type=volunteer"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
              >
                Join as Volunteer
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">For NGOs</h2>
              <p className="text-gray-600 mb-6">
                Find dedicated volunteers who align with your mission and have the right skills for your projects
              </p>
              <Link
                to="/signup?type=ngo"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block font-medium"
              >
                Register NGO
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI-Powered Matching</h3>
            <p className="text-gray-600 mb-6">
              Our advanced vector search technology analyzes your profile, skills, and preferences to find perfect matches
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <strong className="text-blue-800">Semantic Analysis</strong><br/>
                Understanding context beyond keywords
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <strong className="text-green-800">Real-time Matching</strong><br/>
                Instant recommendations as you update your profile
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <strong className="text-purple-800">Learning Algorithm</strong><br/>
                Improves matches based on feedback
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Login Component
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto max-w-md px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your Mauka account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Signup Component
function SignupPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const [userType, setUserType] = useState<'volunteer' | 'ngo'>(
    urlParams.get('type') as 'volunteer' | 'ngo' || 'volunteer'
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    interests: '',
    location: '',
    bio: '',
    organizationName: '',
    focusAreas: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const profileData = {
      user_id: `${userType}_${Date.now()}`,
      name: userType === 'volunteer' ? formData.name : formData.organizationName,
      email: formData.email,
      ...(userType === 'volunteer' ? {
        skills: formData.skills.split(',').map(s => s.trim()),
        interests: formData.interests.split(',').map(s => s.trim()),
        location: formData.location,
        bio: formData.bio,
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
      } : {
        description: formData.description,
        focus_areas: formData.focusAreas.split(',').map(s => s.trim()),
        location: formData.location,
        contact_email: formData.email,
        verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_activity: new Date()
      })
    };

    try {
      const response = await fetch(`http://localhost:4000/api/ai-match/create-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userType,
          profileData
        })
      });

      if (response.ok) {
        alert('Profile created successfully! Please sign in to access your dashboard.');
        navigate('/login');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create profile'}`);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Create Your Account
          </h1>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('volunteer')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  userType === 'volunteer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👥 Volunteer
              </button>
              <button
                type="button"
                onClick={() => setUserType('ngo')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  userType === 'ngo' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🏢 NGO
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'volunteer' ? 'Your Name' : 'Organization Name'}
              </label>
              <input
                type="text"
                required
                value={userType === 'volunteer' ? formData.name : formData.organizationName}
                onChange={(e) => setFormData({
                  ...formData,
                  [userType === 'volunteer' ? 'name' : 'organizationName']: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={userType === 'volunteer' ? 'Enter your full name' : 'Enter organization name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a secure password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {userType === 'volunteer' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Teaching, Programming, Communication, Project Management"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g. Education, Healthcare, Environment, Animal Welfare"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself, your volunteering experience, and what motivates you..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.focusAreas}
                    onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                    placeholder="e.g. Education, Healthcare, Environment, Poverty Alleviation"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your organization's mission, activities, and impact..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                userType === 'volunteer' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {isLoading ? 'Creating Profile...' : `Create ${userType === 'volunteer' ? 'Volunteer' : 'NGO'} Profile`}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMatches: 0,
    activeConnections: 0,
    profileViews: 0
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.userType === 'volunteer' 
              ? 'Ready to make a difference? Check out your AI-powered matches below.'
              : 'Find the perfect volunteers for your cause with our smart matching system.'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🎯</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Matches</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalMatches}</p>
                <p className="text-sm text-gray-500">Total recommendations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🤝</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Connections</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeConnections}</p>
                <p className="text-sm text-gray-500">Active partnerships</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👀</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Profile Views</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.profileViews}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/matches"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                {user?.userType === 'volunteer' ? '🔍 Find NGO Matches' : '👥 Find Volunteers'}
              </Link>
              <Link
                to="/profile"
                className="block w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                ✏️ Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Recent Activity</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Profile updated</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>New match found</span>
                <span className="text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Profile viewed 5 times</span>
                <span className="text-gray-500">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Matches Component
function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const findMatches = async () => {
    setIsLoading(true);
    try {
      const endpoint = user?.userType === 'volunteer' ? '/api/ai-match' : '/api/ai-match/volunteers';
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fake-token-${user?.id}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.data || []);
      } else {
        console.error('Failed to fetch matches');
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
    setIsLoading(false);
  };

  const performHybridSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const collection = user?.userType === 'volunteer' ? 'ngo_profiles' : 'volunteer_profiles';
      const response = await fetch('http://localhost:4000/api/ai-match/hybrid-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fake-token-${user?.id}`
        },
        body: JSON.stringify({
          query: searchQuery,
          collection,
          limit: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.data || []);
      }
    } catch (error) {
      console.error('Error in hybrid search:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    findMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🤖 AI-Powered {user?.userType === 'volunteer' ? 'NGO' : 'Volunteer'} Matches
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${user?.userType === 'volunteer' ? 'NGOs' : 'volunteers'} by keywords, skills, or interests...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && performHybridSearch()}
              />
            </div>
            <button
              onClick={performHybridSearch}
              disabled={!searchQuery.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              🔍 Hybrid Search
            </button>
            <button
              onClick={findMatches}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              🎯 AI Match
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-4">🤖</div>
            <div className="text-lg text-gray-600">AI is finding your perfect matches...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.length > 0 ? (
              matches.map((match: any, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{match.name}</h3>
                    <p className="text-gray-600">{match.location || 'Location not specified'}</p>
                  </div>
                  
                  {match.score && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">AI Match Score</span>
                        <span className="text-sm font-bold text-blue-600">{Math.round(match.score * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${match.score * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {user?.userType === 'volunteer' ? (
                    <>
                      <p className="text-gray-700 mb-4">{match.description}</p>
                      {match.focus_areas && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2">Focus Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {match.focus_areas.slice(0, 3).map((area: string, i: number) => (
                              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-4">{match.bio}</p>
                      {match.skills && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2">Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {match.skills.slice(0, 3).map((skill: string, i: number) => (
                              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try different search terms or use AI Match for personalized recommendations.' : 'Click "AI Match" to discover organizations that align with your profile!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Component
function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 Profile Management</h1>
          
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {user?.userType === 'volunteer' ? '👤' : '🏢'}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user?.userType === 'volunteer' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.userType === 'volunteer' ? 'Volunteer' : 'NGO'}
              </span>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{width: '85%'}}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">85% Complete - Add more details to improve AI matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;