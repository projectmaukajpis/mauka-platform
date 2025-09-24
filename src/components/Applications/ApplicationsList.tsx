import React, { useState, useEffect } from 'react';
import { User, MapPin, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '../../config/supabase';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';

interface ApplicationsListProps {
  ngoUserId: string;
  status?: string;
}

interface Application {
  id: string;
  cover_letter: string;
  status: string;
  applied_at: string;
  volunteer: {
    name: string;
    email: string;
    skills: string[];
    location: string;
    bio: string;
  };
  posting: {
    title: string;
    location: string;
  };
}

export default function ApplicationsList({ ngoUserId, status }: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [ngoUserId, status]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('applications')
        .select(`
          *,
          ngo_postings!inner(title, location, ngo_user_id)
        `)
        .eq('ngo_postings.ngo_user_id', user.id);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('applied_at', { ascending: false });

      if (error) throw error;

      // Get volunteer and organization data separately
      const volunteerIds = data?.map(app => app.volunteer_user_id) || [];
      const { data: volunteerData } = await supabase
        .from('user_profiles')
        .select('user_id, name, email, skills, location, bio')
        .in('user_id', volunteerIds);

      const volunteerMap = new Map(volunteerData?.map(vol => [vol.user_id, vol]) || []);

      const formattedApplications = data?.map(app => ({
        id: app.id,
        cover_letter: app.cover_letter,
        status: app.status,
        applied_at: app.applied_at,
        volunteer: {
          name: volunteerMap.get(app.volunteer_user_id)?.name || 'Unknown Volunteer',
          email: volunteerMap.get(app.volunteer_user_id)?.email || 'No email',
          skills: volunteerMap.get(app.volunteer_user_id)?.skills || [],
          location: volunteerMap.get(app.volunteer_user_id)?.location || 'Location not specified',
          bio: volunteerMap.get(app.volunteer_user_id)?.bio || 'No bio provided'
        },
        posting: {
          title: app.ngo_postings.title,
          location: app.ngo_postings.location || 'Location not specified'
        }
      })) || [];

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'accepted' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: action,
          reviewed_at: new Date().toISOString(),
          ngo_notes: notes || ''
        })
        .eq('id', applicationId);

      if (error) throw error;

      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No applications found
        </h3>
        <p className="text-gray-600">
          {status === 'accepted' 
            ? "You don't have any active volunteers yet."
            : "No volunteer applications received yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {application.volunteer.name}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">
                Applied for: <strong>{application.posting.title}</strong>
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{application.volunteer.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {application.volunteer.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {application.volunteer.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {application.volunteer.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{application.volunteer.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Eye}
                onClick={() => setSelectedApplication(application)}
              >
                View
              </Button>
              {application.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApplicationAction(application.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplicationAction(application.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onAction={handleApplicationAction}
        />
      )}
    </div>
  );
}

// Application Detail Modal
function ApplicationDetailModal({ 
  application, 
  onClose, 
  onAction 
}: {
  application: Application;
  onClose: () => void;
  onAction: (id: string, action: 'accepted' | 'rejected', notes?: string) => void;
}) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Application from {application.volunteer.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Volunteer Profile</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {application.volunteer.name}</p>
              <p><strong>Email:</strong> {application.volunteer.email}</p>
              <p><strong>Location:</strong> {application.volunteer.location}</p>
              <div>
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {application.volunteer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <p><strong>Bio:</strong> {application.volunteer.bio}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{application.cover_letter}</p>
            </div>
          </div>

          {application.status === 'pending' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Review Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your decision..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {application.status === 'pending' && (
            <>
              <Button
                onClick={() => onAction(application.id, 'rejected', notes)}
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onAction(application.id, 'accepted', notes)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={16} className="mr-2" />
                Accept
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}