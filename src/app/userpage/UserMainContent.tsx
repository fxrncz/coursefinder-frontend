"use client";

import React from "react";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";

interface UserMainContentProps {
  userData: any;
}

const UserMainContent: React.FC<UserMainContentProps> = ({ userData }) => {

  return (
    <div className="flex w-full">
      {/* Single row with all rectangles aligned and responsive gaps */}
      <div className="flex w-full h-55 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
        {/* Left End Rectangle */}
        <div className="w-8 sm:w-16 md:w-24 lg:w-32 xl:w-40 h-55 bg-[#A75F00] flex-shrink-0"></div>
        
        {/* Left Side Rectangle */}
        <div className="w-8 sm:w-12 md:w-16 lg:w-20 xl:w-25 h-55 bg-[#A75F00] hidden sm:block"></div>
        
        {/* Main Content */}
        <div className="flex-1 h-55 bg-[#A75F00] flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`${localGeorama.className} text-white`}>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light">Welcome, </span>
              <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${localGeorgia.className}`}>{userData?.username || 'User'}</span>
            </h1>
          </div>
        </div>
        
        {/* Right Side Rectangle */}
        <div className="w-8 sm:w-12 md:w-16 lg:w-20 xl:w-25 h-55 bg-[#A75F00] hidden sm:block"></div>
        
        {/* Right End Rectangle */}
        <div className="w-8 sm:w-16 md:w-24 lg:w-32 xl:w-40 h-55 bg-[#A75F00] flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default UserMainContent; 