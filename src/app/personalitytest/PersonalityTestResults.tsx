import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../lib/api';
import { localGeorama, localGeorgia } from '../fonts';
import CareerDevelopmentPlan from '../components/CareerDevelopmentPlan';

// Extend Window interface for our retry flag
declare global {
  interface Window {
    retryingDetailedScoring?: boolean;
  }
}

interface PersonalityTestResultsProps {
  userId?: number;
  sessionId?: string | null;
  isGuest?: boolean;
  activeTab: 'overview' | 'courses' | 'details' | 'mbti-details' | 'development-plan';
  setActiveTab: (tab: 'overview' | 'courses' | 'details' | 'mbti-details' | 'development-plan') => void;
}

interface PersonalityResult {
  id: number;
  userId?: number;
  guestToken?: string;
  sessionId: string;
  mbtiType: string;
  riasecCode: string;
  coursePath: string;
  careerSuggestions: string;
  // Removed: learningStyle, studyTips, personalityGrowthTips
  studentGoals: string;
  age?: number;
  gender?: string;
  isFromPLMar?: boolean;
  generatedAt: string;
  takenAt: string;
  courseRecommendations?: CourseRecommendation[];
  detailedMbtiInfo?: DetailedMbtiInfo;
  detailedRiasecInfo?: DetailedRiasecInfo;
  detailedScoring?: DetailedScoringData;
  detailedExplanation?: string;
  careerDevelopmentPlan?: CareerDevelopmentPlanData;
  courseDevelopmentPlan?: CourseDevelopmentPlanData;
}

interface CareerDevelopmentPlanData {
  mbtiType: string;
  riasecCode: string;
  careerDetails: CareerDetails[];
}

interface CareerDetails {
  careerName: string;
  description: string;
  introduction: string;
  keySkills: string;
  academicsActivities: string;
  softSkills: string;
  growthOpportunities: string;
  careerFit: string;
  educationLevel: string;
  workEnvironment: string;
  careerPath: string;
}

interface CourseDevelopmentPlanData {
  mbtiType: string;
  riasecCode: string;
  courseDetails: CourseDetails[];
}

interface CourseDetails {
  courseName: string;
  description: string;
  courseOverview: string;
  coreCompetencies: string;
  acadsExtra: string;
  subjMaster: string;
  softSkills: string;
  careerReadiness: string;
  growth: string;
}

interface DetailedScoringData {
  riasecScores: { [key: string]: ScoreData };
  mbtiScores: { [key: string]: ScoreData };
  finalRiasecCode: string;
  finalMbtiType: string;
  riasecGraphData?: any;
  mbtiGraphData?: any;
}

interface ScoreData {
  raw: number;
  percentage: number; // Actual calculated percentage
  label: string;
  description: string;
}

interface DetailedMbtiInfo {
  title?: string;
  description?: string;
  learningStyleSummary: string;
  learningStyleDetails: string;
  learningStyleEnvironments: string;
  learningStyleResources: string;
  studyTipsSummary: string;
  studyTipsDetails: string;
  studyTipsDos: string;
  studyTipsDonts: string;
  studyTipsCommonMistakes: string;
  growthStrengths: string;
  growthWeaknesses: string;
  growthOpportunities: string;
  growthChallenges: string;
}

interface DetailedRiasecInfo {
  learningStyleSummary: string;
  learningStyleDetails: string;
  learningStyleEnvironments: string;
  learningStyleResources: string;
  studyTipsSummary: string;
  studyTipsDetails: string;
  studyTipsDos: string;
  studyTipsDonts: string;
  studyTipsCommonMistakes: string;
  growthStrengths: string;
  growthWeaknesses: string;
  growthOpportunities: string;
  growthChallenges: string;
}

interface CourseRecommendation {
  id: number;
  courseName: string;
  courseDescription: string;
  university: string;
  programType: string;
  duration: string;
  careerOptions: string;
  salaryRange: string;
  matchScore: number;
  category: string;
}

