"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { Mail } from "lucide-react";
import { useToast } from "./ui/toast";
import { apiUrl } from "../../lib/api";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ isOpen, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const { showToast } = useToast();

  const validate = (): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError("");

    // Show immediate feedback
    showToast({
      title: "Sending reset link...",
      description: "Please wait while we process your request.",
      variant: "info",
      durationMs: 2000,
    });

    try {
      // Request a password reset link
      const response = await fetch(apiUrl('/api/verify/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'reset', resetBaseUrl: `${window.location.origin}/reset-password` })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onOpenChange(false);
        showToast({
          title: "✅ Reset link sent!",
          description: "If an account exists for this address, we sent a password reset link to your email.",
          variant: "success",
          durationMs: 5000,
        });
        setEmail("");
      } else {
        setError(data.message || "Something went wrong. Please try again later.");
        showToast({
          title: "Request failed",
          description: data.message || "Please try again later.",
          variant: "error",
          durationMs: 4000,
        });
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      showToast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "error",
        durationMs: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white p-8 transition-all duration-300 ease-in-out">
        <DialogHeader className="text-center">
          <DialogTitle className={`${localGeorama.className} text-[#353535] text-3xl font-bold mb-2 text-center`}>Forgot Password</DialogTitle>
          <DialogDescription className={`${localGeorgia.className} text-[#353535] text-base leading-relaxed text-center`}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fp-email" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="fp-email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`${localGeorgia.className} w-full pl-10 pr-5 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className={`${localGeorama.className} flex-1 text-[#A75F00] hover:bg-gray-100 h-11 justify-center`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`${localGeorama.className} flex-1 bg-[#A75F00] hover:bg-[#8B4F00] text-white font-bold tracking-wider h-11 rounded-md text-sm transition-all duration-200`}
            >
              {isLoading ? "SENDING..." : "SEND RESET LINK"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;


