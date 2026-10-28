import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ReportNewPage } from './pages/ReportNewPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
              {/* Emergency National Hotline 999 Banner */}
              <EmergencyBanner />

              {/* Main Civic Navbar */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/report/new" element={<ReportNewPage />} />
                  <Route path="/report/:id" element={<ReportDetailPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/guidelines" element={<GuidelinesPage />} />
                  <Route path="/privacy" element={<PrivacyTermsPage />} />
                  <Route path="/terms" element={<PrivacyTermsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Civic Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
