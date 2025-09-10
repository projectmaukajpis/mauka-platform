import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Program } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const samplePrograms: Program[] = [
  {
    id: '1',
    title: 'Education for All Initiative',
    description: 'Help underprivileged children access quality education through tutoring, mentorship, and learning resource development. Make a lasting impact on young minds.',
    image_url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active'
  },
  {
    id: '2',
    title: 'Clean Water Project',
    description: 'Support communities in gaining access to clean drinking water through awareness campaigns, water quality testing, and infrastructure development.',
    image_url: 'https://images.pexels.com/photos/6591379/pexels-photo-6591379.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active'
  },
  {
    id: '3',
    title: 'Digital Literacy Campaign',
    description: 'Bridge the digital divide by teaching basic computer skills and internet literacy to rural communities and senior citizens.',
    image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active'
  },
  {
    id: '4',
    title: 'Environmental Conservation Drive',
    description: 'Participate in tree plantation, waste management, and environmental awareness programs to create sustainable communities.',
    image_url: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active'
  },
  {
    id: '5',
    title: 'Healthcare Access Program',
    description: 'Assist in organizing health camps, awareness drives, and supporting healthcare workers in underserved areas.',
    image_url: 'https://images.pexels.com/photos/6749769/pexels-photo-6749769.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Skill Development Workshops',
    description: 'Conduct vocational training and skill development workshops for youth employment and entrepreneurship opportunities.',
    image_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'upcoming'
  }
];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrograms(samplePrograms);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPrograms = filter === 'all' 
    ? programs 
    : programs.filter(program => program.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover meaningful volunteer opportunities across various social causes. 
              Each program is carefully curated to maximize impact and provide valuable 
              experience for student volunteers.
            </p>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['all', 'active', 'upcoming', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 bg-black/10 rounded-full px-2 py-0.5 text-xs">
                      {programs.filter(p => p.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No programs found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No programs available at the moment.' 
                  : `No ${filter} programs available.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={program.image_url || 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={program.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(program.status)}`}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {program.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span>Multiple Locations</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>Flexible Hours</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>Ongoing</span>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        program.status === 'active'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : program.status === 'upcoming'
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={program.status !== 'active'}
                    >
                      {program.status === 'active' ? 'Apply Now' : 
                       program.status === 'upcoming' ? 'Coming Soon' : 'Completed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who are already creating positive impact through our programs. 
            Find your perfect volunteer match with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Explore AI Matching
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}