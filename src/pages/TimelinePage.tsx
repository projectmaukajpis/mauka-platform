import React, { useState } from 'react';
import { DollarSign, TrendingUp, Globe, Smartphone, CheckCircle, Users } from 'lucide-react';

const timelineEvents = [
  {
    id: 1,
    title: 'Zoom Operations Investment',
    amount: '$150',
    description: 'Allocated for Zoom operations (18-member team weekly meetings)',
    icon: Users,
    color: 'bg-blue-500',
    details: [
      '• Enhanced team collaboration capabilities',
      '• Weekly coordination meetings for 18-member team',
      '• Improved project management efficiency'
    ]
  },
  {
    id: 2,
    title: 'Digital Marketing Campaign',
    amount: '$360',
    description: 'Invested in digital marketing (Google and Meta campaigns)',
    icon: TrendingUp,
    color: 'bg-green-500',
    details: [
      '• Google Ads campaign for volunteer recruitment',
      '• Meta (Facebook/Instagram) outreach programs',
      '• Increased platform visibility and engagement'
    ]
  },
  {
    id: 3,
    title: 'Website & App Enhancement',
    amount: '$300',
    description: 'Dedicated to website and app enhancement',
    icon: Smartphone,
    color: 'bg-purple-500',
    details: [
      '• User interface improvements',
      '• Mobile app optimization',
      '• Enhanced user experience features'
    ]
  },
  {
    id: 4,
    title: 'Geographic Expansion',
    amount: '$690',
    description: 'Used for expansion into Odisha, Chhattisgarh, Punjab, and Kashmir',
    icon: Globe,
    color: 'bg-orange-500',
    details: [
      '• Odisha state operations setup',
      '• Chhattisgarh volunteer network',
      '• Punjab regional expansion',
      '• Kashmir community outreach'
    ]
  }
];

export default function TimelinePage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const totalInvestment = timelineEvents.reduce((sum, event) => 
    sum + parseFloat(event.amount.replace('$', '')), 0
  );

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Investment Timeline
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Track our strategic investments and expansion journey as we build 
              a comprehensive volunteer matching platform across India.
            </p>
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ${totalInvestment}
              </div>
              <div className="text-gray-600">Total Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-4 h-4 ${event.color} rounded-full border-4 border-white shadow-lg`}></div>
                  
                  {/* Event Card */}
                  <div className="ml-16">
                    <div 
                      className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                        selectedEvent === event.id ? 'border-orange-500 shadow-xl' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-12 h-12 ${event.color} rounded-full flex items-center justify-center`}>
                              <event.icon className="text-white" size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                              <p className="text-gray-600">{event.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {event.amount}
                          </div>
                          <div className="text-sm text-gray-500">Investment</div>
                        </div>
                      </div>
                      
                      {/* Expandable Details */}
                      {selectedEvent === event.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Investment Details:</h4>
                          <ul className="space-y-2">
                            {event.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-gray-600 flex items-start">
                                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                {detail.replace('• ', '')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Summary */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Investment Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${event.color} rounded-full flex items-center justify-center`}>
                      <event.icon className="text-white" size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{event.title}</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{event.amount}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ${totalInvestment}
              </div>
              <div className="text-gray-600">Total Strategic Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <DollarSign className="mx-auto mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Investing in Impact
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every dollar invested brings us closer to our vision of connecting 
            passionate volunteers with meaningful opportunities across India.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
            Join Our Mission
          </button>
        </div>
      </section>
    </div>
  );
}