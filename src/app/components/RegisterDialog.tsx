"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { localGeorgiaItalic } from "../fonts";
import { User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/toast";
import { apiUrl } from "../../lib/api";
import VerifyEmailDialog from "./VerifyEmailDialog";

interface RegisterDialogProps {
  triggerText: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  isTransitioning?: boolean;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ triggerText, className, isOpen: externalIsOpen, onOpenChange, onSwitchToLogin, isTransitioning }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const router = useRouter();
  const { showToast } = useToast();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
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
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[a-zA-Z]/.test(formData.password)) {
      setError("Password must contain at least one letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
      console.log("Sending registration request to:", apiUrl('/api/auth/register'));
      console.log("Request data:", { username: formData.username, email: formData.email, password: '[HIDDEN]' });
      
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        // Registration successful, now show verification modal
        if (data.requiresVerification) {
          setRegisteredEmail(formData.email);
          setVerifyOpen(true);
          showToast({ 
            title: 'Registration successful!', 
            description: 'Please check your email for verification code.', 
            variant: 'success', 
            durationMs: 5000 
          });
        } else if (data.user) {
          // Direct registration success (fallback)
          localStorage.setItem('userData', JSON.stringify(data.user));
          showToast({ title: 'Registration complete', description: 'Welcome to CourseFinder!', variant: 'success', durationMs: 3000 });
          setIsOpen(false);
          setFormData({ username: "", email: "", password: "", confirmPassword: "" });
          router.push('/userpage');
        }
      } else {
        setError(data.message || "Registration failed");
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again. Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
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
            Register
          </DialogTitle>
          <DialogDescription className={`${localGeorgia.className} text-[#353535] text-base leading-relaxed mb-2 text-center`}>
            Ready to get started? Sign up and take our{" "}
            <span className="text-[#A75F00] underline cursor-pointer hover:text-[#8B4F00]">
              personality evaluation test
            </span>{" "}
            to receive personalized course recommendations just for you.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Display Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="username"
                type="text"
                placeholder="username123"
                required
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`${localGeorgia.className} text-base w-full pl-10 pr-5 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Email Address <span className="text-red-500">*</span>
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
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`${localGeorgia.className} w-full pl-10 pr-5 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={`${localGeorgia.className} text-black text-base font-medium`}>
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder=""
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`${localGeorgia.className} w-full pl-5 pr-5 py-5 text-base border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`${localGeorama.className} w-full bg-[#A75F00] hover:bg-[#8B4F00] text-white font-bold tracking-wider py-6 rounded-md text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "REGISTERING..." : "REGISTER"}
          </Button>
        </form>
        
        <div className="flex justify-center items-center mt-2 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <p className={`${localGeorgia.className} text-[#A75F00] text-base`}>
              Already have an account?
            </p>
            <button 
              type="button"
              className={`${localGeorgiaItalic.className} text-[#A75F00] underline text-base hover:text-[#8B4F00] transition-all duration-200 hover:scale-105`}
              onClick={onSwitchToLogin || (() => {
                console.log("Switch to login");
              })}
            >
              Login Here
            </button>
          </div>
        </div>
      </DialogContent>
      
      {/* Email Verification Modal */}
      <VerifyEmailDialog
        isOpen={verifyOpen}
        onOpenChange={setVerifyOpen}
        email={registeredEmail}
        onVerified={(user) => {
          if (user) {
            localStorage.setItem('userData', JSON.stringify(user));
            showToast({ 
              title: 'Email verified!', 
              description: 'Welcome to CourseFinder!', 
              variant: 'success', 
              durationMs: 3000 
            });
            setIsOpen(false);
            setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            router.push('/userpage');
          }
        }}
      />
    </Dialog>
  );
};

export default RegisterDialog; 