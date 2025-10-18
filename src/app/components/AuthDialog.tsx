"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { localGeorgiaItalic } from "../fonts";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/toast";
import { apiUrl } from "../../lib/api";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

interface AuthDialogProps {
  triggerText: string;
  variant?: "login" | "create";
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSwitchToRegister?: () => void;
  isTransitioning?: boolean;
  onLoginSuccess?: (user: any) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  triggerText, 
  variant = "login", 
  className, 
  isOpen: externalIsOpen, 
  onOpenChange, 
  onSwitchToRegister, 
  isTransitioning,
  onLoginSuccess 
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const router = useRouter();
  const { showToast } = useToast();
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending login request to:", apiUrl('/api/auth/login'));
      console.log("Request data:", { email: formData.email, password: '[HIDDEN]' });
      
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        // Reset form
        setFormData({
          email: "",
          password: ""
        });
        
        // Close dialog
        setIsOpen(false);
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Call onLoginSuccess if provided
        if (onLoginSuccess && data.user) {
          onLoginSuccess(data.user);
        }
        
        // Redirect to userpage
        router.push('/userpage');
        
        // Show success toast
        showToast({
          title: "Welcome back",
          description: "You have logged in successfully.",
          variant: "success",
          durationMs: 3000,
        });
      } else {
        setError(data.message || "Login failed");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again. Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerText && (
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className={`${localGeorama.className} tracking-wider text-[#A75F00] bg-transparent border-none px-2 py-1 focus:outline-none hover:text-yellow-300 hover:bg-transparent transition-colors duration-200 text-sm ${className || ''}`}
          >
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`sm:max-w-[425px] bg-white p-8 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <DialogHeader className="text-center">
          <DialogTitle className={`${localGeorama.className} text-[#353535] text-4xl font-bold mb-2 text-center`}>
            Log In
          </DialogTitle>
          <DialogDescription className={`${localGeorgia.className} text-[#353535] text-base leading-relaxed mb-2 text-center`}>
            New here? Create a free profile by taking our{" "}
            <span className="text-[#A75F00] underline cursor-pointer hover:text-[#8B4F00]">
              personality evaluation test
            </span>{" "}
            and get personalized course suggestions based on your answers.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`${localGeorgia.className} text-base w-full pl-10 pr-5 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`${localGeorgia.className} w-full pl-10 pr-12 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`${localGeorama.className} w-full bg-[#A75F00] hover:bg-[#8B4F00] text-white font-bold tracking-wider py-6 rounded-md text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </Button>
          
          <button 
            type="button"
            className={`${localGeorgia.className} text-[#A75F00] underline text-base hover:text-[#8B4F00] block w-full text-center -mt-4`}
            onClick={() => setForgotOpen(true)}
          >
            Forgot password?
          </button>
        </form>
        
        <div className="flex justify-center items-center mt-0 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <p className={`${localGeorgia.className} text-[#A75F00] text-base`}>
              Doesn't have an account?
            </p>
            <button 
              type="button"
              className={`${localGeorgiaItalic.className} text-[#A75F00] underline text-base hover:text-[#8B4F00] transition-all duration-200 hover:scale-105`}
              onClick={handleSwitchToRegister}
            >
              Register Here
            </button>
          </div>
        </div>
      </DialogContent>
      <ForgotPasswordDialog isOpen={forgotOpen} onOpenChange={setForgotOpen} />
    </Dialog>
  );
};

export default AuthDialog; 