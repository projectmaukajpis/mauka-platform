import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const sampleLeaderboard: LeaderboardEntry[] = [
  { id: '1', volunteer_id: '1', volunteer_name: 'Arjun Mehta', working_hours: 156, rank: 1 },
  { id: '2', volunteer_id: '2', volunteer_name: 'Sneha Sharma', working_hours: 142, rank: 2 },
  { id: '3', volunteer_id: '3', volunteer_name: 'Rohit Kumar', working_hours: 128, rank: 3 },
  { id: '4', volunteer_id: '4', volunteer_name: 'Priya Singh', working_hours: 115, rank: 4 },
  { id: '5', volunteer_id: '5', volunteer_name: 'Vikash Gupta', working_hours: 108, rank: 5 },
  { id: '6', volunteer_id: '6', volunteer_name: 'Ananya Reddy', working_hours: 95, rank: 6 },
  { id: '7', volunteer_id: '7', volunteer_name: 'Karan Patel', working_hours: 87, rank: 7 },
  { id: '8', volunteer_id: '8', volunteer_name: 'Nidhi Agarwal', working_hours: 76, rank: 8 },
  { id: '9', volunteer_id: '9', volunteer_name: 'Suresh Yadav', working_hours: 69, rank: 9 },
  { id: '10', volunteer_id: '10', volunteer_name: 'Kavya Krishnan', working_hours: 58, rank: 10 },
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate API call to fetch leaderboard data
    setTimeout(() => {
      setLeaderboard(sampleLeaderboard);
      setLoading(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 shadow-md';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-md';
      default:
        return 'bg-white border-gray-200 hover:shadow-md';
    }
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
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Trophy className="text-yellow-500" size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Volunteer Leaderboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Celebrating our most dedicated volunteers who are making the biggest impact 
              in their communities. Rankings are based on verified volunteer hours and 
              updated daily at midnight IST.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Last updated: {lastUpdated.toLocaleDateString('en-IN')} at 12:00 AM IST</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {leaderboard.reduce((total, entry) => total + entry.working_hours, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Hours Volunteered</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {leaderboard.length}
              </div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.round(leaderboard.reduce((total, entry) => total + entry.working_hours, 0) / leaderboard.length)}
              </div>
              <div className="text-gray-600">Average Hours per Volunteer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Top 10 Volunteers</h2>
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-6 transition-all duration-200 ${getRankStyle(entry.rank)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {entry.volunteer_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Rank #{entry.rank} • {entry.working_hours} hours
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {entry.working_hours}
                      </div>
                      <div className="text-sm text-gray-600">hours</div>
                    </div>
                  </div>
                  
                  {/* Progress bar for visual representation */}
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          entry.rank === 1
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                            : entry.rank === 2
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                            : entry.rank === 3
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{
                          width: `${(entry.working_hours / leaderboard[0].working_hours) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">
                Rankings update automatically every day at 12:00 AM IST based on verified volunteer hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="mx-auto mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join the Leaderboard?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start volunteering today and track your impact. Every hour counts towards 
            building a better community and climbing the leaderboard!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Find Volunteer Opportunities
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
              Learn How Rankings Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}