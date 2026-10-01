import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MapPin,
  Building2,
  CheckSquare,
  LogOut,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Clock,
  Bell,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const { user, logoutUser, setCurrentPage, showToast } = useApp();
  const [selectedModule, setSelectedModule] = useState<null | {
    title: string;
    description: string;
    roadmap: string[];
  }>(null);
  const [notifiedModules, setNotifiedModules] = useState<Record<string, boolean>>({});

  const displayName = user?.name || 'Traveler';

  const handleLogout = () => {
    logoutUser();
    setCurrentPage('home');
    showToast('Logged out successfully.', 'info');
  };

  const dashboardCards = [
    {
      id: 'plan',
      title: 'Plan a Journey',
      description: 'Start building your travel plan.',
      details: 'Custom multi-stop itineraries, travel window forecasting, transit connections and budget preparation.',
      icon: Compass,
      accentBg: 'bg-teal-50 border-teal-200 text-teal-700',
      badge: 'Coming Soon',
      roadmap: [
        'Multi-modal transit selector (rail, road, air)',
        'Route duration buffer calculator',
        'Seasonal weather & luggage advisory',
      ],
    },
    {
      id: 'explore',
      title: 'Explore Destination',
      description: 'Discover practical destination information.',
      details: 'Truthful ground conditions, local commute methods, permit requirements, and seasonal peak windows.',
      icon: MapPin,
      accentBg: 'bg-sky-50 border-sky-200 text-sky-700',
      badge: 'Coming Soon',
      roadmap: [
        'Official permit & registration portal links',
        'Topography & altitude acclimation tips',
        'Verified emergency & healthcare contacts',
      ],
    },
    {
      id: 'stay',
      title: 'Stay Insights',
      description: 'Understand accommodation and surroundings.',
      details: 'True road access, neighborhood steepness, vehicle parking feasibility, and night safety verification.',
      icon: Building2,
      accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badge: 'Coming Soon',
      roadmap: [
        'Street-level walkability & incline index',
        'Noise level & market proximity assessment',
        'Last-mile road width & taxi accessibility',
      ],
    },
    {
      id: 'checklist',
      title: 'My Checklist',
      description: 'Your personalized travel preparation will appear here.',
      details: 'Dynamic packing guidelines, required original photo IDs, medical kits, and digital pass backups.',
      icon: CheckSquare,
      accentBg: 'bg-amber-50 border-amber-200 text-amber-700',
      badge: 'Coming Soon',
      roadmap: [
        'Family & senior citizen comfort checklist',
        'Offline printable travel summary sheet',
        'Pre-departure 24h & 48h automated reminders',
      ],
    },
  ];

  const handleToggleNotify = (title: string) => {
    const nextState = !notifiedModules[title];
    setNotifiedModules({ ...notifiedModules, [title]: nextState });
    if (nextState) {
      showToast(`Notification enabled for ${title} release!`, 'info');
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0B1528] rounded-[14px] flex items-center justify-center text-teal-300">
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Welcome, {displayName} 👋
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-600 font-normal">
                Your journey starts here.
              </p>
              {user?.email && (
                <div className="text-xs text-slate-400 mt-1">
                  Registered account: {user.email} {user.phone && `· ${user.phone}`}
                </div>
              )}
            </div>
          </div>

          {/* User Actions: Explore Homepage + Working Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Explore Homepage
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Travel Workspace Overview Banner */}
        <div className="bg-[#0B1528] text-white rounded-2xl p-6 mb-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Travel Preparation Hub
              </h2>
              <p className="text-xs text-slate-300 font-normal">
                Build personalized itineraries, view lodging ground reality, and access verified requirements.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-teal-300 px-3 py-1.5 rounded-lg bg-teal-950 border border-teal-500/30 whitespace-nowrap">
            Early Access
          </div>
        </div>

        {/* 4 Placeholder Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${card.accentBg} transition-transform group-hover:scale-105`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    {/* Coming Soon Pill */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>{card.badge}</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-base text-slate-700 font-medium mb-3">
                    {card.description}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {card.details}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Module Preview
                  </span>
                  <button
                    onClick={() =>
                      setSelectedModule({
                        title: card.title,
                        description: card.details,
                        roadmap: card.roadmap,
                      })
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 group-hover:underline decoration-teal-400 cursor-pointer"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail / Roadmap Modal for Cards */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Feature Preview · Phase 2</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                {selectedModule.title}
              </h3>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed font-normal">
                {selectedModule.description}
              </p>

              <div className="mb-6">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Upcoming Module Capabilities:
                </div>
                <ul className="space-y-2.5">
                  {selectedModule.roadmap.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleNotify(selectedModule.title)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    notifiedModules[selectedModule.title]
                      ? 'bg-teal-50 text-teal-800 border border-teal-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {notifiedModules[selectedModule.title]
                      ? 'Release Alert Active'
                      : 'Notify Me On Release'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
