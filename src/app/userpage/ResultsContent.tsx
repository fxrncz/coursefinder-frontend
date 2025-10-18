"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { apiUrl } from "../../lib/api";
import Image from "next/image";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";

interface TestResult {
  id: number;
  userId?: number;
  guestToken?: string;
  sessionId: string;
  mbtiType: string;
  riasecCode: string;
  coursePath: string;
  careerSuggestions: string;
  studentGoals: string;
  age?: number;
  gender?: string;
  isFromPLMar?: boolean;
  generatedAt: string;
  takenAt: string;
  courseRecommendations?: any[];
}

const ResultsContent: React.FC = () => {
  const [hasResults, setHasResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Clear any potential cached test result data
    localStorage.removeItem('testResults');
    localStorage.removeItem('personalityTestResults');
    localStorage.removeItem('lastTestResults');

    checkUserResults();
  }, []);

  const checkUserResults = async () => {
    try {
      // Reset state to ensure clean start
      setHasResults(false);
      setTestResults([]);

      // Get the currently logged-in user from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        console.log('No user data found in localStorage');
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUserData);
      console.log('=== DEBUGGING USER RESULTS ===');
      console.log('Checking results for user:', user);
      console.log('User ID:', user.id);

      // Check if user has taken the personality test
      const checkResponse = await fetch(apiUrl(`/api/personality-test/check/user/${user.id}`));
      const checkData = await checkResponse.json();
      console.log('=== CHECK API RESPONSE ===');
      console.log('Check response:', checkData);
      console.log('Has taken test:', checkData.hasTakenTest);
      console.log('Status:', checkData.status);

      if (checkData.status === 'SUCCESS' && checkData.hasTakenTest === true) {
        console.log('User has taken the test, fetching ALL results...');

        // Get ALL test results for the user (not just the latest)
        const resultResponse = await fetch(apiUrl(`/api/personality-test/results/user/${user.id}`));
        const resultData = await resultResponse.json();
        console.log('=== ALL RESULTS API RESPONSE ===');
        console.log('Result response:', resultData);
        console.log('Result status:', resultData.status);
        console.log('Results count:', resultData.count);
        console.log('Results data:', resultData.results);

        if (resultData.status === 'SUCCESS' && resultData.results && resultData.results.length > 0) {
          console.log('=== SETTING ALL RESULTS ===');
          console.log('Setting testResults:', resultData.results);
          console.log('Number of results:', resultData.results.length);
          console.log('Setting hasResults to TRUE');

          // Store all results in the array
          setTestResults(resultData.results);
          setHasResults(true);
        } else {
          console.log('=== NO RESULTS FOUND ===');
          console.log('No valid result data found');
          console.log('Setting hasResults to FALSE');
          setHasResults(false);
          setTestResults([]);
        }
      } else {
        // User hasn't taken the test, keep hasResults as false
        console.log('=== USER HAS NOT TAKEN TEST ===');
        console.log('User has not taken the test, checkData:', checkData);
        console.log('Setting hasResults to FALSE (no test taken)');
        setHasResults(false);
        setTestResults([]);
      }
    } catch (error) {
      console.error('Error checking user results:', error);
      // On error, reset all state to ensure no false positives
      setHasResults(false);
      setTestResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = (result?: TestResult) => {
    if (result && result.sessionId) {
      // Navigate to results page with specific session ID
      router.push(`/results?session=${result.sessionId}`);
    } else {
      // Fallback to latest result
      router.push('/results');
    }
  };

  const handleRetakeTest = () => {
    router.push('/personalitytest');
  };

  const handleTakeTest = () => {
    router.push('/personalitytest');
  };

  if (loading) {
    return (
      <div className="flex justify-center w-full bg-[#FFF4E6] min-h-screen">
        <div className="w-full max-w-6xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002A3C] mx-auto mb-4"></div>
            <p className={`${localGeorama.className} text-[#002A3C]`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('=== RENDER STATE ===');
  console.log('hasResults:', hasResults);
  console.log('testResults:', testResults);
  console.log('testResults count:', testResults.length);
  console.log('loading:', loading);
  console.log('Will show results card:', hasResults);
  console.log('==================');

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex justify-center w-full bg-[#FFF4E6] min-h-screen">
        <div className="w-full max-w-6xl p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>
                Loading your test results...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Results Content */}
            {hasResults && testResults.length > 0 ? (
              /* Show existing test results */
              <div className="space-y-4">
                {testResults.map((result, index) => {
                  // Parse the UTC timestamp from backend
                  const testDate = new Date(result.takenAt || result.generatedAt);
                  // Format in user's local timezone
                  const formattedDate = testDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  });

                  return (
                    <div key={result.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg gap-3 sm:gap-4">
                      {/* Left Side - Icon and Text */}
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Icon - Parchment Image */}
                        <Image src="/Parchment1.png" alt="Parchment Icon" width={50} height={50} className="w-8 h-8 sm:w-10 sm:h-10" />

                        {/* Title and Date */}
                        <div className="flex flex-col">
                          <h3 className={`${localGeorama.className} font-bold text-black text-sm sm:text-base md:text-lg`}>
                            COURSEFIT PERSONALITY PROFILER
                          </h3>
                          <p className={`${localGeorgia.className} text-black text-xs sm:text-sm`}>
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewResults(result)}
                          className={`${localGeorama.className} px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-[#002A3C] text-white font-bold text-xs sm:text-sm hover:bg-[#004E70] transition-colors`}
                        >
                          VIEW RESULTS
                        </button>
                        <button
                          onClick={handleRetakeTest}
                          className={`${localGeorama.className} px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 border border-black text-black font-bold text-xs sm:text-sm hover:bg-gray-50 transition-colors`}
                        >
                          RETAKE TEST
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Show prompt to take test */
              <div className="text-center p-8">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Image src="/Parchment1.png" alt="Parchment Icon" width={64} height={64} className="w-16 h-16" />
                </div>
                <h3 className={`${localGeorama.className} font-bold text-black text-xl mb-3`}>
                  Take Your Personality Test
                </h3>
                <p className={`${localGeorgia.className} text-gray-600 text-sm mb-6 max-w-md mx-auto`}>
                  Discover your personality type and get personalized course recommendations based on Holland Code and Jungian Typology.
                </p>
                <button
                  onClick={handleTakeTest}
                  className={`${localGeorama.className} px-8 py-3 bg-[#002A3C] text-white font-bold text-sm hover:bg-[#004E70] transition-colors`}
                >
                  START PERSONALITY TEST
                </button>
              </div>
            )}
    </div>
  );
};

export default ResultsContent; 