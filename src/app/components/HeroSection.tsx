import React from "react";
import Image from "next/image";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import { localGeorgia } from "../fonts";

const HeroSection = () => (
  <section className="w-full bg-[#A75F00] py-12 px-4 md:px-6 lg:px-8 xl:px-12">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left: Text */}
      <div className="text-white w-full md:w-auto md:flex-1 lg:flex-[0.6] xl:flex-[0.55] text-center md:text-left px-0 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
          <span className={`block ${localGeorgia.className}`}>Your future begins with</span>
          <span className={`block ${localGeorgia.className}`}>one choice —let CourseFinder</span>
          <span className={`block ${localGeorgia.className}`}>help you find the path</span>
          <span className={`block ${localGeorgia.className}`}>that feels right for you.</span>
        </h1>
        <div className="flex items-center justify-center md:justify-start mb-4">
          <span className="block w-32 h-0.5 bg-white mr-2" />
          <span className="block w-2 h-2 bg-white rounded-full" />
        </div>
        <p className={`text-sm sm:text-base md:text-lg lg:text-2xl font-normal ${localGeorama.className}`}>
          Thoughtful, accurate evaluations to help students<br />
          discover the course that truly fits their future.
        </p>
      </div>
      {/* Right: Illustration */}
      <div className="w-full md:w-auto md:flex-1 lg:flex-[0.4] xl:flex-[0.45] flex justify-center md:justify-end">
        <Image 
          src="/illustration1.png" 
          alt="Person reading" 
          width={750}
          height={700}
          className="object-contain w-full h-auto max-w-[250px] sm:max-w-[300px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[650px]" 
        />
      </div>
    </div>
  </section>
);

export default HeroSection; 