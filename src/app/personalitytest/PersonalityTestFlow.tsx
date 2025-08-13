'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionnaireCard from './QuestionnaireCard';
import GoalSettingQuestions from './GoalSettingQuestions';
import { localGeorama } from '../fonts';
import { apiUrl } from '../../lib/api';

type TestPhase = 'personality' | 'goals' | 'submitting' | 'complete';

interface PersonalityAnswers {
  [questionIndex: number]: number;
}

interface GoalSettingAnswers {
  priority: string;
  learningStyle: string[];
  environment: string;
  motivation: string;
  concern: string;
  confidence: number;
  routine: string;
  impact: string;
}

const PersonalityTestFlow: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<TestPhase>('personality');
  const [personalityAnswers, setPersonalityAnswers] = useState<PersonalityAnswers>({});
  const [goalAnswers, setGoalAnswers] = useState<GoalSettingAnswers | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [returnToLastSet, setReturnToLastSet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in, if not, proceed as guest
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        setIsGuest(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Continue as guest
        setIsGuest(true);
        generateGuestToken();
      }
    } else {
      // Continue as guest
      setIsGuest(true);
      generateGuestToken();
    }
  }, []);

  // Check if user has made progress in the test
  const hasTestProgress = () => {
    // Check for personality test progress
    const savedAnswers = localStorage.getItem('personalityTestAnswers');
    const savedGoalAnswers = localStorage.getItem('goalSettingAnswers');

    if (savedAnswers) {
      try {
        const answers = JSON.parse(savedAnswers);
        if (Object.keys(answers).length > 0) return true;
      } catch (error) {
        console.error('Error checking saved answers:', error);
      }
    }

    if (savedGoalAnswers) {
      try {
        const goalAnswers = JSON.parse(savedGoalAnswers);
        // Check if any goal setting answers have been provided
        if (goalAnswers.priority || goalAnswers.learningStyle?.length > 0 ||
            goalAnswers.environment || goalAnswers.motivation || goalAnswers.concern ||
            goalAnswers.confidence > 0 || goalAnswers.routine || goalAnswers.impact) {
          return true;
        }
      } catch (error) {
        console.error('Error checking saved goal answers:', error);
      }
    }

    return false;
  };

  // Add browser warning for page reload/leave during test (only for leaving the site)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if test is in progress (not complete) and user has progress
      if ((currentPhase === 'personality' || currentPhase === 'goals') && hasTestProgress()) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
        return 'Are you sure you want to leave? Your test progress will be lost.';
      }
    };

    // Add event listener only for page unload (not navigation)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentPhase]);

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (currentPhase === 'personality' && hasTestProgress()) {
        // Prevent the navigation
        e.preventDefault();

        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);

        // Show custom warning dialog
        setShowNavigationWarning(true);
        setPendingNavigation(() => () => {
          // Allow the navigation to proceed
          window.history.back();
        });
      }
      // Goals phase handles its own navigation warning in GoalSettingQuestions component
    };

    // Add navigation handling only for personality phase
    // Goals phase handles its own navigation in GoalSettingQuestions component
    if (currentPhase === 'personality') {
      // Add current state to history to detect back navigation
      window.history.pushState(null, '', window.location.href);

      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', handlePopState);
    }

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPhase]);

  const generateGuestToken = () => {
    // Check if we already have a guest token in localStorage
    let token = localStorage.getItem('guestToken');
    if (!token) {
      // Generate a simple UUID-like token
      token = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guestToken', token);
    }
    setGuestToken(token);
  };

  const handlePersonalityComplete = (answers: PersonalityAnswers) => {
    console.log('Personality Complete - Answers received:', answers);
    console.log('Personality Complete - Answer count:', Object.keys(answers).length);
    setPersonalityAnswers(answers);
    setReturnToLastSet(false); // Reset the flag when moving forward
    setCurrentPhase('goals');
  };

  const handleGoalSettingBack = () => {
    // Navigate back to the last set (set 10) of personality test with saved answers
    // Set flag to return to last set (set 9 = index 9, questions 91-100)
    setReturnToLastSet(true);
    setCurrentPhase('personality');
  };

  const handleGoalSettingComplete = async (answers: GoalSettingAnswers) => {
    console.log('Goal Setting Complete - Personality Answers:', personalityAnswers);
    console.log('Goal Setting Complete - Goal Answers:', answers);
    console.log('Goal Setting Complete - User Data:', userData);
    console.log('Goal Setting Complete - Guest Token:', guestToken);
    console.log('Goal Setting Complete - Is Guest:', isGuest);

    setGoalAnswers(answers);
    setCurrentPhase('submitting');

    // Submit the complete test
    await submitTest(personalityAnswers, answers);
  };

  const submitTest = async (personality: PersonalityAnswers, goals: GoalSettingAnswers) => {
    try {
      console.log('Submit Test - Starting submission...');
      console.log('Submit Test - Personality answers count (in-memory):', Object.keys(personality).length);
      console.log('Submit Test - Goal settings:', goals);

      // Merge with any saved answers from localStorage to ensure completeness
      let savedAnswers: Record<string, number> = {};
      const saved = localStorage.getItem('personalityTestAnswers');
      if (saved) {
        try {
          savedAnswers = JSON.parse(saved);
        } catch (e) {
          console.error('Submit Test - Failed to parse saved answers from localStorage:', e);
        }
      }

      const mergedAnswers: Record<string, number> = { ...savedAnswers, ...personality } as any;
      const mergedCount = Object.keys(mergedAnswers).length;
      console.log('Submit Test - Personality answers count (merged):', mergedCount);

      // Validate that we have exactly 100 personality answers
      if (mergedCount !== 100) {
        throw new Error(`Invalid number of personality answers: ${mergedCount}. Expected 100.`);
      }

      // Validate that all answers are numbers between 1-5
      for (const [key, value] of Object.entries(personality)) {
        if (typeof value !== 'number' || value < 1 || value > 5) {
          throw new Error(`Invalid answer for question ${key}: ${value}. Must be a number between 1-5.`);
        }
      }

      // Validate Goal Setting answers
      if (!goals.priority || !goals.environment || !goals.motivation || !goals.concern || !goals.routine || !goals.impact) {
        throw new Error('All Goal Setting questions must be answered');
      }

      if (goals.confidence < 1 || goals.confidence > 5) {
        throw new Error('Confidence level must be between 1 and 5');
      }

      let submission;
      let endpoint;

      if (isGuest) {
        // Guest submission
        submission = {
          answers: mergedAnswers as any,
          goalSettings: goals
        };
        endpoint = apiUrl(`/api/personality-test/submit/guest?guestToken=${guestToken}`);
        console.log('Submit Test - Guest submission to:', endpoint);
      } else {
        // User submission
        if (!userData) {
          throw new Error('User data not available');
        }
        submission = {
          userId: userData.id,
          answers: mergedAnswers as any,
          goalSettings: goals
        };
        endpoint = apiUrl('/api/personality-test/submit/user');
        console.log('Submit Test - User submission to:', endpoint);
      }

      console.log('Submit Test - Submission payload:', submission);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      console.log('Submit Test - Response status:', response.status);
      console.log('Submit Test - Response ok:', response.ok);

      const data = await response.json();
      console.log('Submit Test - Response data:', data);

      if (data.status === 'SUCCESS') {
        console.log('Submit Test - Success! Session ID:', data.sessionId);

        // Clear all test progress from localStorage since test is complete
        localStorage.removeItem('personalityTestAnswers');
        localStorage.removeItem('personalityTestCurrentSet');
        localStorage.removeItem('personalityTestCurrentQuestion');
        localStorage.removeItem('goalSettingAnswers');

        // Store session ID for result retrieval
        setSessionId(data.sessionId);
        localStorage.setItem('lastTestSessionId', data.sessionId);

        if (isGuest && data.guestToken) {
          localStorage.setItem('guestToken', data.guestToken);
        }

        setCurrentPhase('complete');
        // Redirect to results after a short delay
        setTimeout(() => {
          if (isGuest) {
            router.push(`/results?session=${data.sessionId}`);
          } else {
            router.push('/results');
          }
        }, 3000);
      } else {
        console.error('Submit Test - Error response:', data);
        throw new Error(data.message || 'Failed to submit test');
      }
    } catch (err) {
      console.error('Submit Test - Exception:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit test');
      setCurrentPhase('goals'); // Go back to goals phase
    }
  };

  const handleRetry = () => {
    setError(null);
    setCurrentPhase('goals');
  };

  const handleNavigationWarningConfirm = () => {
    // Clear test progress from localStorage
    localStorage.removeItem('personalityTestAnswers');
    localStorage.removeItem('personalityTestCurrentSet');
    localStorage.removeItem('personalityTestCurrentQuestion');
    localStorage.removeItem('goalSettingAnswers');

    setShowNavigationWarning(false);

    // Execute the pending navigation
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleNavigationWarningCancel = () => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  // Show loading only if we're still determining user status
  if (!isGuest && !userData && guestToken === null) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002A3C] mx-auto mb-4"></div>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPhase === 'personality') {
    return (
      <QuestionnaireCard
        onComplete={handlePersonalityComplete}
        initialSet={returnToLastSet ? 9 : undefined}
        initialQuestion={returnToLastSet ? 0 : undefined}
      />
    );
  }

  if (currentPhase === 'goals') {
    return <GoalSettingQuestions onComplete={handleGoalSettingComplete} onBack={handleGoalSettingBack} />;
  }

  if (currentPhase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#002A3C] mx-auto mb-6"></div>
          <h2 className={`${localGeorama.className} text-[#002A3C] text-2xl font-bold mb-4`}>
            Processing Your Results
          </h2>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>
            Analyzing your personality profile and finding course recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (currentPhase === 'complete') {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`${localGeorama.className} text-[#002A3C] text-3xl font-bold mb-4`}>
            Test Complete!
          </h2>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg mb-6`}>
            Your personality profile has been analyzed and course recommendations are ready.
          </p>
          <p className={`${localGeorama.className} text-gray-600 text-base mb-8`}>
            Redirecting to your results page...
          </p>
          <button
            onClick={() => {
              if (isGuest && sessionId) {
                router.push(`/results?session=${sessionId}`);
              } else {
                router.push('/results');
              }
            }}
            className={`${localGeorama.className} bg-[#002A3C] text-white px-8 py-3 font-semibold hover:bg-[#004E70] transition-colors`}
          >
            VIEW RESULTS NOW
          </button>

          {isGuest && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className={`${localGeorama.className} text-[#002A3C] text-sm`}>
                💡 <strong>Tip:</strong> Create an account to save your results permanently and access them anytime!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className={`${localGeorama.className} text-[#002A3C] text-2xl font-bold mb-4`}>
            Submission Failed
          </h2>
          <p className={`${localGeorama.className} text-red-600 text-base mb-6`}>
            {error}
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className={`${localGeorama.className} bg-[#002A3C] text-white px-6 py-2 font-semibold hover:bg-[#004E70] transition-colors w-full`}
            >
              TRY AGAIN
            </button>
            <button 
              onClick={() => router.push('/userpage')}
              className={`${localGeorama.className} border border-[#002A3C] text-[#002A3C] px-6 py-2 font-semibold hover:bg-gray-50 transition-colors w-full`}
            >
              GO TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Warning Dialog */}
      {showNavigationWarning && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 animate-in zoom-in-95 duration-300 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-xl font-semibold mb-4`}>
                Leave Personality Test?
              </h3>
              <p className={`${localGeorama.className} text-[#002A3C] text-base mb-6`}>
                You have unsaved progress in your personality test. If you leave now, all your answers will be lost and you'll need to start over.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleNavigationWarningCancel}
                className={`${localGeorama.className} flex-1 border border-[#002A3C] text-[#002A3C] px-4 py-2 rounded font-semibold hover:bg-gray-50 transition-colors`}
              >
                Stay on Test
              </button>
              <button
                onClick={handleNavigationWarningConfirm}
                className={`${localGeorama.className} flex-1 bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors`}
              >
                Leave Test
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalityTestFlow;
