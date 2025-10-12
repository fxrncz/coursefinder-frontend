'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localGeorama } from '../../fonts';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { apiUrl } from '../../../lib/api';
import Image from 'next/image';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Check if admin is already logged in
  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin && admin.id) {
          // Admin already logged in, redirect to dashboard
          router.push('/admin/dashboard');
        }
      } catch (error) {
        // Invalid data, clear it
        localStorage.removeItem('adminData');
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
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
    setError('');

    try {
      console.log('Sending admin login request to:', apiUrl('/api/admin/login'));
      
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Admin login response status:', response.status);

      const data = await response.json();
      console.log('Admin login response:', data);

      if (data.success && data.admin) {
        // Store admin data in localStorage
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        
        console.log('Admin login successful, redirecting to dashboard...');
        
        // Show success message briefly before redirect
        setError('');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
        
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#002A3C] rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-[#FFF4E6]" />
          </div>
          <h1 className={`${localGeorama.className} text-4xl font-bold text-[#002A3C] mb-2`}>
            Admin Portal
          </h1>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg opacity-75`}>
            CourseFinder Administration
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-[#002A3C]/10">
          <h2 className={`${localGeorama.className} text-2xl font-bold text-[#002A3C] mb-6 text-center`}>
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className={`${localGeorama.className} block text-sm font-semibold text-[#002A3C] mb-2`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${localGeorama.className} w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#002A3C] focus:ring-2 focus:ring-[#002A3C]/20 transition-all`}
                  placeholder=""
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className={`${localGeorama.className} block text-sm font-semibold text-[#002A3C] mb-2`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${localGeorama.className} w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#002A3C] focus:ring-2 focus:ring-[#002A3C]/20 transition-all`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className={`${localGeorama.className} text-red-600 text-sm text-center`}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${localGeorama.className} w-full bg-[#002A3C] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#004E70] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className={`${localGeorama.className} text-[#002A3C] hover:text-[#004E70] font-semibold underline transition-colors`}
          >
            ← Back to CourseFinder Home
          </button>
        </div>
      </div>
    </div>
  );
}

