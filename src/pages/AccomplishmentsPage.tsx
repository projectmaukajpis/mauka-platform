import React from 'react';
import { Award, Trophy, Star, Medal, Newspaper, Users } from 'lucide-react';

const accomplishments = [
  {
    id: 1,
    icon: Newspaper,
    title: 'City Bhaskar Newspaper Recognition',
    description: 'Mauka team recognized by City Bhaskar newspaper',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    icon: Newspaper,
    title: 'First India Newspaper Feature',
    description: 'Featured in First India Newspaper',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 3,
    icon: Award,
    title: 'Indian Achiever\'s Forum Recognition',
    description: 'Recognized by Indian Achiever\'s Forum',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 4,
    icon: Trophy,
    title: 'iVolunteer Youth Champion Finalist',
    description: 'Founder Parth Jain: iVolunteer Youth Champion finalist award (youngest awardee at IRA by Orchid, Mumbai ceremony)',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 5,
    icon: Star,
    title: 'Best Initiative at JPIS',
    description: 'Won best initiative at JPIS (2022-2023)',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 6,
    icon: Medal,
    title: 'Silver Medallion Winner',
    description: 'Silver Medallion winner (1 of 25 selected from 2,200+ projects) by Pramerica Life Insurance Emerging Visionaries (February 2024)',
    color: 'bg-gray-100 text-gray-600'
  },
  {
    id: 7,
    icon: Users,
    title: 'Rajasthani Community Service Recognition',
    description: 'Founder Parth Jain: Only Rajasthani awardee for nationwide community service contribution',
    color: 'bg-red-100 text-red-600'
  }
];

export default function AccomplishmentsPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Trophy className="text-yellow-500" size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Accomplishments
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the recognition and achievements that validate our mission 
              to create meaningful change through volunteer engagement across India.
            </p>
          </div>
        </div>
      </section>

      {/* Accomplishments Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accomplishments.map((accomplishment) => (
              <div key={accomplishment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className={`w-16 h-16 ${accomplishment.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <accomplishment.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {accomplishment.title}
                </h3>
                <ul className="text-gray-600 text-center">
                  <li>• {accomplishment.description}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Recognition & Awards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Award className="text-orange-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Media Recognition</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• City Bhaskar newspaper feature</li>
                <li>• First India Newspaper coverage</li>
                <li>• Indian Achiever's Forum recognition</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Trophy className="text-yellow-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Awards & Honors</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• iVolunteer Youth Champion finalist</li>
                <li>• JPIS best initiative winner</li>
                <li>• Pramerica Silver Medallion</li>
                <li>• Rajasthani community service awardee</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="mx-auto mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Award-Winning Mission
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of a recognized platform that's making real impact. 
            Your volunteer journey with us could be the next success story.
          </p>
          <button className="px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
            Start Volunteering Today
          </button>
        </div>
      </section>
    </div>
  );
}