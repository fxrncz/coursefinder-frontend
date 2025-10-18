"use client";
import React, { useState } from "react";
import { localGeorama, localGeorgia, localGotham } from "../fonts";

// All question sets
const allQuestionSets = [
  // Set 1 (Questions 1-10)
  [
    "I enjoy fixing mechanical things such as tools, engines, or electronics.",
    "I prefer working with my hands rather than sitting at a desk all day.",
    "I feel confident using tools or machines.",
    "I enjoy building or assembling physical structures.",
    "I like outdoor activities that involve physical labor.",
    "I enjoy tasks that involve operating vehicles or heavy equipment.",
    "I prefer working in environments that are not highly structured.",
    "I enjoy using equipment or machinery to solve practical problems.",
    "I feel comfortable in physically demanding tasks.",
    "I enjoy learning by doing rather than just listening or reading."
  ],
  // Set 2 (Questions 11-20)
  [
    "I enjoy solving puzzles or logical problems.",
    "I prefer thinking through problems before taking action.",
    "I enjoy reading or researching topics in-depth.",
    "I like experimenting and discovering how things work.",
    "I enjoy subjects such as science or mathematics.",
    "I feel comfortable analyzing data or complex information.",
    "I am curious and enjoy asking questions about how or why things happen.",
    "I enjoy developing theories or abstract ideas.",
    "I am comfortable working independently to explore ideas.",
    "I enjoy tackling complex challenges that require critical thinking."
  ],
  // Set 3 (Questions 21-30)
  [
    "I enjoy expressing myself through creative writing, drawing, or music.",
    "I like to explore new ways of doing things artistically.",
    "I appreciate beauty in art, nature, or design.",
    "I enjoy working in unstructured environments where creativity is encouraged.",
    "I feel confident creating original artwork or creative pieces.",
    "I enjoy playing an instrument, acting, or performing.",
    "I prefer freedom over routine in my work or study.",
    "I like sharing my ideas through visual or performing arts.",
    "I enjoy imagining new concepts or alternative worlds.",
    "I feel most engaged when expressing myself creatively."
  ],
  // Set 4 (Questions 31-40)
  [
    "I enjoy helping people solve their problems.",
    "I feel fulfilled when I make a difference in others' lives.",
    "I enjoy teaching or mentoring others.",
    "I feel confident working in a team or group.",
    "I enjoy volunteering or participating in community activities.",
    "I find satisfaction in offering emotional support to others.",
    "I prefer jobs that involve working directly with people.",
    "I enjoy listening to others and understanding their needs.",
    "I feel motivated when others succeed because of my help.",
    "I feel energized by social interaction and group collaboration."
  ],
  // Set 5 (Questions 41-50)
  [
    "I enjoy persuading others to see things my way.",
    "I feel confident speaking in front of groups.",
    "I enjoy taking risks when starting a new project.",
    "I like being in leadership positions.",
    "I enjoy organizing people to work toward a goal.",
    "I prefer tasks that involve negotiation or selling.",
    "I feel energized by challenges and competition.",
    "I enjoy planning and executing business ideas.",
    "I am confident in making decisions quickly and under pressure.",
    "I see myself as a natural leader or influencer."
  ],
  // Set 6 (Questions 51-60)
  [
    "I enjoy organizing files, data, or schedules.",
    "I prefer following a clear structure or set of rules.",
    "I feel confident working with spreadsheets, charts, or databases.",
    "I enjoy keeping records accurate and up to date.",
    "I prefer routine over unpredictability.",
    "I feel comfortable doing detailed, repetitive tasks.",
    "I like working in environments with clear expectations.",
    "I enjoy checking things for accuracy and consistency.",
    "I am good at handling clerical or financial tasks.",
    "I find satisfaction in completing tasks in an orderly manner."
  ],
  // Set 7 (Questions 61-70)
  [
    "I prefer group activities over spending time alone.",
    "I feel energized after being around people.",
    "I like being the center of attention.",
    "I enjoy discussing my ideas with others.",
    "I get restless when I'm alone for too long.",
    "I prefer quiet, reflective environments.",
    "I need time alone to recharge after social events.",
    "I prefer deep conversations over small talk.",
    "I often reflect on my thoughts and experiences.",
    "I feel more comfortable writing my thoughts than speaking them aloud."
  ],
  // Set 8 (Questions 71-80)
  [
    "I focus more on details than the big picture.",
    "I prefer step-by-step instructions.",
    "I trust practical experience more than theory.",
    "I like dealing with concrete facts.",
    "I rely on my senses to understand the world.",
    "I enjoy imagining future possibilities.",
    "I am interested in abstract ideas and meanings.",
    "I often look for patterns or connections between things.",
    "I focus on innovation rather than tradition.",
    "I enjoy thinking about what could be rather than what is."
  ],
  // Set 9 (Questions 81-90)
  [
    "I make decisions based on logic and facts.",
    "I value fairness over empathy.",
    "I enjoy analyzing problems objectively.",
    "I prefer critical thinking over emotional expression.",
    "I remain calm even in emotional situations.",
    "I consider others' feelings when making decisions.",
    "I am deeply affected by the emotions of others.",
    "I avoid conflict to maintain harmony.",
    "I value compassion over being right.",
    "I feel fulfilled when I help others feel better."
  ],
  // Set 10 (Questions 91-100)
  [
    "I like having a clear plan before I start a task.",
    "I prefer structure and organization in my life.",
    "I feel more comfortable when decisions are made.",
    "I enjoy checking tasks off a to-do list.",
    "I work best with clear goals and deadlines.",
    "I like to keep my options open.",
    "I adapt easily to unexpected changes.",
    "I enjoy exploring new opportunities spontaneously.",
    "I prefer flexibility over rigid planning.",
    "I often delay decisions to see what unfolds."
  ]
];

