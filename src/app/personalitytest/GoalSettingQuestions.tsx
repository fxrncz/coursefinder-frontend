import React, { useState, useEffect, useRef } from 'react';
import { localGeorama, localGeorgia } from '../fonts';
import { apiUrl } from '../../lib/api';

interface GoalSettingAnswers {
  priority: string;
  environment: string;
  motivation: string;
  concern: string;
  confidence: number;
  routine: string;
  impact: string;
  age?: number;
  gender?: string;
  isFromPLMar?: boolean;
  // Support for multi-choice questions that need arrays
  [key: string]: string | number | boolean | string[] | undefined;
}

interface GoalSettingQuestionsProps {
  onComplete?: (answers: GoalSettingAnswers) => void;
  onBack?: () => void;
  userData?: any; // Add userData prop to access existing profile data
}

const GoalSettingQuestions: React.FC<GoalSettingQuestionsProps> = ({ onComplete, onBack, userData }) => {
  const [answers, setAnswers] = useState<GoalSettingAnswers>({
    priority: '',
    environment: '',
    motivation: '',
    concern: '',
    confidence: 0,
    routine: '',
    impact: '',
    age: userData?.age || undefined,
    gender: userData?.gender || '',
    isFromPLMar: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [hasAnsweredPLMar, setHasAnsweredPLMar] = useState(false);

  // Use ref to track the latest answers for immediate saving
  const answersRef = useRef(answers);
  
  // Scroll to top when component mounts (similar to personality test behavior)
  useEffect(() => {
    const scrollToTop = () => {
      const goalSettingStart = document.querySelector('[data-goal-setting-start]');
      if (goalSettingStart) {
        goalSettingStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Function to update user profile with new age/gender data
  const updateUserProfile = async (newAge?: number, newGender?: string) => {
    if (!userData || (!newAge && !newGender)) return;
    
    try {
      console.log('Updating user profile with:', { newAge, newGender, userId: userData.id });
      
      const response = await fetch(apiUrl('/api/auth/update-profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          age: newAge || userData.age,
          gender: newGender || userData.gender
        }),
      });

      console.log('Profile update response status:', response.status);

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        console.error('Response status:', response.status);
        return;
      }

      const data = await response.json();
      console.log('Profile update response data:', data);
      
      if (data.success) {
        // Update localStorage with new user data
        const updatedUserData = { ...userData, age: newAge || userData.age, gender: newGender || userData.gender };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.log('User profile updated successfully');
      } else {
        console.error('Profile update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  // Load saved goal setting answers from localStorage on component mount
  // But prioritize userData for age and gender if available
  useEffect(() => {
    const savedGoalAnswers = localStorage.getItem('goalSettingAnswers');
    if (savedGoalAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedGoalAnswers);
        
        // Merge with userData, prioritizing userData for age and gender
        const mergedAnswers = {
          ...parsedAnswers,
          // Only use userData if the saved answers don't already have these values
          age: parsedAnswers.age || userData?.age || undefined,
          gender: parsedAnswers.gender || userData?.gender || ''
        };
        
        setAnswers(mergedAnswers);
        answersRef.current = mergedAnswers;
        
        // Check if PLMar question was answered
        if (parsedAnswers.isFromPLMar !== undefined) {
          setHasAnsweredPLMar(true);
        }
      } catch (error) {
        console.error('Error loading saved goal answers:', error);
        // If parsing fails, still try to use userData
        if (userData?.age || userData?.gender) {
          setAnswers(prev => ({
            ...prev,
            age: userData.age || prev.age,
            gender: userData.gender || prev.gender
          }));
        }
      }
    } else if (userData?.age || userData?.gender) {
      // If no saved answers but user has age/gender, pre-fill them
      setAnswers(prev => ({
        ...prev,
        age: userData.age || prev.age,
        gender: userData.gender || prev.gender
      }));
    }
  }, [userData]);

  // Scroll to the Goal-Setting form when page appears
  useEffect(() => {
    // Find the form container and scroll to it
    const formContainer = document.querySelector('.bg-white.rounded-lg.shadow-lg');
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Note: Profile update is now handled only when "Complete Assessment" is clicked
  // This useEffect was removed to prevent automatic updates during input/selection

  // Save goal setting answers to localStorage whenever they change and update ref
  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem('goalSettingAnswers', JSON.stringify(answers));
  }, [answers]);

  // Update user profile when age or gender changes (only for logged-in users)
  // Temporarily disabled to prevent errors - will be re-enabled once backend is stable
  // useEffect(() => {
  //   if (userData && (answers.age !== userData.age || answers.gender !== userData.gender)) {
  //     // Only update if the user has actually made changes (not just initial load)
  //     const hasAgeChanged = answers.age !== undefined && answers.age !== userData.age;
  //     const hasGenderChanged = answers.gender !== '' && answers.gender !== userData.gender;
      
  //     if (hasAgeChanged || hasGenderChanged) {
  //       updateUserProfile(answers.age, answers.gender);
  //     }
  //   }
  // }, [answers.age, answers.gender, userData]);

  // Check if user has made progress in goal setting
  const hasGoalProgress = () => {
    return answers.priority ||
           answers.environment || answers.motivation || answers.concern ||
           answers.confidence > 0 || answers.routine || answers.impact ||
           answers.age || answers.gender || hasAnsweredPLMar;
  };

  // Add browser warning for page reload/leave during goal setting (only for leaving the site)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Always save current answers before unload
      localStorage.setItem('goalSettingAnswers', JSON.stringify(answersRef.current));

      if (hasGoalProgress()) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your goal setting progress will be lost.';
        return 'Are you sure you want to leave? Your goal setting progress will be lost.';
      }
    };

    // Add event listener only for page unload (not navigation)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers]);

  // Handle browser navigation (back/forward buttons) with warning dialog
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Always show warning when user tries to leave Goal Setting page
      // Prevent the navigation
      e.preventDefault();

      // Push the current state back to prevent navigation
      window.history.pushState(null, '', window.location.href);

      // Show custom warning dialog
      setShowNavigationWarning(true);
      setPendingNavigation(() => () => {
        // Allow the navigation to proceed by calling onBack
        if (onBack) {
          onBack();
        } else {
          // Fallback: go back in history
          window.history.back();
        }
      });
    };

    // Add current state to history to detect back navigation
    window.history.pushState(null, '', window.location.href);

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack, answers]);

  // Save answers when component unmounts
  useEffect(() => {
    return () => {
      // Save current answers when component unmounts
      localStorage.setItem('goalSettingAnswers', JSON.stringify(answersRef.current));
    };
  }, []);

  const handleSingleChoice = (question: keyof GoalSettingAnswers, value: string) => {
    const newAnswers = {
      ...answers,
      [question]: value
    };
    setAnswers(newAnswers);
    // Immediately save to localStorage
    localStorage.setItem('goalSettingAnswers', JSON.stringify(newAnswers));
    answersRef.current = newAnswers;
  };

  const handleMultiChoice = (question: keyof GoalSettingAnswers, value: string) => {
    // Type-safe way to handle multi-choice arrays
    const currentValue = answers[question];
    const currentValues = Array.isArray(currentValue) ? currentValue : [];
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    const newAnswers = {
      ...answers,
      [question]: newValues
    };
    setAnswers(newAnswers);
    // Immediately save to localStorage
    localStorage.setItem('goalSettingAnswers', JSON.stringify(newAnswers));
    answersRef.current = newAnswers;
  };

  const handleConfidenceChange = (value: number) => {
    const newAnswers = {
      ...answers,
      confidence: value
    };
    setAnswers(newAnswers);
    // Immediately save to localStorage
    localStorage.setItem('goalSettingAnswers', JSON.stringify(newAnswers));
    answersRef.current = newAnswers;
  };

  // Modern vertical choice card component
  const ChoiceCard: React.FC<{ label: string; selected: boolean; onClick: () => void; disabled?: boolean }> = ({ label, selected, onClick, disabled }) => {
    return (
      <button
        type="button"
        disabled={!!disabled}
        onClick={onClick}
        className={`w-full text-left rounded-lg border p-4 transition-all duration-200 ${selected ? 'border-[#002A3C] bg-[#FFFAF4] shadow-md' : 'border-[#E7DFD6] bg-white hover:border-[#A75F00] hover:shadow-sm hover:-translate-y-0.5'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className={`${localGeorgia.className} text-[#002A3C]`}>{label}</span>
          {selected && (
            <span className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#002A3C]">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
      </button>
    );
  };

  const handleNavigationWarningConfirm = () => {
    // Clear goal setting progress from localStorage
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

  const handleIncompleteWarningClose = () => {
    setShowIncompleteWarning(false);
  };



  return (
    <div className="w-full bg-[#FFF4E6] py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-lg shadow-lg p-8" data-goal-setting-start>
          <h2 className={`${localGeorama.className} text-[#002A3C] text-3xl font-bold text-center mb-8`}>
            Goal-Setting Questions
          </h2>

          <div className="space-y-8">
            {/* Question 1: Priority */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                1. What is your main priority in choosing a course?
              </h3>
              <div className="space-y-3">
                {[
                  'High-paying job after graduation',
                  'Doing something I love',
                  'Stability and job security',
                  'Opportunity to help people',
                  'Exploring different interests'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.priority === option}
                    onClick={() => handleSingleChoice('priority', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 2: Environment */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                2. Which environment excites you the most?
              </h3>
              <div className="space-y-3">
                {[
                  'Office or business setting',
                  'Creative studio or stage',
                  'Hospital, clinic, or field service',
                  'Laboratory or tech workspace',
                  'Outdoor or travel-based work'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.environment === option}
                    onClick={() => handleSingleChoice('environment', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 3: Motivation */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                3. What motivates you most in school or life?
              </h3>
              <div className="space-y-3">
                {[
                  'Achieving goals and recognition',
                  'Discovering how things work',
                  'Making a difference in people\'s lives',
                  'Creating or expressing myself',
                  'Feeling secure and prepared'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.motivation === option}
                    onClick={() => handleSingleChoice('motivation', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 4: Concern */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                4. What's your biggest concern about college?
              </h3>
              <div className="space-y-3">
                {[
                  'Choosing the wrong course',
                  'Financial cost',
                  'Academic pressure',
                  'Not fitting in or belonging',
                  'I don\'t know what I want yet'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.concern === option}
                    onClick={() => handleSingleChoice('concern', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 5: Confidence Scale */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                5. How confident are you in your career path?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 1, label: 'Very uncertain - I have no idea what I want to do' },
                  { value: 2, label: 'Somewhat uncertain - I have some ideas but need more guidance' },
                  { value: 3, label: 'Moderately confident - I have a general direction but open to changes' },
                  { value: 4, label: 'Quite confident - I have a clear path with some flexibility' },
                  { value: 5, label: 'Very confident - I know exactly what I want to pursue' }
                ].map((option) => (
                  <ChoiceCard
                    key={option.value}
                    label={option.label}
                    selected={answers.confidence === option.value}
                    onClick={() => handleConfidenceChange(option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Question 6: Routine */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                6. Do you prefer structured or flexible routines?
              </h3>
              <div className="space-y-3">
                {[
                  'Structured – I like plans and clear instructions',
                  'Flexible – I prefer freedom to explore and change',
                  'Somewhere in between'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.routine === option}
                    onClick={() => handleSingleChoice('routine', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 7: Impact */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                7. What type of impact do you want to have?
              </h3>
              <div className="space-y-3">
                {[
                  'Inspire people through creativity or storytelling',
                  'Solve problems using technology or logic',
                  'Help individuals directly (health, guidance)',
                  'Improve communities and systems',
                  'Lead and manage people or ideas'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.impact === option}
                    onClick={() => handleSingleChoice('impact', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 8: Age */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                8. What is your age? <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h3>
              {userData?.age && (
                <p className={`${localGeorgia.className} text-sm text-green-600 mb-2`}>
                  ✓ Pre-filled from your profile
                </p>
              )}
              <div className="max-w-xs">
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={answers.age || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A3C] focus:border-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Question 9: Gender */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                9. What is your gender? <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h3>
              {userData?.gender && (
                <p className={`${localGeorgia.className} text-sm text-green-600 mb-2`}>
                  ✓ Pre-filled from your profile
                </p>
              )}
              <div className="space-y-3">
                {[
                  'Male',
                  'Female',
                  'Non-binary',
                  'Prefer not to say'
                ].map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={answers.gender === option}
                    onClick={() => handleSingleChoice('gender', option)}
                  />
                ))}
              </div>
            </div>

            {/* Question 10: PLMar Status */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                10. Are you from PLMar or Not? <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-3">
                {[
                  { value: true, label: 'Yes, I am from PLMar' },
                  { value: false, label: 'No, I am not from PLMar' }
                ].map((option) => (
                  <ChoiceCard
                    key={option.label}
                    label={option.label}
                    selected={answers.isFromPLMar === option.value}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, isFromPLMar: option.value }));
                      setHasAnsweredPLMar(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-8">
              <button
                disabled={isSubmitting}
                className={`${localGeorama.className} bg-[#002A3C] text-white px-8 py-3 font-semibold hover:bg-[#004E70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={async () => {
                  // Validate all required questions are answered
                  if (!answers.priority || !answers.environment || !answers.motivation ||
                      !answers.concern || !answers.routine || !answers.impact ||
                      answers.confidence === 0 ||
                      !hasAnsweredPLMar) {
                    setShowIncompleteWarning(true);
                    return;
                  }

                  // Set submitting state immediately to prevent double-clicks
                  setIsSubmitting(true);

                  // Update user profile with age/gender if user doesn't already have them
                  // Wrapped in try-catch to prevent profile update errors from blocking test submission
                  if (userData && (answers.age || answers.gender)) {
                    const shouldUpdateAge = answers.age && !userData.age;
                    const shouldUpdateGender = answers.gender && !userData.gender;
                    
                    if (shouldUpdateAge || shouldUpdateGender) {
                      try {
                        console.log('Updating user profile before test submission...');
                        await updateUserProfile(answers.age, answers.gender);
                        console.log('Profile update completed successfully');
                      } catch (profileError) {
                        // Log error but continue with test submission
                        console.error('Profile update failed, but continuing with test submission:', profileError);
                      }
                    }
                  }

                  if (onComplete) {
                    console.log('Goal Setting - Submitting answers:', answers);
                    try {
                      // Clear localStorage when completing goal setting
                      localStorage.removeItem('goalSettingAnswers');
                      
                      onComplete(answers);
                    } catch (error) {
                      console.error('Goal Setting - Submission error:', error);
                      setIsSubmitting(false);
                    }
                  }
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    SUBMITTING...
                  </div>
                ) : (
                  'COMPLETE ASSESSMENT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Warning Dialog */}
      {showNavigationWarning && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300 ease-out">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-xl font-bold mb-4`}>
                Leave Goal Setting?
              </h3>
              <p className={`${localGeorama.className} text-[#002A3C] text-base mb-6`}>
                Are you sure you want to leave? Everything will be lost and the data you've just answered will be reset.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleNavigationWarningCancel}
                  className={`${localGeorama.className} flex-1 border border-[#002A3C] text-[#002A3C] px-4 py-2 font-semibold hover:bg-gray-50 transition-colors duration-200`}
                >
                  STAY
                </button>
                <button
                  onClick={handleNavigationWarningConfirm}
                  className={`${localGeorama.className} flex-1 bg-[#002A3C] text-white px-4 py-2 font-semibold hover:bg-[#004E70] transition-colors duration-200`}
                >
                  LEAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Questions Warning Dialog */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300 ease-out">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-xl font-bold mb-4`}>
                Incomplete Assessment
              </h3>
              <p className={`${localGeorama.className} text-[#002A3C] text-base mb-6`}>
                Please answer all questions before completing the assessment.
              </p>
              <button
                onClick={handleIncompleteWarningClose}
                className={`${localGeorama.className} bg-[#002A3C] text-white px-6 py-2 font-semibold hover:bg-[#004E70] transition-colors duration-200 w-full`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSettingQuestions;
