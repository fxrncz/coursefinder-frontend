import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../lib/api';
import { localGeorama, localGeorgia } from '../fonts';

interface PersonalityTestResultsProps {
  userId?: number;
  sessionId?: string | null;
  isGuest?: boolean;
  activeTab: 'overview' | 'courses' | 'details' | 'mbti-details';
  setActiveTab: (tab: 'overview' | 'courses' | 'details' | 'mbti-details') => void;
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
  learningStyle: string;
  studyTips: string;
  personalityGrowthTips: string;
  studentGoals: string;
  generatedAt: string;
  takenAt: string;
  courseRecommendations?: CourseRecommendation[];
  detailedMbtiInfo?: DetailedMbtiInfo;
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
          response = await fetch(apiUrl(`/api/personality-test/result/enhanced/session/${sessionId}`));
          const enhancedData = await response.json();
          if (enhancedData.status === 'SUCCESS') {
            setResults(enhancedData.result);
            // Check if course path needs regeneration (old format)
            if ((enhancedData.result.coursePath && !enhancedData.result.coursePath.includes(':')) ||
                (enhancedData.result.careerSuggestions && !enhancedData.result.careerSuggestions.includes(':'))) {
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
          response = await fetch(apiUrl(`/api/personality-test/result/enhanced/session/${sessionId}`));
          const enhancedData = await response.json();
          if (enhancedData.status === 'SUCCESS') {
            setResults(enhancedData.result);
            // Check if course path needs regeneration (old format)
            if (enhancedData.result.coursePath && !enhancedData.result.coursePath.includes(':')) {
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
            setResults(enhancedData.result);
            // Check if course path needs regeneration (old format)
            if ((enhancedData.result.coursePath && !enhancedData.result.coursePath.includes(':')) ||
                (enhancedData.result.careerSuggestions && !enhancedData.result.careerSuggestions.includes(':'))) {
              // For user results, we need to get the session ID from the result
              if (enhancedData.result.sessionId) {
                await regenerateCourseDescriptions(enhancedData.result.sessionId);
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
        setResults(data.result);
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

  const colorTheme = getMBTIColorTheme(results.mbtiType);

  return (
    <div className="w-full bg-[#FFF4E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-8">



        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg mb-8 mx-4 -mt-10">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Hero Section with Personality Type */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#004E70] to-[#00A3CC] rounded-full mb-6 shadow-2xl">
                    <span className={`${localGeorama.className} text-white text-4xl font-bold`}>
                      {results.mbtiType}
                    </span>
                  </div>
                  <h2 className={`${localGeorama.className} text-4xl font-bold text-[#002A3C] mb-6`}>
                    {results.detailedMbtiInfo?.title || getMBTIDescription(results.mbtiType, results.detailedMbtiInfo).split(' - ')[0]}
                  </h2>
                  <p className={`${localGeorgia.className} text-xl text-[#666] max-w-3xl mx-auto leading-relaxed`}>
                    {results.detailedMbtiInfo?.description || getMBTIDescription(results.mbtiType, results.detailedMbtiInfo).split(' - ')[1] || 'Unique personality type'}
                  </p>
                </div>

                {/* Interactive MBTI Traits Visualization */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className={`${localGeorama.className} text-3xl font-bold text-[#002A3C] mb-8 text-center`}>
                    Your Personality Traits Breakdown
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {(() => {
                      // Define the four MBTI dimensions
                      const dimensions = [
                        { 
                          letters: ['E', 'I'], 
                          names: ['Extraversion', 'Introversion'], 
                          descriptions: ['Outgoing, energetic, social', 'Reflective, reserved, focused'],
                          colors: ['from-green-400 to-emerald-500', 'from-blue-400 to-cyan-500']
                        },
                        { 
                          letters: ['S', 'N'], 
                          names: ['Sensing', 'Intuition'], 
                          descriptions: ['Practical, detail-oriented, concrete', 'Abstract, future-focused, innovative'],
                          colors: ['from-orange-400 to-red-500', 'from-purple-400 to-pink-500']
                        },
                        { 
                          letters: ['T', 'F'], 
                          names: ['Thinking', 'Feeling'], 
                          descriptions: ['Logical, objective, analytical', 'Empathetic, values-driven, harmonious'],
                          colors: ['from-teal-400 to-blue-500', 'from-rose-400 to-pink-500']
                        },
                        { 
                          letters: ['J', 'P'], 
                          names: ['Judging', 'Perceiving'], 
                          descriptions: ['Structured, decisive, organized', 'Flexible, adaptable, spontaneous'],
                          colors: ['from-amber-400 to-orange-500', 'from-lime-400 to-green-500']
                        }
                      ];
                      
                      return dimensions.map((dimension, index) => {
                        const mbtiLetter = results.mbtiType[index];
                        const preferredIndex = dimension.letters.indexOf(mbtiLetter);
                        const preferredTrait = {
                          letter: mbtiLetter,
                          name: dimension.names[preferredIndex],
                          description: dimension.descriptions[preferredIndex],
                          color: dimension.colors[preferredIndex],
                          opposite: dimension.names[1 - preferredIndex]
                        };
                        
                        // Calculate consistent percentage based on MBTI type
                        const getConsistentPercentage = (mbtiType: string, dimensionIndex: number) => {
                          // Create a deterministic hash from MBTI type and dimension
                          const hashString = mbtiType + dimensionIndex.toString();
                          let hash = 0;
                          for (let i = 0; i < hashString.length; i++) {
                            const char = hashString.charCodeAt(i);
                            hash = ((hash << 5) - hash) + char;
                            hash = hash & hash; // Convert to 32-bit integer
                          }
                          
                          // Use hash to generate consistent percentage between 65-85%
                          const normalizedHash = Math.abs(hash) % 21; // 0-20 range
                          const percentage = 65 + normalizedHash; // 65-85% range
                          return percentage;
                        };
                        
                        const percentage = getConsistentPercentage(results.mbtiType, index);
                        
                        return (
                          <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 bg-gradient-to-r ${preferredTrait.color} rounded-full`}></div>
                                <h4 className={`${localGeorama.className} font-bold text-xl text-[#002A3C]`}>
                                  {preferredTrait.name}
                                </h4>
                              </div>
                              <div className={`px-4 py-2 bg-gradient-to-r ${preferredTrait.color} text-white rounded-full text-base font-bold`}>
                                {preferredTrait.letter}
                              </div>
                            </div>
                            <p className={`${localGeorgia.className} text-base text-[#666] mb-4`}>
                              {preferredTrait.description}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`bg-gradient-to-r ${preferredTrait.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{preferredTrait.opposite}</span>
                              <span className="font-semibold">{percentage}%</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RIASEC Interests Radar Visualization */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className={`${localGeorama.className} text-3xl font-bold text-[#002A3C] mb-8 text-center`}>
                    Your Career Interests Profile
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {results.riasecCode.split('').map((code, index) => {
                      const interests = {
                        'R': { name: 'Realistic', description: 'Hands-on, practical work', icon: '🔧', color: 'from-red-400 to-orange-500' },
                        'I': { name: 'Investigative', description: 'Research and analysis', icon: '🔬', color: 'from-blue-400 to-cyan-500' },
                        'A': { name: 'Artistic', description: 'Creative and expressive', icon: '🎨', color: 'from-purple-400 to-pink-500' },
                        'S': { name: 'Social', description: 'Helping and teaching others', icon: '👥', color: 'from-green-400 to-emerald-500' },
                        'E': { name: 'Enterprising', description: 'Leadership and business', icon: '💼', color: 'from-yellow-400 to-orange-500' },
                        'C': { name: 'Conventional', description: 'Organized and detailed work', icon: '📊', color: 'from-indigo-400 to-blue-500' }
                      };
                      const interest = interests[code as keyof typeof interests];
                      const strength = (3 - index) * 25; // Higher strength for earlier letters
                      return (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                          <div className="text-center">
                            <div className="text-4xl mb-3">{interest.icon}</div>
                            <h4 className={`${localGeorama.className} font-bold text-xl text-[#002A3C] mb-3`}>
                              {interest.name}
                            </h4>
                            <p className={`${localGeorgia.className} text-base text-[#666] mb-4`}>
                              {interest.description}
                            </p>
                            <div className="relative">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                  className={`bg-gradient-to-r ${interest.color} h-4 rounded-full transition-all duration-1000 ease-out`}
                                  style={{width: `${strength}%`}}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>Low</span>
                                <span className="font-bold text-xl">{strength}%</span>
                                <span>High</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Learning Style & Goals Interactive Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">📚</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#002A3C]`}>
                        Learning Style
                      </h4>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <p className={`${localGeorgia.className} text-[#002A3C] leading-relaxed text-lg`}>
                        {results.learningStyle}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#002A3C]`}>
                        Student Goals
                      </h4>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <p className={`${localGeorgia.className} text-[#002A3C] leading-relaxed text-lg`}>
                        {results.studentGoals ? JSON.parse(results.studentGoals).priority || 'Not specified' : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personality Insights Summary */}
                <div className="bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-2xl p-8 text-white shadow-2xl">
                  <h3 className={`${localGeorama.className} text-3xl font-bold mb-6 text-center`}>
                    Your Unique Personality Profile
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">🧠</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Cognitive Style</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {results.mbtiType.includes('N') ? 'Intuitive & Abstract' : 'Sensing & Practical'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">⚡</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Energy Source</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {results.mbtiType.includes('E') ? 'External & Social' : 'Internal & Reflective'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-4xl mb-4">🎯</div>
                      <h4 className={`${localGeorama.className} font-bold text-xl mb-3`}>Decision Making</h4>
                      <p className={`${localGeorgia.className} text-base opacity-90`}>
                        {results.mbtiType.includes('T') ? 'Logical & Objective' : 'Values & Empathetic'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-10">
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#004E70] to-[#00A3CC] rounded-full mb-6 shadow-2xl">
                    <span className="text-white text-3xl">🎓</span>
                  </div>
                  <h3 className={`${localGeorama.className} text-4xl font-bold text-[#002A3C] mb-4`}>
                    Your Personalized Course Recommendations
                  </h3>
                  <p className={`${localGeorgia.className} text-xl text-[#666] max-w-3xl mx-auto leading-relaxed`}>
                    Carefully curated based on your <span className="font-bold text-[#004E70]">{results.mbtiType}</span> personality type and <span className="font-bold text-[#004E70]">{results.riasecCode}</span> career interests
                  </p>
                </div>

                {/* Course Path - Enhanced */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                      Course Recommendations
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className={`${localGeorgia.className} text-[#002A3C] text-lg leading-relaxed`}>
                      {results.coursePath.split(';').map((courseWithDescription, index) => {
                        const trimmed = courseWithDescription.trim();
                        if (!trimmed) return null;
                        
                        // Check if the course has a description (contains ":")
                        if (trimmed.includes(':')) {
                          const [courseName, description] = trimmed.split(':', 2);
                          return (
                            <div key={index} className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#004E70]">
                              <div className="flex items-start mb-2">
                                <span className="text-[#004E70] mr-3 mt-1 text-xl">•</span>
                                <div className="flex-1">
                                  <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg mb-1`}>
                                    {courseName.trim()}
                                  </h5>
                                  <p className={`${localGeorgia.className} text-[#666] text-base leading-relaxed`}>
                                    {description.trim()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          // Fallback for courses without descriptions (legacy format)
                          return (
                            <div key={index} className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#004E70]">
                              <div className="flex items-start mb-2">
                                <span className="text-[#004E70] mr-3 mt-1 text-xl">•</span>
                                <div className="flex-1">
                                  <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg mb-1`}>
                                    {trimmed}
                                  </h5>
                                  <p className={`${localGeorgia.className} text-[#666] text-base leading-relaxed`}>
                                    A comprehensive program designed to develop relevant skills and knowledge.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>

                {/* Career Opportunities - Full Width */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-yellow-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">💼</span>
                    </div>
                    <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                      Career Opportunities
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className={`${localGeorgia.className} text-[#002A3C]`}>
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

                        return (
                          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((entry, index) => {
                              const hasDesc = entry.includes(':');
                              const [nameRaw, descRaw] = hasDesc ? entry.split(':', 2) : [entry, ''];
                              const name = (nameRaw || '').trim();
                              const desc = (descRaw || '').trim() || getFallback(name);
                              return (
                                <div key={index} className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100 hover:shadow-xl transition-all">
                                  <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center justify-center mr-3 font-bold">
                                      {name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg mb-1 group-hover:text-[#004E70] transition-colors`}>{name}</h5>
                                      <p className={`${localGeorgia.className} text-[#666] text-sm leading-relaxed`}>{desc}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Study & Development Insights Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Study Tips */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">📚</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                        Study Strategies
                      </h4>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                        {results.studyTips}
                      </p>
                    </div>
                  </div>

                  {/* Personal Development Insights */}
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🌱</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                        Personal Development Insights
                      </h4>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                        {results.personalityGrowthTips}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Course Recommendations */}
                {results.courseRecommendations && results.courseRecommendations.length > 0 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#004E70] to-[#00A3CC] rounded-full mb-4 shadow-xl">
                        <span className="text-white text-2xl">🎓</span>
                      </div>
                      <h4 className={`${localGeorama.className} text-3xl font-bold text-[#002A3C] mb-2`}>
                        Detailed Course Recommendations
                      </h4>
                      <p className={`${localGeorgia.className} text-lg text-[#666]`}>
                        Top courses matched to your personality and interests
                      </p>
                    </div>
                    
                    <div className="grid gap-6">
                      {results.courseRecommendations.slice(0, 5).map((course, index) => (
                        <div key={course.id || index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#004E70] to-[#00A3CC] rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-bold">{index + 1}</span>
                                  </div>
                                  <h5 className={`${localGeorama.className} text-2xl font-bold text-[#002A3C] group-hover:text-[#004E70] transition-colors`}>
                                    {course.courseName}
                                  </h5>
                                </div>
                                <div className="flex items-center text-[#666] mb-4">
                                  <span className="text-lg">🏛️</span>
                                  <span className={`${localGeorgia.className} text-lg ml-2 font-medium`}>
                                    {course.university}
                                  </span>
                                  <span className="mx-3 text-gray-300">•</span>
                                  <span className="text-lg">⏱️</span>
                                  <span className={`${localGeorgia.className} text-lg ml-2 font-medium`}>
                                    {course.duration}
                                  </span>
                                  <span className="mx-3 text-gray-300">•</span>
                                  <span className="text-lg">📋</span>
                                  <span className={`${localGeorgia.className} text-lg ml-2 font-medium`}>
                                    {course.programType}
                                  </span>
                                </div>
                              </div>
                              {course.matchScore && (
                                <div className="flex flex-col items-center">
                                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                                    <span className={`${localGeorama.className} text-white text-xl font-bold`}>
                                      {Math.round(course.matchScore * 100)}%
                                    </span>
                                  </div>
                                  <span className={`${localGeorama.className} text-sm font-semibold text-green-600`}>
                                    Match Score
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed mb-6`}>
                              {course.courseDescription}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                <h6 className={`${localGeorama.className} font-bold text-[#004E70] mb-2 flex items-center`}>
                                  <span className="mr-2">💼</span>
                                  Career Options
                                </h6>
                                <p className={`${localGeorgia.className} text-[#002A3C] text-sm`}>
                                  {course.careerOptions}
                                </p>
                              </div>
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                                <h6 className={`${localGeorama.className} font-bold text-[#004E70] mb-2 flex items-center`}>
                                  <span className="mr-2">💰</span>
                                  Salary Range
                                </h6>
                                <p className={`${localGeorgia.className} text-[#002A3C] text-sm`}>
                                  {course.salaryRange}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#004E70] to-[#00A3CC] rounded-full mb-6 shadow-2xl">
                    <span className="text-white text-3xl">📊</span>
                  </div>
                  <h3 className={`${localGeorama.className} text-4xl font-bold text-[#002A3C] mb-4`}>
                    Detailed Scores & Analysis
                  </h3>
                  <p className={`${localGeorgia.className} text-xl text-[#666] max-w-3xl mx-auto leading-relaxed`}>
                    Comprehensive breakdown of your personality assessment results
                  </p>
                </div>

                {/* Test Information - Enhanced Design */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📅</span>
                    </div>
                    <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                      Test Information
                    </h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📅</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg`}>Test Date</h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] text-base`}>
                        {new Date(results.takenAt || results.generatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">👤</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg`}>Test Type</h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] text-base`}>
                        {isGuest ? 'Guest Test' : 'User Account Test'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personality Breakdown - Enhanced Design */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🧠</span>
                    </div>
                    <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                      Personality Type Breakdown
                    </h4>
                  </div>
                  
                  <div className="space-y-8">
                    {/* MBTI Dimensions */}
                    <div>
                      <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-6 text-xl`}>
                        MBTI Dimensions: {results.mbtiType}
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.mbtiType.split('').map((letter, index) => {
                          const dimensions = [
                            { E: 'Extraversion', I: 'Introversion', desc: 'Energy Source' },
                            { S: 'Sensing', N: 'Intuition', desc: 'Information Processing' },
                            { T: 'Thinking', F: 'Feeling', desc: 'Decision Making' },
                            { J: 'Judging', P: 'Perceiving', desc: 'Lifestyle Approach' }
                          ];
                          const dimension = dimensions[index];
                          const fullName = dimension[letter as keyof typeof dimension];
                          const description = dimension.desc;

                          return (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                              <div className="text-center">
                                <div className={`${localGeorama.className} font-bold text-[#004E70] text-3xl mb-2`}>
                                  {letter}
                                </div>
                                <h6 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg mb-1`}>
                                  {fullName}
                                </h6>
                                <p className={`${localGeorgia.className} text-sm text-gray-600`}>
                                  {description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIASEC Interests */}
                    <div>
                      <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-6 text-xl`}>
                        Career Interests: {results.riasecCode}
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {results.riasecCode.split('').map((code, index) => {
                          const interests = {
                            'R': { name: 'Realistic', desc: 'Hands-on, practical work', icon: '🔧', color: 'from-red-400 to-orange-500' },
                            'I': { name: 'Investigative', desc: 'Research and analysis', icon: '🔬', color: 'from-blue-400 to-cyan-500' },
                            'A': { name: 'Artistic', desc: 'Creative and expressive', icon: '🎨', color: 'from-purple-400 to-pink-500' },
                            'S': { name: 'Social', desc: 'Helping and teaching others', icon: '👥', color: 'from-green-400 to-emerald-500' },
                            'E': { name: 'Enterprising', desc: 'Leadership and business', icon: '💼', color: 'from-yellow-400 to-orange-500' },
                            'C': { name: 'Conventional', desc: 'Organized and detailed work', icon: '📊', color: 'from-indigo-400 to-blue-500' }
                          };
                          const interest = interests[code as keyof typeof interests];
                          const strength = (3 - index) * 25; // Higher strength for earlier letters

                          return (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                              <div className="text-center">
                                <div className="text-4xl mb-3">{interest.icon}</div>
                                <h6 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg mb-2`}>
                                  {interest.name}
                                </h6>
                                <p className={`${localGeorgia.className} text-sm text-gray-600 mb-4`}>
                                  {interest.desc}
                                </p>
                                <div className="relative">
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className={`bg-gradient-to-r ${interest.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                                      style={{width: `${strength}%`}}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Low</span>
                                    <span className="font-bold">{strength}%</span>
                                    <span>High</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

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
                            return Object.entries(goals).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-400">
                                <span className={`${localGeorama.className} font-bold text-[#002A3C] capitalize`}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className={`${localGeorgia.className} text-[#666] font-medium`}>
                                  {String(value)}
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
            )}

            {activeTab === 'mbti-details' && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#004E70] to-[#00A3CC] rounded-full mb-6 shadow-2xl">
                    <span className="text-white text-3xl">🔍</span>
                  </div>
                  <h3 className={`${localGeorama.className} text-4xl font-bold text-[#002A3C] mb-4`}>
                    Detailed MBTI Analysis
                  </h3>
                  <p className={`${localGeorgia.className} text-xl text-[#666] max-w-3xl mx-auto leading-relaxed`}>
                    In-depth insights into your {results.mbtiType} personality type, learning preferences, and growth opportunities.
                  </p>
                </div>

                {results.detailedMbtiInfo ? (
                  <div className="space-y-8">
                    {/* Learning Style Section - Enhanced Design */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-xl">📚</span>
                        </div>
                        <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                          Learning Style Analysis
                        </h4>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                            Learning Style Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                            {results.detailedMbtiInfo.learningStyleSummary}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                            Detailed Learning Preferences
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                            {results.detailedMbtiInfo.learningStyleDetails}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                              Optimal Learning Environments
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.learningStyleEnvironments}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                              Recommended Resources
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.learningStyleResources}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Study Tips Section - Enhanced Design */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-xl">💡</span>
                        </div>
                        <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                          Personalized Study Tips
                        </h4>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                            Study Tips Summary
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                            {results.detailedMbtiInfo.studyTipsSummary}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <h5 className={`${localGeorama.className} font-bold text-[#002A3C] mb-3 text-lg`}>
                            Detailed Study Strategies
                          </h5>
                          <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                            {results.detailedMbtiInfo.studyTipsDetails}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">✅</span>
                              Do's
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line`}>
                              {results.detailedMbtiInfo.studyTipsDos}
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-red-500">
                            <h5 className={`${localGeorama.className} font-bold text-red-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">❌</span>
                              Don'ts
                            </h5>
                            <div className={`${localGeorgia.className} text-[#666] leading-relaxed whitespace-pre-line`}>
                              {results.detailedMbtiInfo.studyTipsDonts}
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-yellow-500">
                            <h5 className={`${localGeorama.className} font-bold text-yellow-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">⚠️</span>
                              Common Mistakes
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.studyTipsCommonMistakes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Growth Section - Enhanced Design */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-xl">🌱</span>
                        </div>
                        <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70]`}>
                          Personal Growth Insights
                        </h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500">
                            <h5 className={`${localGeorama.className} font-bold text-green-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">💪</span>
                              Your Strengths
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.growthStrengths}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500">
                            <h5 className={`${localGeorama.className} font-bold text-blue-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">🎯</span>
                              Growth Opportunities
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.growthOpportunities}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-orange-500">
                            <h5 className={`${localGeorama.className} font-bold text-orange-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">⚡</span>
                              Areas to Develop
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.growthWeaknesses}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500">
                            <h5 className={`${localGeorama.className} font-bold text-purple-700 mb-3 text-lg flex items-center`}>
                              <span className="mr-2">🏆</span>
                              Growth Challenges
                            </h5>
                            <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                              {results.detailedMbtiInfo.growthChallenges}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Source Note - Enhanced Design */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 text-center shadow-lg border border-gray-100">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-2xl mr-2">✨</span>
                        <h5 className={`${localGeorama.className} font-bold text-[#002A3C] text-lg`}>
                          Enhanced Analysis
                        </h5>
                      </div>
                      <p className={`${localGeorgia.className} text-[#666] leading-relaxed`}>
                        This detailed information is based on comprehensive MBTI research 
                        and provides personalized insights for your <span className="font-bold text-[#004E70]">{results.mbtiType}</span> personality type.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-8 text-center shadow-xl border border-yellow-100">
                    <div className="text-6xl mb-6">🔍</div>
                    <h4 className={`${localGeorama.className} text-2xl font-bold text-[#004E70] mb-4`}>
                      Detailed Analysis Coming Soon
                    </h4>
                    <p className={`${localGeorgia.className} text-[#666] text-lg leading-relaxed max-w-2xl mx-auto`}>
                      We're working on providing you with detailed MBTI insights. In the meantime, 
                      check out your basic personality analysis in the Overview tab.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTestResults;
