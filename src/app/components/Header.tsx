"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import AuthDialog from "./AuthDialog";
import RegisterDialog from "./RegisterDialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const shouldBeScrolled = scrollTop > 50;
    
    // Only update state if it actually changed
    if (shouldBeScrolled !== isScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    // Throttle scroll events for better performance
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
                  onClick={() => {
                    localStorage.removeItem('userData');
                    setIsAuthenticated(false);
                    setUserData(null);
                    showToast({
                      title: "Logged out",
                      description: "You have been logged out successfully.",
                      variant: "info",
                      durationMs: 3000,
                    });
                  }}
                  variant="ghost" 
                  className="text-white hover:text-yellow-300 hover:bg-transparent"
                >
                  LOGOUT
                </Button>
              </div>
            </div>
            
            {/* Main Header - Optimized Animation */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 transition-all duration-300 ease-in-out ${isScrolled ? 'fixed top-0 left-0 right-0 z-40 shadow-lg bg-white/95 backdrop-blur-sm' : 'relative'}`}>
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
                      onClick={() => {
                        localStorage.removeItem('userData');
                        setIsAuthenticated(false);
                        setUserData(null);
                        showToast({
                          title: "Logged out",
                          description: "You have been logged out successfully.",
                          variant: "info",
                          durationMs: 3000,
                        });
                      }}
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
                    <Link href="/personalitytest" className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap`}>
                      <span>PERSONALITY TEST</span>
                      <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <span className="text-lg ml-1">→</span>
                    </Link>
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
                  <Link href="/personalitytest" className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline py-2`}>
                    PERSONALITY TEST
                    <span className="text-lg ml-1">→</span>
                  </Link>
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
                onClick={() => setAuthDialogOpen(true)}
                className="text-white hover:text-yellow-300 mr-6 bg-transparent border-none cursor-pointer"
              >
                LOGIN
              </button>
              <button 
                onClick={() => setRegisterDialogOpen(true)}
                className="text-white hover:text-yellow-300 bg-transparent border-none cursor-pointer"
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
            
            {/* Main Header - Optimized Animation */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 transition-all duration-300 ease-in-out ${isScrolled ? 'fixed top-0 left-0 right-0 z-40 shadow-lg bg-white/95 backdrop-blur-sm' : 'relative'}`}>
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden">
                {/* Login/Create Account - Left Side */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAuthDialogOpen(true)}
                    className="text-[#A75F00] hover:text-yellow-300 text-xs bg-transparent border-none cursor-pointer"
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => setRegisterDialogOpen(true)}
                    className="text-[#A75F00] hover:text-yellow-300 text-xs bg-transparent border-none cursor-pointer"
                  >
                    SIGN UP
                  </button>
                </div>
                
                {/* Logo and Title - Center */}
                <div className="flex items-center gap-2">
                  <Image src="/togahat.png" alt="CourseFinder Logo" width={40} height={40} />
                  <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg tracking-wide`}>COURSEFINDER</span>
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
                    <Image src="/togahat.png" alt="CourseFinder Logo" width={50} height={50} className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" />
                    <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg sm:text-xl md:text-2xl tracking-wide`}>COURSEFINDER</span>
                  </div>
                  <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 text-sm sm:text-base">
                    <Link href="/" className={`${localGeorama.className} font-bold text-[#4d2c00] no-underline relative group`}>
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
                    <Link href="/personalitytest" className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap`}>
                      <span>PERSONALITY TEST</span>
                      <span className="absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <span className="text-lg ml-1">→</span>
                    </Link>
                  </nav>
                </div>
              </div>
              
              {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
              <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'shadow-lg' : ''}`}>
                <nav className="flex flex-col py-4 px-8 space-y-4">
                  <Link href="/" className={`${localGeorama.className} font-bold text-[#4d2c00] no-underline py-2`}>
                    HOME
                  </Link>
                  <Link href="/about" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline py-2`}>
                    ABOUT US
                  </Link>
                  <Link href="/resources" className={`${localGeorama.className} font-normal text-[#4d2c00] no-underline py-2`}>
                    RESOURCES
                  </Link>
                  <Link href="/personalitytest" className={`${localGeorama.className} flex items-center font-normal text-[#4d2c00] no-underline py-2`}>
                    PERSONALITY TEST
                    <span className="text-lg ml-1">→</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }, [isAuthenticated, userData, isScrolled, isMenuOpen, setAuthDialogOpen, setRegisterDialogOpen]);

  const handleLoginSuccess = (user: any) => {
    setUserData(user);
    setIsAuthenticated(true);
    setAuthDialogOpen(false);
    // Redirect to user page after successful login
    router.push('/userpage');
  };

  return (
    <>
      {headerContent}

      {/* Auth Dialog */}
      <AuthDialog 
        triggerText=""
        isOpen={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSwitchToRegister={() => {
          setAuthDialogOpen(false);
          setRegisterDialogOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Dialog */}
      <RegisterDialog 
        triggerText=""
        isOpen={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onSwitchToLogin={() => {
          setRegisterDialogOpen(false);
          setAuthDialogOpen(true);
        }}
      />
    </>
  );
};

export default Header;
