import React, { createContext, useContext, useState, useEffect } from 'react';
import { Page, Language, User, ToastMessage } from '../types';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
  toast: ToastMessage | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_contact: 'Contact Us',
    nav_login: 'Login',
    nav_plan_journey: 'Plan My Journey',
    nav_logout: 'Logout',
    nav_dashboard: 'Dashboard',
    
    hero_eyebrow: 'YOUR JOURNEY, SIMPLIFIED',
    hero_title: 'Welcome to Yatra Saathi',
    hero_subtitle: 'Yatra Saathi brings the essential pieces of your journey together — from destination preparation and accommodation insights to important travel requirements and practical information — so you can travel with greater confidence.',
    hero_primary_cta: 'Plan My Journey →',
    hero_secondary_cta: 'Explore Yatra Saathi',
    
    tagline: 'Travel smarter. Prepare better. Journey with confidence.',
    footer_desc: 'Your companion for informed, prepared and confident travel.',
    back_to_home: '← Back to Home',
  },
  hi: {
    nav_home: 'होम',
    nav_about: 'हमारे बारे में',
    nav_contact: 'संपर्क करें',
    nav_login: 'लॉग इन',
    nav_plan_journey: 'यात्रा योजना बनाएं',
    nav_logout: 'लॉग आउट',
    nav_dashboard: 'डैशबोर्ड',
    
    hero_eyebrow: 'आपकी यात्रा, सरल और सुगम',
    hero_title: 'यात्रा साथी में आपका स्वागत है',
    hero_subtitle: 'यात्रा साथी आपकी यात्रा के सभी जरूरी पहलुओं को एक साथ लाता है — गंतव्य की तैयारी और ठहरने की सटीक जानकारी से लेकर जरूरी यात्रा नियम और उपयोगी परामर्श तक — ताकि आप पूरे आत्मविश्वास के साथ यात्रा कर सकें।',
    hero_primary_cta: 'यात्रा योजना बनाएं →',
    hero_secondary_cta: 'यात्रा साथी जानें',
    
    tagline: 'समझदारी से यात्रा करें। बेहतर तैयारी करें। आत्मविश्वास के साथ सफर करें।',
    footer_desc: 'सूचित, तैयार और निश्चिंत यात्रा के लिए आपका विश्वसनीय साथी।',
    back_to_home: '← होम पर वापस जाएं',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('yatrasaathi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const loginUser = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('yatrasaathi_user', JSON.stringify(userData));
    } catch {
      // ignore
    }
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('yatrasaathi_user');
    } catch {
      // ignore
    }
    setCurrentPage('home');
    showToast('Logged out successfully', 'info');
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        language,
        setLanguage,
        user,
        loginUser,
        logoutUser,
        toast,
        showToast,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
