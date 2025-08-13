"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import AuthDialog from "../components/AuthDialog";
import RegisterDialog from "../components/RegisterDialog";
import GuestResultsDialog from "../components/GuestResultsDialog";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../components/ui/toast";
import { apiUrl } from "../../lib/api";

const PersonalityTestHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [guestResultsDialogOpen, setGuestResultsDialogOpen] = useState(false);
  const [isPersonalityDropdownOpen, setIsPersonalityDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Simplified scroll handler - only for visual effects, not positioning
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const shouldBeScrolled = scrollTop > 50;

    // Only update state if it actually changed
    if (shouldBeScrolled !== isScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    // Simple throttled scroll handler
    let ticking = false;

    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.personality-dropdown')) {
        setIsPersonalityDropdownOpen(false);
      }
    };

    if (isPersonalityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPersonalityDropdownOpen]);

  // Check authentication status on component mount and when userData changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
          setUserData(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginClick = () => {
    setAuthDialogOpen(true);
  };

  const handleRegisterClick = () => {
    setRegisterDialogOpen(true);
  };

  const handleSwitchToRegister = () => {
    setAuthDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterDialogOpen(false);
    setAuthDialogOpen(true);
  };

  const togglePersonalityDropdown = () => {
    setIsPersonalityDropdownOpen(!isPersonalityDropdownOpen);
  };

  const handleGuestViewResults = () => {
    setGuestResultsDialogOpen(true);
  };

  const handleGuestCreateAccount = () => {
    setGuestResultsDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  const handleGuestViewAsGuest = () => {
    setGuestResultsDialogOpen(false);

    // Check if user is currently authenticated - if so, they shouldn't access guest results
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      // User is authenticated, redirect to their user results instead
      window.location.href = '/userpage?tab=results';
      return;
    }

    // Check for guest session - only for actual guest users
    const lastSessionId = localStorage.getItem('lastTestSessionId');
    const guestToken = localStorage.getItem('guestToken'); // Additional check for guest-specific token

    if (lastSessionId && !storedUserData) {
      // Verify this is actually a guest session by checking if it's not linked to a user
      fetch(apiUrl(`/api/personality-test/result/session/${lastSessionId}`))
        .then(response => response.json())
        .then(data => {
          if (data.status === 'SUCCESS' && data.result && !data.result.userId) {
            // This is a valid guest session (no userId associated)
            window.location.href = `/results?session=${lastSessionId}`;
          } else {
            // This session belongs to a user or is invalid, redirect to test
            localStorage.removeItem('lastTestSessionId'); // Clean up invalid session
            window.location.href = '/personalitytest';
          }
        })
        .catch(() => {
          // Error checking session, redirect to test
          localStorage.removeItem('lastTestSessionId');
          window.location.href = '/personalitytest';
        });
    } else {
      // No valid guest session found, redirect to test
      window.location.href = '/personalitytest';
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
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

  const handleLoginSuccess = (user: any) => {
    setUserData(user);
    setIsAuthenticated(true);
    setAuthDialogOpen(false);
  };

  // Memoize header content to prevent unnecessary re-renders
  const headerContent = useMemo(() => {
    if (isAuthenticated) {
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
                  Welcome, {userData?.username || 'User'}
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
            
            {/* Main Header - Sticky positioning to prevent layout shifts */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 sticky top-0 z-40 transition-all duration-300 ease-in-out ${isScrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : ''}`}>
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden px-4">
                {/* Your Account/Logout - Left Side */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Link 
                      href="/userpage" 
                      className="text-xs text-[#A75F00] hover:text-yellow-300 transition-colors duration-200 cursor-pointer font-semibold"
                    >
                      Hi, {userData?.username || 'User'}!
                    </Link>
                    <Button 
                      onClick={handleLogout}
                      variant="ghost" 
                      className="text-[#A75F00] hover:text-yellow-300 text-xs px-2"
                    >
                      LOGOUT
                    </Button>
                  </div>
                </div>
                
                {/* Logo and Title - Center */}
                <div className="flex items-center gap-1 flex-1 justify-center">
                  <Link href="/" className="flex items-center gap-1">
                    <Image src="/togahat.png" alt="CourseFinder Logo" width={32} height={32} />
                    <span className={`${localGotham.className} text-[#A75F00] font-semibold text-base tracking-wide`}>COURSEFINDER</span>
                  </Link>
                </div>
                
                {/* Burger Menu - Right Side */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none ml-2"
                >
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
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
                        className={`${localGeorama.className} flex items-center font-bold text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap bg-transparent border-none cursor-pointer`}
                      >
                        <span>PERSONALITY TEST</span>
                        <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className={`text-lg ml-1 transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>↓</span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 z-50 ${isPersonalityDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
                        <div className="py-2 min-w-[200px]">
                          <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-2 text-[#A75F00] font-bold hover:bg-gray-50 transition-colors duration-200`}>
                            Take Test
                          </Link>
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                // Navigate to user's Results tab with URL parameter
                                window.location.href = '/userpage?tab=results';
                              } else {
                                // Show dialog for guest users
                                handleGuestViewResults();
                              }
                            }}
                            className={`${localGeorama.className} block w-full text-left px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}
                          >
                            View Results
                          </button>
                          <Link href="/personalitytest/about" className={`${localGeorama.className} block px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}>
                            About the Test
                          </Link>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
              
              {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
              <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'shadow-lg' : ''}`}>
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
                      className={`${localGeorama.className} flex items-center justify-between font-bold text-[#4d2c00] no-underline py-3 bg-transparent border-none cursor-pointer w-full text-left`}
                    >
                      <span>PERSONALITY TEST</span>
                      <span className={`text-sm transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    <div className={`bg-gray-50 rounded-lg ml-4 mr-2 transition-all duration-300 ${isPersonalityDropdownOpen ? 'max-h-48 opacity-100 py-2 mb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-3 text-[#A75F00] font-bold hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
                        Take Test
                      </Link>
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            // Navigate to user's Results tab with URL parameter
                            window.location.href = '/userpage?tab=results';
                          } else {
                            // Show dialog for guest users
                            handleGuestViewResults();
                          }
                        }}
                        className={`${localGeorama.className} block w-full text-left px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}
                      >
                        View Results
                      </button>
                      <Link href="/personalitytest/about" className={`${localGeorama.className} block px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
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
    } else {
      return (
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-8">
            {/* Login/Create Account - Original Desktop Design */}
            <div className={`max-w-xs ml-auto bg-[#A75F00] flex justify-center px-0 sm:px-2 py-3 hidden sm:flex ${localGeorama.className}`}>
              <button 
                onClick={handleLoginClick}
                className="text-white hover:text-yellow-300 mr-6 bg-transparent border-none cursor-pointer"
              >
                LOGIN
              </button>
              <button 
                onClick={handleRegisterClick}
                className="text-white hover:text-yellow-300 bg-transparent border-none cursor-pointer"
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
            
            {/* Main Header - Sticky positioning to prevent layout shifts */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 sticky top-0 z-40 transition-all duration-300 ease-in-out ${isScrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : ''}`}>
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden">
                {/* Login/Create Account - Left Side */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLoginClick}
                    className="text-[#A75F00] hover:text-yellow-300 text-xs bg-transparent border-none cursor-pointer"
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={handleRegisterClick}
                    className="text-[#A75F00] hover:text-yellow-300 text-xs bg-transparent border-none cursor-pointer"
                  >
                    SIGN UP
                  </button>
                </div>
                
                {/* Logo and Title - Center */}
                <div className="flex items-center gap-2">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/togahat.png" alt="CourseFinder Logo" width={40} height={40} />
                    <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg tracking-wide`}>COURSEFINDER</span>
                  </Link>
                </div>
                
                {/* Burger Menu - Right Side */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
                >
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-[#4d2c00] transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
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
                        className={`${localGeorama.className} flex items-center font-bold text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap bg-transparent border-none cursor-pointer`}
                      >
                        <span>PERSONALITY TEST</span>
                        <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className={`text-lg ml-1 transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>↓</span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 z-50 ${isPersonalityDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
                        <div className="py-2 min-w-[200px]">
                          <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-2 text-[#A75F00] font-bold hover:bg-gray-50 transition-colors duration-200`}>
                            Take Test
                          </Link>
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                // Navigate to user's Results tab with URL parameter
                                window.location.href = '/userpage?tab=results';
                              } else {
                                // Show dialog for guest users
                                handleGuestViewResults();
                              }
                            }}
                            className={`${localGeorama.className} block w-full text-left px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}
                          >
                            View Results
                          </button>
                          <Link href="/personalitytest/about" className={`${localGeorama.className} block px-4 py-2 text-[#4d2c00] hover:bg-gray-50 transition-colors duration-200`}>
                            About the Test
                          </Link>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
              
              {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
              <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'shadow-lg' : ''}`}>
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
                      className={`${localGeorama.className} flex items-center justify-between font-bold text-[#4d2c00] no-underline py-3 bg-transparent border-none cursor-pointer w-full text-left`}
                    >
                      <span>PERSONALITY TEST</span>
                      <span className={`text-sm transition-transform duration-300 ${isPersonalityDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    <div className={`bg-gray-50 rounded-lg ml-4 mr-2 transition-all duration-300 ${isPersonalityDropdownOpen ? 'max-h-48 opacity-100 py-2 mb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <Link href="/personalitytest" className={`${localGeorama.className} block px-4 py-3 text-[#A75F00] font-bold hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
                        Take Test
                      </Link>
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            // Navigate to user's Results tab with URL parameter
                            window.location.href = '/userpage?tab=results';
                          } else {
                            // Show dialog for guest users
                            handleGuestViewResults();
                          }
                        }}
                        className={`${localGeorama.className} block w-full text-left px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}
                      >
                        View Results
                      </button>
                      <Link href="/personalitytest/about" className={`${localGeorama.className} block px-4 py-3 text-[#4d2c00] hover:bg-white rounded-md mx-2 transition-colors duration-200`}>
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
    }
  }, [isAuthenticated, userData, isScrolled, isMenuOpen, isPersonalityDropdownOpen, handleLoginClick, handleRegisterClick, handleLogout, togglePersonalityDropdown]);

  return (
    <>
      {headerContent}

      {/* Auth Dialog */}
      <AuthDialog 
        triggerText=""
        isOpen={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Dialog */}
      <RegisterDialog
        triggerText=""
        isOpen={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Guest Results Dialog */}
      <GuestResultsDialog
        isOpen={guestResultsDialogOpen}
        onClose={() => setGuestResultsDialogOpen(false)}
        onCreateAccount={handleGuestCreateAccount}
        onViewAsGuest={handleGuestViewAsGuest}
      />
    </>
  );
};

export default PersonalityTestHeader; 