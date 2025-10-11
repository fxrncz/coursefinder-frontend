"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import AuthDialog from "./AuthDialog";
import RegisterDialog from "./RegisterDialog";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "./ui/toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface HeaderProps {
  forceWhite?: boolean;
}

const Header: React.FC<HeaderProps> = ({ forceWhite = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isAuthMenuAnimating, setIsAuthMenuAnimating] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuAnimating, setIsUserMenuAnimating] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const pathname = usePathname();

  const isActive = useCallback((href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }, [pathname]);

  // Navigation warning
  const isOnTestPage = useMemo(() => pathname?.startsWith('/personalitytest') ?? false, [pathname]);
  const hasTestProgress = useCallback(() => {
    try {
      const savedAnswers = localStorage.getItem('personalityTestAnswers');
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        if (parsed && Object.keys(parsed).length > 0) return true;
      }
      const savedGoal = localStorage.getItem('goalSettingAnswers');
      if (savedGoal) {
        const goal = JSON.parse(savedGoal);
        if (
          goal?.priority ||
          goal?.environment || goal?.motivation || goal?.concern ||
          (typeof goal?.confidence === 'number' && goal.confidence > 0) ||
          goal?.routine || goal?.impact
        ) return true;
      }
    } catch {}
    return false;
  }, []);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleNavAttempt = useCallback((e: React.MouseEvent, href: string) => {
    if (isOnTestPage && !href.startsWith('/personalitytest') && hasTestProgress()) {
      e.preventDefault();
      setPendingHref(href);
      setShowLeaveDialog(true);
    }
  }, [isOnTestPage, hasTestProgress]);
  const navHandler = useCallback((href: string) => (e: React.MouseEvent) => handleNavAttempt(e, href), [handleNavAttempt]);
  const confirmLeaveTest = useCallback(() => {
    try {
      localStorage.removeItem('personalityTestAnswers');
      localStorage.removeItem('personalityTestCurrentSet');
      localStorage.removeItem('personalityTestCurrentQuestion');
      localStorage.removeItem('goalSettingAnswers');
    } catch {}
    const target = pendingHref || '/';
    setShowLeaveDialog(false);
    setPendingHref(null);
    router.push(target);
  }, [pendingHref, router]);
  const cancelLeaveTest = useCallback(() => {
    setShowLeaveDialog(false);
    setPendingHref(null);
  }, []);

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

  // Toggle auth menu with animation
  const toggleAuthMenu = () => {
    if (isAuthMenuOpen) {
      // Closing animation
      setIsAuthMenuAnimating(true);
      setTimeout(() => {
        setIsAuthMenuOpen(false);
        setIsAuthMenuAnimating(false);
      }, 150); // Match transition duration
    } else {
      // Opening animation
      setIsAuthMenuOpen(true);
      setIsAuthMenuAnimating(false);
    }
  };

  // Toggle user menu with animation
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

  // Close auth menu and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Handle auth menu
      if (isAuthMenuOpen && !isAuthMenuAnimating) {
        const authContainer = target.closest('.auth-menu-container');
        const authDropdown = target.closest('.auth-dropdown');
        
        if (!authContainer && !authDropdown) {
          toggleAuthMenu();
        }
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

    if (isAuthMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAuthMenuOpen, isAuthMenuAnimating, isUserMenuOpen, isUserMenuAnimating]);

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
            <div className={`max-w-xs ml-auto ${forceWhite ? 'bg-white' : 'bg-[#A75F00]'} flex justify-center px-0 sm:px-2 py-3 hidden sm:flex ${localGeorama.className}`}>
              <div className={`flex items-center gap-4 ${forceWhite ? 'text-[#4d2c00]' : 'text-white'}`}>
                <Link 
                  href="/userpage" 
                  className={`text-sm transition-colors duration-200 cursor-pointer font-semibold ${forceWhite ? 'text-[#A75F00] hover:text-[#4d2c00]' : 'hover:text-yellow-300'}`}
                >
                  Your account
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
                  className={`${forceWhite ? 'text-[#A75F00] hover:text-[#4d2c00]' : 'text-white hover:text-yellow-300'} hover:bg-transparent`}
                >
                  LOGOUT
                </Button>
              </div>
            </div>
            
            {/* Main Header - Optimized Animation */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 transition-all duration-300 ease-in-out relative ${isScrolled ? 'sm:fixed sm:top-0 sm:left-0 sm:right-0 sm:z-40 sm:shadow-lg sm:bg-white/95 sm:backdrop-blur-sm' : ''}`}>
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden px-4">
                {/* CourseFinder Logo - Left Side */}
                <div className="flex items-center gap-2">
                  <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className="flex items-center gap-2">
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
                            localStorage.removeItem('userData');
                            setIsAuthenticated(false);
                            setUserData(null);
                            toggleUserMenu();
                            showToast({
                              title: "Logged out",
                              description: "You have been logged out successfully.",
                              variant: "info",
                              durationMs: 3000,
                            });
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
                    <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <Image src="/togahat.png" alt="CourseFinder Logo" width={50} height={50} className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" />
                      <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg sm:text-xl md:text-2xl tracking-wide`}>COURSEFINDER</span>
                    </Link>
                  </div>
                  <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 text-sm sm:text-base">
                    <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group`}>
                      <span>HOME</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/about" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/about'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/about') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group whitespace-nowrap`}>
                      <span>ABOUT US</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/about') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/resources" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/resources'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/resources') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group`}>
                      <span>RESOURCES</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/resources') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/personalitytest" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/personalitytest'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} flex items-center ${isActive('/personalitytest') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap`}>
                      <span>PERSONALITY TEST</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/personalitytest') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                      <span className="text-lg ml-1">→</span>
                    </Link>
                  </nav>
                </div>
              </div>
              
              {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
              <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 z-50 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'sm:shadow-lg' : ''}`}>
                <nav className="flex flex-col py-4 px-8 space-y-4">
                  <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    HOME
                  </Link>
                  <Link href="/about" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/about'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/about') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    ABOUT US
                  </Link>
                  <Link href="/resources" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/resources'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/resources') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    RESOURCES
                  </Link>
                  <Link href="/personalitytest" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/personalitytest'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} flex items-center ${isActive('/personalitytest') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
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
            <div className={`max-w-xs ml-auto ${forceWhite ? 'bg-white' : 'bg-[#A75F00]'} flex justify-center px-0 sm:px-2 py-3 hidden sm:flex ${localGeorama.className}`}>
              <button 
                onClick={() => setAuthDialogOpen(true)}
                className={`${forceWhite ? 'text-[#A75F00] hover:text-[#4d2c00]' : 'text-white hover:text-yellow-300'} mr-6 bg-transparent border-none cursor-pointer`}
              >
                LOGIN
              </button>
              <button 
                onClick={() => setRegisterDialogOpen(true)}
                className={`${forceWhite ? 'text-[#A75F00] hover:text-[#4d2c00]' : 'text-white hover:text-yellow-300'} bg-transparent border-none cursor-pointer`}
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
            
            {/* Main Header - Optimized Animation */}
            <div className={`bg-white flex items-center justify-center px-0 pt-3 pb-4 transition-all duration-300 ease-in-out relative ${isScrolled ? 'sm:fixed sm:top-0 sm:left-0 sm:right-0 sm:z-40 sm:shadow-lg sm:bg-white/95 sm:backdrop-blur-sm' : ''}`}>
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden px-4">
                {/* CourseFinder Logo - Left Side */}
                <div className="flex items-center gap-2">
                  <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className="flex items-center gap-2">
                    <Image src="/togahat.png" alt="CourseFinder Logo" width={32} height={32} />
                    <span className={`${localGotham.className} text-[#A75F00] font-semibold text-base tracking-wide`}>COURSEFINDER</span>
                  </Link>
                </div>
                
                {/* Right Side - Burger Menu and Auth Icon */}
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
                  
                  {/* Auth Icon with Dropdown */}
                  <div className="relative auth-menu-container">
                    <button 
                      onClick={toggleAuthMenu}
                      className="flex items-center justify-center w-8 h-8 text-[#A75F00] hover:text-yellow-300 transition-colors focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    
                    {/* Auth Dropdown Menu */}
                    {(isAuthMenuOpen || isAuthMenuAnimating) && (
                      <div className={`fixed top-16 right-4 w-40 bg-white border border-gray-200 rounded-md shadow-xl z-[99999] auth-dropdown transition-all duration-150 ease-out ${
                        isAuthMenuOpen && !isAuthMenuAnimating 
                          ? 'opacity-100 translate-y-0 scale-100' 
                          : 'opacity-0 -translate-y-2 scale-95'
                      }`}>
                        <button 
                          onClick={() => {
                            setAuthDialogOpen(true);
                            toggleAuthMenu();
                          }}
                          className={`${localGeorama.className} block w-full text-left px-4 py-2 text-sm text-[#A75F00] hover:bg-gray-50 transition-colors first:rounded-t-md`}
                        >
                          Login
                        </button>
                        <button 
                          onClick={() => {
                            setRegisterDialogOpen(true);
                            toggleAuthMenu();
                          }}
                          className={`${localGeorama.className} block w-full text-left px-4 py-2 text-sm text-[#A75F00] hover:bg-gray-50 transition-colors border-t border-gray-200 last:rounded-b-md`}
                        >
                          Register
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
                    <Image src="/togahat.png" alt="CourseFinder Logo" width={50} height={50} className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" />
                    <span className={`${localGotham.className} text-[#A75F00] font-semibold text-lg sm:text-xl md:text-2xl tracking-wide`}>COURSEFINDER</span>
                  </div>
                  <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 text-sm sm:text-base">
                    <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group`}>
                      <span>HOME</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/about" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/about'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/about') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group whitespace-nowrap`}>
                      <span>ABOUT US</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/about') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/resources" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/resources'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/resources') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline relative group`}>
                      <span>RESOURCES</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/resources') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </Link>
                    <Link href="/personalitytest" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/personalitytest'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} flex items-center ${isActive('/personalitytest') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline gap-1 relative group whitespace-nowrap`}>
                      <span>PERSONALITY TEST</span>
                      <span className={`absolute left-0 -bottom-1 w-1/2 h-0.5 bg-[#4d2c00] ${isActive('/personalitytest') ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                      <span className="text-lg ml-1">→</span>
                    </Link>
                  </nav>
                </div>
              </div>
              
              {/* Mobile Navigation Menu - Fixed positioning when scrolled */}
              <div className={`sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 z-50 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? 'sm:shadow-lg' : ''}`}>
                <nav className="flex flex-col py-4 px-8 space-y-4">
                  <Link href="/" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    HOME
                  </Link>
                  <Link href="/about" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/about'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/about') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    ABOUT US
                  </Link>
                  <Link href="/resources" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/resources'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} ${isActive('/resources') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
                    RESOURCES
                  </Link>
                  <Link href="/personalitytest" onClick={(e)=>{ if(isOnTestPage && hasTestProgress()){ e.preventDefault(); setPendingHref('/personalitytest'); setShowLeaveDialog(true);} }} className={`${localGeorama.className} flex items-center ${isActive('/personalitytest') ? 'font-bold' : 'font-normal'} text-[#4d2c00] no-underline py-2`}>
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
  }, [isAuthenticated, userData, isScrolled, isMenuOpen, isAuthMenuOpen, isUserMenuOpen, isAuthMenuAnimating, isUserMenuAnimating, setAuthDialogOpen, setRegisterDialogOpen]);

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
      {showLeaveDialog && (
        <Dialog open={showLeaveDialog}>
          <DialogContent className="bg-white border-[#E7DFD6] p-6 sm:p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#002A3C]">Leave Personality Test?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#294556]">You have in-progress answers. Leaving will clear your current test progress.</p>
            <DialogFooter>
              <button onClick={cancelLeaveTest} className={`${localGeorama.className} border border-[#002A3C] text-[#002A3C] px-4 py-2 rounded font-semibold hover:bg-gray-50 transition-colors`}>Stay on Test</button>
              <button onClick={confirmLeaveTest} className={`${localGeorama.className} bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors`}>Leave Test</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
