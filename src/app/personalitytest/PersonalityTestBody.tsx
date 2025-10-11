import React from "react";
import { localGeorama, localGeorgia } from "../fonts";

const PersonalityTestBody = () => {
  return (
    <div className="w-full">
      {/* Hero Section - Teal Background */}
      <div className="bg-[#004E70] min-h-[400px] flex items-center justify-center px-8 py-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
          {/* Left Text Content */}
          <div className="flex-1 max-w-9xl">
            <h1 className={`text-white text-5xl font-serif leading-tight mb-4`}>
              THE COURSEFIT PERSONALITY PROFILER
            </h1>
            <div className="w-80 h-0.5 bg-white mb-6"></div>
            <p className={`${localGeorama.className} text-white text-lg leading-relaxed`}>
              Based on Holland Code and Jungian Typology—
              Discover your true potential.
            </p>
          </div>
          
          {/* Right Illustration */}
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <img 
                src="/personality_img.png" 
                alt="Personality Test Illustration" 
                className="w-100 h-100 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Beige Background */}
      <div className="bg-[#FFF4E6] py-10 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Descriptive Text */}
          <p className={`${localGeorgia.className} text-[#002A3C] text-base leading-relaxed mb-8 text-center`}>
            Take this free personality test to uncover your true self. Explore college courses and future careers that match your personality, based on Dr. Carl Jung's Typology and the Holland Code (RIASEC). Identify your personality type and discover your strengths.
          </p>
          
            {/* Separator Line with Circles on Ends */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-180 h-0.5 bg-[#1e4d6b] relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#1e4d6b] rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#1e4d6b] rounded-full"></div>
              </div>
            </div>
          
          {/* Instructions */}
          <p className={`${localGeorama.className} text-[#002A3C] text-lg font-semibold text-center leading-relaxed`}>
            TO BEGIN THE PERSONALITY TEST, SELECT THE RESPONSE THAT BEST REFLECTS HOW ACCURATELY EACH STATEMENT DESCRIBES YOU.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTestBody; 