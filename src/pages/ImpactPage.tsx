import React from 'react';
import { ExternalLink, Facebook, Twitter, Instagram, Linkedin, MapPin, Users, Clock, Heart } from 'lucide-react';

const socialLinks = [
  {
    platform: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/volunteermauka',
    followers: '5.2K',
    color: 'text-blue-600'
  },
  {
    platform: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/volunteermauka',
    followers: '3.8K',
    color: 'text-blue-400'
  },
  {
    platform: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/volunteermauka',
    followers: '8.9K',
    color: 'text-pink-600'
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/company/volunteermauka',
    followers: '2.1K',
    color: 'text-blue-700'
  }
];

const impactMetrics = [
  {
    icon: Users,
    title: 'Lives Impacted',
    value: '25,000+',
    description: 'People directly benefited from our volunteer programs',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: MapPin,
    title: 'Cities Reached',
    value: '50+',
    description: 'Cities across India where our volunteers are active',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Clock,
    title: 'Hours Contributed',
    value: '100,000+',
    description: 'Total volunteer hours contributed to various causes',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Heart,
    title: 'NGO Partners',
    value: '500+',
    description: 'Verified NGOs collaborating with our platform',
    color: 'bg-red-100 text-red-600'
  }
];

const recentUpdates = [
  {
    id: 1,
    title: 'Education Drive Success',
    description: 'Our volunteers helped 500+ children access quality education materials this month.',
    date: 'January 15, 2025',
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'Clean Water Initiative',
    description: 'Successfully installed water purification systems in 10 rural villages.',
    date: 'January 10, 2025',
    image: 'https://images.pexels.com/photos/6591379/pexels-photo-6591379.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: 'Digital Literacy Program',
    description: 'Trained 200+ seniors in basic computer and internet skills.',
    date: 'January 5, 2025',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400'
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Impact Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest achievements and the positive changes 
              our volunteer community is creating across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentUpdates.map((update) => (
              <div key={update.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={update.image}
                  alt={update.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{update.date}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{update.title}</h3>
                  <p className="text-gray-600">{update.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">More impact stories coming soon!</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Subscribe for Updates
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-lg text-gray-600">
              Follow us on social media to stay updated with our latest activities, 
              impact stories, and volunteer opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${social.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <social.icon size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {social.platform}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{social.followers} followers</p>
                  <div className="inline-flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                    Follow us <ExternalLink size={14} className="ml-1" />
                  </div>
                </div>
              </a>
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