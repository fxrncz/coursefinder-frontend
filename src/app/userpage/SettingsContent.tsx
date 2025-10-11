"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../lib/api";
import ResultsContent from "./ResultsContent";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface SettingsContentProps {
  userData: any;
  onUserDataUpdate?: (updatedUserData: any) => void;
}

interface FormData {
  username: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  age: string;
  gender: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ userData, onUserDataUpdate }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showAgeErrorDialog, setShowAgeErrorDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetSending, setIsResetSending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    username: userData?.username || "",
    email: userData?.email || "",
    newPassword: "",
    confirmPassword: "",
    age: userData?.age?.toString() || "",
    gender: userData?.gender || ""
  });
  
  // Track original values to detect changes
  const [originalData, setOriginalData] = useState<FormData>({
    username: userData?.username || "",
    email: userData?.email || "",
    newPassword: "",
    confirmPassword: "",
    age: userData?.age?.toString() || "",
    gender: userData?.gender || ""
  });
  
  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'results') {
      setActiveTab('results');
      // Clean up URL parameter
      window.history.replaceState({}, '', '/userpage');
    }
  }, []);

  // Check if form has unsaved changes
  const hasUnsavedChanges = () => {
    return (
      formData.username !== originalData.username ||
      formData.email !== originalData.email ||
      formData.newPassword !== originalData.newPassword ||
      formData.confirmPassword !== originalData.confirmPassword ||
      formData.age !== originalData.age ||
      formData.gender !== originalData.gender
    );
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Special validation for age field
    if (field === 'age') {
      const ageValue = parseInt(value);
      if (value !== '' && (isNaN(ageValue) || ageValue <= 0)) {
        setShowAgeErrorDialog(true);
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle tab change with unsaved changes check
  const handleTabChange = (tab: string) => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      setPendingNavigation(tab);
    } else {
      setActiveTab(tab);
    }
  };

  // Handle navigation with unsaved changes check
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, originalData]);

  // Save user profile
  const handleSave = async () => {
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password length if provided
    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(apiUrl('/api/auth/update-profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id,
          username: formData.username,
          email: formData.email,
          newPassword: formData.newPassword || null,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update original data to reflect saved state
        setOriginalData({
          ...formData,
          newPassword: "",
          confirmPassword: ""
        });
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          newPassword: "",
          confirmPassword: ""
        }));
        
        // Update userData in parent component
        if (onUserDataUpdate) {
          onUserDataUpdate(data.user);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user account
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(apiUrl('/api/auth/delete-account'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Account deleted successfully!' });
        
        // Clear all user-related data from localStorage (same as logout)
        localStorage.removeItem('userData');
        localStorage.removeItem('personalityTestAnswers');
        localStorage.removeItem('personalityTestCurrentSet');
        localStorage.removeItem('personalityTestCurrentQuestion');
        localStorage.removeItem('lastTestSessionId');
        
        // Trigger storage event to update all header components immediately
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userData',
          oldValue: JSON.stringify(userData),
          newValue: null,
          storageArea: localStorage
        }));
        
        // Show a quick GSAP loading overlay, then redirect to home
        setIsRedirecting(true);
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { autoAlpha: 0 });
          gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
        }
        // Spinner rotation handled by CSS for smoother, GPU-accelerated animation
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Request password reset via email
  const handleRequestPasswordReset = async () => {
    if (!userData?.email) {
      setMessage({ type: 'error', text: 'No email found on your profile.' });
      return;
    }
    setIsResetSending(true);
    setMessage(null);
    try {
      const resp = await fetch(apiUrl('/api/verify/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, purpose: 'reset', resetBaseUrl: `${window.location.origin}/reset-password` })
      });
      if (!resp.ok) {
        throw new Error('Request failed');
      }
      setMessage({ type: 'success', text: 'Password reset link sent. Please check your email.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to send reset link. Please try again.' });
    } finally {
      setIsResetSending(false);
    }
  };

  // Handle unsaved changes dialog
  const handleUnsavedDialogConfirm = () => {
    // Reset form data to original values when user chooses to leave without saving
    setFormData(originalData);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      setActiveTab(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleUnsavedDialogCancel = () => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

  const handleAgeErrorDialogClose = () => {
    setShowAgeErrorDialog(false);
  };

  return (
    <div className="flex justify-center w-full bg-[#FFF4E6] min-h-screen py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-6xl p-4 sm:p-6 md:p-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* White Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          {/* Tabs */}
          <div className={`flex ${localGeorgia.className}`}>
            <button
              onClick={() => handleTabChange("settings")}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium border-t border-l border-r border-gray-300 ${
                activeTab === "settings"
                  ? "bg-white text-black border-gray-300"
                  : "bg-[#FFF4E6] text-[#A75F00] border-transparent"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => handleTabChange("results")}
              data-tab="results"
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium border-t border-l border-r border-gray-300 ${
                activeTab === "results"
                  ? "bg-white text-black border-gray-300"
                  : "bg-[#FFF4E6] text-[#A75F00] border-transparent"
              }`}
            >
              Results
            </button>
          </div>
          {/* Separator Line */}
          <div className="border-b border-gray-300 mb-4 sm:mb-6 md:mb-8"></div>

          {/* Conditional Content with Smooth Transitions */}
          <div className="relative overflow-hidden">
            {/* Settings Content */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeTab === "settings"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 translate-x-full absolute top-0 left-0 w-full pointer-events-none"
            }`}>
              {activeTab === "settings" && (
            <>
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
                {/* Left Column */}
                <div className={`space-y-4 sm:space-y-6 ${localGeorgia.className}`}>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md text-[#A75F00] italic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md text-[#A75F00] italic"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md text-[#A75F00]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                        Gender
                      </label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md text-[#A75F00]"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                  <div className={`${localGeorgia.className}`}>
                    <label className="block text-xs sm:text-sm font-medium text-black mb-2">
                      Request to change your password
                    </label>
                    <p className="text-sm text-[#353535] mb-3">
                      We will send a secure password reset link to your email: <span className="font-medium">{userData?.email}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleRequestPasswordReset}
                      disabled={isResetSending}
                      className="bg-[#A75F00] hover:bg-[#8B4F00] disabled:bg-gray-400 text-white px-6 py-2 rounded-md text-sm"
                    >
                      {isResetSending ? 'Sending…' : 'Reset Password'}
                    </button>
                  </div>
                  <div className="pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10">
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`bg-[#A75F00] hover:bg-[#804000] disabled:bg-gray-400 text-white px-8 sm:px-12 md:px-15 py-1 rounded-sm font-medium h-9 sm:h-10 md:h-11 text-sm sm:text-base ${localGeorama.className}`}
                      >
                        {isLoading ? 'SAVING...' : 'SAVE'}
                      </button>
                      <div className="flex flex-col items-start sm:-mt-6">
                        <div className="text-xs sm:text-sm text-[#A75F00] mb-1">
                          Delete your account?
                        </div>
                        <button 
                          onClick={() => setShowDeleteDialog(true)}
                          disabled={isLoading}
                          className="border border-[#A75F00] text-[#A75F00] hover:bg-[#A75F00] hover:text-white disabled:border-gray-400 disabled:text-gray-400 px-6 sm:px-8 md:px-10 py-1 font-medium bg-white h-9 sm:h-10 md:h-11 text-sm sm:text-base"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
              )}
            </div>

            {/* Results Content */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeTab === "results"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 -translate-x-full absolute top-0 left-0 w-full pointer-events-none"
            }`}>
              {activeTab === "results" && <ResultsContent />}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`${localGeorama.className} text-red-600`}>
              Delete Account
            </DialogTitle>
            <DialogDescription className={`${localGeorgia.className}`}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isRedirecting && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div
              ref={spinnerRef}
              className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
              style={{ willChange: 'transform' }}
            ></div>
            <div className={`${localGeorgia.className} mt-4 text-white text-sm`}>
              Taking you home...
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`${localGeorama.className} text-orange-600`}>
              Unsaved Changes
            </DialogTitle>
            <DialogDescription className={`${localGeorgia.className}`}>
              You have unsaved changes. Are you sure you want to leave without saving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleUnsavedDialogCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Stay
            </button>
            <button
              onClick={handleUnsavedDialogConfirm}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Leave
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Age Error Dialog */}
      <Dialog open={showAgeErrorDialog} onOpenChange={setShowAgeErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`${localGeorama.className} text-red-600`}>
              Invalid Age
            </DialogTitle>
            <DialogDescription className={`${localGeorgia.className}`}>
              Please enter a valid age. Age must be a positive number greater than 0.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={handleAgeErrorDialogClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsContent; 