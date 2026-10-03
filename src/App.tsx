import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { TravelResourcesSection } from './components/TravelResourcesSection';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { DashboardPage } from './components/DashboardPage';
import { ChecklistPage } from './components/ChecklistPage';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <Hero />
            <FeaturesSection />
            <HowItWorksSection />
            <TravelResourcesSection />
          </>
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'login' && <LoginPage />}

        {currentPage === 'signup' && <SignupPage />}

        {currentPage === 'dashboard' && <DashboardPage />}

        {currentPage === 'checklist' && <ChecklistPage />}
      </main>

      {/* Global Consistent Footer */}
      <Footer />

      {/* Interactive System Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
