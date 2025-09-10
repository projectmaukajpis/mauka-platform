import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ImpactPage from './pages/ImpactPage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import SearchPage from './pages/SearchPage';
import MatchPage from './pages/MatchPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfileSetupPage from './pages/auth/ProfileSetupPage';
import NGORegistrationPage from './pages/NGORegistrationPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
          <Routes>
              {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* <Route path="/ai-match" element={<AIMatchNewPage />} /> */}
              {/* <Route path="/ai-match-demo" element={<AIMatchPage />} /> */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/match" element={<MatchPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/profile-setup" element={<ProfileSetupPage />} />
              
              {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;