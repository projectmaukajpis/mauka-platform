import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Target, Sparkles, MapPin } from 'lucide-react';
import Button from '../components/UI/Button';

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Volunteer.{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Make Impact.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Mauka is India's first AI-powered platform connecting passionate student volunteers 
              with meaningful NGO opportunities. Find your perfect match and create lasting change 
              in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                  Join as Volunteer
                </Button>
              </Link>
              <Link to="https://forms.gle/wgP9RX5DYF5L54uz9">
                <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                  Join as NGO
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Mauka?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of volunteer matching with our AI-powered platform 
              designed specifically for Indian students and NGOs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Location-Based Matching</h3>
              <p className="text-gray-600">
                Find volunteer opportunities near you using real-time location data and 
                distance-based matching for maximum convenience and impact.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Impact</h3>
              <p className="text-gray-600">
                Make a real difference in your local community by connecting with verified NGOs 
                and volunteer opportunities within your preferred distance range.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Measurable Impact</h3>
              <p className="text-gray-600">
                Track your volunteer hours, see your impact grow, and compete on our leaderboard 
                while building valuable experience for your future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">3000+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">80+</div>
              <div className="text-gray-600">Partner NGOs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">7200+</div>
              <div className="text-gray-600">Hours Volunteered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the Mauka community today and discover volunteer opportunities 
            that align with your passion and skills. Your journey to impact starts here.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth/signup">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-orange-600 border-white hover:bg-gray-100"
              >
                Join as Volunteer
              </Button>
            </Link>
            <Link to="https://forms.gle/xyyVhHwoJqJYcCUx6">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-orange-600 border-white hover:bg-gray-100"
              >
                Join as NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}