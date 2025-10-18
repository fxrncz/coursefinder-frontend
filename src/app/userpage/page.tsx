"use client";

import React, { useState, useEffect } from "react";
import UserMainContent from "./UserMainContent";
import SettingsContent from "./SettingsContent";
import UserHeader from "./UserHeader";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If there's an error parsing, redirect to home
        router.push('/');
      }
    } else {
      // If no user data, redirect to home
      router.push('/');
    }
    
    setLoading(false);
  }, [router]);

  // Handle user data updates
  const handleUserDataUpdate = (updatedUserData: any) => {
    setUserData(updatedUserData);
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#A75F00] text-lg">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return null; // Will redirect to home
  }

  return (
    <div className="flex flex-col">
      <UserHeader userData={userData} />
      <UserMainContent userData={userData} />
      <SettingsContent userData={userData} onUserDataUpdate={handleUserDataUpdate} />
    </div>
  );
}