import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Mauka
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering students to make a difference by connecting them with meaningful volunteer opportunities across India. Together, we create positive impact in our communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/volunteermauka/" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link></li>
              <li><Link to="/ai-match" className="text-gray-300 hover:text-white transition-colors">AI Matching</Link></li>
              {/*<li><Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link></li>*/}
              <li><Link to="/impact" className="text-gray-300 hover:text-white transition-colors">Our Impact</Link></li>
              <li><Link to="/accomplishments" className="text-gray-300 hover:text-white transition-colors">Accomplishments</Link></li>
              <li><Link to="/timeline" className="text-gray-300 hover:text-white transition-colors">Timeline</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray-300">projectmaukajpis@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">+91 98759 77777</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span className="text-gray-300">India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Mauka. All rights reserved. Built with ❤️ for a better tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}