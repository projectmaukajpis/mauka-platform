import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award } from 'lucide-react';
import Button from '../components/UI/Button';

const teamMembers = [
  {
    id: '1',
    name: 'Aadarsh Tripathy',
    position: 'President',
    image_url: 'https://i.postimg.cc/zV27cj2G/aadarsh.png"',
    contact: 'atripathy@jpischool.com'
  },
  {
    id: '2',
    name: 'Arsh Choudhary',
    position: 'President',
    image_url: 'https://i.postimg.cc/zy9jJfrm/arsh.jpg',
    contact: 'arshchoudhary009@gmail.com'
  },
  {
    id: '3',
    name: 'Siddharth Sharma',
    position: 'Head of Operations',
    image_url: 'https://i.postimg.cc/zbkSSSR5/siddharth.jpg',
    contact: 'ssharma28@jpischool.com'
  },
  {
    id: '4',
    name: 'Yashvi Singh',
    position: 'Head of Operations',
    image_url: 'https://i.postimg.cc/s1w4Mmr4/yashvi.jpg',
    contact: 'ysingh4@jpischool.com'
  },
  {
    id: '5',
    name: 'Mrityunjay Gupta',
    position: 'Head of Technology',
    image_url: 'https://i.postimg.cc/GThPM8kD/mj.jpg',
    contact: 'mgupta1@jpischool.com'
  },
  {
    id: '6',
    name: 'Aarush Gupta',
    position: 'Head of Finance',
    image_url: 'https://i.postimg.cc/Mnc52Qgb/aarush.jpg',
    contact: 'agupta41@jpischool.com'
  },
  {
    id: '7',
    name: 'Vivaan Patni',
    position: 'Head of Outreach',
    image_url: 'https://i.postimg.cc/s1VJf8t2/vivaan.jpg',
    contact: 'vpatni@jpischool.com'
  },
  {
    id: '8',
    name: 'Deeva Choudhary',
    position: 'Head of Outreach',
    image_url: 'https://i.postimg.cc/MMwmQrHd/deeva.jpg',
    contact: 'dchoudhary2@jpischool.com.'
  },
  {
    id: '9',
    name: 'Aahvana Kapuria',
    position: 'Head of Outreach',
    image_url: 'https://i.postimg.cc/mcCShGLP/aahvana.jpg',
    contact: 'akapuria@jpischool.com'
  }
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Mauka
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe every student has the power to create positive change in their community. 
              Mauka exists to unlock that potential by connecting passionate volunteers with 
              meaningful opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize volunteer opportunities in India by creating an intelligent platform 
                that matches students with NGOs based on their unique skills, interests, and availability. 
                We envision a future where every student can easily find and contribute to causes they care about.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Through the power of artificial intelligence and community building, we're transforming 
                how volunteering works in India - making it more accessible, efficient, and impactful 
                for everyone involved.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Target className="text-blue-600" size={20} />
                  <span className="text-gray-700">Impact-Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-green-600" size={20} />
                  How can NGOs join the platform?
                </div>
                <div className="flex items-center space-x-2">
                  NGOs can apply to join our platform through our application form. 
                  We carefully review all applications to ensure authenticity and impact 
                  before providing access credentials.
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <img 
                src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Team collaboration" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Mauka and shape how we serve 
              our community of volunteers and NGO partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Purpose</h3>
              <p className="text-gray-600">
                Every action we take is driven by our commitment to creating meaningful 
                social impact through volunteer engagement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Inclusion</h3>
              <p className="text-gray-600">
                We believe volunteering should be accessible to every student, 
                regardless of background or experience level.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in our platform, partnerships, 
                and the volunteer experiences we facilitate.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Empathy</h3>
              <p className="text-gray-600">
                We approach every interaction with understanding, compassion, 
                and respect for diverse perspectives and needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to revolutionize volunteering in India. 
              We're students, technologists, and change-makers united by a common vision.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative mb-4">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium italic mb-8">
            "The best way to find yourself is to lose yourself in the service of others."
          </blockquote>
          <p className="text-xl opacity-90 mb-8">— Mahatma Gandhi</p>
          <p className="text-lg opacity-80 mb-8">
            This timeless wisdom inspires everything we do at Mauka. We believe that through service 
            to others, students not only create positive change but also discover their own potential 
            and purpose.
          </p>
          <Link to="/auth/signup">
            <Button variant="outline" size="lg" className="bg-white text-blue-600 border-white hover:bg-gray-100">
              Join Our Mission
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}