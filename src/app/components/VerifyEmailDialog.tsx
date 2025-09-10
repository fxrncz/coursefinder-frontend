"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { useToast } from "./ui/toast";
import { apiUrl } from "../../lib/api";

interface VerifyEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified?: (user?: any) => void;
}

const RESEND_COOLDOWN_MS = 30000;

const VerifyEmailDialog: React.FC<VerifyEmailDialogProps> = ({ isOpen, onOpenChange, email, onVerified }) => {
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setError("");
    }
  }, [isOpen]);

  const remainingMs = Math.max(0, cooldownUntil - Date.now());
  const remainingSeconds = useMemo(() => Math.ceil(remainingMs / 1000), [remainingMs]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const id = window.setInterval(() => {
      // trigger re-render
      setCooldownUntil((prev) => prev);
    }, 500);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  const validate = () => {
    if (!code.trim()) {
      setError("Please enter the 6-digit code");
      return false;
    }
    if (!/^[0-9]{6}$/.test(code.trim())) {
      setError("Code must be 6 digits");
      return false;
    }
    return true;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    
    // Show immediate feedback
    showToast({ 
      title: "Verifying...", 
      description: "Please wait while we verify your code.", 
      variant: "info", 
      durationMs: 2000 
    });
    
    try {
      const startTime = Date.now();
      const resp = await fetch(apiUrl('/api/verify/confirm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await resp.json();
      const endTime = Date.now();
      
      if (data.success) {
        showToast({ 
          title: "🎉 Email verified!", 
          description: "Your account is now ready to use. Welcome to CourseFinder!", 
          variant: "success", 
          durationMs: 4000 
        });
        onOpenChange(false);
        if (onVerified) onVerified(data.user);
      } else {
        setError(data.message || 'Invalid code');
        showToast({ 
          title: "Verification failed", 
          description: data.message || 'Please check your code and try again.', 
          variant: "error", 
          durationMs: 3000 
        });
      }
    } catch (err) {
      setError('Network error. Please try again.');
      showToast({ 
        title: "Network error", 
        description: 'Please check your connection and try again.', 
        variant: "error", 
        durationMs: 3000 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (remainingMs > 0) return;
    setResending(true);
    setError("");
    
    showToast({ 
      title: "Sending new code...", 
      description: "Please wait while we send a new verification code.", 
      variant: "info", 
      durationMs: 2000 
    });
    
    try {
      const resp = await fetch(apiUrl('/api/verify/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();
      if (data.success) {
        showToast({ 
          title: "✅ New code sent!", 
          description: `We sent a new verification code to ${email}.`, 
          variant: "success", 
          durationMs: 4000 
        });
        setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);
      } else {
        showToast({ 
          title: "Unable to send", 
          description: data.message || 'Please try again later.', 
          variant: "error", 
          durationMs: 3500 
        });
      }
    } catch {
      showToast({ 
        title: "Network error", 
        description: 'Please check your connection and try again.', 
        variant: "error", 
        durationMs: 3500 
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white p-8">
        <DialogHeader className="text-center">
          <DialogTitle className={`${localGeorama.className} text-[#353535] text-3xl font-bold mb-2 text-center`}>Enter verification code</DialogTitle>
          <DialogDescription className={`${localGeorgia.className} text-[#353535] text-base leading-relaxed text-center`}>
            We sent a 6-digit code to <span className="font-semibold">{email}</span>. Enter it below to verify your email.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="______"
            className={`${localGeorama.className} tracking-[0.6em] text-center text-xl py-6`}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || remainingMs > 0}
              className={`${localGeorgia.className} text-[#A75F00] underline disabled:text-gray-400`}
            >
              {remainingMs > 0 ? `Resend in ${remainingSeconds}s` : resending ? 'Sending…' : 'Resend code'}
            </button>
            <Button
              type="submit"
              disabled={submitting}
              className={`${localGeorama.className} bg-[#A75F00] hover:bg-[#8B4F00] text-white font-bold tracking-wider px-6 py-6 rounded-md text-sm`}
            >
              {submitting ? 'VERIFYING…' : 'VERIFY'}
            </Button>
          </div>
        </form>

        <DialogFooter className="mt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={`${localGeorgia.className} text-[#A75F00] underline mx-auto`}
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyEmailDialog;