// Helper function to get MBTI color theme
const getMBTIColorTheme = (type: string) => {
  const colorThemes: { [key: string]: { primary: string; secondary: string; accent: string; bg: string } } = {
    'INTJ': { primary: 'from-purple-600 to-indigo-700', secondary: 'bg-purple-50', accent: 'text-purple-700', bg: 'border-purple-200' },
    'INTP': { primary: 'from-blue-600 to-cyan-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' },
    'ENTJ': { primary: 'from-red-600 to-orange-700', secondary: 'bg-red-50', accent: 'text-red-700', bg: 'border-red-200' },
    'ENTP': { primary: 'from-blue-600 to-indigo-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' },
    'INFJ': { primary: 'from-teal-600 to-green-700', secondary: 'bg-teal-50', accent: 'text-teal-700', bg: 'border-teal-200' },
    'INFP': { primary: 'from-pink-600 to-rose-700', secondary: 'bg-pink-50', accent: 'text-pink-700', bg: 'border-pink-200' },
    'ENFJ': { primary: 'from-emerald-600 to-teal-700', secondary: 'bg-emerald-50', accent: 'text-emerald-700', bg: 'border-emerald-200' },
    'ENFP': { primary: 'from-blue-500 to-purple-600', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' },
    'ISTJ': { primary: 'from-slate-600 to-gray-700', secondary: 'bg-slate-50', accent: 'text-slate-700', bg: 'border-slate-200' },
    'ISFJ': { primary: 'from-green-600 to-emerald-700', secondary: 'bg-green-50', accent: 'text-green-700', bg: 'border-green-200' },
    'ESTJ': { primary: 'from-blue-600 to-indigo-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' },
    'ESFJ': { primary: 'from-rose-600 to-pink-700', secondary: 'bg-rose-50', accent: 'text-rose-700', bg: 'border-rose-200' },
    'ISTP': { primary: 'from-gray-600 to-slate-700', secondary: 'bg-gray-50', accent: 'text-gray-700', bg: 'border-gray-200' },
    'ISFP': { primary: 'from-violet-600 to-purple-700', secondary: 'bg-violet-50', accent: 'text-violet-700', bg: 'border-violet-200' },
    'ESTP': { primary: 'from-blue-600 to-teal-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' },
    'ESFP': { primary: 'from-blue-600 to-purple-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' }
  };
  return colorThemes[type] || { primary: 'from-blue-600 to-indigo-700', secondary: 'bg-blue-50', accent: 'text-blue-700', bg: 'border-blue-200' };
};

const PersonalityTestResults: React.FC<PersonalityTestResultsProps> = ({ userId, sessionId, isGuest = false, activeTab, setActiveTab }) => {
  const [results, setResults] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch detailed scoring data
  const fetchDetailedScoringData = async (testResultId?: number, sessionId?: string): Promise<DetailedScoringData | null> => {
    try {
      console.log('Fetching detailed scoring data for testResultId:', testResultId, 'sessionId:', sessionId);
      
      // Prefer test_result_id over session_id for better reliability
      let checkResponse;
      let checkData;
      
      if (testResultId) {
        console.log('Using test_result_id endpoint:', testResultId);
        checkResponse = await fetch(apiUrl(`/api/personality-test/scores/${testResultId}`));
        checkData = await checkResponse.json();
        console.log('Test result ID scores response:', checkData);
      } else if (sessionId) {
        console.log('Falling back to session_id endpoint:', sessionId);
        checkResponse = await fetch(apiUrl(`/api/personality-test/check-scores/${sessionId}`));
        checkData = await checkResponse.json();
        console.log('Session ID scores response:', checkData);
      } else {
        console.log('No test result ID or session ID provided');
        return null;
      }
      
      console.log('Response status:', checkResponse.status);
      console.log('Response headers:', checkResponse.headers);
      
      if (checkData.scoringDataExists && checkData.riasecScores && checkData.mbtiScores) {
        console.log('Found existing detailed scoring data');
        console.log('RIASEC scores:', checkData.riasecScores);
        console.log('MBTI scores:', checkData.mbtiScores);
        console.log('Final RIASEC code:', checkData.finalRiasecCode);
        console.log('Final MBTI type:', checkData.finalMbtiType);
        
        // Debug the structure of the scores
        console.log('RIASEC scores structure:', JSON.stringify(checkData.riasecScores, null, 2));
        console.log('MBTI scores structure:', JSON.stringify(checkData.mbtiScores, null, 2));
        
        // Debug individual score access
        if (checkData.riasecScores && checkData.riasecScores['R']) {
          console.log('RIASEC R score data:', checkData.riasecScores['R']);
          console.log('RIASEC R percentage:', checkData.riasecScores['R'].percentage);
          console.log('RIASEC R percentage type:', typeof checkData.riasecScores['R'].percentage);
        }
        if (checkData.mbtiScores && checkData.mbtiScores['E']) {
          console.log('MBTI E score data:', checkData.mbtiScores['E']);
          console.log('MBTI E percentage:', checkData.mbtiScores['E'].percentage);
          console.log('MBTI E percentage type:', typeof checkData.mbtiScores['E'].percentage);
        }
        
        return {
          riasecScores: checkData.riasecScores,
          mbtiScores: checkData.mbtiScores,
          finalRiasecCode: checkData.finalRiasecCode,
          finalMbtiType: checkData.finalMbtiType
        };
      }
      
      // If no data exists, try to regenerate it
      console.log('No detailed scoring data found, attempting to regenerate...');
      const regenerateResponse = await fetch(apiUrl(`/api/personality-test/force-regenerate-scoring/${sessionId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const regenerateData = await regenerateResponse.json();
      console.log('Regenerate response:', regenerateData);
      
      if (regenerateData.success) {
        console.log('Detailed scoring data regenerated successfully');
        // Try to fetch again
        const retryResponse = await fetch(apiUrl(`/api/personality-test/check-scores/${sessionId}`));
        const retryData = await retryResponse.json();
        console.log('Retry check response:', retryData);
        
        if (retryData.scoringDataExists && retryData.riasecScores && retryData.mbtiScores) {
          return {
            riasecScores: retryData.riasecScores,
            mbtiScores: retryData.mbtiScores,
            finalRiasecCode: retryData.finalRiasecCode,
            finalMbtiType: retryData.finalMbtiType
          };
        }
      }
      
      // If regeneration fails, try the test endpoint for sample data
      console.log('Trying test endpoint for sample data...');
      const testResponse = await fetch(apiUrl(`/api/personality-test/test-scoring/${sessionId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const testData = await testResponse.json();
      console.log('Test data response:', testData);
      
      if (testData.success && testData.data) {
        console.log('Using test sample data');
        return testData.data;
      }
      
      console.log('No detailed scoring data available');
      return null;
    } catch (error) {
      console.error('Error fetching detailed scoring data:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchResults();
  }, [userId, sessionId, isGuest]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      let response;

      if (isGuest && sessionId) {
        // For guests, try enhanced session endpoint first, fallback to regular if needed
        try {
          // Get guestToken from localStorage for authorization
          const guestToken = localStorage.getItem('guestToken');
          const url = guestToken 
            ? apiUrl(`/api/personality-test/result/enhanced/session/${sessionId}?guestToken=${guestToken}`)
            : apiUrl(`/api/personality-test/result/enhanced/session/${sessionId}`);
          
          response = await fetch(url);
          const enhancedData = await response.json();
          
          // Check for unauthorized access
          if (enhancedData.status === 'UNAUTHORIZED') {
            setError('UNAUTHORIZED');
            setLoading(false);
            return;
          }
          
          if (enhancedData.status === 'SUCCESS') {
            const result = enhancedData.result;
            
            // Fetch detailed scoring data using test result ID first, fallback to session ID
            if (result.id || result.sessionId) {
              const detailedScoring = await fetchDetailedScoringData(result.id, result.sessionId);
              if (detailedScoring) {
                result.detailedScoring = detailedScoring;
              }
            }
            
            setResults(result);
            // Check if course path needs regeneration (old format)
            if ((result.coursePath && !result.coursePath.includes(':')) ||
                (result.careerSuggestions && !result.careerSuggestions.includes(':'))) {
              await regenerateCourseDescriptions(sessionId);
            }
            return;
          }
        } catch (enhancedError) {
          console.log('Enhanced endpoint failed, falling back to regular endpoint');
        }
        // Fallback to regular endpoint
        response = await fetch(apiUrl(`/api/personality-test/result/session/${sessionId}`));
      } else if (userId && sessionId) {
        // For authenticated users with session ID, try enhanced session endpoint first, fallback to regular if needed
        try {
          // Pass userId for authorization
          response = await fetch(apiUrl(`/api/personality-test/result/enhanced/session/${sessionId}?userId=${userId}`));
          const enhancedData = await response.json();
          
          // Check for unauthorized access
          if (enhancedData.status === 'UNAUTHORIZED') {
            setError('UNAUTHORIZED');
            setLoading(false);
            return;
          }
          
          if (enhancedData.status === 'SUCCESS') {
            const result = enhancedData.result;
            
            // Fetch detailed scoring data using test result ID first, fallback to session ID
            if (result.id || result.sessionId) {
              const detailedScoring = await fetchDetailedScoringData(result.id, result.sessionId);
              if (detailedScoring) {
                result.detailedScoring = detailedScoring;
              }
            }
            
            setResults(result);
            // Check if course path needs regeneration (old format)
            if (result.coursePath && !result.coursePath.includes(':')) {
              await regenerateCourseDescriptions(sessionId);
            }
            return;
          }
        } catch (enhancedError) {
          console.log('Enhanced endpoint failed, falling back to regular endpoint');
        }
        // Fallback to regular endpoint
        response = await fetch(apiUrl(`/api/personality-test/result/session/${sessionId}`));
      } else if (userId) {
        // For authenticated users without session ID, get latest result
        try {
          response = await fetch(apiUrl(`/api/personality-test/result/enhanced/user/${userId}`));
          const enhancedData = await response.json();
          if (enhancedData.status === 'SUCCESS') {
            const result = enhancedData.result;
            
            // Fetch detailed scoring data using test result ID first, fallback to session ID
            if (result.id || result.sessionId) {
              const detailedScoring = await fetchDetailedScoringData(result.id, result.sessionId);
              if (detailedScoring) {
                result.detailedScoring = detailedScoring;
              }
            }
            
            setResults(result);
            // Check if course path needs regeneration (old format)
            if ((result.coursePath && !result.coursePath.includes(':')) ||
                (result.careerSuggestions && !result.careerSuggestions.includes(':'))) {
              // For user results, we need to get the session ID from the result
              if (result.sessionId) {
                await regenerateCourseDescriptions(result.sessionId);
              }
            }
            return;
          }
        } catch (enhancedError) {
          console.log('Enhanced endpoint failed, falling back to regular endpoint');
        }
        // Fallback to regular endpoint
        response = await fetch(apiUrl(`/api/personality-test/result/user/${userId}`));
      } else {
        throw new Error('No user ID or session ID provided');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        const result = data.result;
        
        // Fetch detailed scoring data using test result ID first, fallback to session ID
        if (result.id || result.sessionId) {
          const detailedScoring = await fetchDetailedScoringData(result.id, result.sessionId);
          if (detailedScoring) {
            result.detailedScoring = detailedScoring;
          }
        }
        
        setResults(result);
        // Check if course path needs regeneration (old format)
        const needsRegen = (data.result.coursePath && !data.result.coursePath.includes(':')) ||
                           (data.result.careerSuggestions && !data.result.careerSuggestions.includes(':'));
        if (needsRegen && sessionId) {
          await regenerateCourseDescriptions(sessionId);
        }
      } else {
        setError(data.message || 'Failed to load results');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const regenerateCourseDescriptions = async (sessionId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/personality-test/result/regenerate-descriptions/${sessionId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'SUCCESS') {
          // Refetch the results to get the updated course descriptions
          await fetchResults();
        }
      }
    } catch (error) {
      console.error('Error regenerating course descriptions:', error);
    }
  };

  const getMBTIDescription = (type: string, detailedInfo?: DetailedMbtiInfo) => {
    // Primary source: Backend database (enhanced details)
    if (detailedInfo?.title && detailedInfo?.description) {
      return `${detailedInfo.title} - ${detailedInfo.description}`;
    }
    
    // Fallback source: Frontend hardcoded descriptions (fast loading)
    const fallbackDescriptions: { [key: string]: { title: string; description: string } } = {
      'INTJ': {
        title: 'The Strategic Architect',
        description: 'INTJs excel at seeing the big picture and devising long-term plans. Their analytical minds and independent spirit drive them to turn complex visions into reality.'
      },
      'INTP': {
        title: 'The Conceptual Explorer',
        description: 'INTPs are driven by curiosity and a love for abstract thinking. They enjoy unraveling complex problems and often bring fresh, unconventional perspectives.'
      },
      'ENTJ': {
        title: 'The Commanding Planner',
        description: 'ENTJs are decisive leaders who excel at organizing people and resources. Their confidence and strategic mindset help them achieve ambitious goals.'
      },
      'ENTP': {
        title: 'The Visionary Challenger',
        description: 'ENTPs thrive on exploring new ideas and challenging the status quo. Their quick wit and adaptability make them natural innovators who inspire others to think differently.'
      },
      'INFJ': {
        title: 'The Insightful Guide',
        description: 'INFJs possess a deep understanding of people and a strong sense of purpose. They are driven by their ideals and often help others find meaning and direction.'
      },
      'INFP': {
        title: 'The Imaginative Idealist',
        description: 'INFPs are guided by their values and a vivid inner world. They seek authenticity and meaning, often expressing themselves through creativity and compassion.'
      },
      'ENFJ': {
        title: 'The Empathetic Motivator',
        description: 'ENFJs inspire and unite others with their warmth and vision. They are deeply attuned to the needs of those around them and excel at fostering collaboration.'
      },
      'ENFP': {
        title: 'The Spirited Inspirer',
        description: 'ENFPs radiate enthusiasm and see possibilities everywhere. Their energy and empathy help them connect with others and spark positive change.'
      },
      'ISTJ': {
        title: 'The Responsible Analyst',
        description: 'ISTJs value tradition and approach life with a methodical mindset. Their attention to detail and reliability ensure that tasks are completed with precision.'
      },
      'ISFJ': {
        title: 'The Supportive Guardian',
        description: 'ISFJs are caring and attentive, always looking out for the well-being of others. Their loyalty and sense of responsibility make them trusted friends and colleagues.'
      },
      'ESTJ': {
        title: 'The Practical Organizer',
        description: 'ESTJs are reliable and efficient, excelling at bringing order to chaos. Their strong sense of duty and clear standards make them natural leaders in any setting.'
      },
      'ESFJ': {
        title: 'The Harmonious Caretaker',
        description: 'ESFJs thrive on creating harmony and supporting their communities. They are sociable and attentive, always ready to lend a helping hand.'
      },
      'ISTP': {
        title: 'The Analytical Craftsman',
        description: 'ISTPs are independent thinkers who enjoy hands-on problem-solving. Their calm and practical approach allows them to navigate complex situations with ease.'
      },
      'ISFP': {
        title: 'The Gentle Creator',
        description: 'ISFPs are sensitive and artistic, finding beauty in everyday moments. They express themselves through creativity and value living authentically.'
      },
      'ESTP': {
        title: 'The Dynamic Problem-Solver',
        description: 'ESTPs are action-oriented and thrive in fast-paced environments. Their resourcefulness and adaptability help them tackle challenges head-on.'
      },
      'ESFP': {
        title: 'The Vibrant Entertainer',
        description: 'ESFPs bring energy and joy wherever they go, embracing life\'s experiences to the fullest. Their spontaneity and warmth make them the life of any gathering.'
      }
    };
    
    const typeInfo = fallbackDescriptions[type];
    if (typeInfo) {
      return `${typeInfo.title} - ${typeInfo.description}`;
    }
    return 'Unique personality type';
  };

  const getRIASECDescription = (code: string) => {
    const descriptions: { [key: string]: string } = {
      'R': 'Realistic - Hands-on, practical work',
      'I': 'Investigative - Research and analysis',
      'A': 'Artistic - Creative and expressive',
      'S': 'Social - Helping and teaching others',
      'E': 'Enterprising - Leadership and business',
      'C': 'Conventional - Organized and detailed work'
    };

    // Split the code into individual letters and get descriptions
    const codes = code.split('');
    return codes.map(c => descriptions[c] || c).join(' + ');
  };

  if (loading) {
    return (
      <div className="w-full bg-[#FFF4E6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002A3C] mx-auto mb-4"></div>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Special handling for unauthorized access
    if (error === 'UNAUTHORIZED') {
      return (
        <div className="w-full bg-[#FFF4E6] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl">🔒</span>
                </div>
              </div>

              {/* Title */}
              <h1 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-4 text-center`}>
                Sorry, we can't show you this results page!
              </h1>

              {/* Description */}
              <p className={`${localGeorgia.className} text-base sm:text-lg text-gray-700 leading-relaxed mb-8 text-center`}>
                Personality test results pages are private, which means they can only be viewed by the user who took the test.
              </p>

              {/* Section 1 */}
              <div className="mb-6">
                <h2 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-3`}>
                  If you're trying to access someone else's test results
                </h2>
                <p className={`${localGeorgia.className} text-gray-700 leading-relaxed mb-3`}>
                  You won't be able to view results that belong to another person on the site. If someone wants to share their results with you, the best way to do so is for them to take a screenshot and send it to you, or copy and paste the text they want to share.
                </p>
                <p className={`${localGeorgia.className} text-gray-700 leading-relaxed`}>
                  Or, you can <a href="/personalitytest" className="text-[#004E70] font-semibold hover:underline">take the test yourself</a> and see your own results!
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-6">
                <h2 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-3`}>
                  If you're trying to access your own results
                </h2>
                <div className={`${localGeorgia.className} text-gray-700 leading-relaxed`}>
                  <p>
                    If you have <strong>registered</strong> for an account on the site, you must be logged in to see your results. Please check the top right-hand corner of this page to see if you are logged in. If not, please <a href="/userpage" className="text-[#004E70] font-semibold hover:underline">log in</a> and try reloading this page.
                  </p>
                </div>
              </div>

              {/* Section 3 - About CourseFinder */}
              <div className="mb-8">
                <h2 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-3`}>
                  About CourseFinder
                </h2>
                <div className={`${localGeorgia.className} text-gray-700 leading-relaxed`}>
                  <p>
                    CourseFinder is your personalized guide to discovering the right educational path and career direction based on your unique personality. Our comprehensive assessment combines Jungjian Topology personality typing with RIASEC career interest profiling to provide you with tailored course recommendations, career suggestions, and a detailed development plan designed specifically for Senior High School students. Whether you're exploring your options or confirming your direction, CourseFinder helps you make informed decisions about your future with insights backed by established psychological frameworks. Take the test to unlock your personalized results and discover courses and careers that align with who you are!
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center">
                <a
                  href="/personalitytest"
                  className={`${localGeorama.className} px-8 py-3 bg-gradient-to-r from-[#004E70] to-[#00A3CC] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center`}
                >
                  Take the Test
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default error handling
    return (
      <div className="w-full bg-[#FFF4E6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className={`${localGeorama.className} text-red-600 text-lg mb-4`}>{error}</p>
          <button 
            onClick={fetchResults}
            className={`${localGeorama.className} bg-[#002A3C] text-white px-6 py-2 font-semibold hover:bg-[#004E70] transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="w-full bg-[#FFF4E6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>No results found. Please take the personality test first.</p>
        </div>
      </div>
    );
  }

  // Use the correct MBTI type from detailed scoring data if available, fallback to results.mbtiType
  const actualMbtiType = results.detailedScoring?.finalMbtiType || results.mbtiType;
  const colorTheme = getMBTIColorTheme(actualMbtiType);

  const renderContent = () => {
    if (activeTab === 'development-plan') {
      return (
        <CareerDevelopmentPlan 
          careerDevelopmentPlan={results?.careerDevelopmentPlan}
          courseDevelopmentPlan={results?.courseDevelopmentPlan}
          mbtiType={results?.mbtiType}
          riasecCode={results?.riasecCode}
        />
      );
    }
    
    if (activeTab === 'overview') {
      return (
              <div className="w-full min-h-screen bg-gradient-to-b from-transparent to-gray-50/50">
                <div className="relative z-10 w-full flex flex-col items-center">
                  {/* Hero Section - Full Width */}
                  <div className="relative overflow-hidden w-full">
                    {/* Hero Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50"></div>
                    
                    <div className="relative py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                      <div className="text-center max-w-6xl mx-auto">
                        {/* Icon and Title */}
                        <div className="flex flex-col items-center mb-4 sm:mb-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
                            <span className={`${localGeorama.className} text-white text-lg sm:text-xl font-bold`}>
                              {actualMbtiType}
                            </span>
                          </div>
                          <h1 className={`${localGeorama.className} text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-4`}>
                            {results.detailedMbtiInfo?.title || getMBTIDescription(actualMbtiType, results.detailedMbtiInfo).split(' - ')[0]}
                          </h1>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                          {results.detailedMbtiInfo?.description || getMBTIDescription(actualMbtiType, results.detailedMbtiInfo).split(' - ')[1] || 'Unique personality type'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MBTI Traits Section - Full Width */}
                  <div className="relative bg-gradient-to-b from-transparent to-gray-50/50 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
                    <div className="w-full max-w-7xl mx-auto">
                      <div className="text-center mb-6 sm:mb-8">
                        <h2 className={`${localGeorama.className} text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4`}>
                          Your Personality Traits Breakdown
                        </h2>
                        <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {(() => {
                      // Define the four MBTI dimensions with enhanced styling
                      const dimensions = [
                        { 
                          letters: ['E', 'I'], 
                          names: ['Extraversion', 'Introversion'], 
                          descriptions: ['Outgoing, energetic, social', 'Reflective, reserved, focused'],
                          icons: ['🌟', '🧘'],
                          colors: ['#10b981', '#3b82f6'],
                          lightColors: ['bg-emerald-50', 'bg-blue-50'],
                          category: 'Energy Source'
                        },
                        { 
                          letters: ['S', 'N'], 
                          names: ['Sensing', 'Intuition'], 
                          descriptions: ['Practical, detail-oriented, concrete', 'Abstract, future-focused, innovative'],
                          icons: ['🔍', '💡'],
                          colors: ['#f59e0b', '#8b5cf6'],
                          lightColors: ['bg-amber-50', 'bg-purple-50'],
                          category: 'Information Processing'
                        },
                        { 
                          letters: ['T', 'F'], 
                          names: ['Thinking', 'Feeling'], 
                          descriptions: ['Logical, objective, analytical', 'Empathetic, values-driven, harmonious'],
                          icons: ['🧠', '❤️'],
                          colors: ['#06b6d4', '#ec4899'],
                          lightColors: ['bg-cyan-50', 'bg-pink-50'],
                          category: 'Decision Making'
                        },
                        { 
                          letters: ['J', 'P'], 
                          names: ['Judging', 'Perceiving'], 
                          descriptions: ['Structured, decisive, organized', 'Flexible, adaptable, spontaneous'],
                          icons: ['📋', '🎯'],
                          colors: ['#ea580c', '#84cc16'],
                          lightColors: ['bg-orange-50', 'bg-lime-50'],
                          category: 'Lifestyle Approach'
                        }
                      ];
                      
                      return dimensions.map((dimension, index) => {
                        const mbtiLetter = actualMbtiType[index];
                        
                        // Get percentages for both traits in this dimension
                        const getPercentages = () => {
                          if (results.detailedScoring?.mbtiScores) {
                            const letter1Data = results.detailedScoring.mbtiScores[dimension.letters[0]];
                            const letter2Data = results.detailedScoring.mbtiScores[dimension.letters[1]];
                            
                            if (letter1Data && letter2Data) {
                              return {
                                [dimension.letters[0]]: Math.round(letter1Data.percentage),
                                [dimension.letters[1]]: Math.round(letter2Data.percentage)
                              };
                            }
                          }
                          return {
                            [dimension.letters[0]]: 0,
                            [dimension.letters[1]]: 0
                          };
                        };
                        
                        const percentages = getPercentages();
                        const dominantIndex = percentages[dimension.letters[0]] > percentages[dimension.letters[1]] ? 0 : 1;
                        const dominantLetter = dimension.letters[dominantIndex];
                        
                        return (
                          <div key={index} className="relative backdrop-blur-sm bg-white/90 rounded-xl sm:rounded-2xl border border-white/60 shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8">
                            {/* Category Header */}
                            <div className="text-center mb-3 md:mb-4 lg:mb-6">
                              <h4 className={`${localGeorama.className} text-sm md:text-base lg:text-lg font-bold text-[#002A3C] mb-1 md:mb-2`}>
                                {dimension.category}
                              </h4>
                              <div className="w-12 md:w-14 lg:w-16 h-0.5 md:h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto"></div>
                            </div>
                            
                            {/* Two Traits Comparison */}
                            <div className="space-y-2 md:space-y-3 lg:space-y-4">
                              {dimension.letters.map((letter, letterIndex) => {
                                const percentage = percentages[letter];
                                const isPreferred = letter === dominantLetter;
                                const name = dimension.names[letterIndex];
                                const description = dimension.descriptions[letterIndex];
                                const icon = dimension.icons[letterIndex];
                                const color = dimension.colors[letterIndex];
                                const lightColor = dimension.lightColors[letterIndex];
                                
                                return (
                                  <div key={letter} className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                                    isPreferred 
                                      ? `${lightColor} border-2 ring-2 ring-opacity-20 shadow-lg transform scale-[1.02]` 
                                      : 'bg-gray-50/50 border border-gray-200/50 backdrop-blur-sm'
                                  }`} style={{
                                    borderColor: isPreferred ? color : undefined,
                                    '--ring-color': isPreferred ? color : undefined
                                  } as React.CSSProperties}>
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                      <div className="flex items-center space-x-2 md:space-x-3">
                                        <div className="text-lg md:text-xl lg:text-2xl">{icon}</div>
                                        <div>
                                          <div className="flex items-center space-x-1 md:space-x-2">
                                            <span className={`font-bold text-sm md:text-base lg:text-lg ${isPreferred ? 'text-[#002A3C]' : 'text-gray-600'}`}>
                                              {name}
                                            </span>
                                            <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-bold text-white`} 
                                                  style={{ backgroundColor: color }}>
                                              {letter}
                                            </span>
                                          </div>
                                          <p className={`text-xs md:text-sm ${isPreferred ? 'text-gray-700' : 'text-gray-500'} mt-0.5 md:mt-1`}>
                                            {description}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className={`text-lg md:text-xl lg:text-2xl font-bold ${isPreferred ? 'text-[#002A3C]' : 'text-gray-500'}`}>
                                          {percentage}%
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                                      <div 
                                        className={`h-1.5 md:h-2 rounded-full transition-all duration-1500 ease-out ${
                                          isPreferred ? 'shadow-md' : 'opacity-60'
                                        }`}
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: color,
                                          boxShadow: isPreferred ? `0 0 10px ${color}40` : 'none'
                                        }}
                                      ></div>
                                    </div>
                                    
                                    {/* Preferred Indicator */}
                                    {isPreferred && (
                                      <div className="absolute -top-1 md:-top-2 -right-1 md:-right-2">
                                        <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow-md">
                                          PREFERRED
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RIASEC Career Interests Section - Full Width */}
                <div className="relative bg-gradient-to-b from-transparent to-gray-50/50 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
                  <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className={`${localGeorama.className} text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4`}>
                        Your Career Interests Profile
                      </h2>
                      <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto"></div>
                    </div>
                  
                    {/* Primary Interests (Top 2) */}
                    <div className="mb-6 sm:mb-8">
                      <div className="text-center mb-4 sm:mb-6">
                        <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3`}>
                          Your Primary Career Interests
                        </h3>
                        <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                      {(() => {
                        // Get percentages and sort by percentage (highest first)
                        const getPercentages = () => {
                          if (results.detailedScoring?.riasecScores) {
                            const percentages: { [key: string]: number } = {};
                            ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
                              const data = results.detailedScoring?.riasecScores[code];
                              if (data) {
                                percentages[code] = Math.round(data.percentage);
                              }
                            });
                            return percentages;
                          }
                          return {};
                        };
                        
                        const percentages = getPercentages();
                        
                        // Sort the RIASEC codes by percentage (highest first)
                        const sortedCodes = results.riasecCode.split('').sort((a, b) => {
                          const aPercentage = percentages[a] || 0;
                          const bPercentage = percentages[b] || 0;
                          return bPercentage - aPercentage;
                        });
                        
                        return sortedCodes.map((code, index) => {
                          const interests = {
                          'R': { 
                            name: 'Realistic', 
                            description: 'Hands-on, practical work with tools and machines', 
                            icon: '🔧', 
                            color: '#dc2626',
                            lightColor: 'bg-red-50',
                            category: 'Doers'
                          },
                          'I': { 
                            name: 'Investigative', 
                            description: 'Research, analysis, and problem-solving', 
                            icon: '🔬', 
                            color: '#2563eb',
                            lightColor: 'bg-blue-50',
                            category: 'Thinkers'
                          },
                          'A': { 
                            name: 'Artistic', 
                            description: 'Creative and expressive activities', 
                            icon: '🎨', 
                            color: '#9333ea',
                            lightColor: 'bg-purple-50',
                            category: 'Creators'
                          },
                          'S': { 
                            name: 'Social', 
                            description: 'Helping, teaching, and serving others', 
                            icon: '👥', 
                            color: '#059669',
                            lightColor: 'bg-emerald-50',
                            category: 'Helpers'
                          },
                          'E': { 
                            name: 'Enterprising', 
                            description: 'Leadership, business, and persuasion', 
                            icon: '💼', 
                            color: '#d97706',
                            lightColor: 'bg-amber-50',
                            category: 'Persuaders'
                          },
                          'C': { 
                            name: 'Conventional', 
                            description: 'Organized, systematic, and detailed work', 
                            icon: '📊', 
                            color: '#7c3aed',
                            lightColor: 'bg-violet-50',
                            category: 'Organizers'
                          }
                        };
                        const interest = interests[code as keyof typeof interests];
                        
                        // Get percentage from detailed scoring data
                        const getRealRIASECPercentage = (code: string) => {
                          if (results.detailedScoring?.riasecScores) {
                            const scoreData = results.detailedScoring.riasecScores[code];
                            if (scoreData) {
                              return Math.round(scoreData.percentage);
                            }
                          }
                          return 0;
                        };
                        
                        const percentage = getRealRIASECPercentage(code);
                        const rank = index + 1;
                        
                        return (
                          <div key={index} className={`relative backdrop-blur-sm bg-white/90 rounded-xl sm:rounded-2xl border border-white/60 shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 transform hover:scale-[1.02] ${interest.lightColor} border-2 ring-2 ring-opacity-20`} 
                               style={{
                                 borderColor: interest.color,
                                 '--ring-color': interest.color
                               } as React.CSSProperties}>
                            {/* Rank Badge */}
                            <div className="absolute -top-2 md:-top-3 -left-2 md:-left-3">
                              <div className="bg-yellow-400 text-yellow-900 text-xs md:text-sm font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md">
                                #{rank}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
                              <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                                <div className="text-2xl md:text-3xl lg:text-4xl">{interest.icon}</div>
                                <div>
                                  <div className="flex items-center space-x-1 md:space-x-2 mb-0.5 md:mb-1">
                                    <h4 className={`${localGeorama.className} font-bold text-base md:text-lg lg:text-xl text-[#002A3C]`}>
                                      {interest.name}
                                    </h4>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-bold text-white" 
                                          style={{ backgroundColor: interest.color }}>
                                      {code}
                                    </span>
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-600 font-medium">{interest.category}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#002A3C]">
                                  {percentage}%
                                </div>
                                <div className="text-xs md:text-sm text-gray-500">Interest Level</div>
                              </div>
                            </div>
                            
                            <p className={`${localGeorgia.className} text-gray-700 mb-2 md:mb-3 lg:mb-4 text-sm md:text-base`}>
                              {interest.description}
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5 lg:h-3 overflow-hidden">
                              <div 
                                className="h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-1500 ease-out shadow-md"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: interest.color,
                                  boxShadow: `0 0 15px ${interest.color}40`
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                        });
                      })()}
                    </div>
                  </div>
                  
                    {/* Complete Interest Profile */}
                    <div>
                      <div className="text-center mb-4 sm:mb-6">
                        <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3`}>
                          Complete Interest Profile
                        </h3>
                        <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {Object.entries({
                        'R': { 
                          name: 'Realistic', 
                          description: 'Hands-on work', 
                          icon: '🔧', 
                          color: '#dc2626',
                          category: 'Doers'
                        },
                        'I': { 
                          name: 'Investigative', 
                          description: 'Research & analysis', 
                          icon: '🔬', 
                          color: '#2563eb',
                          category: 'Thinkers'
                        },
                        'A': { 
                          name: 'Artistic', 
                          description: 'Creative expression', 
                          icon: '🎨', 
                          color: '#9333ea',
                          category: 'Creators'
                        },
                        'S': { 
                          name: 'Social', 
                          description: 'Helping others', 
                          icon: '👥', 
                          color: '#059669',
                          category: 'Helpers'
                        },
                        'E': { 
                          name: 'Enterprising', 
                          description: 'Leadership & business', 
                          icon: '💼', 
                          color: '#d97706',
                          category: 'Persuaders'
                        },
                        'C': { 
                          name: 'Conventional', 
                          description: 'Organized work', 
                          icon: '📊', 
                          color: '#7c3aed',
                          category: 'Organizers'
                        }
                      }).map(([code, interest]) => {
                        const getRealRIASECPercentage = (code: string) => {
                          if (results.detailedScoring?.riasecScores) {
                            const scoreData = results.detailedScoring.riasecScores[code];
                            if (scoreData) {
                              return Math.round(scoreData.percentage);
                            }
                          }
                          return 0;
                        };
                        
                        const percentage = getRealRIASECPercentage(code);
                        const isTopInterest = results.riasecCode.includes(code);
                        
                        return (
                          <div key={code} className={`backdrop-blur-sm bg-white/90 rounded-lg sm:rounded-xl border border-white/60 shadow-lg sm:shadow-xl p-3 sm:p-4 transition-all duration-300 overflow-hidden ${
                            isTopInterest ? 'ring-2 ring-opacity-50 shadow-xl' : 'hover:shadow-lg'
                          }`} style={{
                            '--ring-color': isTopInterest ? interest.color : undefined
                          } as React.CSSProperties}>
                            {/* Header Section */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                                <div className="text-sm lg:text-base flex-shrink-0">{interest.icon}</div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1 mb-0.5">
                                    <span className={`font-bold text-xs ${isTopInterest ? 'text-[#002A3C]' : 'text-gray-600'} truncate`}>
                                      {interest.name}
                                    </span>
                                    <span className="px-1 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0" 
                                          style={{ backgroundColor: interest.color }}>
                                      {code}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">{interest.category}</div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-1">
                                <div className={`text-xs font-bold ${isTopInterest ? 'text-[#002A3C]' : 'text-gray-500'}`}>
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Description Section */}
                            <div className="mb-1">
                              <p className="text-xs text-gray-600 leading-tight line-clamp-1">{interest.description}</p>
                            </div>
                            
                            {/* Progress Bar Section */}
                            <div className="mb-1">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full transition-all duration-1000 ease-out ${
                                    isTopInterest ? 'shadow-md' : 'opacity-60'
                                  }`}
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: interest.color
                                  }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Top Interest Badge */}
                            {isTopInterest && (
                              <div className="text-center">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                  TOP INTEREST
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personality Insights Summary Section - Full Width */}
              <div className="relative bg-gradient-to-r from-[#004E70] to-[#00A3CC] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
                <div className="w-full max-w-7xl mx-auto text-white">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className={`${localGeorama.className} text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4`}>
                      Your Unique Personality Profile
                    </h2>
                    <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-white/40 to-white/60 rounded-full mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">🧠</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Cognitive Style</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {actualMbtiType.includes('N') ? 'Intuitive & Abstract' : 'Sensing & Practical'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">⚡</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Energy Source</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {actualMbtiType.includes('E') ? 'External & Social' : 'Internal & Reflective'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">🎯</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Decision Making</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {actualMbtiType.includes('T') ? 'Logical & Objective' : 'Values & Empathetic'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'courses') {
      return (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Hero Section with Gradient Background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#002A3C] via-[#004E70] to-[#00A3CC] rounded-3xl mb-12">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
                        <span className="text-white text-2xl sm:text-3xl">🎓</span>
                      </div>
                      <h3 className={`${localGeorama.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight`}>
                        Your Personalized Course Recommendations
                      </h3>
                      <p className={`${localGeorgia.className} text-lg sm:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed`}>
                        Carefully curated based on your <span className="font-bold text-white">{actualMbtiType}</span> personality type and <span className="font-bold text-white">{results.riasecCode}</span> career interests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 sm:space-y-16">

                {/* Modern Course Path Section */}
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                      <span className="text-white text-xl sm:text-2xl">🎯</span>
                    </div>
                    <div>
                      <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                        Course Recommendations
                      </h4>
                      <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                        Tailored to your personality and career interests
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {(() => {
                      const hasSemicolon = results.coursePath?.includes(';');
                      const items = (hasSemicolon ? results.coursePath.split(';') : results.coursePath.split(','))
                        .map(s => s.trim())
                        .filter(Boolean);

                      return items.map((entry, index) => {
                        const trimmed = entry.trim();
                        if (!trimmed) return null;
                        
                        if (trimmed.includes(':')) {
                          const [courseName, description] = trimmed.split(':', 2);
                          return (
                            <div key={index} className="group bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-[#004E70]/30 hover:shadow-lg transition-all duration-300">
                              <div className="flex items-start">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-full flex items-center justify-center mr-4 mt-1 shadow-md">
                                  <span className="text-white text-sm sm:text-base font-bold">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg sm:text-xl mb-2 group-hover:text-[#004E70] transition-colors`}>
                                    {courseName.trim()}
                                  </h5>
                                  <p className={`${localGeorgia.className} text-[#666] text-sm sm:text-base leading-relaxed`}>
                                    {description.trim()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={index} className="group bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-[#004E70]/30 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-full flex items-center justify-center mr-4 mt-1 shadow-md">
                                <span className="text-white text-sm sm:text-base font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg sm:text-xl mb-2 group-hover:text-[#004E70] transition-colors`}>
                                  {trimmed}
                                </h5>
                                <p className={`${localGeorgia.className} text-[#666] text-sm sm:text-base leading-relaxed`}>
                                  A comprehensive program designed to develop relevant skills and knowledge.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Modern Career Opportunities Section */}
                <div className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                      <span className="text-white text-xl sm:text-2xl">💼</span>
                    </div>
                    <div>
                      <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                        Career Opportunities
                      </h4>
                      <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                        Explore potential career paths aligned with your profile
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {(() => {
                      const hasSemicolon = results.careerSuggestions?.includes(';');
                      const items = (hasSemicolon ? results.careerSuggestions.split(';') : results.careerSuggestions.split(','))
                        .map(s => s.trim())
                        .filter(Boolean);

                      const getFallback = (name: string) => {
                        const n = name.toLowerCase();
                        if (n.includes('teacher')) return 'Educates and mentors learners through structured instruction and assessment.';
                        if (n.includes('manager')) return 'Leads teams, improves processes, and aligns outcomes with organizational goals.';
                        if (n.includes('specialist')) return 'Provides focused expertise and delivers quality outcomes in a defined domain.';
                        if (n.includes('director')) return 'Oversees creative or operational vision, strategy, and execution across initiatives.';
                        if (n.includes('writer') || n.includes('editor')) return 'Creates and refines content to communicate ideas clearly for target audiences.';
                        if (n.includes('designer') || n.includes('artist')) return 'Transforms concepts into compelling visuals and experiences.';
                        return 'A role aligned with your strengths, offering meaningful impact and growth opportunities.';
                      };

                      return items.map((entry, index) => {
                        const hasDesc = entry.includes(':');
                        const [nameRaw, descRaw] = hasDesc ? entry.split(':', 2) : [entry, ''];
                        const name = (nameRaw || '').trim();
                        const desc = (descRaw || '').trim() || getFallback(name);
                        return (
                          <div key={index} className="group bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-5 sm:p-6 border border-amber-100/50 hover:border-amber-400/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center mr-4 shadow-md">
                                <span className="font-bold text-sm sm:text-base">{name.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg sm:text-xl mb-2 group-hover:text-[#004E70] transition-colors`}>{name}</h5>
                                <p className={`${localGeorgia.className} text-[#666] text-sm sm:text-base leading-relaxed`}>{desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Course Recommendations Disclaimer */}
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💡</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-purple-800 mb-3`}>
                        Important Note About Your Recommendations
                      </h3>
                      <div className={`${localGeorama.className} text-sm sm:text-base text-purple-700 leading-relaxed space-y-3`}>
                        <p>
                          The course and career suggestions you see here are based <strong>solely on your self-evaluation</strong> during the Personality Test. CourseFinder is simply providing you with <strong>ideas and suggestions</strong> of what might suit your personality profile.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>These recommendations are <strong>starting points for exploration</strong>, not definitive career paths you must follow</li>
                          <li>You have <strong>complete freedom</strong> to choose any course or career that interests you, regardless of what appears here</li>
                          <li>Your personality assessment results are just <strong>one factor</strong> among many that can influence your educational and career choices</li>
                          <li>Personal interests, passions, values, and life circumstances are equally important in making your decisions</li>
                        </ul>
                        <p className="font-semibold text-purple-800">
                          Remember:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li><strong>You are not limited</strong> by these suggestions - they are meant to inspire, not restrict</li>
                          <li><strong>Explore widely</strong> and consider options that genuinely excite and motivate you</li>
                          <li><strong>Trust your instincts</strong> and pursue paths that align with your personal goals and values</li>
                          <li><strong>Consult with counselors, teachers, and mentors</strong> for additional guidance and perspective</li>
                        </ul>
                        <p className="italic text-purple-700">
                          Your future is in your hands. Use these suggestions as a helpful starting point, but always choose the path that feels right for YOU.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modern Detailed Course Recommendations */}
                {results.courseRecommendations && results.courseRecommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                        <span className="text-white text-xl sm:text-2xl">🎓</span>
                      </div>
                      <div>
                        <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                          Detailed Course Recommendations
                        </h4>
                        <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                          Top courses matched to your personality and interests
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      {results.courseRecommendations.slice(0, 5).map((course, index) => (
                        <div key={course.id || index} className="group bg-gradient-to-r from-white to-emerald-50/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100/50 overflow-hidden">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                            <div className="flex-1 mb-4 lg:mb-0">
                              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-xl flex items-center justify-center mr-4 mb-2 sm:mb-0 shadow-lg">
                                  <span className="text-white text-sm sm:text-base font-bold">{index + 1}</span>
                                </div>
                                <h5 className={`${localGeorama.className} text-xl sm:text-2xl lg:text-3xl font-bold text-[#002A3C] group-hover:text-[#004E70] transition-colors`}>
                                  {course.courseName}
                                </h5>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center text-[#666] mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center">
                                  <span className="text-lg mr-2">🏛️</span>
                                  <span className={`${localGeorgia.className} text-sm sm:text-base font-medium`}>
                                    {course.university}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-lg mr-2">⏱️</span>
                                  <span className={`${localGeorgia.className} text-sm sm:text-base font-medium`}>
                                    {course.duration}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-lg mr-2">📋</span>
                                  <span className={`${localGeorgia.className} text-sm sm:text-base font-medium`}>
                                    {course.programType}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {course.matchScore && (
                              <div className="flex flex-col items-center mb-4 lg:mb-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                  <span className={`${localGeorama.className} text-white text-lg sm:text-xl font-bold`}>
                                    {Math.round(course.matchScore * 10)/10}
                                  </span>
                                </div>
                                <span className={`${localGeorama.className} text-xs sm:text-sm font-semibold text-emerald-600 mt-2`}>
                                  Match Score
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className={`${localGeorgia.className} text-[#002A3C] text-sm sm:text-base leading-relaxed mb-6`}>
                            {course.courseDescription}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl p-4 sm:p-5">
                              <h6 className={`${localGeorama.className} font-bold text-[#004E70] mb-2 flex items-center text-sm sm:text-base`}>
                                <span className="mr-2">💼</span>
                                Career Options
                              </h6>
                              <p className={`${localGeorgia.className} text-[#002A3C] text-xs sm:text-sm leading-relaxed`}>
                                {course.careerOptions}
                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-2xl p-4 sm:p-5">
                              <h6 className={`${localGeorama.className} font-bold text-[#004E70] mb-2 flex items-center text-sm sm:text-base`}>
                                <span className="mr-2">💰</span>
                                Salary Range
                              </h6>
                              <p className={`${localGeorgia.className} text-[#002A3C] text-xs sm:text-sm leading-relaxed`}>
                                {course.salaryRange}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
      );
    }
    
    if (activeTab === 'details') {
      return (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Hero Section with Gradient Background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#002A3C] via-[#004E70] to-[#00A3CC] rounded-3xl mb-12">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
                        <span className="text-white text-2xl sm:text-3xl">📊</span>
                      </div>
                      <h3 className={`${localGeorama.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight`}>
                        Detailed Scores & Analysis
                      </h3>
                      <p className={`${localGeorgia.className} text-lg sm:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed`}>
                        Comprehensive breakdown of your personality assessment results
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 sm:space-y-12 md:space-y-16">

                {/* Modern Test Information Section */}
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                      <span className="text-white text-xl sm:text-2xl">📅</span>
                    </div>
                    <div>
                      <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                        Test Information
                      </h4>
                      <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                        Details about your assessment session
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <span className="text-xl sm:text-2xl mr-3">📅</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-base sm:text-lg`}>Test Date</h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] text-sm sm:text-base`}>
                        {new Date(results.takenAt || results.generatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        })}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <span className="text-xl sm:text-2xl mr-3">👤</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-base sm:text-lg`}>Test Type</h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] text-sm sm:text-base`}>
                        {isGuest ? 'Guest Test' : 'User Account Test'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modern Personality Breakdown Section */}
                <div className="bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                      <span className="text-white text-xl sm:text-2xl">🧠</span>
                    </div>
                    <div>
                      <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                        Personality Type Breakdown
                      </h4>
                      <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                        Comprehensive analysis of your personality dimensions
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* MBTI Dimensions - Unique Detailed Analysis Design */}
                    <div>
                      <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-2xl">
                          <span className="text-white text-2xl">📊</span>
                        </div>
                        <h5 className={`${localGeorama.className} font-bold text-3xl text-[#002A3C] mb-3`}>
                          MBTI Dimensions Deep Dive
                        </h5>
                        <p className={`${localGeorgia.className} text-[#666] text-lg max-w-2xl mx-auto`}>
                          Comprehensive analysis of your <span className="font-bold text-purple-600">{actualMbtiType}</span> personality type across all four core dimensions
                        </p>
                      </div>
                      
                      {/* Detailed Analysis Grid */}
                      <div className="space-y-8 md:space-y-12">
                        {[
                          { 
                            pair: ['E', 'I'], 
                            labels: ['Extraversion', 'Introversion'], 
                            desc: 'Energy Source', 
                            icon: '⚡',
                            color: '#8b5cf6',
                            bgGradient: 'from-purple-50 to-violet-100',
                            borderColor: 'border-purple-200',
                            descriptions: ['Outgoing, energetic, social', 'Reflective, reserved, focused'],
                            characteristics: ['Gains energy from social interaction', 'Gains energy from quiet reflection']
                          },
                          { 
                            pair: ['S', 'N'], 
                            labels: ['Sensing', 'Intuition'], 
                            desc: 'Information Processing', 
                            icon: '🔍',
                            color: '#06b6d4',
                            bgGradient: 'from-cyan-50 to-blue-100',
                            borderColor: 'border-cyan-200',
                            descriptions: ['Practical, detail-oriented, concrete', 'Abstract, future-focused, innovative'],
                            characteristics: ['Focuses on facts and details', 'Focuses on patterns and possibilities']
                          },
                          { 
                            pair: ['T', 'F'], 
                            labels: ['Thinking', 'Feeling'], 
                            desc: 'Decision Making', 
                            icon: '⚖️',
                            color: '#ec4899',
                            bgGradient: 'from-pink-50 to-rose-100',
                            borderColor: 'border-pink-200',
                            descriptions: ['Logical, objective, analytical', 'Empathetic, values-driven, harmonious'],
                            characteristics: ['Makes decisions based on logic', 'Makes decisions based on values']
                          },
                          { 
                            pair: ['J', 'P'], 
                            labels: ['Judging', 'Perceiving'], 
                            desc: 'Lifestyle Approach', 
                            icon: '📅',
                            color: '#f59e0b',
                            bgGradient: 'from-amber-50 to-orange-100',
                            borderColor: 'border-amber-200',
                            descriptions: ['Structured, decisive, organized', 'Flexible, adaptable, spontaneous'],
                            characteristics: ['Prefers structure and closure', 'Prefers flexibility and openness']
                          }
                        ].map((dimension, index) => {
                          const mbtiLetter = actualMbtiType[index];
                          const letterIndex = dimension.pair.indexOf(mbtiLetter);
                          
                          // Get percentages from detailed scoring data
                          const getPercentages = () => {
                            if (results.detailedScoring?.mbtiScores) {
                              const letter1Data = results.detailedScoring.mbtiScores[dimension.pair[0]];
                              const letter2Data = results.detailedScoring.mbtiScores[dimension.pair[1]];
                              
                              if (letter1Data && letter2Data) {
                                return {
                                  [dimension.pair[0]]: Math.round(letter1Data.percentage),
                                  [dimension.pair[1]]: Math.round(letter2Data.percentage)
                                };
                              }
                            }
                            
                            return {
                              [dimension.pair[0]]: 0,
                              [dimension.pair[1]]: 0
                            };
                          };
                          
                          const percentages = getPercentages();
                          const dominantPercentage = Math.max(percentages[dimension.pair[0]], percentages[dimension.pair[1]]);
                          const dominantLetter = percentages[dimension.pair[0]] > percentages[dimension.pair[1]] ? dimension.pair[0] : dimension.pair[1];
                          const nonDominantLetter = dominantLetter === dimension.pair[0] ? dimension.pair[1] : dimension.pair[0];
                          const nonDominantPercentage = percentages[nonDominantLetter];

                          return (
                            <div key={index} className={`bg-gradient-to-br ${dimension.bgGradient} rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border ${dimension.borderColor} hover:shadow-2xl transition-all duration-500`}>
                              {/* Dimension Header */}
                              <div className="flex items-center justify-between mb-6 md:mb-8">
                                <div className="flex items-center space-x-3 md:space-x-4">
                                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: dimension.color + '20' }}>
                                    <span className="text-2xl md:text-3xl">{dimension.icon}</span>
                                  </div>
                                  <div>
                                    <h6 className={`${localGeorama.className} font-bold text-xl md:text-2xl text-[#002A3C] mb-1`}>
                                      {dimension.desc}
                                    </h6>
                                    <p className={`${localGeorgia.className} text-[#666] text-sm md:text-lg`}>
                                      How you process information and make decisions
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs md:text-sm text-gray-600 mb-1">Dominant Trait</div>
                                  <div className="text-2xl md:text-3xl font-bold text-[#002A3C]">{dominantLetter}</div>
                                  <div className="text-base md:text-lg font-semibold" style={{ color: dimension.color }}>{dominantPercentage}%</div>
                                </div>
                              </div>
                              
                              {/* Detailed Comparison Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {dimension.pair.map((letter, letterIdx) => {
                                  const percentage = percentages[letter];
                                  const isDominant = letter === dominantLetter;
                                  const label = dimension.labels[letterIdx];
                                  const description = dimension.descriptions[letterIdx];
                                  const characteristic = dimension.characteristics[letterIdx];
                                  
                                  return (
                                    <div key={letter} className={`relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg transition-all duration-300 ${
                                      isDominant ? 'ring-2 ring-opacity-50 transform scale-105' : 'opacity-90'
                                    }`} style={{
                                      '--ring-color': isDominant ? dimension.color : undefined
                                    } as React.CSSProperties}>
                                      
                                      {/* Dominant Indicator */}
                                      {isDominant && (
                                        <div className="absolute -top-3 -right-3">
                                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            DOMINANT
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Trait Header */}
                                      <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <div className="flex items-center space-x-2 md:space-x-3">
                                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-base md:text-lg" 
                                               style={{ backgroundColor: dimension.color }}>
                                            {letter}
                                          </div>
                                          <div>
                                            <h6 className={`${localGeorama.className} font-bold text-lg md:text-xl text-[#002A3C]`}>
                                              {label}
                                            </h6>
                                            <p className={`${localGeorgia.className} text-xs md:text-sm text-gray-600`}>
                                              {description}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`text-2xl md:text-4xl font-bold ${isDominant ? 'text-[#002A3C]' : 'text-gray-500'}`}>
                                            {percentage}%
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Detailed Progress Visualization */}
                                      <div className="mb-3 md:mb-4">
                                        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
                                          <span>0%</span>
                                          <span className="font-medium">Score Distribution</span>
                                          <span>100%</span>
                                        </div>
                                        <div className="relative">
                                          <div className="w-full bg-gray-200 rounded-full h-4 md:h-6 overflow-hidden">
                                            <div 
                                              className="h-4 md:h-6 rounded-full transition-all duration-2000 ease-out relative"
                                              style={{
                                                width: `${percentage}%`,
                                                backgroundColor: dimension.color,
                                                boxShadow: isDominant ? `0 0 20px ${dimension.color}60` : 'none'
                                              }}
                                            >
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs md:text-sm drop-shadow-lg">
                                                  {percentage}%
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Characteristic Description */}
                                      <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4">
                                        <div className="flex items-start space-x-2">
                                          <div className="w-2 h-2 rounded-full mt-1.5 md:mt-2" style={{ backgroundColor: dimension.color }}></div>
                                          <p className={`${localGeorgia.className} text-xs md:text-sm text-gray-700`}>
                                            {characteristic}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Dimension Analysis Summary */}
                              <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h6 className={`${localGeorama.className} font-bold text-base md:text-lg text-[#002A3C] mb-1 md:mb-2`}>
                                      Dimension Analysis
                                    </h6>
                                    <p className={`${localGeorgia.className} text-gray-600 text-xs md:text-sm`}>
                                      You show a {dominantPercentage - nonDominantPercentage}% preference for <span className="font-bold" style={{ color: dimension.color }}>{dominantLetter}</span> over <span className="font-bold text-gray-500">{nonDominantLetter}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl md:text-2xl font-bold text-[#002A3C]">{dominantLetter}</div>
                                    <div className="text-xs md:text-sm text-gray-500">Final Choice</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIASEC Interests - Modern Bar Chart */}
                    <div>
                      <div className="text-center mb-4 md:mb-6 lg:mb-8">
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl`}>
                          Your Career Interest Profile
                        </h5>
                        <div className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg">
                          <span className={`${localGeorama.className} font-bold text-sm md:text-base lg:text-lg`}>
                            Top Interests: {(() => {
                              // Calculate correct RIASEC code based on actual percentages
                              if (results.detailedScoring?.riasecScores) {
                                const codes = ['R', 'I', 'A', 'S', 'E', 'C'];
                                const sortedCodes = codes.sort((a, b) => {
                                  const aPercentage = results.detailedScoring?.riasecScores[a]?.percentage || 0;
                                  const bPercentage = results.detailedScoring?.riasecScores[b]?.percentage || 0;
                                  return bPercentage - aPercentage;
                                });
                                // Return top 2 codes
                                return sortedCodes.slice(0, 2).join('');
                              }
                              // Fallback to backend value if no detailed scoring
                              return results.riasecCode;
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-3 md:p-6 lg:p-8 shadow-xl border border-gray-100 mx-0 md:mx-1">
                        {/* Modern Vertical Bar Chart Visualization */}
                        <div className="space-y-3 md:space-y-6 lg:space-y-8">
                          {/* Chart Container */}
                          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-2 md:p-4 lg:p-6 border border-gray-100 overflow-hidden">
                            <div className="flex items-end justify-center space-x-1 md:space-x-4 lg:space-x-6 relative" style={{ height: '300px' }}>
                              {/* Y-axis Grid Lines - Fixed positioning for perfect alignment */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ paddingBottom: '0px' }}>
                                {[100, 75, 50, 25, 0].map((value, index) => (
                                  <div key={value} className="flex items-center relative" style={{ 
                                    top: value === 0 ? '-1px' : '0px',
                                    height: '1px'
                                  }}>
                                    <div className="w-full border-t border-dashed border-gray-400 opacity-70"></div>
                                    <div className="absolute right-0 text-xs text-gray-600 font-semibold bg-white px-1 md:px-2 py-0.5 md:py-1 rounded shadow-sm border border-gray-200" style={{
                                      transform: 'translateX(100%)',
                                      marginLeft: '4px'
                                    }}>
                                      {value}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {(() => {
                                const interests = {
                                  'R': { name: 'Realistic', desc: 'Hands-on, practical work', icon: '🔧', color: '#ef4444', shortName: 'R' },
                                  'I': { name: 'Investigative', desc: 'Research and analysis', icon: '🔬', color: '#3b82f6', shortName: 'I' },
                                  'A': { name: 'Artistic', desc: 'Creative and expressive', icon: '🎨', color: '#8b5cf6', shortName: 'A' },
                                  'S': { name: 'Social', desc: 'Helping and teaching others', icon: '👥', color: '#10b981', shortName: 'S' },
                                  'E': { name: 'Enterprising', desc: 'Leadership and business', icon: '💼', color: '#f59e0b', shortName: 'E' },
                                  'C': { name: 'Conventional', desc: 'Organized and detailed work', icon: '📊', color: '#6366f1', shortName: 'C' }
                                };
                                
                                // Get percentages
                                const getPercentages = () => {
                                  if (results.detailedScoring?.riasecScores) {
                                    const percentages: { [key: string]: number } = {};
                                    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
                                      const data = results.detailedScoring?.riasecScores[code];
                                      if (data) {
                                        percentages[code] = Math.round(data.percentage);
                                      }
                                    });
                                    return percentages;
                                  }
                                  
                                  // Fallback
                                  return {
                                    'R': 17, 'I': 17, 'A': 17, 'S': 17, 'E': 16, 'C': 16
                                  };
                                };
                                
                                const percentages = getPercentages();
                                
                                return ['R', 'I', 'A', 'S', 'E', 'C'].map((code, index) => {
                                  const interest = interests[code as keyof typeof interests];
                                  const percentage = percentages[code] || 0;
                                  
                                  // Calculate correct top interests based on actual percentages
                                  const getCorrectTopInterests = () => {
                                    if (results.detailedScoring?.riasecScores) {
                                      const codes = ['R', 'I', 'A', 'S', 'E', 'C'];
                                      const sortedCodes = codes.sort((a, b) => {
                                        const aPercentage = results.detailedScoring?.riasecScores[a]?.percentage || 0;
                                        const bPercentage = results.detailedScoring?.riasecScores[b]?.percentage || 0;
                                        return bPercentage - aPercentage;
                                      });
                                      return sortedCodes.slice(0, 2).join('');
                                    }
                                    return results.riasecCode;
                                  };
                                  
                                  const correctTopInterests = getCorrectTopInterests();
                                  const isTopInterest = correctTopInterests.includes(code);
                                  const rank = ['R', 'I', 'A', 'S', 'E', 'C'].sort((a, b) => (percentages[b] || 0) - (percentages[a] || 0)).indexOf(code) + 1;
                                  
                                  return (
                                    <div key={code} className="flex flex-col items-center group relative">
                                      {/* Bar Container */}
                                      <div className="relative flex flex-col items-center mb-4">
                                        {/* Percentage Label on Top - White badge with colored border */}
                                        <div 
                                          className="mb-1 md:mb-2 px-1 md:px-3 py-0.5 md:py-1 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 bg-white shadow-sm"
                                          style={{
                                            border: `2px solid ${interest.color}`,
                                            color: interest.color
                                          }}
                                        >
                                          {percentage}%
                                        </div>
                                        
                                        {/* Vertical Bar - Fixed height calculation for perfect grid alignment */}
                                        <div 
                                          className={`relative transition-all duration-2000 ease-out group-hover:scale-105 w-8 md:w-14 lg:w-18 ${
                                            isTopInterest ? 'drop-shadow-lg' : ''
                                          }`}
                                          style={{
                                            height: `${(percentage / 100) * 300}px`, // Matches container height of 300px
                                            background: isTopInterest 
                                              ? `linear-gradient(180deg, ${interest.color}, ${interest.color}CC)` 
                                              : `linear-gradient(180deg, ${interest.color}80, ${interest.color}60)`,
                                            borderRadius: '6px 6px 0 0',
                                            boxShadow: isTopInterest ? `0 8px 24px ${interest.color}40` : `0 4px 16px ${interest.color}20`,
                                            minHeight: '4px' // Ensure even 0% values are visible
                                          }}
                                        >
                                          {/* Shimmer effect for top interests */}
                                          {isTopInterest && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-30 animate-pulse rounded-t-lg"></div>
                                          )}
                                        </div>
                                        
                                        {/* Rank Badge for top interests - improved positioning */}
                                        {isTopInterest && rank <= 2 && (
                                          <div className="absolute -top-1 md:-top-3 -left-1 md:-left-3 w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                            <span className="text-white font-bold text-xs md:text-sm">
                                              {rank}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* X-axis Label - Removed for cleaner look */}
                                      
                                      {/* Enhanced Hover Tooltip */}
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 scale-95 group-hover:scale-100">
                                        <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-3 whitespace-nowrap shadow-2xl border border-gray-700">
                                          <div className="font-bold text-white mb-1">{interest.name}</div>
                                          <div className="text-gray-300 text-xs mb-1">{interest.desc}</div>
                                          <div className="text-yellow-300 font-bold text-sm">{percentage}% Interest</div>
                                          {isTopInterest && (
                                            <div className="text-blue-300 text-xs font-semibold mt-1">★ Primary Interest</div>
                                          )}
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            
                            {/* Chart Title Below */}
                            <div className="text-center mt-2 md:mt-4 lg:mt-6">
                              <h6 className={`${localGeorama.className} text-xs md:text-base lg:text-lg font-bold text-[#002A3C]`}>
                                RIASEC Career Interest Assessment
                              </h6>
                            </div>
                          </div>
                          
                          {/* Legend with Detailed Info - Fixed for desktop layout */}
                          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-6">
                            {(() => {
                              const interests = {
                                'R': { name: 'Realistic', desc: 'Hands-on, practical work', icon: '🔧', color: '#ef4444' },
                                'I': { name: 'Investigative', desc: 'Research and analysis', icon: '🔬', color: '#3b82f6' },
                                'A': { name: 'Artistic', desc: 'Creative and expressive', icon: '🎨', color: '#8b5cf6' },
                                'S': { name: 'Social', desc: 'Helping and teaching others', icon: '👥', color: '#10b981' },
                                'E': { name: 'Enterprising', desc: 'Leadership and business', icon: '💼', color: '#f59e0b' },
                                'C': { name: 'Conventional', desc: 'Organized and detailed work', icon: '📊', color: '#6366f1' }
                              };
                              
                              const getPercentages = () => {
                                if (results.detailedScoring?.riasecScores) {
                                  const percentages: { [key: string]: number } = {};
                                  ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
                                    const data = results.detailedScoring?.riasecScores[code];
                                    if (data) {
                                      percentages[code] = Math.round(data.percentage);
                                    }
                                  });
                                  return percentages;
                                }
                                return { 'R': 17, 'I': 17, 'A': 17, 'S': 17, 'E': 16, 'C': 16 };
                              };
                              
                              const percentages = getPercentages();
                              
                              return ['R', 'I', 'A', 'S', 'E', 'C'].map((code) => {
                                const interest = interests[code as keyof typeof interests];
                                const percentage = percentages[code] || 0;
                                
                                // Calculate correct top interests based on actual percentages
                                const getCorrectTopInterests = () => {
                                  if (results.detailedScoring?.riasecScores) {
                                    const codes = ['R', 'I', 'A', 'S', 'E', 'C'];
                                    const sortedCodes = codes.sort((a, b) => {
                                      const aPercentage = results.detailedScoring?.riasecScores[a]?.percentage || 0;
                                      const bPercentage = results.detailedScoring?.riasecScores[b]?.percentage || 0;
                                      return bPercentage - aPercentage;
                                    });
                                    return sortedCodes.slice(0, 2).join('');
                                  }
                                  return results.riasecCode;
                                };
                                
                                const correctTopInterests = getCorrectTopInterests();
                                const isTopInterest = correctTopInterests.includes(code);
                                
                                return (
                                  <div key={code} className={`p-2 md:p-4 lg:p-5 xl:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 min-h-[100px] md:min-h-[130px] lg:min-h-[140px] xl:min-h-[120px] ${
                                    isTopInterest 
                                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg transform scale-105' 
                                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                                  }`}>
                                    <div className="flex flex-col items-center text-center h-full justify-between">
                                      {/* Icon and Name Section */}
                                      <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                        <span className="text-xl md:text-3xl lg:text-4xl xl:text-2xl">{interest.icon}</span>
                                        <div className="space-y-1">
                                          <div className={`text-xs md:text-base lg:text-lg xl:text-sm font-bold leading-tight ${isTopInterest ? 'text-[#002A3C]' : 'text-gray-700'}`}>
                                            {interest.name}
                                          </div>
                                          <div className={`text-xs md:text-sm lg:text-base xl:text-xs leading-tight ${isTopInterest ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {interest.desc}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Percentage Section */}
                                      <div className="mt-auto">
                                        <div className={`text-base md:text-xl lg:text-2xl xl:text-lg font-bold ${isTopInterest ? 'text-blue-600' : 'text-gray-600'}`}>
                                          {percentage}%
                                        </div>
                                        {isTopInterest && (
                                          <div className="text-xs font-semibold text-blue-500 mt-1">
                                            TOP INTEREST
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                        
                        {/* Summary Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#002A3C] mb-1">
                                {(() => {
                                  const percentages = results.detailedScoring?.riasecScores ? 
                                    Object.values(results.detailedScoring.riasecScores).map(s => s.percentage) : 
                                    [17, 17, 17, 17, 16, 16];
                                  return Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
                                })()}%
                              </div>
                              <div className="text-sm text-gray-600">Average Interest</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#002A3C] mb-1">
                                {results.riasecCode.length}
                              </div>
                              <div className="text-sm text-gray-600">Primary Interests</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#002A3C] mb-1">
                                {(() => {
                                  const percentages = results.detailedScoring?.riasecScores ? 
                                    Object.values(results.detailedScoring.riasecScores).map(s => s.percentage) : 
                                    [17, 17, 17, 17, 16, 16];
                                  const max = Math.max(...percentages);
                                  return max;
                                })()}%
                              </div>
                              <div className="text-sm text-gray-600">Highest Interest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Explanation - moved here above Goals & Preferences */}
                {results.detailedExplanation && (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-indigo-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">💡</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                        Detailed Explanation
                      </h4>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg ring-1 ring-indigo-100">
                      <div className={`${localGeorgia.className} text-[#002A3C] text-lg leading-8 whitespace-pre-wrap break-words max-w-none overflow-hidden`}> 
                        {(() => {
                          const text = String(results.detailedExplanation || '');
                          
                          // Debug info (can be removed later)
                          console.log('Detailed Explanation Debug:', {
                            originalLength: text.length,
                            originalText: text,
                            first100: text.substring(0, 100),
                            last100: text.length > 100 ? text.substring(text.length - 100) : text
                          });
                          
                          if (!text || text.trim() === '') {
                            return <div className="text-gray-500 italic">No detailed explanation available.</div>;
                          }
                          
                          // Split by double newlines for paragraphs, or single newlines if no double newlines
                          let parts = text.split(/\n\s*\n/);
                          if (parts.length === 1) {
                            // If no paragraph breaks, split by single newlines
                            parts = text.split(/\n/);
                          }
                          
                          return (
                            <div className="space-y-4">
                              {parts.map((para, idx) => {
                                const trimmedPara = para.trim();
                                if (!trimmedPara) return null;
                                
                                return (
                                  <p key={idx} className="mb-4 last:mb-0 leading-relaxed">
                                    {trimmedPara}
                                  </p>
                                );
                              }).filter(Boolean)}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Goals - Enhanced Design */}
                {results.studentGoals && results.studentGoals !== '{}' && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 shadow-xl border border-yellow-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                        Your Goals & Preferences
                      </h4>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="space-y-4">
                        {(() => {
                          try {
                            const goals = JSON.parse(results.studentGoals);
                            // Filter out demographic fields that shouldn't be displayed
                            const filteredGoals = Object.entries(goals).filter(([key]) => 
                              !['age', 'gender', 'isFromPLMar'].includes(key)
                            );
                            
                            if (filteredGoals.length === 0) {
                              return (
                                <p className={`${localGeorgia.className} text-gray-600 text-center py-8`}>
                                  Goal information not available
                                </p>
                              );
                            }
                            
                            // Function to provide better descriptions for goal values
                            const getDisplayValue = (key: string, value: string) => {
                              if (key === 'routine') {
                                switch (value) {
                                  case 'Structured – I like plans and clear instructions':
                                    return 'Prefers structured plans and clear instructions';
                                  case 'Flexible – I prefer freedom to explore and change':
                                    return 'Prefers flexible freedom to explore and change';
                                  case 'Somewhere in between':
                                    return 'Can adapt to both structured and flexible approaches';
                                  default:
                                    return value;
                                }
                              } else if (key === 'confidence') {
                                const level = parseInt(value);
                                switch (level) {
                                  case 1:
                                    return 'Level 1 - Very uncertain about career path';
                                  case 2:
                                    return 'Level 2 - Somewhat uncertain about career path';
                                  case 3:
                                    return 'Level 3 - Moderately confident in career path';
                                  case 4:
                                    return 'Level 4 - Quite confident in career path';
                                  case 5:
                                    return 'Level 5 - Very confident in career path';
                                  default:
                                    return `Level ${level}`;
                                }
                              }
                              return value;
                            };
                            
                            return filteredGoals.map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-400">
                                <span className={`${localGeorama.className} font-bold text-[#002A3C] capitalize`}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className={`${localGeorgia.className} text-[#666] font-medium`}>
                                  {getDisplayValue(key, String(value))}
                                </span>
                              </div>
                            ));
                          } catch {
                            return (
                              <p className={`${localGeorgia.className} text-gray-600 text-center py-8`}>
                                Goal information not available
                              </p>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Notice - Moved to Bottom */}
                {isGuest && (
                  <div className="bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-2xl p-8 text-white shadow-2xl">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-2xl">💡</span>
                        </div>
                        <h4 className={`${localGeorama.className} text-2xl font-bold`}>
                          Guest Results
                        </h4>
                      </div>
                      <p className={`${localGeorgia.className} text-lg leading-relaxed opacity-90 mb-6`}>
                        Create an account to save your results permanently and access them anytime!
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className={`${localGeorgia.className} text-sm opacity-80`}>
                          Your results are currently stored temporarily. Sign up to keep them forever and track your personality development over time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
      );
    }
    
    if (activeTab === 'mbti-details') {
      return (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Hero Section with Gradient Background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#002A3C] via-[#004E70] to-[#00A3CC] rounded-3xl mb-12">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
                        <span className="text-white text-2xl sm:text-3xl">🔍</span>
                      </div>
                      <h3 className={`${localGeorama.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight`}>
                        Detailed MBTI Analysis
                      </h3>
                      <p className={`${localGeorgia.className} text-lg sm:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed`}>
                        In-depth insights into your <span className="font-bold text-white">{actualMbtiType}</span> personality type, learning preferences, and growth opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 sm:space-y-16">

                {results.detailedMbtiInfo ? (
                  <div className="space-y-8">
                    {/* Modern Learning Style Section */}
                    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">📚</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Learning Style Analysis
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Understanding how you learn best based on your personality
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 sm:space-y-8">
                        <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Learning Style Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedMbtiInfo.learningStyleSummary}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Detailed Learning Preferences
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedMbtiInfo.learningStyleDetails}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                              Optimal Learning Environments
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.learningStyleEnvironments}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                              Recommended Resources
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.learningStyleResources}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modern Study Tips Section */}
                    <div className="bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">💡</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Personalized Study Tips
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Tailored strategies to maximize your learning potential
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 sm:space-y-8">
                        <div className="bg-gradient-to-r from-white to-emerald-50/30 rounded-2xl p-5 sm:p-6 border border-emerald-100/50 hover:border-emerald-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Study Tips Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedMbtiInfo.studyTipsSummary}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-white to-emerald-50/30 rounded-2xl p-5 sm:p-6 border border-emerald-100/50 hover:border-emerald-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Detailed Study Strategies
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedMbtiInfo.studyTipsDetails}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="bg-gradient-to-r from-white to-green-50/30 rounded-2xl p-5 sm:p-6 border border-green-100/50 hover:border-green-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">✅</span>
                              Do's
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.studyTipsDos}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-white to-red-50/30 rounded-2xl p-5 sm:p-6 border border-red-100/50 hover:border-red-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-red-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">❌</span>
                              Don'ts
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.studyTipsDonts}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-white to-yellow-50/30 rounded-2xl p-5 sm:p-6 border border-yellow-100/50 hover:border-yellow-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                            <h5 className={`${localGeorama.className} font-bold text-yellow-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">⚠️</span>
                              Common Mistakes
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.studyTipsCommonMistakes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modern Personal Growth Section */}
                    <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">🌱</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Personal Growth Insights
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Discover your strengths and areas for development
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gradient-to-r from-white to-green-50/30 rounded-2xl p-5 sm:p-6 border border-green-100/50 hover:border-green-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">💪</span>
                              Your Strengths
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.growthStrengths}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-blue-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">🎯</span>
                              Growth Opportunities
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.growthOpportunities}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-orange-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">⚡</span>
                              Areas to Develop
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.growthWeaknesses}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-purple-50/30 rounded-2xl p-5 sm:p-6 border border-purple-100/50 hover:border-purple-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-purple-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">🏆</span>
                              Growth Challenges
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedMbtiInfo.growthChallenges}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modern Data Source Note */}
                    <div className="bg-gradient-to-r from-white via-gray-50/30 to-blue-50/30 rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-xl sm:text-2xl mr-2">✨</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg sm:text-xl`}>
                          Enhanced Analysis
                        </h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                        This detailed information is based on comprehensive MBTI research 
                        and provides personalized insights for your <span className="font-bold text-[#004E70]">{actualMbtiType}</span> personality type.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 rounded-3xl p-6 sm:p-8 lg:p-10 text-center shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-4xl sm:text-6xl mb-6">🔍</div>
                    <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-4`}>
                      Detailed MBTI Analysis Coming Soon
                    </h4>
                    <p className={`${localGeorgia.className} text-[#666] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto`}>
                      We're working on providing you with detailed MBTI insights. In the meantime, 
                      check out your basic personality analysis in the Overview tab.
                    </p>
                  </div>
                )}

                {/* MBTI Detailed Analysis Disclaimer */}
                {results.detailedMbtiInfo && (
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">ℹ️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-blue-800 mb-3`}>
                          About Your MBTI Detailed Analysis
                        </h3>
                        <div className={`${localGeorama.className} text-sm sm:text-base text-blue-700 leading-relaxed space-y-3`}>
                          <p>
                            The MBTI (Myers-Briggs Type Indicator) detailed analysis provided here is based on <strong>established psychological research</strong> and represents general tendencies associated with your personality type. Please understand that:
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>MBTI results represent <strong>preferences and tendencies</strong>, not fixed characteristics or limitations</li>
                            <li>Learning styles and study strategies are <strong>general guidelines</strong> that may work well for your type, but individual effectiveness varies</li>
                            <li>These insights are <strong>starting points</strong> for self-exploration, not definitive rules about how you must learn or behave</li>
                            <li>Personality type is just <strong>one factor</strong> among many that influence learning and career success</li>
                          </ul>
                          <p className="font-semibold text-blue-800">
                            How to use this information effectively:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Experiment</strong> with the suggested strategies and adapt them to your unique needs</li>
                            <li><strong>Combine</strong> approaches from different personality types if they resonate with you</li>
                            <li><strong>Consult</strong> with teachers, counselors, or mentors for personalized guidance</li>
                            <li><strong>Remember</strong> that growth often comes from developing skills outside your natural preferences</li>
                          </ul>
                          <p className="italic text-blue-700">
                            The MBTI framework is a tool for self-understanding, not a box that defines who you are or what you can achieve. Your potential is unlimited, regardless of your personality type.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RIASEC Details Section */}
                <div className="mt-16"></div>
                
                {/* RIASEC Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#DC2626] rounded-3xl mb-12">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
                        <span className="text-white text-2xl sm:text-3xl">🎯</span>
                      </div>
                      <h3 className={`${localGeorama.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight`}>
                        Detailed RIASEC Analysis
                      </h3>
                      <p className={`${localGeorgia.className} text-lg sm:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed`}>
                        In-depth insights into your <span className="font-bold text-white">{results.riasecCode.substring(0, 1)}</span> (TOP 1) interest type, learning preferences, and growth opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                {results.detailedRiasecInfo ? (
                  <div className="space-y-8">
                    {/* RIASEC Learning Style Section */}
                    <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">📚</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Learning Style Analysis (RIASEC)
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Understanding how you learn best based on your interest type
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 sm:space-y-8">
                        <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Learning Style Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedRiasecInfo.learningStyleSummary}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Detailed Learning Preferences
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedRiasecInfo.learningStyleDetails}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                              Optimal Learning Environments
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.learningStyleEnvironments}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                              Recommended Resources
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.learningStyleResources}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIASEC Study Tips Section */}
                    <div className="bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">💡</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Personalized Study Tips (RIASEC)
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Tailored strategies to maximize your learning potential
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 sm:space-y-8">
                        <div className="bg-gradient-to-r from-white to-amber-50/30 rounded-2xl p-5 sm:p-6 border border-amber-100/50 hover:border-amber-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Study Tips Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedRiasecInfo.studyTipsSummary}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-white to-amber-50/30 rounded-2xl p-5 sm:p-6 border border-amber-100/50 hover:border-amber-300/30 hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-4 text-lg sm:text-xl`}>
                            Detailed Study Strategies
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                            {results.detailedRiasecInfo.studyTipsDetails}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="bg-gradient-to-r from-white to-green-50/30 rounded-2xl p-5 sm:p-6 border border-green-100/50 hover:border-green-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">✅</span>
                              Do's
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.studyTipsDos
                                .split('• ')
                                .filter(item => item.trim() !== '')
                                .map(item => `• ${item.trim()}`)
                                .join('\n')}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-white to-red-50/30 rounded-2xl p-5 sm:p-6 border border-red-100/50 hover:border-red-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-red-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">❌</span>
                              Don'ts
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.studyTipsDonts
                                .split('• ')
                                .filter(item => item.trim() !== '')
                                .map(item => `• ${item.trim()}`)
                                .join('\n')}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-white to-yellow-50/30 rounded-2xl p-5 sm:p-6 border border-yellow-100/50 hover:border-yellow-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                            <h5 className={`${localGeorama.className} font-bold text-yellow-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">⚠️</span>
                              Common Mistakes
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.studyTipsCommonMistakes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIASEC Personal Growth Section */}
                    <div className="bg-gradient-to-br from-white via-rose-50/30 to-red-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 mb-4 sm:mb-0 shadow-lg">
                          <span className="text-white text-xl sm:text-2xl">🌱</span>
                        </div>
                        <div>
                          <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-2`}>
                            Personal Growth Insights (RIASEC)
                          </h4>
                          <p className={`${localGeorgia.className} text-base sm:text-lg text-[#666]`}>
                            Discover your strengths and areas for development
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gradient-to-r from-white to-green-50/30 rounded-2xl p-5 sm:p-6 border border-green-100/50 hover:border-green-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">💪</span>
                              Your Strengths
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.growthStrengths}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-blue-100/50 hover:border-blue-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-blue-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">🎯</span>
                              Growth Opportunities
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.growthOpportunities}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gradient-to-r from-white to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-orange-100/50 hover:border-orange-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-orange-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">⚡</span>
                              Areas to Develop
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.growthWeaknesses}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-white to-purple-50/30 rounded-2xl p-5 sm:p-6 border border-purple-100/50 hover:border-purple-300/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-purple-700 mb-4 text-lg sm:text-xl flex items-center`}>
                              <span className="mr-2">🏆</span>
                              Growth Challenges
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                              {results.detailedRiasecInfo.growthChallenges}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIASEC Data Source Note */}
                    <div className="bg-gradient-to-r from-white via-gray-50/30 to-orange-50/30 rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-xl sm:text-2xl mr-2">✨</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg sm:text-xl`}>
                          Enhanced Analysis
                        </h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] leading-relaxed text-sm sm:text-base`}>
                        This detailed information is based on comprehensive RIASEC research 
                        and provides personalized insights for your <span className="font-bold text-[#EA580C]">{results.riasecCode.substring(0, 1)}</span> (TOP 1) interest type.
                      </p>
                    </div>

                    {/* RIASEC Detailed Analysis Disclaimer */}
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 sm:p-8 shadow-lg mt-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">ℹ️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-orange-800 mb-3`}>
                            About Your RIASEC Detailed Analysis
                          </h3>
                          <div className={`${localGeorama.className} text-sm sm:text-base text-orange-700 leading-relaxed space-y-3`}>
                            <p>
                              The RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) detailed analysis provided here is based on <strong>established vocational psychology research</strong> by Dr. John Holland. Please understand that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>RIASEC results represent <strong>general tendencies and preferences</strong>, not absolute rules about your capabilities or interests</li>
                              <li>Learning styles and study strategies are <strong>extrapolated from career research</strong> and should be considered starting points for exploration</li>
                              <li>Most people have characteristics from <strong>multiple RIASEC types</strong>, and your interests can develop over time</li>
                              <li>Individual effectiveness depends on many factors beyond personality type, including <strong>effort, opportunity, and personal circumstances</strong></li>
                            </ul>
                            <p className="font-semibold text-orange-800">
                              How to use this information effectively:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li><strong>Explore</strong> the suggested study strategies and see what resonates with your learning style</li>
                              <li><strong>Experiment</strong> with different approaches to find what works best for you personally</li>
                              <li><strong>Research</strong> careers and educational paths aligned with your interest type</li>
                              <li><strong>Consult</strong> with career counselors, academic advisors, or mentors for personalized guidance</li>
                            </ul>
                            <p className="font-semibold text-orange-800">
                              Important limitations to remember:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>These insights are <strong>general guidelines</strong>, not diagnostic tools or medical assessments</li>
                              <li>Professional guidance is recommended for <strong>major educational or career decisions</strong></li>
                              <li>Your unique combination of interests, skills, values, and circumstances will ultimately guide your path</li>
                            </ul>
                            <p className="italic text-orange-700">
                              The RIASEC framework is designed to help you explore possibilities and understand yourself better. It's a starting point for your journey, not a final destination. Your potential is unlimited, regardless of your interest type.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 rounded-3xl p-6 sm:p-8 lg:p-10 text-center shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-4xl sm:text-6xl mb-6">🎯</div>
                    <h4 className={`${localGeorama.className} text-2xl sm:text-3xl font-bold text-[#002A3C] mb-4`}>
                      Detailed RIASEC Analysis Coming Soon
                    </h4>
                    <p className={`${localGeorgia.className} text-[#666] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto`}>
                      We're working on providing you with detailed RIASEC insights. In the meantime, 
                      check out your interest profile in the Overview tab.
                    </p>
                  </div>
                )}

                </div>
              </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full bg-[#FFF4E6] min-h-screen py-8">
      {renderContent()}
    </div>
  );
};

export default PersonalityTestResults;
