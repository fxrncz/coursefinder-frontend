'use client';

import React from 'react';

// TypeScript interfaces matching backend DTOs
interface TraitScore {
  trait: string;
  percentage: number;
  label: string;
}

interface PersonalityMetrics {
  mbtiTraits: TraitScore[];
  riasecInterests: TraitScore[];
  averageTraitStrength: number;
}

interface CourseMatchAnalysis {
  courseName: string;
  courseDescription: string;
  humanMetricScore: number;
  aiMetricScore: number;
  combinedMatchScore: number;
  matchExplanation: string;
  confidenceLevel: string;
}

interface CareerMatchAnalysis {
  careerName: string;
  careerDescription: string;
  humanMetricScore: number;
  aiMetricScore: number;
  combinedMatchScore: number;
  matchExplanation: string;
  confidenceLevel: string;
}

interface OverallStatistics {
  averageCourseMatch: number;
  topCourseMatch: number;
  averageCareerMatch: number;
  topCareerMatch: number;
  overallConfidence: number;
  recommendationStrength: string;
}

interface AdvancedAnalyticsData {
  mbtiType: string;
  riasecCode: string;
  generatedAt: string;
  personalityMetrics: PersonalityMetrics;
  courseMatches: CourseMatchAnalysis[];
  careerMatches: CareerMatchAnalysis[];
  overallSynthesis: string;
  overallStatistics: OverallStatistics;
}

