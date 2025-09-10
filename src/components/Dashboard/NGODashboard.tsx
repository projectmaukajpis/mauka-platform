import React, { useState, useEffect } from 'react';
import { Plus, Users, FileText, CheckCircle, XCircle, AlertCircle, Edit } from 'lucide-react';
import { supabase } from '../../config/supabase';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';
import PostingForm from '../Forms/PostingForm';
import ApplicationsList from '../Applications/ApplicationsList';

interface NGODashboardProps {
  profile: {
    id: string;
    user_type: string;
    name: string;
    verified: boolean;
    verification_status: string;
  };
}

interface Posting {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  current_volunteers: number;
  max_volunteers: number;
  created_at: string;
}

export default function NGODashboard({ profile }: NGODashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'postings' | 'applicants' | 'volunteers'>('profile');
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [editingPosting, setEditingPosting] = useState<Posting | null>(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'postings', label: 'Postings', icon: FileText },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'volunteers', label: 'Active Volunteers', icon: CheckCircle },
  ];

  useEffect(() => {
    if (activeTab === 'postings') {
      fetchPostings();
    }
  }, [activeTab]);

  const fetchPostings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ngo_postings')
        .select('*')
        .eq('ngo_user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPostings(data || []);
    } catch (error) {
      console.error('Error fetching postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusIcon = () => {
    switch (profile.verification_status) {
      case 'verified':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <AlertCircle className="text-yellow-600" size={20} />;
    }
  };

  const getVerificationStatusText = () => {
    switch (profile.verification_status) {
      case 'verified':
        return 'Verified Organization';
      case 'rejected':
        return 'Verification Rejected';
      default:
        return 'Verification Pending';
    }
  };

  const getVerificationStatusColor = () => {
    switch (profile.verification_status) {
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NGO Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your organization's volunteer opportunities and applications.
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className={`mb-8 p-4 rounded-lg border ${getVerificationStatusColor()}`}>
          <div className="flex items-center space-x-3">
            {getVerificationStatusIcon()}
            <div>
              <h3 className="font-semibold">{getVerificationStatusText()}</h3>
              <p className="text-sm">
                {profile.verification_status === 'verified' && 
                  'Your organization is verified. You can now create volunteer postings.'}
                {profile.verification_status === 'pending' && 
                  'Your verification is under review. You\'ll be notified once approved.'}
                {profile.verification_status === 'rejected' && 
                  'Your verification was rejected. Please contact support for more information.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Organization Profile</h2>
                <Button icon={Edit} variant="outline">
                  Edit Profile
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Organization Name</h3>
                  <p className="text-gray-600">{profile.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Verification Status</h3>
                  <div className="flex items-center space-x-2">
                    {getVerificationStatusIcon()}
                    <span>{getVerificationStatusText()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'postings' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Volunteer Postings</h2>
                {profile.verified && (
                  <Button 
                    icon={Plus} 
                    onClick={() => setShowPostingForm(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Create Posting
                  </Button>
                )}
              </div>

              {!profile.verified ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Verification Required
                  </h3>
                  <p className="text-gray-600">
                    You need to be verified before you can create volunteer postings.
                  </p>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : postings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No postings yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first volunteer posting to start attracting volunteers.
                  </p>
                  <Button 
                    icon={Plus} 
                    onClick={() => setShowPostingForm(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Create Your First Posting
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {postings.map((posting) => (
                    <div
                      key={posting.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {posting.title}
                          </h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">
                            {posting.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{posting.location}</span>
                            <span>{posting.current_volunteers}/{posting.max_volunteers} volunteers</span>
                            <span>Created {new Date(posting.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            posting.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {posting.status}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPosting(posting)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Volunteer Applicants
              </h2>
              <ApplicationsList ngoUserId={profile.id} />
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Active Volunteers
              </h2>
              <ApplicationsList ngoUserId={profile.id} status="accepted" />
            </div>
          )}
        </div>
      </div>

      {/* Posting Form Modal */}
      {showPostingForm && (
        <PostingForm
          onClose={() => {
            setShowPostingForm(false);
            setEditingPosting(null);
          }}
          onSuccess={() => {
            setShowPostingForm(false);
            setEditingPosting(null);
            fetchPostings();
          }}
          editing={editingPosting}
        />
      )}
    </div>
  );
}