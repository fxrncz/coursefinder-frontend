import React, { useState, useEffect, useRef } from 'react';
import { localGeorama, localGeorgia } from '../fonts';

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

interface GoalSettingQuestionsProps {
  onComplete?: (answers: GoalSettingAnswers) => void;
  onBack?: () => void;
}

const GoalSettingQuestions: React.FC<GoalSettingQuestionsProps> = ({ onComplete, onBack }) => {
  const [answers, setAnswers] = useState<GoalSettingAnswers>({
    priority: '',
    learningStyle: [],
    environment: '',
    motivation: '',
    concern: '',
    confidence: 0,
    routine: '',
    impact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // Use ref to track the latest answers for immediate saving
  const answersRef = useRef(answers);
  // Load saved goal setting answers from localStorage on component mount
  useEffect(() => {
    const savedGoalAnswers = localStorage.getItem('goalSettingAnswers');
    if (savedGoalAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedGoalAnswers);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error('Error loading saved goal answers:', error);
      }
    }
  }, []);

  // Save goal setting answers to localStorage whenever they change and update ref
  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem('goalSettingAnswers', JSON.stringify(answers));
  }, [answers]);

  // Check if user has made progress in goal setting
  const hasGoalProgress = () => {
    return answers.priority || answers.learningStyle.length > 0 ||
           answers.environment || answers.motivation || answers.concern ||
           answers.confidence > 0 || answers.routine || answers.impact;
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
    const currentValues = answers[question] as string[];
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
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className={`${localGeorama.className} text-[#002A3C] text-3xl font-bold text-center mb-8`}>
            Goal-Setting Questions
          </h2>

          <div className="space-y-8">
            {/* Question 1: Priority */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                1. What is your main priority in choosing a course?
              </h3>
              <div className="space-y-2">
                {[
                  'High-paying job after graduation',
                  'Doing something I love',
                  'Stability and job security',
                  'Opportunity to help people',
                  'Exploring different interests'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={option}
                      checked={answers.priority === option}
                      onChange={() => handleSingleChoice('priority', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2: Learning Style */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                2. How do you prefer to learn? (Select up to 2)
              </h3>
              <div className="space-y-2">
                {[
                  'By doing or practicing (hands-on)',
                  'Through reading and theory',
                  'In group activities or discussions',
                  'By observing or watching videos',
                  'Through art, visuals, or creating something'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.learningStyle.includes(option)}
                      onChange={() => handleMultiChoice('learningStyle', option)}
                      disabled={answers.learningStyle.length >= 2 && !answers.learningStyle.includes(option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3: Environment */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                3. Which environment excites you the most?
              </h3>
              <div className="space-y-2">
                {[
                  'Office or business setting',
                  'Creative studio or stage',
                  'Hospital, clinic, or field service',
                  'Laboratory or tech workspace',
                  'Outdoor or travel-based work'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      value={option}
                      checked={answers.environment === option}
                      onChange={() => handleSingleChoice('environment', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 4: Motivation */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                4. What motivates you most in school or life?
              </h3>
              <div className="space-y-2">
                {[
                  'Achieving goals and recognition',
                  'Discovering how things work',
                  'Making a difference in people\'s lives',
                  'Creating or expressing myself',
                  'Feeling secure and prepared'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="motivation"
                      value={option}
                      checked={answers.motivation === option}
                      onChange={() => handleSingleChoice('motivation', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 5: Concern */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                5. What's your biggest concern about college?
              </h3>
              <div className="space-y-2">
                {[
                  'Choosing the wrong course',
                  'Financial cost',
                  'Academic pressure',
                  'Not fitting in or belonging',
                  'I don\'t know what I want yet'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="concern"
                      value={option}
                      checked={answers.concern === option}
                      onChange={() => handleSingleChoice('concern', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 6: Confidence Scale */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                6. How confident are you in your career path?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`${localGeorgia.className} text-[#002A3C] text-sm`}>No idea at all</span>
                  <span className={`${localGeorgia.className} text-[#002A3C] text-sm`}>I've already decided</span>
                </div>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="flex flex-col items-center space-y-2 cursor-pointer">
                      <input
                        type="radio"
                        name="confidence"
                        value={value}
                        checked={answers.confidence === value}
                        onChange={() => handleConfidenceChange(value)}
                        className="w-6 h-6"
                      />
                      <span className={`${localGeorgia.className} text-[#002A3C] text-sm`}>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Question 7: Routine */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                7. Do you prefer structured or flexible routines?
              </h3>
              <div className="space-y-2">
                {[
                  'Structured – I like plans and clear instructions',
                  'Flexible – I prefer freedom to explore and change',
                  'Somewhere in between'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="routine"
                      value={option}
                      checked={answers.routine === option}
                      onChange={() => handleSingleChoice('routine', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 8: Impact */}
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold mb-4`}>
                8. What type of impact do you want to have?
              </h3>
              <div className="space-y-2">
                {[
                  'Inspire people through creativity or storytelling',
                  'Solve problems using technology or logic',
                  'Help individuals directly (health, guidance)',
                  'Improve communities and systems',
                  'Lead and manage people or ideas'
                ].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="impact"
                      value={option}
                      checked={answers.impact === option}
                      onChange={() => handleSingleChoice('impact', option)}
                      className="w-4 h-4"
                    />
                    <span className={`${localGeorgia.className} text-[#002A3C]`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-8">
              <button
                disabled={isSubmitting}
                className={`${localGeorama.className} bg-[#002A3C] text-white px-8 py-3 font-semibold hover:bg-[#004E70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={async () => {
                  // Validate all questions are answered
                  if (!answers.priority || !answers.environment || !answers.motivation ||
                      !answers.concern || !answers.routine || !answers.impact ||
                      answers.confidence === 0 || answers.learningStyle.length === 0) {
                    setShowIncompleteWarning(true);
                    return;
                  }

                  if (onComplete) {
                    setIsSubmitting(true);
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