interface AdvancedAnalyticsProps {
  analytics: AdvancedAnalyticsData | null;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 text-center border-2 border-dashed border-purple-300">
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Advanced Analytics Processing
        </h3>
        <p className="text-gray-600">
          Your comprehensive personality + AI analysis is being generated. This combines your self-evaluation with cutting-edge AI insights.
        </p>
      </div>
    );
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'VERY_HIGH': return 'bg-green-100 text-green-800 border-green-300';
      case 'HIGH': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'VERY_HIGH': return '🎯';
      case 'HIGH': return '✨';
      case 'MODERATE': return '💡';
      case 'LOW': return '🔍';
      default: return '📊';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRecommendationBadge = (strength: string) => {
    const badges = {
      'EXCELLENT': { color: 'bg-green-500', icon: '🌟', text: 'Excellent Match' },
      'STRONG': { color: 'bg-blue-500', icon: '💪', text: 'Strong Match' },
      'GOOD': { color: 'bg-yellow-500', icon: '👍', text: 'Good Match' },
      'MODERATE': { color: 'bg-orange-500', icon: '📊', text: 'Moderate Match' }
    };
    return badges[strength as keyof typeof badges] || badges['MODERATE'];
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTEwIDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
              <span className="text-white text-4xl">🔬</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Advanced Analytics Dashboard
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-6">
              Comprehensive analysis combining your <span className="font-bold">{analytics.mbtiType}</span> personality traits 
              and <span className="font-bold">{analytics.riasecCode}</span> interests with cutting-edge AI insights
            </p>
            
            {/* Overall Statistics Badge */}
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${getRecommendationBadge(analytics.overallStatistics.recommendationStrength).color} text-white rounded-full font-bold text-sm shadow-lg`}>
                  <span>{getRecommendationBadge(analytics.overallStatistics.recommendationStrength).icon}</span>
                  <span>{getRecommendationBadge(analytics.overallStatistics.recommendationStrength).text}</span>
                </div>
                <p className="text-white/80 text-xs mt-2">Overall Confidence: {Math.round(analytics.overallStatistics.overallConfidence)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Metrics Overview */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Your Personality Metrics</h3>
            <p className="text-gray-600">Self-evaluation trait strengths from your test results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MBTI Traits */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              MBTI Personality Traits
            </h4>
            <div className="space-y-4">
              {analytics.personalityMetrics.mbtiTraits.map((trait, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      {trait.trait} - {trait.label}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(trait.percentage)}`}>
                      {Math.round(trait.percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgColor(trait.percentage)} transition-all duration-500 rounded-full`}
                      style={{ width: `${trait.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIASEC Interests */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              RIASEC Interest Areas
            </h4>
            <div className="space-y-4">
              {analytics.personalityMetrics.riasecInterests.map((interest, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      {interest.trait} - {interest.label}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(interest.percentage)}`}>
                      {Math.round(interest.percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgColor(interest.percentage)} transition-all duration-500 rounded-full`}
                      style={{ width: `${interest.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Average Trait Strength */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Average Trait Strength</span>
            <span className={`text-2xl font-bold ${getScoreColor(analytics.personalityMetrics.averageTraitStrength)}`}>
              {Math.round(analytics.personalityMetrics.averageTraitStrength)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This represents the overall strength of your personality profile based on your self-evaluation.
          </p>
        </div>
      </div>

      {/* Course Match Analysis */}
      {analytics.courseMatches && analytics.courseMatches.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📚</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Course Match Analysis</h3>
              <p className="text-gray-600">Combined human personality + AI analysis for each course</p>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Top Course Match</span>
                <span className={`text-2xl font-bold ${getScoreColor(analytics.overallStatistics.topCourseMatch)}`}>
                  {Math.round(analytics.overallStatistics.topCourseMatch)}%
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Average Course Match</span>
                <span className={`text-2xl font-bold ${getScoreColor(analytics.overallStatistics.averageCourseMatch)}`}>
                  {Math.round(analytics.overallStatistics.averageCourseMatch)}%
                </span>
              </div>
            </div>
          </div>

          {/* Course Cards */}
          <div className="space-y-6">
            {analytics.courseMatches.slice(0, 6).map((course, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                      <h4 className="text-xl font-bold text-gray-800">{course.courseName}</h4>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getConfidenceColor(course.confidenceLevel)}`}>
                      <span>{getConfidenceIcon(course.confidenceLevel)}</span>
                      <span>{course.confidenceLevel.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getScoreColor(course.combinedMatchScore)}`}>
                      {Math.round(course.combinedMatchScore)}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Combined Match</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">👤 Human Metrics</span>
                      <span className={`text-xl font-bold ${getScoreColor(course.humanMetricScore)}`}>
                        {Math.round(course.humanMetricScore)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBgColor(course.humanMetricScore)} rounded-full transition-all duration-500`}
                        style={{ width: `${course.humanMetricScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on your personality traits</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">🤖 AI Analysis</span>
                      <span className={`text-xl font-bold ${getScoreColor(course.aiMetricScore)}`}>
                        {Math.round(course.aiMetricScore)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBgColor(course.aiMetricScore)} rounded-full transition-all duration-500`}
                        style={{ width: `${course.aiMetricScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">AI-powered evaluation</p>
                  </div>
                </div>

                {/* Match Explanation */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-blue-700">💡 Analysis: </span>
                    {course.matchExplanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Match Analysis */}
      {analytics.careerMatches && analytics.careerMatches.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">💼</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Career Match Analysis</h3>
              <p className="text-gray-600">Combined human personality + AI analysis for each career</p>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Top Career Match</span>
                <span className={`text-2xl font-bold ${getScoreColor(analytics.overallStatistics.topCareerMatch)}`}>
                  {Math.round(analytics.overallStatistics.topCareerMatch)}%
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Average Career Match</span>
                <span className={`text-2xl font-bold ${getScoreColor(analytics.overallStatistics.averageCareerMatch)}`}>
                  {Math.round(analytics.overallStatistics.averageCareerMatch)}%
                </span>
              </div>
            </div>
          </div>

          {/* Career Cards */}
          <div className="space-y-6">
            {analytics.careerMatches.slice(0, 6).map((career, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-green-600">#{index + 1}</span>
                      <h4 className="text-xl font-bold text-gray-800">{career.careerName}</h4>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getConfidenceColor(career.confidenceLevel)}`}>
                      <span>{getConfidenceIcon(career.confidenceLevel)}</span>
                      <span>{career.confidenceLevel.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getScoreColor(career.combinedMatchScore)}`}>
                      {Math.round(career.combinedMatchScore)}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Combined Match</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">👤 Human Metrics</span>
                      <span className={`text-xl font-bold ${getScoreColor(career.humanMetricScore)}`}>
                        {Math.round(career.humanMetricScore)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBgColor(career.humanMetricScore)} rounded-full transition-all duration-500`}
                        style={{ width: `${career.humanMetricScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on your personality traits</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">🤖 AI Analysis</span>
                      <span className={`text-xl font-bold ${getScoreColor(career.aiMetricScore)}`}>
                        {Math.round(career.aiMetricScore)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBgColor(career.aiMetricScore)} rounded-full transition-all duration-500`}
                        style={{ width: `${career.aiMetricScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">AI-powered evaluation</p>
                  </div>
                </div>

                {/* Match Explanation */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-green-700">💡 Analysis: </span>
                    {career.matchExplanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology Explanation */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border-2 border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📖</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">How This Works</h3>
            <p className="text-gray-600">Understanding your advanced analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">👤</div>
            <h4 className="font-bold text-gray-800 mb-2">Human Metrics (40%)</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your personality trait percentages from self-evaluation are matched against course/career requirements using established psychological frameworks.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">🤖</div>
            <h4 className="font-bold text-gray-800 mb-2">AI Analysis (60%)</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced AI models from Hugging Face analyze your profile and provide intelligent recommendations based on patterns and market insights.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-bold text-gray-800 mb-2">Combined Score</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              The final match score combines both approaches, giving you the most accurate and comprehensive career guidance possible.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-700">💡 Note: </span>
            This advanced analytics system represents the cutting edge of career guidance technology, combining traditional psychological assessment with modern AI capabilities to provide you with the most accurate recommendations possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;

