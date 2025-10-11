"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/toast";
import { useRouter } from "next/navigation";
import GuestResultsDialog from "../components/GuestResultsDialog";

interface UserHeaderProps {
  userData: any;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPersonalityDropdownOpen, setIsPersonalityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuAnimating, setIsUserMenuAnimating] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Handle personality dropdown
      if (!target.closest('.personality-dropdown')) {
        setIsPersonalityDropdownOpen(false);
      }
      
      // Handle user menu
      if (isUserMenuOpen && !isUserMenuAnimating) {
        const userContainer = target.closest('.user-menu-container');
        const userDropdown = target.closest('.user-dropdown');
        
        if (!userContainer && !userDropdown) {
          toggleUserMenu();
        }
      }
    };

    if (isPersonalityDropdownOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPersonalityDropdownOpen, isUserMenuOpen, isUserMenuAnimating]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    // Navigate back to home page
    router.push('/');
    // Show toast notification
    showToast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      variant: "info",
      durationMs: 3000,
    });
  };

  const togglePersonalityDropdown = () => {
    setIsPersonalityDropdownOpen(!isPersonalityDropdownOpen);
  };

  const toggleUserMenu = () => {
    if (isUserMenuOpen) {
      // Closing animation
      setIsUserMenuAnimating(true);
      setTimeout(() => {
        setIsUserMenuOpen(false);
        setIsUserMenuAnimating(false);
      }, 150); // Match transition duration
    } else {
      // Opening animation
      setIsUserMenuOpen(true);
      setIsUserMenuAnimating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-8">
        {/* Your Account/Logout - Original Desktop Design */}
        <div className={`max-w-xs ml-auto bg-[#A75F00] flex justify-center px-0 sm:px-2 py-3 hidden sm:flex ${localGeorama.className}`}>
          <div className="flex items-center gap-4 text-white">
            <Link 
              href="/userpage" 
              className="text-sm hover:text-yellow-300 transition-colors duration-200 cursor-pointer font-semibold"
            >
              Your account
            </Link>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="text-white hover:text-yellow-300 hover:bg-transparent"
            >
              LOGOUT
            </Button>
          </div>
        </div>
        
        {/* Main Header - Smooth Animation */}
        <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 transition-all duration-500 ease-out relative ${isScrolled ? 'fixed top-0 left-0 right-0 z-40 shadow-lg bg-white/95 backdrop-blur-sm' : ''}`}>
          {/* Mobile Layout */}
          <div className="flex items-center justify-between w-full sm:hidden px-4">
            {/* CourseFinder Logo - Left Side */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/togahat.png" alt="CourseFinder Logo" width={32} height={32} />
                <span className={`${localGotham.className} text-[#A75F00] font-semibold text-base tracking-wide`}>COURSEFINDER</span>
              </Link>
            </div>
            
            {/* Right Side - Burger Menu and User Icon */}
            <div className="flex items-center gap-3">
              {/* Burger Menu */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
              >
                <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
              
              {/* User Icon with Dropdown */}
              <div className="relative user-menu-container">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center w-8 h-8 text-[#A75F00] hover:text-yellow-300 transition-colors focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {(isUserMenuOpen || isUserMenuAnimating) && (
                  <div className={`fixed top-16 right-4 w-40 bg-white border border-gray-200 rounded-md shadow-xl z-[99999] user-dropdown transition-all duration-150 ease-out ${
                    isUserMenuOpen && !isUserMenuAnimating 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 -translate-y-2 scale-95'
                  }`}>
                    <Link 
                      href="/userpage" 
                      className={`${localGeorama.className} block w-full text-left px-4 py-2 text-sm text-[#A75F00] hover:bg-gray-50 transition-colors first:rounded-t-md`}
                      onClick={toggleUserMenu}
                    >
                      Your Account
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        toggleUserMenu();
                      }}
                      className={`${localGeorama.className} block w-full text-left px-4 py-2 text-sm text-[#A75F00] hover:bg-gray-50 transition-colors border-t border-gray-200 last:rounded-b-md`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop/Tablet Layout - Centered */}
          <div className="hidden sm:flex items-center justify-center w-full">
            <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <Image src="/togahat.png" alt="CourseFinder Logo" width={50} height={50} className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" />
                  <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg sm:text-xl md:text-2xl tracking-wide`}>COURSEFINDER</span>
                </Link>
              </div>
              <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 text-sm sm:text-base">
                <Link href="/" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline relative group`}>
                  <span>HOME</span>
                  <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link href="/about" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline relative group whitespace-nowrap`}>
                  <span>ABOUT US</span>
                  <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link href="/resources" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline relative group`}>
                  <span>RESOURCES</span>
                  <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <div className="relative personality-dropdown">
                  <button 
                    onClick={togglePersonalityDropdown}
                    className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap bg-transparent border-none cursor-pointer`}
                  >
                    <span>PERSONALITY TEST</span>
                    <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className={`text-lg ml-1 transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>↓</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 z-50 ${isPersonalityDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="py-2 min-w-[200px]">
                      <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-2 text-[#A75F00] font-bold hover:bg-gray-50 transition-colors duration-200`}>
                        Take Test
                      </Link>
                      <button
                        onClick={() => {
                          // Navigate to Results tab with URL parameter
                          window.location.href = '/userpage?tab=results';
                        }}
                        className={`${localGeorama.className} block w-full text-left px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}
                      >
                        View Results
                      </button>
                      <Link href="/resources" className={`${localGeorama.className} block px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}>
                        About the Test
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
          <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 z-50 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'shadow-lg' : ''}`}>
            <nav className="flex flex-col py-4 px-8 space-y-4">
              <Link href="/" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline py-2`}>
                HOME
              </Link>
              <Link href="/about" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline py-2`}>
                ABOUT US
              </Link>
              <Link href="/resources" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline py-2`}>
                RESOURCES
              </Link>
              <div className="relative personality-dropdown">
                <button 
                  onClick={togglePersonalityDropdown}
                  className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline py-2 bg-transparent border-none cursor-pointer w-full text-left`}
                >
                  PERSONALITY TEST
                  <span className={`text-lg ml-1 transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>↓</span>
                </button>
                
                {/* Mobile Dropdown Menu */}
                <div className={`bg-gray-50 rounded-lg ml-4 mr-2 transition-all duration-300 ${isPersonalityDropdownOpen ? 'max-h-48 opacity-100 py-2 mb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-3 text-[#A75F00] font-bold hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
                    Take Test
                  </Link>
                  <button
                    onClick={() => {
                      // Navigate to Results tab with URL parameter
                      window.location.href = '/userpage?tab=results';
                    }}
                    className={`${localGeorama.className} block w-full text-left px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}
                  >
                    View Results
                  </button>
                  <Link href="/resources" className={`${localGeorama.className} block px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
                    About the Test
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader; 