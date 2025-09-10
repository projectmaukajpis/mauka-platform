import React, { useState, useEffect } from 'react';
import { Users, Building, FileText, Flag, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '../../config/supabase';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';

interface AdminDashboardProps {
  profile: {
    id: string;
    user_type: string;
    name: string;
  };
}

interface NGOApplication {
  id: string;
  organization_name: string;
  contact_person: string;
  description: string;
  status: string;
  documents: any[];
  created_at: string;
  user_profiles: {
    name: string;
    email: string;
  };
}

interface Stats {
  totalNGOs: number;
  totalVolunteers: number;
  totalPostings: number;
  pendingApplications: number;
}

export default function AdminDashboard({ profile }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'applications' | 'flags'>('stats');
  const [applications, setApplications] = useState<NGOApplication[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalNGOs: 0,
    totalVolunteers: 0,
    totalPostings: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<NGOApplication | null>(null);

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: FileText },
    { id: 'applications', label: 'NGO Applications', icon: Building },
    { id: 'flags', label: 'User Flags', icon: Flag },
  ];

  useEffect(() => {
    fetchStats();
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [ngoCount, volunteerCount, postingCount, pendingCount] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('user_type', 'ngo'),
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('user_type', 'volunteer'),
        supabase.from('ngo_postings').select('id', { count: 'exact' }),
        supabase.from('ngo_applications').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        totalNGOs: ngoCount.count || 0,
        totalVolunteers: volunteerCount.count || 0,
        totalPostings: postingCount.count || 0,
        pendingApplications: pendingCount.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ngo_applications')
        .select(`
          *,
          user_profiles!inner(name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationReview = async (applicationId: string, status: 'approved' | 'rejected', notes: string) => {
    try {
      const { error } = await supabase
        .from('ngo_applications')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: profile.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // If approved, update user profile to verified
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await supabase
            .from('user_profiles')
            .update({
              verified: true,
              verification_status: 'verified'
            })
            .eq('user_id', application.user_profiles.email); // This needs to be fixed with proper user_id mapping
        }
      }

      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error reviewing application:', error);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage NGO verifications, monitor platform statistics, and handle user reports.
          </p>
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
          {activeTab === 'stats' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600">Total Volunteers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total NGOs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalNGOs}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Active Postings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPostings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Pending Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                NGO Verification Applications
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending applications
                  </h3>
                  <p className="text-gray-600">
                    All NGO verification applications have been reviewed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.organization_name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Contact: {application.contact_person} ({application.user_profiles.email})
                          </p>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {application.description}
                          </p>
                          <div className="text-sm text-gray-500">
                            Applied: {new Date(application.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedApplication(application)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Flags & Reports</h2>
              <div className="text-center py-12">
                <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No flags reported
                </h3>
                <p className="text-gray-600">
                  User reports and flags will appear here for review.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Review Modal */}
      {selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onReview={handleApplicationReview}
        />
      )}
    </div>
  );
}

// Application Review Modal Component
function ApplicationReviewModal({ 
  application, 
  onClose, 
  onReview 
}: {
  application: NGOApplication;
  onClose: () => void;
  onReview: (id: string, status: 'approved' | 'rejected', notes: string) => void;
}) {
  const [notes, setNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async (status: 'approved' | 'rejected') => {
    setReviewing(true);
    await onReview(application.id, status, notes);
    setReviewing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Review NGO Application: {application.organization_name}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Organization Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {application.organization_name}</p>
                <p><strong>Contact Person:</strong> {application.contact_person}</p>
                <p><strong>Email:</strong> {application.user_profiles.email}</p>
                <p><strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
              <div className="space-y-2">
                {application.documents && application.documents.length > 0 ? (
                  application.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 border border-gray-200 rounded text-sm hover:bg-gray-50"
                    >
                      📄 {doc.name}
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {application.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={reviewing}>
            Cancel
          </Button>
          <Button
            onClick={() => handleReview('rejected')}
            disabled={reviewing}
            className="bg-red-600 hover:bg-red-700"
          >
            {reviewing ? <LoadingSpinner size="sm" className="mr-2" /> : <XCircle size={16} className="mr-2" />}
            Reject
          </Button>
          <Button
            onClick={() => handleReview('approved')}
            disabled={reviewing}
            className="bg-green-600 hover:bg-green-700"
          >
            {reviewing ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}