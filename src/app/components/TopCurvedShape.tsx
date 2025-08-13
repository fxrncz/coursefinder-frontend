"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import { localGeorgia } from "../fonts";

const width = 1440;
const height = 690;

const TopCurvedShape = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/personalitytest');
  };

  return (
  <div className="w-full relative mb-80 sm:mb-12 md:mb-16 lg:mb-20">
    {/* Mobile Background - Full Coverage */}
    <div className="block sm:hidden absolute inset-0 bg-[#FFF1DD] -z-10" style={{height: 'calc(100% + 20rem)'}}></div>

    <svg
      className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[579px]"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Desktop/Tablet Background Shape */}
      <polygon
        points={`0,0 ${width * .45},120 ${width * 0.75},40 ${width},160 ${width},${height} ${width * 0.96},${height - (-100)} ${width * 0.28},${height - 100} 0,${height * 1}`}
        fill="#FFF1DD"
        className="hidden sm:block"
      />
    </svg>
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-16 md:pt-20 lg:pt-35 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-8">
        {/* Left: Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
          <div className={`uppercase text-[#502D00] text-sm sm:text-base lg:text-lg mb-1 tracking-wide ${localGeorama.className}`}>Course Matching</div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2 sm:mb-3 ${localGotham.className}`}>Discover your path</h2>
          <p className={`text-sm sm:text-base lg:text-lg text-[#2D2D2D] mb-4 sm:mb-6 leading-relaxed max-w-lg ${localGeorgia.className}`}>
            In our free evaluation, you'll uncover what truly motivates you, where your strengths shine, and which courses align with your goals—helping you make more confident and meaningful decisions for your future.
          </p>
          <button
            onClick={handleGetStarted}
            className={`border border-black px-6 sm:px-8 py-2 font-bold uppercase text-sm sm:text-base lg:text-lg bg-[#FFEFDA] text-black hover:bg-[#A75F00] hover:text-white hover:border-[#A75F00] transition-colors ${localGeorama.className}`}
          >
            Get Started
          </button>
        </div>
        {/* Right: Polygon Shape */}
        <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[650px] flex justify-center lg:justify-end mt-8 sm:-mt-16 md:-mt-20 lg:-mt-24 -mr-0 lg:-mr-20 relative">
          <svg
            viewBox="-20 -20 410 410"
            className="w-full h-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[550px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Circle in top-left corner */}
            <circle
              cx="-15"
              cy="90"
              r="5"
              fill="#502D00"
            />

            <circle
              cx="0"
              cy="75"
              r="4"
              fill="#502D00"
            />

            <circle
               cx="-13"
               cy="110"
               r="3"
               fill="#502D00"
              />

             {/* Circle in bottom-right corner */}
             <circle
               cx="370"
               cy="270"
               r="5"
               fill="#502D00"
             />

              <circle
               cx="378"
               cy="250"
               r="4"
               fill="#502D00"
             />

             <circle
               cx="350"
               cy="290"
               r="3"
               fill="#502D00"
             />

            <g transform="translate(6,-9)">
              <polygon
                points="350,60 350,250 165,340 10,270 10,90 175,10"
                stroke="#000"
                strokeWidth=".5"
              />
            </g>

            <g transform="translate(12,-18)">
              <polygon
                points="350,60 350,250 165,340 10,270 10,90 175,10"
                stroke="#000"
                strokeWidth=".5"
              />
            </g>

            <g transform="translate(-6,9)">
              <polygon
                points="350,60 350,250 165,340 10,270 10,90 175,10"
                stroke="#000"
                strokeWidth=".5"
              />
            </g>

            <g transform="translate(-12,18)">
              <polygon
                points="350,60 350,250 165,340 10,270 10,90 175,10"
                stroke="#000"
                strokeWidth=".5"
              />
            </g>
            
            <polygon
              points="350,60 350,250 165,340 10,270 10,90 175,10"
              fill="#fff"
            />
          </svg>

          {/* Team Brainstorming Image positioned inside the polygon */}
          <div className="absolute inset-0 flex items-center justify-center -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16">
            <div className="w-[280px] h-[280px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[390px] lg:h-[390px] relative">
              <Image
                src="/teambrainstorming.png"
                alt="Team Brainstorming"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
  );
};

export default TopCurvedShape;