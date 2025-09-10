"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";
import { apiUrl } from "../../lib/api";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFF4E6] p-4">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = useMemo(() => params.get("email") || "", [params]);
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (!token || !email) {
      setError("Invalid or expired reset link");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    
    try {
      // First confirm token (purpose=reset)
      const verify = await fetch(apiUrl('/api/verify/confirm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: token, purpose: 'reset' })
      });
      const v = await verify.json();
      if (!v.success) {
        setError(v.message || 'Invalid or expired link');
        return;
      }
      
      // Then set new password
      const resp = await fetch(apiUrl('/api/password/reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password, token })
      });
      const data = await resp.json();
      
      if (data.success) {
        setSuccess('✅ Password updated successfully! Redirecting...');
        // If user is logged in, go back to settings tab; otherwise home
        const stored = localStorage.getItem('userData');
        const target = stored ? '/userpage?tab=settings' : '/';
        setTimeout(() => router.push(target), 2000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF4E6] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-[#A75F00] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className={`${localGeorama.className} text-2xl font-bold text-[#353535] mb-2`}>Set a new password</h1>
          <p className={`${localGeorgia.className} text-sm text-[#666]`}>for {email}</p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`${localGeorgia.className} block text-sm font-medium text-[#353535] mb-2`}>
              New password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={`${localGeorgia.className} w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className={`${localGeorgia.className} block text-sm font-medium text-[#353535] mb-2`}>
              Confirm new password
            </label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={confirm} 
                onChange={(e) => setConfirm(e.target.value)} 
                className={`${localGeorgia.className} w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:border-[#A75F00] focus:ring-1 focus:ring-[#A75F00] focus:outline-none transition-all duration-200`}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`${localGeorama.className} w-full bg-[#A75F00] hover:bg-[#8B4F00] disabled:bg-gray-400 text-white font-semibold py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Update password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}


