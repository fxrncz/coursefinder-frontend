'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PersonalityTestResults from '../personalitytest/PersonalityTestResults';
import PersonalityTestHeader from '../personalitytest/PersonalityTestHeader';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for session ID in URL (for guest users)
    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      setSessionId(sessionParam);
      setIsGuest(true);
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
    <div className="min-h-screen bg-white">
      <PersonalityTestHeader />
      <PersonalityTestResults
        userId={userData?.id}
        sessionId={sessionId}
        isGuest={isGuest}
      />
    </div>
  );
}
