'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PersonalityTestResults from '../personalitytest/PersonalityTestResults';
import RegisterDialog from '../components/RegisterDialog';
import AuthDialog from '../components/AuthDialog';
import { localGeorama } from '../fonts';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center"><p className={`${localGeorama.className} text-[#002A3C] text-lg`}>Loading...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const [userData, setUserData] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'details' | 'mbti-details' | 'development-plan' | 'comparison'>('overview');
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for session ID in URL (for both guests and users)
    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      setSessionId(sessionParam);
      
      // Check if user is logged in to determine if this is a guest or user session
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setUserData(user);
          setIsGuest(false);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsGuest(true);
        }
      } else {
        setIsGuest(true);
      }
      setLoading(false);
      return;
    }

    // Check if user is logged in
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        setIsGuest(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Check for guest session
        checkGuestSession();
      }
    } else {
      // Check for guest session
      checkGuestSession();
    }
    setLoading(false);
  }, [router, searchParams]);

  const checkGuestSession = () => {
    // Check for last test session ID in localStorage
    const lastSessionId = localStorage.getItem('lastTestSessionId');
    if (lastSessionId) {
      setSessionId(lastSessionId);
      setIsGuest(true);
    } else {
      // No session found, redirect to test
      router.push('/personalitytest');
    }
  };

  const handleLoginSuccess = (user: any) => {
    setUserData(user);
    setIsGuest(false);
    setAuthDialogOpen(false);
    // Redirect to user page after successful login
    router.push('/userpage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002A3C] mx-auto mb-4"></div>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isGuest && !userData) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <p className={`${localGeorama.className} text-[#002A3C] text-lg mb-4`}>
            No test results found
          </p>
          <button
            onClick={() => router.push('/personalitytest')}
            className={`${localGeorama.className} bg-[#002A3C] text-white px-6 py-2 font-semibold hover:bg-[#004E70] transition-colors`}
          >
            Take Personality Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4E6]">
      {/* Navigation Tabs - Responsive */}
      <div className="bg-white shadow-lg mb-8 mx-0">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center px-2 sm:px-4 lg:px-6 xl:px-8">
          {/* Centered Tab Navigation with better responsiveness */}
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 max-w-full mx-auto">
            {[
              { key: 'overview', label: 'Overview', shortLabel: 'Overview' },
              { key: 'courses', label: 'Course Recommendations', shortLabel: 'Courses' },
              { key: 'details', label: 'Detailed Scores', shortLabel: 'Scores' },
              { key: 'mbti-details', label: 'Personality Details', shortLabel: 'Personality' },
              { key: 'development-plan', label: 'Development Plan', shortLabel: 'Plan' },
              { key: 'comparison', label: 'AI Comparison', shortLabel: 'AI Compare' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${localGeorama.className} 
                  px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 
                  py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 
                  text-sm sm:text-base md:text-lg lg:text-xl 
                  font-bold transition-all duration-300
                  whitespace-nowrap
                  flex-shrink-0
                  hover:scale-105 active:scale-95
                  ${activeTab === tab.key
                    ? 'text-[#004E70] border-b-3 sm:border-b-4 border-[#004E70] bg-blue-50/30'
                    : 'text-gray-600 hover:text-[#004E70] hover:bg-gray-50/50'
                  }`}
                title={tab.label} // Show full label on hover
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation - Grid Layout */}
        <div className="md:hidden">
          {/* Mobile Tab Navigation */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 p-2 sm:p-3">
            {[
              { key: 'overview', label: 'Overview', shortLabel: 'Overview' },
              { key: 'courses', label: 'Course Recommendations', shortLabel: 'Courses' },
              { key: 'details', label: 'Detailed Scores', shortLabel: 'Scores' },
              { key: 'mbti-details', label: 'Personality Details', shortLabel: 'Personality' },
              { key: 'development-plan', label: 'Development Plan', shortLabel: 'Plan' },
              { key: 'comparison', label: 'AI Comparison', shortLabel: 'AI Compare' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${localGeorama.className} 
                  px-2 sm:px-3 
                  py-3 sm:py-4 
                  text-xs sm:text-sm 
                  font-bold transition-all duration-300 
                  rounded-lg
                  hover:scale-105 active:scale-95
                  ${activeTab === tab.key
                    ? 'text-[#004E70] bg-blue-50 border-2 border-[#004E70] shadow-md'
                    : 'text-gray-600 hover:text-[#004E70] hover:bg-gray-50 hover:shadow-sm'
                  }`}
                title={tab.label}
              >
                {tab.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Profile/Create Account Button - Below Navigation Tabs */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center px-4 py-3">
            {!isGuest && userData ? (
              <button
                onClick={() => router.push('/userpage?tab=settings')}
                className={`${localGeorama.className} 
                  flex items-center space-x-2 
                  px-4 sm:px-6 
                  py-2 sm:py-3 
                  bg-[#004E70] text-white rounded-lg 
                  hover:bg-[#002A3C] transition-all duration-300 
                  font-semibold text-sm sm:text-base
                  hover:scale-105 active:scale-95`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile Settings</span>
              </button>
            ) : (
              <button
                onClick={() => setRegisterDialogOpen(true)}
                className={`${localGeorama.className} 
                  flex items-center space-x-2 
                  px-4 sm:px-6 
                  py-2 sm:py-3 
                  bg-[#A75F00] text-white rounded-lg 
                  hover:bg-[#8B4F00] transition-all duration-300 
                  font-semibold text-sm sm:text-base
                  hover:scale-105 active:scale-95`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Create Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <PersonalityTestResults
        userId={userData?.id}
        sessionId={sessionId}
        isGuest={isGuest}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Auth Dialog */}
      <AuthDialog 
        triggerText=""
        isOpen={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSwitchToRegister={() => {
          setAuthDialogOpen(false);
          setRegisterDialogOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Dialog */}
      <RegisterDialog 
        triggerText=""
        isOpen={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onSwitchToLogin={() => {
          setRegisterDialogOpen(false);
          setAuthDialogOpen(true);
        }}
      />
    </div>
  );
}
