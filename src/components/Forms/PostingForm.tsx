import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Users, FileText } from 'lucide-react';
import { supabase } from '../../config/supabase';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface PostingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editing?: any;
}

interface PostingData {
  title: string;
  description: string;
  skills_required: string[];
  location: string;
  time_commitment: string;
  duration: string;
  benefits: string[];
  requirements: string;
  max_volunteers: number;
  application_deadline: string;
}

const COMMON_SKILLS = [
  'Teaching', 'Communication', 'Event Management', 'Healthcare', 'Technology',
  'Marketing', 'Design', 'Writing', 'Research', 'Project Management',
  'Social Media', 'Photography', 'Counseling', 'First Aid', 'Leadership'
];

const COMMON_BENEFITS = [
  'Certificate of Appreciation', 'Training Provided', 'Flexible Timings',
  'Transportation Allowance', 'Meals Provided', 'Skill Development',
  'Networking Opportunities', 'Reference Letter'
];

export default function PostingForm({ onClose, onSuccess, editing }: PostingFormProps) {
  const [formData, setFormData] = useState<PostingData>({
    title: '',
    description: '',
    skills_required: [],
    location: '',
    time_commitment: '',
    duration: '',
    benefits: [],
    requirements: '',
    max_volunteers: 1,
    application_deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (editing) {
      setFormData({
        title: editing.title || '',
        description: editing.description || '',
        skills_required: editing.skills_required || [],
        location: editing.location || '',
        time_commitment: editing.time_commitment || '',
        duration: editing.duration || '',
        benefits: editing.benefits || [],
        requirements: editing.requirements || '',
        max_volunteers: editing.max_volunteers || 1,
        application_deadline: editing.application_deadline ? 
          new Date(editing.application_deadline).toISOString().split('T')[0] : ''
      });
    }
  }, [editing]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.time_commitment.trim()) newErrors.time_commitment = 'Time commitment is required';
    if (formData.max_volunteers < 1) newErrors.max_volunteers = 'Must allow at least 1 volunteer';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const postingData = {
        ...formData,
        ngo_user_id: user.id,
        application_deadline: formData.application_deadline ? 
          new Date(formData.application_deadline).toISOString() : null
      };

      if (editing) {
        const { error } = await supabase
          .from('ngo_postings')
          .update(postingData)
          .eq('id', editing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ngo_postings')
          .insert(postingData);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving posting:', error);
      setErrors({ general: 'Failed to save posting. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.includes(skill)
        ? prev.skills_required.filter(s => s !== skill)
        : [...prev.skills_required, skill]
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {editing ? 'Edit Posting' : 'Create New Posting'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline mr-1" size={16} />
                Posting Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Teaching Assistant for Mathematics"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-1" size={16} />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Andheri West, Mumbai"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the volunteer opportunity, responsibilities, and impact..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Required Skills (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    formData.skills_required.includes(skill)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-1" size={16} />
                Time Commitment
              </label>
              <select
                value={formData.time_commitment}
                onChange={(e) => setFormData(prev => ({ ...prev, time_commitment: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.time_commitment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select time commitment</option>
                <option value="2-4 hours/week">2-4 hours/week</option>
                <option value="4-8 hours/week">4-8 hours/week</option>
                <option value="8-12 hours/week">8-12 hours/week</option>
                <option value="12+ hours/week">12+ hours/week</option>
                <option value="Flexible">Flexible</option>
              </select>
              {errors.time_commitment && <p className="mt-1 text-sm text-red-600">{errors.time_commitment}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select duration</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline mr-1" size={16} />
                Max Volunteers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.max_volunteers}
                onChange={(e) => setFormData(prev => ({ ...prev, max_volunteers: Number(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.max_volunteers ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.max_volunteers && <p className="mt-1 text-sm text-red-600">{errors.max_volunteers}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Benefits for Volunteers (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_BENEFITS.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    formData.benefits.includes(benefit)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Any specific requirements or qualifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {editing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editing ? 'Update Posting' : 'Create Posting'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}