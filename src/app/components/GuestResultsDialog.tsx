"use client";

import React, { useState, useEffect } from "react";
import { apiUrl } from "../../lib/api";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface GuestResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  onViewAsGuest: () => void;
}

const GuestResultsDialog: React.FC<GuestResultsDialogProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
  onViewAsGuest
}) => {
  const [hasValidGuestSession, setHasValidGuestSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (isOpen) {
      checkGuestSession();
    }
  }, [isOpen]);

  const checkGuestSession = async () => {
    setCheckingSession(true);

    // Check if user is authenticated - if so, no guest session should be available
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setHasValidGuestSession(false);
      setCheckingSession(false);
      return;
    }

    // Check for guest session
    const lastSessionId = localStorage.getItem('lastTestSessionId');
    if (lastSessionId) {
      try {
        const response = await fetch(apiUrl(`/api/personality-test/result/session/${lastSessionId}`));
        const data = await response.json();

        // Valid guest session should have no userId associated
        if (data.status === 'SUCCESS' && data.result && !data.result.userId) {
          setHasValidGuestSession(true);
        } else {
          setHasValidGuestSession(false);
          // Clean up invalid session
          localStorage.removeItem('lastTestSessionId');
        }
      } catch (error) {
        setHasValidGuestSession(false);
        localStorage.removeItem('lastTestSessionId');
      }
    } else {
      setHasValidGuestSession(false);
    }

    setCheckingSession(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`${localGeorama.className} text-[#002A3C] text-xl font-bold`}>
            Save Your Results
          </DialogTitle>
          <DialogDescription className={`${localGeorgia.className} text-[#4d2c00] mt-2`}>
            To save and access your personality test results anytime, create a free account. 
            Your results will be permanently stored and available across all your devices.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-xl">💡</div>
              <div>
                <h4 className={`${localGeorama.className} font-semibold text-[#002A3C] text-sm mb-1`}>
                  Benefits of Creating an Account:
                </h4>
                <ul className={`${localGeorgia.className} text-[#4d2c00] text-xs space-y-1`}>
                  <li>• Save your personality test results permanently</li>
                  <li>• Access results from any device, anytime</li>
                  <li>• Track your progress over time</li>
                  <li>• Get personalized course recommendations</li>
                  <li>• Retake tests and compare results</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className={`${localGeorgia.className} text-[#4d2c00] text-xs`}>
              <strong>Note:</strong> Guest results are only available if you've recently completed a test in this browser session.
              Without an account, your results will be lost when you close your browser or clear your data.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {checkingSession ? (
            <div className="flex justify-center py-2">
              <span className={`${localGeorgia.className} text-[#4d2c00] text-sm`}>
                Checking for existing results...
              </span>
            </div>
          ) : (
            <>
              {hasValidGuestSession && (
                <button
                  onClick={onViewAsGuest}
                  className={`${localGeorama.className} flex-1 px-4 py-2 border border-gray-300 text-[#4d2c00] rounded-md hover:bg-gray-50 transition-colors text-sm`}
                >
                  View as Guest
                </button>
              )}
              <button
                onClick={onCreateAccount}
                className={`${localGeorama.className} ${hasValidGuestSession ? 'flex-1' : 'w-full'} px-4 py-2 bg-[#002A3C] text-white rounded-md hover:bg-[#004E70] transition-colors font-semibold text-sm`}
              >
                Create Free Account
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestResultsDialog;
