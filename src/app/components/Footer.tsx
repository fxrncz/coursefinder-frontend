import React from "react";
import Image from "next/image";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";

const Footer = () => (
  <footer className="w-full bg-[#fafafa] mt-8 sm:mt-12 md:mt-16 lg:mt-20 pt-4 pb-2 text-neutral-700 text-sm">
    <div className="flex flex-col items-center gap-2 px-4 sm:px-0">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 mb-2">
        <Image src="/togahat.png" alt="CourseFinder Logo" width={28} height={28} className="sm:w-8 sm:h-8" />
        <span className={`text-[#A75F00] font-bold text-lg sm:text-xl tracking-wide uppercase ${localGotham.className}`}>CourseFinder</span>
      </div>
      {/* Navigation Links */}
      <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-25 mb-2 text-center">
        <a href="#" className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}>About Us</a>
        <a href="#" className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}>Terms of Use</a>
        <a href="#" className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}>Privacy Policy</a>
      </nav>
    </div>
    {/* Divider */}
    <hr className="border-t border-neutral-300 my-2 mx-4 sm:mx-0" />
    {/* Copyright */}
    <div className={`text-center text-xs text-neutral-500 pb-2 tracking-wide px-4 sm:px-0 ${localGeorama.className}`}>
      COPY RIGHT &copy; {new Date().getFullYear()}, COURSEFINDER. ALL RIGHTS RESERVED.
    </div>
  </footer>
);

export default Footer; 