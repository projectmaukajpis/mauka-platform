import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Building, Globe, Phone, User, AlertCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface NGORegistrationData {
  organization_name: string;
  description: string;
  contact_person: string;
  website: string;
  registration_number: string;
  focus_areas: string[];
  location: string;
}

const FOCUS_AREAS = [
  'Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Child Welfare',
  'Elder Care', 'Animal Welfare', 'Rural Development', 'Digital Literacy',
  'Skill Development', 'Disaster Relief', 'Mental Health', 'Arts & Culture',
  'Sports & Recreation', 'Human Rights', 'Poverty Alleviation'
];

export default function NGORegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NGORegistrationData>({
    organization_name: '',
    description: '',
    contact_person: '',
    website: '',
    registration_number: '',
    focus_areas: [],
    location: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = 'Organization name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (formData.focus_areas.length === 0) {
      newErrors.focus_areas = 'Please select at least one focus area';
    }
    if (documents.length === 0) {
      newErrors.documents = 'Please upload at least one verification document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        documents: 'Only PDF and image files under 10MB are allowed'
      }));
    } else {
      setDocuments(prev => [...prev, ...validFiles]);
      setErrors(prev => ({ ...prev, documents: '' }));
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadDocuments = async (): Promise<any[]> => {
    const uploadedDocs = [];

    for (let i = 0; i < documents.length; i++) {
      const file = documents[i];
      const fileName = `${user!.id}/${Date.now()}_${file.name}`;

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const { data, error } = await supabase.storage
          .from('ngo-documents')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('ngo-documents')
          .getPublicUrl(fileName);

        uploadedDocs.push({
          name: file.name,
          url: urlData.publicUrl,
          path: fileName,
          size: file.size,
          type: file.type
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    }

    return uploadedDocs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');

      // Upload documents first
      const uploadedDocuments = await uploadDocuments();

      // Check if application already exists
      const { data: existingApplication } = await supabase
        .from('ngo_applications')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create or update NGO application
      const applicationData = {
        user_id: user.id,
        organization_name: formData.organization_name,
        description: formData.description,
        contact_person: formData.contact_person,
        website: formData.website || null,
        registration_number: formData.registration_number || null,
        focus_areas: formData.focus_areas,
        documents: uploadedDocuments,
        status: 'pending'
      };

      let applicationError;
      if (existingApplication) {
        // Update existing application
        const { error } = await supabase
          .from('ngo_applications')
          .update(applicationData)
          .eq('user_id', user.id);
        applicationError = error;
      } else {
        // Create new application
        const { error } = await supabase
          .from('ngo_applications')
          .insert(applicationData);
        applicationError = error;
      }

      if (applicationError) throw applicationError;

      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create or update user profile as NGO
      const profileData = {
        user_id: user.id,
        user_type: 'ngo',
        name: formData.organization_name,
        organization_name: formData.organization_name,
        bio: formData.description,
        description: formData.description,
        location: formData.location,
        focus_areas: formData.focus_areas,
        contact_person: formData.contact_person,
        website: formData.website,
        registration_number: formData.registration_number,
        verified: false,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let profileError;
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', user.id);
        profileError = error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert(profileData);
        profileError = error;
      }

      if (profileError) throw profileError;

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setErrors({ general: error.message || 'Failed to submit application' });
    } finally {
      setLoading(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(area)
        ? prev.focus_areas.filter(a => a !== area)
        : [...prev.focus_areas, area]
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Building className="mx-auto h-12 w-12 text-orange-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Registration</h1>
            <p className="text-gray-600">
              Register your organization to start connecting with passionate volunteers
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Organization Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline mr-1" size={16} />
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={formData.organization_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.organization_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your organization name"
                  />
                  {errors.organization_name && <p className="mt-1 text-sm text-red-600">{errors.organization_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-1" size={16} />
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.contact_person ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Primary contact person name"
                  />
                  {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your organization's mission, activities, and impact..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline mr-1" size={16} />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline mr-1" size={16} />
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Government registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City, State"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Focus Areas *
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOCUS_AREAS.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`p-3 text-sm rounded-lg border-2 transition-all ${
                      formData.focus_areas.includes(area)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {errors.focus_areas && <p className="text-sm text-red-600">{errors.focus_areas}</p>}
            </div>

            {/* Document Upload */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Verification Documents *
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Required Documents:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Certificate of Incorporation/Registration</li>
                  <li>• 12A/80G Certificate (if applicable)</li>
                  <li>• PAN Card of the organization</li>
                  <li>• Address proof of registered office</li>
                  <li>• Any other relevant certifications</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <label htmlFor="file-upload" className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium">
                      Click to upload documents
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or images up to 10MB each</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {errors.documents && <p className="text-sm text-red-600">{errors.documents}</p>}

              {/* Uploaded Files */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Uploaded Documents:</h4>
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadProgress[file.name] !== undefined && (
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Review Process:</p>
                  <p>
                    Your application will be reviewed by our admin team within 3-5 business days. 
                    You'll receive an email notification once your verification is complete.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
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
                      Submitting Application...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}