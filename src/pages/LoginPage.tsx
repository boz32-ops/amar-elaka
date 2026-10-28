import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      success(language === 'bn' ? 'সফলভাবে লগইন হয়েছে' : 'Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
          <MapPin className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('loginTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'আপনার নাগরিক অ্যাকাউন্টে প্রবেশ করে সমস্যার অগ্রগতি পর্যবেক্ষণ করুন'
            : 'Access your account to report and track civic resolutions'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button type="submit" size="md" className="w-full mt-2" isLoading={isLoading}>
            {t('loginSubmit')}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <Link to="/register" className="text-emerald-700 hover:underline font-semibold">
            {t('noAccount')}
          </Link>
        </div>

        {/* Quick Demo Credentials Autofill Pill */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {language === 'bn' ? 'এক ক্লিকে ডেমো লগইন:' : 'One-Click Demo Accounts:'}
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@amarelaka.gov.bd', 'Admin@123456')}
              className="py-1.5 px-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-center truncate"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('moderator@amarelaka.gov.bd', 'Moderator@123456')}
              className="py-1.5 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center truncate"
            >
              Moderator
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('resident@gmail.com', 'Resident@123456')}
              className="py-1.5 px-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors text-center truncate"
            >
              Resident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
