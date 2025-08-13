"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { localGeorama } from "../fonts";
import { localGeorgia } from "../fonts";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = useMemo(() => params.get("email") || "", [params]);
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      const verify = await fetch('http://localhost:8080/api/verify/confirm', {
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
      const resp = await fetch('http://localhost:8080/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password })
      });
      const data = await resp.json();
      if (data.success) {
        setSuccess('Password updated. Redirecting...');
        // If user is logged in, go back to settings tab; otherwise home
        const stored = localStorage.getItem('userData');
        const target = stored ? '/userpage?tab=settings' : '/';
        setTimeout(() => router.push(target), 1500);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF4E6] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className={`${localGeorama.className} text-2xl font-bold text-[#353535] text-center`}>Set a new password</h1>
        <p className={`${localGeorgia.className} text-center text-sm mt-2 text-[#353535]`}>for {email}</p>
        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
        {success && <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{success}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={`${localGeorgia.className} block text-sm mb-1`}>New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className={`${localGeorgia.className} block text-sm mb-1`}>Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <button type="submit" disabled={loading} className={`${localGeorama.className} w-full bg-[#A75F00] hover:bg-[#8B4F00] text-white font-semibold py-3 rounded-md`}>{loading ? 'Updating...' : 'Update password'}</button>
        </form>
      </div>
    </div>
  );
}


