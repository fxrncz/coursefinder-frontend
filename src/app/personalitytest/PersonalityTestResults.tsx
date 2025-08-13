import React, { useState, useEffect } from 'react';
import { localGeorama, localGeorgia } from '../fonts';

interface PersonalityTestResultsProps {
  userId?: number;
  sessionId?: string | null;
  isGuest?: boolean;
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

const PersonalityTestResults: React.FC<PersonalityTestResultsProps> = ({ userId, sessionId, isGuest = false }) => {
  const [results, setResults] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'details'>('overview');

  useEffect(() => {
    fetchResults();
  }, [userId, sessionId, isGuest]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      let response;

      if (isGuest && sessionId) {
        // Fetch results by session ID for guest users
        response = await fetch(`http://localhost:8080/api/personality-test/result/session/${sessionId}`);
      } else if (userId) {
        // Fetch results by user ID for authenticated users
        response = await fetch(`http://localhost:8080/api/personality-test/result/user/${userId}`);
      } else {
        throw new Error('No user ID or session ID provided');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setResults(data.result);
      } else {
        setError(data.message || 'Failed to load results');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getMBTIDescription = (type: string) => {
    const descriptions: { [key: string]: string } = {
      'INTJ': 'The Architect - Strategic and independent thinkers',
      'INTP': 'The Thinker - Innovative and logical problem-solvers',
      'ENTJ': 'The Commander - Bold and strong-willed leaders',
      'ENTP': 'The Debater - Smart and curious innovators',
      'INFJ': 'The Advocate - Creative and insightful idealists',
      'INFP': 'The Mediator - Poetic and kind-hearted altruists',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leaders',
      'ENFP': 'The Campaigner - Enthusiastic and creative free spirits',
      'ISTJ': 'The Logistician - Practical and fact-minded organizers',
      'ISFJ': 'The Protector - Warm-hearted and dedicated caregivers',
      'ESTJ': 'The Executive - Excellent administrators and managers',
      'ESFJ': 'The Consul - Extraordinarily caring and social people',
      'ISTP': 'The Virtuoso - Bold and practical experimenters',
      'ISFP': 'The Adventurer - Flexible and charming artists',
      'ESTP': 'The Entrepreneur - Smart and energetic problem-solvers',
      'ESFP': 'The Entertainer - Spontaneous and enthusiastic performers'
    };
    return descriptions[type] || 'Unique personality type';
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

  return (
    <div className="w-full bg-[#FFF4E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className={`${localGeorama.className} text-[#002A3C] text-4xl font-bold text-center mb-4`}>
            Your Personality Profile
          </h1>
          <div className="text-center">
            <div className="inline-flex items-center space-x-8">
              <div className="text-center">
                <div className={`${localGeorama.className} text-3xl font-bold text-[#004E70] mb-2`}>
                  {results.mbtiType}
                </div>
                <p className={`${localGeorgia.className} text-[#002A3C] text-sm`}>
                  {getMBTIDescription(results.mbtiType)}
                </p>
              </div>
              <div className="w-px h-16 bg-gray-300"></div>
              <div className="text-center">
                <div className={`${localGeorama.className} text-3xl font-bold text-[#004E70] mb-2`}>
                  {results.riasecCode}
                </div>
                <p className={`${localGeorgia.className} text-[#002A3C] text-sm`}>
                  {getRIASECDescription(results.riasecCode)}
                </p>
              </div>
            </div>
          </div>

          {isGuest && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className={`${localGeorgia.className} text-[#002A3C] text-sm`}>
                💡 <strong>Guest Results:</strong> Create an account to save your results permanently and access them anytime!
              </p>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="flex border-b">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'courses', label: 'Course Recommendations' },
              { key: 'details', label: 'Detailed Scores' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${localGeorama.className} px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#004E70] border-b-2 border-[#004E70] bg-blue-50'
                    : 'text-gray-600 hover:text-[#004E70]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-4`}>
                    Your Personality Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                        MBTI Type: {results.mbtiType}
                      </h4>
                      <p className={`${localGeorgia.className} text-[#002A3C] text-sm leading-relaxed`}>
                        {getMBTIDescription(results.mbtiType)}
                      </p>
                      <div className="mt-4 space-y-2">
                        {results.mbtiType.split('').map((letter, index) => {
                          const dimensions = ['E/I', 'S/N', 'T/F', 'J/P'];
                          const fullNames = {
                            'E': 'Extraversion', 'I': 'Introversion',
                            'S': 'Sensing', 'N': 'Intuition',
                            'T': 'Thinking', 'F': 'Feeling',
                            'J': 'Judging', 'P': 'Perceiving'
                          };
                          return (
                            <div key={index} className="flex justify-between">
                              <span className={`${localGeorgia.className} text-sm`}>
                                {fullNames[letter as keyof typeof fullNames]}
                              </span>
                              <span className={`${localGeorama.className} font-semibold`}>
                                {letter}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                        RIASEC Profile: {results.riasecCode}
                      </h4>
                      <p className={`${localGeorgia.className} text-[#002A3C] text-sm leading-relaxed mb-4`}>
                        {getRIASECDescription(results.riasecCode)}
                      </p>
                      <div className="space-y-2">
                        {results.riasecCode.split('').map((code, index) => {
                          const descriptions = {
                            'R': 'Realistic - Hands-on, practical work',
                            'I': 'Investigative - Research and analysis',
                            'A': 'Artistic - Creative and expressive',
                            'S': 'Social - Helping and teaching others',
                            'E': 'Enterprising - Leadership and business',
                            'C': 'Conventional - Organized and detailed work'
                          };
                          return (
                            <div key={index} className="flex justify-between items-center">
                              <span className={`${localGeorgia.className} text-sm`}>
                                {descriptions[code as keyof typeof descriptions]}
                              </span>
                              <span className={`${localGeorama.className} font-bold text-[#004E70]`}>
                                #{index + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                      Learning Style
                    </h4>
                    <p className={`${localGeorgia.className} text-[#002A3C] text-sm leading-relaxed`}>
                      {results.learningStyle}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                      Student Goals
                    </h4>
                    <p className={`${localGeorgia.className} text-[#002A3C] text-sm leading-relaxed`}>
                      {results.studentGoals ? JSON.parse(results.studentGoals).priority || 'Not specified' : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-8">
                <div>
                  <h3 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-4`}>
                    Recommended Courses for You
                  </h3>
                  <p className={`${localGeorgia.className} text-[#002A3C] mb-6`}>
                    Based on your {results.mbtiType} personality type and {results.riasecCode} interests
                  </p>
                </div>

                {/* Course Path */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-l-4 border-[#004E70]">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                    🎯 Recommended Course Path
                  </h4>
                  <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                    {results.coursePath}
                  </p>
                </div>

                {/* Career Suggestions */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                    💼 Career Suggestions
                  </h4>
                  <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                    {results.careerSuggestions}
                  </p>
                </div>

                {/* Study Tips */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                    📚 Study Tips for Your Personality Type
                  </h4>
                  <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                    {results.studyTips}
                  </p>
                </div>

                {/* Personality Growth Tips */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-3`}>
                    🌱 Personality Growth Tips
                  </h4>
                  <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed`}>
                    {results.personalityGrowthTips}
                  </p>
                </div>

                {/* Course Recommendations from Database */}
                {results.courseRecommendations && results.courseRecommendations.length > 0 && (
                  <div>
                    <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-4`}>
                      🎓 Detailed Course Recommendations
                    </h4>
                    <div className="grid gap-4">
                      {results.courseRecommendations.slice(0, 5).map((course, index) => (
                        <div key={course.id || index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className={`${localGeorama.className} font-semibold text-[#002A3C]`}>
                              {course.courseName}
                            </h5>
                            {course.matchScore && (
                              <span className={`${localGeorama.className} text-[#004E70] text-sm font-semibold`}>
                                {Math.round(course.matchScore * 100)}% Match
                              </span>
                            )}
                          </div>
                          <p className={`${localGeorgia.className} text-[#002A3C] text-sm mb-2`}>
                            {course.university} • {course.duration}
                          </p>
                          <p className={`${localGeorgia.className} text-gray-600 text-sm`}>
                            {course.courseDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`${localGeorama.className} text-xl font-bold text-[#002A3C] mb-4`}>
                    Test Details & Information
                  </h3>
                </div>

                {/* Test Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-4`}>
                    Test Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className={`${localGeorama.className} font-semibold`}>Test Date: </span>
                      <span className={`${localGeorgia.className}`}>
                        {new Date(results.takenAt || results.generatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className={`${localGeorama.className} font-semibold`}>Session ID: </span>
                      <span className={`${localGeorgia.className} text-sm font-mono`}>
                        {results.sessionId}
                      </span>
                    </div>
                    <div>
                      <span className={`${localGeorama.className} font-semibold`}>Test Type: </span>
                      <span className={`${localGeorgia.className}`}>
                        {isGuest ? 'Guest Test' : 'User Account Test'}
                      </span>
                    </div>
                    <div>
                      <span className={`${localGeorama.className} font-semibold`}>Result ID: </span>
                      <span className={`${localGeorgia.className}`}>#{results.id}</span>
                    </div>
                  </div>
                </div>

                {/* Personality Breakdown */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-4`}>
                    Personality Type Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className={`${localGeorama.className} font-semibold text-[#002A3C] mb-2`}>
                        MBTI Type: {results.mbtiType}
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {results.mbtiType.split('').map((letter, index) => {
                          const dimensions = [
                            { E: 'Extraversion', I: 'Introversion' },
                            { S: 'Sensing', N: 'Intuition' },
                            { T: 'Thinking', F: 'Feeling' },
                            { J: 'Judging', P: 'Perceiving' }
                          ];
                          const dimension = dimensions[index];
                          const fullName = dimension[letter as keyof typeof dimension];

                          return (
                            <div key={index} className="bg-white p-3 rounded text-center">
                              <div className={`${localGeorama.className} font-bold text-[#004E70] text-lg`}>
                                {letter}
                              </div>
                              <div className={`${localGeorgia.className} text-xs text-gray-600`}>
                                {fullName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h5 className={`${localGeorama.className} font-semibold text-[#002A3C] mb-2`}>
                        RIASEC Code: {results.riasecCode}
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        {results.riasecCode.split('').map((code, index) => {
                          const descriptions = {
                            'R': 'Realistic',
                            'I': 'Investigative',
                            'A': 'Artistic',
                            'S': 'Social',
                            'E': 'Enterprising',
                            'C': 'Conventional'
                          };

                          return (
                            <div key={index} className="bg-white p-3 rounded">
                              <div className={`${localGeorama.className} font-bold text-[#004E70]`}>
                                {code} - {descriptions[code as keyof typeof descriptions]}
                              </div>
                              <div className={`${localGeorgia.className} text-sm text-gray-600`}>
                                Priority #{index + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Goals */}
                {results.studentGoals && results.studentGoals !== '{}' && (
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className={`${localGeorama.className} font-bold text-[#004E70] mb-4`}>
                      Your Goals & Preferences
                    </h4>
                    <div className="space-y-2">
                      {(() => {
                        try {
                          const goals = JSON.parse(results.studentGoals);
                          return Object.entries(goals).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className={`${localGeorama.className} font-semibold capitalize`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className={`${localGeorgia.className}`}>
                                {String(value)}
                              </span>
                            </div>
                          ));
                        } catch {
                          return (
                            <p className={`${localGeorgia.className} text-gray-600`}>
                              Goal information not available
                            </p>
                          );
                        }
                      })()}
                    </div>
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
