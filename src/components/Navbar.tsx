import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Menu, X, Globe, User as UserIcon, Compass, LogOut } from 'lucide-react';
import { Page } from '../types';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, language, setLanguage, user, logoutUser, showToast, t } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentPage('home');
    setIsMobileMenuOpen(false);
    showToast('Logged out successfully.', 'info');
  };

  const isTransparentHero = currentPage === 'home' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparentHero
          ? 'bg-slate-950/65 backdrop-blur-md py-4 border-b border-white/10'
          : 'bg-[#0B1528]/95 backdrop-blur-md py-3 shadow-md border-b border-slate-800/80 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          {/* LEFT: Brand Logo + Yatra Saathi Name + Logged-in Logout Option */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-0.5 transition-opacity hover:opacity-95 cursor-pointer"
              aria-label="Yatra Saathi Home"
            >
              <Logo variant="light" size="md" />
            </button>

            {/* Clearly visible Logout button on the top-left near branding when logged in */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:text-white bg-rose-500/20 hover:bg-rose-600 border border-rose-400/30 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                title="Log out from Yatra Saathi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* CENTER: Main Navigation Links with Spacious Gap (Home | About Us | Contact Us) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {[
              { id: 'home' as Page, label: t('nav_home') },
              { id: 'about' as Page, label: t('nav_about') },
              { id: 'contact' as Page, label: t('nav_contact') },
              ...(user ? [{ id: 'dashboard' as Page, label: t('nav_dashboard') }] : []),
            ].map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2 py-1.5 text-sm font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-teal-300 font-semibold'
                      : 'text-slate-200 hover:text-white hover:text-teal-200'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Language Control + Auth State Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher: English | हिंदी */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 text-xs shadow-xs">
              <span className="px-1.5 text-slate-400">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium cursor-pointer ${
                  language === 'en'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium cursor-pointer ${
                  language === 'hi'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Auth Buttons: In logged-out state, show Login. In logged-in state, show User Profile. Do NOT show both Login and Logout */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'bg-teal-600/30 text-teal-300 border-teal-500/50 shadow-xs'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title="Go to Your Dashboard"
              >
                <UserIcon className="w-3.5 h-3.5 text-teal-400" />
                <span className="max-w-[130px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t('nav_login')}
              </button>
            )}

            {/* Primary Action Button: Plan My Journey */}
            <button
              onClick={() => handleNavClick(user ? 'dashboard' : 'login')}
              className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-xs hover:shadow-teal-500/25 active:scale-98 transition-all whitespace-nowrap cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-teal-200" />
              <span>{t('nav_plan_journey')}</span>
            </button>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-200 bg-rose-500/20 border border-rose-400/30 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B1528] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {[
              { id: 'home' as Page, label: t('nav_home') },
              { id: 'about' as Page, label: t('nav_about') },
              { id: 'contact' as Page, label: t('nav_contact') },
              ...(user ? [{ id: 'dashboard' as Page, label: t('nav_dashboard') }] : []),
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-teal-600/20 text-teal-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Language / भाषा:</span>
            <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-teal-600 text-white font-medium' : 'text-slate-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-teal-600 text-white font-medium' : 'text-slate-300'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav_logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer"
              >
                {t('nav_login')}
              </button>
            )}

            <button
              onClick={() => handleNavClick(user ? 'dashboard' : 'login')}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-xs cursor-pointer"
            >
              {t('nav_plan_journey')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
