import React from 'react';
import { ExternalLink, Facebook, Twitter, Instagram, Linkedin, MapPin, Users, Clock, Heart } from 'lucide-react';



const impactMetrics = [
  {
    icon: Users,
    title: 'Volunteers',
    value: '3000',
    description: 'Active volunteers making a difference',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: MapPin,
    title: 'NGO Partners',
    value: '80+',
    description: 'Verified NGOs collaborating with our platform',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Clock,
    title: 'Service Hours',
    value: '7200',
    description: 'Total volunteer hours contributed to various causes',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Heart,
    title: 'Lives Impacted',
    value: '15,000+',
    description: 'People directly benefited from our volunteer programs',
    color: 'bg-red-100 text-red-600'
  }
];

const programs = [
  {
    id: 1,
    title: 'Educational Sessions',
    description: 'Comprehensive learning programs designed to enhance academic skills and knowledge across various subjects.',
    image: '/education.jpeg'
  },
  {
    id: 2,
    title: 'Musical Sessions',
    description: 'Creative music programs that foster artistic expression and cultural appreciation among participants.',
    image: '/music.jpeg'
  },
  {
    id: 3,
    title: 'Enrichment Sessions',
    description: 'Holistic development programs focusing on life skills, personality development, and community engagement.',
    image: '/enrich.jpeg'
  }
];

export default function ImpactPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Impact
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Together, we're creating meaningful change across India. Explore the stories, 
              numbers, and communities that showcase the power of student volunteers working 
              with dedicated NGOs.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Impact by Numbers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These metrics represent the collective effort of our volunteer community 
              and the tangible difference we're making together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${metric.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <metric.icon size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Impact Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the core programs that drive our mission to create positive 
              change in communities across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Future Metrics Section (Placeholder) */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Building Tomorrow's Impact
          </h2>
          <p className="text-xl mb-8 opacity-90">
            We're working on new features to better track and showcase our collective impact. 
            Stay tuned for detailed analytics, volunteer stories, and community highlights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Impact Dashboard</h3>
              <p className="text-sm opacity-80">Real-time tracking of volunteer activities and outcomes</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Story Hub</h3>
              <p className="text-sm opacity-80">Personal narratives from volunteers and beneficiaries</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Community Map</h3>
              <p className="text-sm opacity-80">Interactive visualization of our nationwide presence</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}