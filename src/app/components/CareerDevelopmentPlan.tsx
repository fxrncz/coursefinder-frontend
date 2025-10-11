'use client';

import React, { useState } from 'react';
import { localGeorama } from '../fonts';

// Types for Career Development Plan from backend
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

interface CareerDevelopmentPlanData {
  mbtiType: string;
  riasecCode: string;
  careerDetails: CareerDetails[];
}

// Types for Course Development Plan
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

interface CourseDevelopmentPlanData {
  mbtiType: string;
  riasecCode: string;
  courseDetails: CourseDetails[];
}

interface CareerDevelopmentPlanProps {
  careerDevelopmentPlan?: CareerDevelopmentPlanData;
  courseDevelopmentPlan?: CourseDevelopmentPlanData;
  mbtiType?: string;
  riasecCode?: string;
}

// Helper Components
function ModernBadge({ label, gradient, icon }: { label: string; gradient: string; icon: string }) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${gradient} rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <span className="text-sm sm:text-base">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

function CareerCard({ 
  career, 
  isHovered, 
  onHover, 
  cardId 
}: { 
  career: CareerDetails; 
  isHovered: boolean;
  onHover: (id: string | null) => void;
  cardId: string;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getCareerIcon = (careerName: string) => {
    if (careerName.includes('Software') || careerName.includes('Developer')) return '💻';
    if (careerName.includes('Guidance') || careerName.includes('Counselor')) return '🎯';
    if (careerName.includes('Social Media')) return '📱';
    if (careerName.includes('Data')) return '📊';
    if (careerName.includes('Graphic') || careerName.includes('Design')) return '🎨';
    if (careerName.includes('Digital Marketing') || careerName.includes('Marketing')) return '📈';
    if (careerName.includes('Teacher') || careerName.includes('Education')) return '📚';
    if (careerName.includes('Nurse') || careerName.includes('Health')) return '🏥';
    if (careerName.includes('Engineer')) return '⚙️';
    if (careerName.includes('Manager') || careerName.includes('Management')) return '👥';
    return '💼';
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105' : 'hover:scale-102'
      }`}
      onMouseEnter={() => onHover(cardId)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative backdrop-blur-sm bg-white/90 rounded-xl sm:rounded-2xl border border-white/60 shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 h-full">
        {/* Header */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0">
            <span className="text-2xl sm:text-3xl">{getCareerIcon(career.careerName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight`}>
              {career.careerName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.description}</p>
          </div>
        </div>

        {/* Career Profile Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm">🎯</span>
              <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Career Fit</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-green-800 leading-tight">{career.careerFit}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm">📚</span>
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Education Level</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-blue-800 leading-tight">{career.educationLevel}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm">💼</span>
              <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Work Environment</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-purple-800 leading-tight">{career.workEnvironment}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm">🚀</span>
              <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Career Path</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-orange-800 leading-tight">{career.careerPath}</div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3 sm:space-y-4">
          {/* Introduction */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('introduction')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">📖 Introduction</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('introduction') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('introduction') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.introduction}</p>
              </div>
            )}
          </div>

          {/* Key Skills */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('skills')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🎯 Key Skills to Focus On</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('skills') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('skills') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.keySkills}</p>
              </div>
            )}
          </div>

          {/* Academic Activities */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('activities')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🏆 Academic & Extracurricular Activities</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('activities') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('activities') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.academicsActivities}</p>
              </div>
            )}
          </div>


          {/* Soft Skills */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('soft-skills')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">💪 Soft Skills & Habits to Develop</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('soft-skills') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('soft-skills') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.softSkills}</p>
              </div>
            )}
          </div>

          {/* Growth Opportunities */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('growth')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🚀 Growth Opportunities & Career Pathways</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('growth') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('growth') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{career.growthOpportunities}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Course Card Component (similar to Career Card but without career info stats)
function CourseCard({ 
  course, 
  isHovered, 
  onHover, 
  cardId 
}: { 
  course: CourseDetails; 
  isHovered: boolean;
  onHover: (id: string | null) => void;
  cardId: string;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getCourseIcon = (courseName: string) => {
    if (courseName.includes('STEM') || courseName.includes('Science')) return '🔬';
    if (courseName.includes('ABM') || courseName.includes('Business')) return '💼';
    if (courseName.includes('HUMSS') || courseName.includes('Social')) return '📚';
    if (courseName.includes('ICT') || courseName.includes('Computer')) return '💻';
    if (courseName.includes('Arts') || courseName.includes('Design')) return '🎨';
    if (courseName.includes('TVL') || courseName.includes('Technical')) return '⚙️';
    if (courseName.includes('GAS') || courseName.includes('Academic')) return '🎓';
    if (courseName.includes('Sports')) return '⚽';
    return '📖';
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105' : 'hover:scale-102'
      }`}
      onMouseEnter={() => onHover(cardId)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative backdrop-blur-sm bg-white/90 rounded-xl sm:rounded-2xl border border-white/60 shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 h-full">
        {/* Header */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 flex-shrink-0">
            <span className="text-2xl sm:text-3xl">{getCourseIcon(course.courseName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight`}>
              {course.courseName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Expandable Sections - 7 sections */}
        <div className="space-y-3 sm:space-y-4">
          {/* Course Overview (Introduction equivalent) */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('overview')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">📖 Course Overview</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('overview') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('overview') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.courseOverview}</p>
              </div>
            )}
          </div>

          {/* Core Competencies (Key Skills equivalent) */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('competencies')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🎯 Core Competencies</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('competencies') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('competencies') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.coreCompetencies}</p>
              </div>
            )}
          </div>

          {/* Academic & Extracurricular Activities */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('acads-extra')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🏆 Academic & Extracurricular Activities</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('acads-extra') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('acads-extra') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.acadsExtra}</p>
              </div>
            )}
          </div>

          {/* Subjects to Master (Certifications equivalent) */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('subjects')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🎓 Subjects to Master</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('subjects') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('subjects') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.subjMaster}</p>
              </div>
            )}
          </div>

          {/* Soft Skills */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('soft-skills')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">💪 Soft Skills & Habits to Develop</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('soft-skills') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('soft-skills') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.softSkills}</p>
              </div>
            )}
          </div>

          {/* Career Readiness */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('career-readiness')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🎯 Career Readiness</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('career-readiness') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('career-readiness') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.careerReadiness}</p>
              </div>
            )}
          </div>

          {/* Growth Opportunities */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('growth')}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">🚀 Growth Opportunities & Career Pathways</h4>
              <span className={`text-base sm:text-lg transition-transform ${expandedSections.has('growth') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSections.has('growth') && (
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{course.growth}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function CareerDevelopmentPlan({ careerDevelopmentPlan, courseDevelopmentPlan, mbtiType, riasecCode }: CareerDevelopmentPlanProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Use provided data or fallback values
  const planData = careerDevelopmentPlan || {
    mbtiType: mbtiType || 'ENFP',
    riasecCode: riasecCode || 'AS',
    careerDetails: []
  };

  const coursePlanData = courseDevelopmentPlan || {
    mbtiType: mbtiType || 'ENFP',
    riasecCode: riasecCode || 'AS',
    courseDetails: []
  };

  console.log('CareerDevelopmentPlan received data:', planData);
  console.log('CourseDevelopmentPlan received data:', coursePlanData);

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
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className={`${localGeorama.className} text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-4`}>
                  Development Plan
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                🎯 Your personalized roadmap of actions to take while still in Senior High School! This isn't just career recommendations—it's your step-by-step guide to success.
              </p>
              
              {/* Personality Badges */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 px-4">
                <ModernBadge gradient="from-blue-500 to-cyan-500" label={`MBTI: ${planData.mbtiType}`} icon="🧠" />
                <ModernBadge gradient="from-purple-500 to-pink-500" label={`RIASEC: ${planData.riasecCode}`} icon="🎨" />
                <ModernBadge gradient="from-green-500 to-teal-500" label={`${planData.careerDetails.length} Career${planData.careerDetails.length !== 1 ? 's' : ''} Matched`} icon="👥" />
                <ModernBadge gradient="from-emerald-500 to-green-500" label={`${coursePlanData.courseDetails.length} Course${coursePlanData.courseDetails.length !== 1 ? 's' : ''} Matched`} icon="📚" />
              </div>
            </div>
          </div>
        </div>

        {/* Career Suggestions Section - Full Width */}
        <div className="relative bg-gradient-to-b from-transparent to-gray-50/50 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">

          {/* Career Cards Grid - Responsive layout */}
          <div className="w-full max-w-7xl mx-auto">
            {planData.careerDetails.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {planData.careerDetails.map((career, index) => (
                <CareerCard 
                  key={index}
                  career={career}
                  isHovered={hoveredCard === `career-${index}`}
                  onHover={setHoveredCard}
                  cardId={`career-${index}`}
                />
              ))}
            </div>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                <h3 className={`${localGeorama.className} text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4`}>
                  Loading Your Career Plan...
            </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  We're preparing your personalized career development plan based on your personality profile. 
                  This may take a moment as we match you with the best career opportunities.
                </p>
            </div>
            )}
          </div>
        </div>

        {/* Development Plan Disclaimer */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-amber-800 mb-3`}>
                  Important Disclaimer
                </h3>
                <div className={`${localGeorama.className} text-sm sm:text-base text-amber-700 leading-relaxed space-y-3`}>
                  <p>
                    The career and course development plans presented here are <strong>interpretive guidance</strong> based on your personality assessment results. While we strive to provide accurate and helpful information, please understand that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Some information may be <strong>inaccurate or outdated</strong> due to the rapidly evolving nature of careers and educational programs</li>
                    <li>These recommendations are <strong>general guidelines</strong> and may not perfectly match your unique circumstances, interests, or local opportunities</li>
                    <li>Career and course information can vary significantly by <strong>location, institution, and industry trends</strong></li>
                    <li>Individual success depends on many factors beyond personality type, including <strong>effort, opportunity, and personal circumstances</strong></li>
                  </ul>
                  <p className="font-semibold text-amber-800">
                    We strongly encourage you to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Research independently</strong> to verify and supplement the information provided</li>
                    <li><strong>Consult with career counselors, academic advisors, or industry professionals</strong> for personalized guidance</li>
                    <li><strong>Explore multiple sources</strong> to get a comprehensive understanding of your options</li>
                    <li><strong>Consider this as a starting point</strong> for your career exploration journey</li>
                  </ul>
                  <p className="italic text-amber-700">
                    Remember: This development plan is designed to inspire and guide your exploration, not to limit your possibilities. Your future is ultimately shaped by your choices, efforts, and opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Suggestions Section - Full Width */}
        <div className="relative bg-gradient-to-b from-gray-50/50 to-transparent py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
          
          {/* Section Header */}
          <div className="text-center max-w-6xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className={`${localGeorama.className} text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-4`}>
                Recommended Courses
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              📚 Based on your personality and interests, here are the courses that align with your strengths and career goals!
            </p>
          </div>

          {/* Course Cards Grid - Responsive layout */}
          <div className="w-full max-w-7xl mx-auto">
            {coursePlanData.courseDetails.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {coursePlanData.courseDetails.map((course, index) => (
                  <CourseCard 
                    key={index}
                    course={course}
                    isHovered={hoveredCard === `course-${index}`}
                    onHover={setHoveredCard}
                    cardId={`course-${index}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">📚</div>
                <h3 className={`${localGeorama.className} text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4`}>
                  Loading Your Course Plan...
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  We're preparing your personalized course development plan based on your personality profile.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}