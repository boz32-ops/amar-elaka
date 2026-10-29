import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Gunaigach, Ulipur, Kurigram');
  const [ward, setWard] = useState('Ward 01');
  const [district, setDistrict] = useState('Kurigram');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        area: area.trim(),
        ward: ward.trim() || undefined,
        district: district.trim(),
      });
      success(
        language === 'bn'
          ? 'নাগরিক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!'
          : 'Citizen account created successfully!'
      );
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
          <MapPin className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('registerTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'আপনার এলাকার সমস্যা সমাধানে সক্রিয় ভূমিকা রাখতে নাগরিক হিসেবে যোগ দিন'
            : 'Join as an engaged resident to report issues and support community fixes'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('fullName')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rahim Ahmed"
                className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('email')} <span className="text-red-500">*</span>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('password')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('filterArea')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                placeholder="e.g. Gunaigach, গুনাইগাছ"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('ward')}
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Ward 10"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {language === 'bn'
                ? 'আপনার ফোন নম্বর কখনো প্রকাশ্যে প্রদর্শিত হবে না'
                : 'Your phone number is kept private and never published.'}
            </span>
          </div>

          <Button type="submit" size="md" className="w-full mt-2" isLoading={isLoading}>
            {t('registerSubmit')}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <Link to="/login" className="text-emerald-700 hover:underline font-semibold">
            {t('haveAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};
