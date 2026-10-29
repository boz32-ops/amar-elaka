import React, { useEffect, useState } from 'react';
import { BookOpen, Award, Building2 } from 'lucide-react';

interface AdminProfile {
  titleBn: string;
  titleEn: string;
  nameBn: string;
  nameEn: string;
  qualificationsBn: string;
  qualificationsEn: string;
  roleBn: string;
  roleEn: string;
  institutionBn: string;
  institutionEn: string;
  photo: string; // URL or base64
}

const PROFILE_DATA: AdminProfile = {
  titleBn: 'প্রভাষক',
  titleEn: 'Lecturer',
  nameBn: 'মোঃ জিয়াউর রহমান',
  nameEn: 'Md. Ziaur Rahman',
  qualificationsBn: 'বিএসসি (সম্মান), এমএসসি, এলএলবি.',
  qualificationsEn: 'BSc (Hons), MSc, LLB.',
  roleBn: 'প্রভাষক (জীববিজ্ঞান)',
  roleEn: 'Lecturer (Biology)',
  institutionBn: 'জুম্মাহাট ফাজিল ডিগ্রী মাদ্রাসা',
  institutionEn: 'Jummahat Fazil Degree Madrasa',
  photo: '/mock/admin-profile.jpg',
};

interface AdminProfileCardProps {
  language?: 'bn' | 'en';
}

export const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ language = 'bn' }) => {
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const p = PROFILE_DATA;
  const isBn = language === 'bn';

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950 border border-emerald-700/40 shadow-2xl">
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />

        {/* BD Flag stripe accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 via-red-500 to-green-600 rounded-t-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
          {/* ─── Photo column ─── */}
          <div className="flex-shrink-0 flex items-end justify-center sm:items-end sm:justify-start px-6 pt-8 pb-0 sm:pb-0">
            <div className="relative">
              {/* Dark wood-effect frame */}
              <div className="w-36 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-4 border-amber-900/70 shadow-xl shadow-black/40">
                <img
                  src={p.photo}
                  alt={isBn ? p.nameBn : p.nameEn}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback avatar if image not found
                    const el = e.target as HTMLImageElement;
                    el.onerror = null;
                    el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      p.nameEn
                    )}&size=200&background=064e3b&color=6ee7b7&font-size=0.3`;
                  }}
                />
              </div>
              {/* Small verified badge */}
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow ring-2 ring-emerald-900">
                ✓ {isBn ? 'যাচাইকৃত' : 'Verified'}
              </span>
            </div>
          </div>

          {/* ─── Info column ─── */}
          <div className="flex-1 flex flex-col justify-center gap-3 px-6 pt-6 pb-8 text-white">
            {/* Title chip */}
            <span className="inline-flex items-center self-start gap-1.5 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              <Award className="w-3 h-3" />
              {isBn ? p.titleBn : p.titleEn}
            </span>

            {/* Name */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                {isBn ? p.nameBn : p.nameEn}
              </h3>
              {/* Qualifications */}
              <p className="text-emerald-300 text-sm font-medium mt-1">
                {isBn ? p.qualificationsBn : p.qualificationsEn}
              </p>
            </div>

            {/* Role & Institution */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Role pill */}
              <span className="inline-flex items-center gap-1.5 bg-red-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">
                <BookOpen className="w-3.5 h-3.5" />
                {isBn ? p.roleBn : p.roleEn}
              </span>

              {/* Divider (desktop) */}
              <span className="hidden sm:inline text-emerald-700 self-center">|</span>

              {/* Institution */}
              <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {isBn ? p.institutionBn : p.institutionEn}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