interface QuestionnaireCardProps {
  onComplete?: (answers: {[key: number]: number}) => void;
  initialSet?: number;
  initialQuestion?: number;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ onComplete, initialSet, initialQuestion }) => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [allAnswers, setAllAnswers] = useState<{[key: number]: number}>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [navigationAllowed, setNavigationAllowed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Smoothly scroll the active question into view when it changes
  React.useEffect(() => {
    if (!hasStarted) return;

    // Use rAF to wait for DOM to paint after state updates
    const frameId = requestAnimationFrame(() => {
      const activeQuestionContainer = document.querySelector(
        `[data-question-container="${currentQuestion}"]`
      ) as HTMLElement | null;

      if (activeQuestionContainer) {
        activeQuestionContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [currentQuestion, currentSet, hasStarted]);

  // Load saved answers from localStorage on component mount
  React.useEffect(() => {
    const savedAnswers = localStorage.getItem('personalityTestAnswers');
    const savedCurrentSet = localStorage.getItem('personalityTestCurrentSet');
    const savedCurrentQuestion = localStorage.getItem('personalityTestCurrentQuestion');

    // Parse saved answers or use empty object
    let parsedAnswers = {};
    if (savedAnswers) {
      try {
        parsedAnswers = JSON.parse(savedAnswers);
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }

    // Set all answers first
    setAllAnswers(parsedAnswers);

    // Use initial props if provided, otherwise use saved values
    const targetSet = initialSet !== undefined ? initialSet : (savedCurrentSet ? parseInt(savedCurrentSet) : 0);
    const targetQuestion = initialQuestion !== undefined ? initialQuestion : (savedCurrentQuestion ? parseInt(savedCurrentQuestion) : 0);

    // Load answers for the target set
    loadCurrentSetAnswers(targetSet, parsedAnswers);

    setCurrentSet(targetSet);
    setCurrentQuestion(targetQuestion);

    // Update localStorage with the target values
    localStorage.setItem('personalityTestCurrentSet', targetSet.toString());
    localStorage.setItem('personalityTestCurrentQuestion', targetQuestion.toString());
  }, [initialSet, initialQuestion]);

  // Additional effect to ensure answers are loaded when allAnswers changes
  React.useEffect(() => {
    if (Object.keys(allAnswers).length > 0) {
      loadCurrentSetAnswers(currentSet, allAnswers);
    }
  }, [allAnswers, currentSet]);

  // Save answers when component unmounts
  React.useEffect(() => {
    return () => {
      // Save current answers when component unmounts
      localStorage.setItem('personalityTestAnswers', JSON.stringify(allAnswers));
      localStorage.setItem('personalityTestCurrentSet', currentSet.toString());
      localStorage.setItem('personalityTestCurrentQuestion', currentQuestion.toString());
    };
  }, [allAnswers, currentSet, currentQuestion]);

  // Force reload when component mounts (especially when returning from Goal Setting)
  React.useEffect(() => {
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      forceReloadAnswers();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Reload answers when window gains focus (user returns to tab)
  React.useEffect(() => {
    const handleFocus = () => {
      forceReloadAnswers();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Save answers to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('personalityTestAnswers', JSON.stringify(allAnswers));
    localStorage.setItem('personalityTestCurrentSet', currentSet.toString());
    localStorage.setItem('personalityTestCurrentQuestion', currentQuestion.toString());
  }, [allAnswers, currentSet, currentQuestion]);

  // Check if user has made progress in the test
  const hasTestProgress = () => {
    return Object.keys(allAnswers).length > 0;
  };

  // Handle browser navigation (back/forward buttons)
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Allow navigation if explicitly permitted
      if (navigationAllowed) {
        return;
      }

      // Only show warning if user has progress
      if (hasTestProgress()) {
        // Prevent the navigation
        e.preventDefault();

        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);

        // Show custom warning dialog
        setShowNavigationWarning(true);
        setPendingNavigation(() => () => {
          // Set flag to allow navigation and then navigate to home
          setNavigationAllowed(true);
          setTimeout(() => {
            window.location.href = '/';
          }, 50);
        });
      }
    };

    // Add current state to history to detect back navigation
    window.history.pushState(null, '', window.location.href);

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [allAnswers, navigationAllowed]);

  // Function to load answers for current set from allAnswers
  const loadCurrentSetAnswers = (setIndex: number, globalAnswers: {[key: number]: number}) => {
    const currentSetAnswers: {[key: number]: number} = {};
    for (let i = 0; i < 10; i++) {
      const globalIndex = (setIndex * 10) + i;
      if (globalAnswers[globalIndex] !== undefined) {
        currentSetAnswers[i] = globalAnswers[globalIndex];
      }
    }
    setAnswers(currentSetAnswers);
  };

  // Force reload answers from localStorage when component mounts or set changes
  const forceReloadAnswers = () => {
    const savedAnswers = localStorage.getItem('personalityTestAnswers');
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAllAnswers(parsedAnswers);
        loadCurrentSetAnswers(currentSet, parsedAnswers);
      } catch (error) {
        console.error('Error reloading answers:', error);
      }
    }
  };
  
  const questions = allQuestionSets[currentSet];

  const handleAnswerChange = (questionIndex: number, value: number) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    // Update current set answers
    const newCurrentAnswers = {
      ...answers,
      [questionIndex]: value
    };
    setAnswers(newCurrentAnswers);

    // Update global answers with the actual question index
    const globalQuestionIndex = (currentSet * 10) + questionIndex;
    const newAllAnswers = {
      ...allAnswers,
      [globalQuestionIndex]: value
    };
    setAllAnswers(newAllAnswers);

    // Immediately save to localStorage
    localStorage.setItem('personalityTestAnswers', JSON.stringify(newAllAnswers));
    localStorage.setItem('personalityTestCurrentSet', currentSet.toString());
    localStorage.setItem('personalityTestCurrentQuestion', questionIndex.toString());

    // Move to next question if not the last one
    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  const handleNextSet = () => {
    // Check if all questions in current set are answered
    const currentSetAnswers = questions.map((_, index) => answers[index]).filter(answer => answer !== undefined);

    if (currentSetAnswers.length < questions.length) {
      setShowWarning(true);
      return;
    }

    // Check if this is the last set
    if (currentSet === allQuestionSets.length - 1) {
      // Test is complete, but DON'T clear localStorage yet (in case user goes back)
      // Only clear when the entire assessment is submitted
      if (onComplete) {
        onComplete(allAnswers);
      }
      return;
    }

    // Move to next set
    const nextSet = currentSet + 1;
    setCurrentSet(nextSet);
    setCurrentQuestion(0);

    // Load answers for the next set (don't reset, preserve existing answers)
    loadCurrentSetAnswers(nextSet, allAnswers);

    // Scroll to beginning of questionnaire
    setTimeout(() => {
      const questionnaireStart = document.querySelector('[data-questionnaire-start]');
      questionnaireStart?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePreviousSet = () => {
    if (currentSet > 0) {
      const prevSet = currentSet - 1;
      setCurrentSet(prevSet);
      setCurrentQuestion(0);

      // Load answers for the previous set (preserve existing answers)
      loadCurrentSetAnswers(prevSet, allAnswers);

      // Scroll to beginning of questionnaire
      setTimeout(() => {
        const questionnaireStart = document.querySelector('[data-questionnaire-start]');
        questionnaireStart?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleNavigationWarningConfirm = () => {
    // Clear test progress from localStorage
    localStorage.removeItem('personalityTestAnswers');
    localStorage.removeItem('personalityTestCurrentSet');
    localStorage.removeItem('personalityTestCurrentQuestion');

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
    setNavigationAllowed(false); // Reset navigation flag
  };

  return (
    <div className="min-h-screen bg-[#FFEDD7] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-20" data-questionnaire-start>
      <div className="w-full max-w-4xl">
        {/* Question Indicator */}
        <p className={`${localGeorama.className} text-[#002A3C] text-sm sm:text-base font-medium text-center mb-4`} data-question-indicator>
          Question {(currentSet * 10) + 10} out of 100
        </p>
        
        {/* Individual Question Containers */}
        {questions.map((question, index) => {
          // Determine container background color based on answer status
          let containerBgColor = "bg-[#FFF7ED]"; // Default: unanswered and not current
          let textColor = "text-[#002A3C]"; // Default text color
          
          if (answers[index]) {
            containerBgColor = "bg-[#F9F9F9]"; // Answered: slightly faded
            textColor = "text-[#686868]"; // Faded text for answered questions
          } else if (index === currentQuestion) {
            containerBgColor = "bg-white"; // Current question: white
            textColor = "text-[#002A3C]"; // Normal text for current question
          } else {
            textColor = "text-[#686868]"; // Muted text for unanswered questions
          }
          
          return (
            <div key={index} className="mb-1" data-question-container={index}>
              <div className={`${containerBgColor} shadow-sm p-4 sm:p-6 lg:p-8 transition-colors duration-200`}>
                <p className={`${localGeorama.className} ${textColor} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-center leading-relaxed`}>
                  {question}
                </p>
                
                {/* Radio Button Row - Horizontal Layout with Labels Below */}
                <div className="w-full">
                  {/* Radio Buttons Container */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={value}
                          checked={answers[index] === value}
                          onChange={() => handleAnswerChange(index, value)}
                          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-gray-800 rounded-full appearance-none checked:bg-[#002A3C] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-110"
                        />
                      </label>
                    ))}
                  </div>
                  
                  {/* Scale Labels - Positioned Below Radio Buttons */}
                  <div className="flex justify-between items-center px-1">
                    {/* Strongly Disagree Label */}
                    <span className={`${localGeorama.className} ${answers[index] ? 'text-red-400' : 'text-red-600'} text-xs sm:text-sm lg:text-base font-medium`}>
                      Strongly Disagree
                    </span>
                    
                    {/* Strongly Agree Label */}
                    <span className={`${localGeorama.className} ${answers[index] ? 'text-green-400' : 'text-green-600'} text-xs sm:text-sm lg:text-base font-medium`}>
                      Strongly Agree
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Progress Indicator */}
        <div className="text-center mt-6 sm:mt-8">
          <p className={`${localGeorama.className} text-[#002A3C] text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4`}>
            Test {(currentSet * 10) + 1} to {(currentSet * 10) + 10}
          </p>
          <div className="flex justify-center space-x-1 sm:space-x-2 mb-6 sm:mb-8">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestion 
                    ? 'bg-[#1e4d6b] scale-110' 
                    : answers[index] 
                      ? 'bg-[#9BBFCE]' 
                      : 'border border-[#9BBFCE] bg-[#FFEDD7]'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
          {currentSet > 0 && (
            <button 
              onClick={handlePreviousSet}
              className="bg-[#002A3C] text-white px-6 sm:px-12 lg:px-15 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-[#153a4f] transition-colors rounded-sm"
            >
              BACK
            </button>
          )}
          <button 
            onClick={handleNextSet}
            className="bg-[#002A3C] text-white px-6 sm:px-12 lg:px-15 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-[#153a4f] transition-colors rounded-sm"
          >
            {currentSet === allQuestionSets.length - 1 ? 'CONTINUE' : 'NEXT'}
          </button>
        </div>
      </div>

      {/* Warning Dialog */}
      {showWarning && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <h3 className={`${localGeorama.className} text-[#002A3C] text-lg sm:text-xl font-semibold mb-4 text-center`}>
              Please Complete All Questions
            </h3>
            <p className={`${localGeorama.className} text-[#002A3C] text-sm sm:text-base mb-6 text-center`}>
              You must answer all questions in this set before proceeding to the next section.
            </p>
            <div className="text-center">
              <button
                onClick={() => setShowWarning(false)}
                className="bg-[#002A3C] text-white px-6 py-2 rounded font-semibold hover:bg-[#153a4f] transition-colors text-sm sm:text-base"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Warning Dialog */}
      {showNavigationWarning && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`${localGeorama.className} text-[#002A3C] text-lg sm:text-xl font-semibold mb-4`}>
                Leave Personality Test?
              </h3>
              <p className={`${localGeorama.className} text-[#002A3C] text-sm sm:text-base mb-6`}>
                You have unsaved progress in your personality test. If you leave now, all your answers will be lost and you'll need to start over.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleNavigationWarningCancel}
                className={`${localGeorama.className} flex-1 border border-[#002A3C] text-[#002A3C] px-4 py-2 rounded font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base`}
              >
                Stay on Test
              </button>
              <button
                onClick={handleNavigationWarningConfirm}
                className={`${localGeorama.className} flex-1 bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base`}
              >
                Leave Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireCard; 