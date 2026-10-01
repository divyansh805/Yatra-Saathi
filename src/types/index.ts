export type Page = 'home' | 'about' | 'contact' | 'login' | 'signup' | 'dashboard';
export type Language = 'en' | 'hi';

export interface User {
  name: string;
  email: string;
  phone: string;
  preferredLanguage?: Language;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}
