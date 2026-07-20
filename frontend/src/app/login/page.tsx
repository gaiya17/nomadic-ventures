"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, redirectIfAuthenticated } = useAuth();

  // If already logged in, push to dashboard
  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError(response.data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Success! Pass token and user data to the auth hook
      login(response.data.admin);
      
    } catch (err) {
      setError("Cannot connect to server. Is the backend running?");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030213]">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F4B942] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F4B942] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] p-8"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-widest text-white mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              NOMADIC VENTURES
            </h1>
          </Link>
          <p className="text-sm text-gray-400 tracking-wide uppercase">Admin Portal</p>
        </div>

        <div className="bg-[#0A091A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#F4B942] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#F4B942] focus:border-[#F4B942] transition-all"
                  placeholder="admin@nomadicventures.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#F4B942] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#F4B942] focus:border-[#F4B942] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F4B942] hover:bg-[#e0a83b] text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            Protected area. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
