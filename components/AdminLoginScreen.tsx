"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Mail,
  CheckCircle,
  Eye,
  EyeOff,
  XCircle,
  ChevronLeft
} from "lucide-react";

export default function AdminLoginScreen() {
  const router = useRouter();
  
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");
  
  const [showForgotSheet, setShowForgotSheet] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Email Validation
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  useEffect(() => {
    // Check initial session & lockout
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setTimeout(() => {
        setEmail(savedEmail);
        setRememberMe(true);
      }, 0);
    }
    
    const lockout = localStorage.getItem("lockoutUntil");
    if (lockout && parseInt(lockout) > Date.now()) {
      setTimeout(() => setLockoutUntil(parseInt(lockout)), 0);
    }
  }, []);

  useEffect(() => {
    // Lockout countdown timer
    let interval: NodeJS.Timeout;
    if (lockoutUntil && lockoutUntil > Date.now()) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = lockoutUntil - now;
        if (diff <= 0) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          localStorage.removeItem("lockoutUntil");
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleLogin = async () => {
    if (lockoutUntil) return;
    if (!isValidEmail || !password) {
      setErrorMsg("Email aur password dono format check karo.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // Simulate Firebase logic
    try {
      // Fake network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "admin@streeteats.app" && password === "admin123") {
        // Success
        setSuccess(true);
        if (rememberMe) {
          localStorage.setItem("adminEmail", email);
        } else {
          localStorage.removeItem("adminEmail");
        }
        localStorage.setItem("adminSession", "mock-uid-123");
        localStorage.setItem("lastLogin", Date.now().toString());
        
        setTimeout(() => {
          router.replace("/admin-dashboard");
        }, 600);
      } else {
        // Validation failed
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      
      if (attempts >= 5) {
        const lockoutTime = Date.now() + 30 * 60 * 1000; // 30 mins
        setLockoutUntil(lockoutTime);
        localStorage.setItem("lockoutUntil", lockoutTime.toString());
        setErrorMsg("Too many attempts");
      } else {
        setErrorMsg("Email ya password galat hai");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail) return;
    // Simulate sendPasswordResetEmail
    await new Promise(res => setTimeout(res, 800));
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotSheet(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050508] font-sans flex items-center justify-center overflow-hidden">
      
      {/* SVG Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="40" y1="0" x2="40" y2="40" stroke="rgba(255,107,0,0.04)" strokeWidth="1" />
            <line x1="0" y1="40" x2="40" y2="40" stroke="rgba(255,107,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* Glow Orbs */}
      <div className="absolute -top-[80px] -right-[80px] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)', opacity: 0.06 }} />
      <div className="absolute -bottom-[60px] -left-[60px] w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)', opacity: 0.04 }} />

      <div className="w-full max-w-[390px] min-h-[844px] relative flex flex-col items-center">
        
        {/* Top Security Badge */}
        <div className="absolute top-[60px] w-full flex justify-center items-center gap-[6px]">
          <div className="w-[40px] h-[1px] bg-[rgba(255,107,0,0.3)]" />
          <Lock size={14} className="text-[#FF6B00]" />
          <span className="font-dm-sans font-bold text-[11px] text-[#FF6B00] tracking-[3px]">ADMIN PORTAL</span>
          <div className="w-[40px] h-[1px] bg-[rgba(255,107,0,0.3)]" />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.push('/role-select')}
          className="absolute top-[60px] left-[24px] w-[32px] h-[32px] rounded-full bg-[#13131F] border border-[#252538] flex items-center justify-center text-[#EFEFFF] z-10"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Logo Section */}
        <div className="mt-[120px] flex flex-col items-center">
          <div className="relative">
            <motion.div 
              className="absolute -inset-[8px] rounded-[28px] border-2 border-[rgba(255,107,0,0.3)] pointer-events-none"
              animate={{ scale: [1, 1.08, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-[#FF6B00] to-[#FF4500] shadow-[0_0_40px_rgba(255,107,0,0.4),0_0_80px_rgba(255,107,0,0.15)] flex items-center justify-center text-[32px]">
              🍜
            </div>
          </div>
          
          <h1 className="mt-[16px] font-baloo-2 font-bold text-[32px] text-[#EFEFFF] tracking-[-0.5px]">StreetEats</h1>
          <p className="mt-[4px] font-dm-sans text-[14px] text-[#6B6B6B]">Admin Control Panel</p>
          
          <div className="mt-[10px] bg-[#0F0F1A] border border-[#252538] rounded-[20px] px-[12px] py-[4px]">
            <span className="font-dm-sans text-[11px] text-[#6B6B6B]">v1.0.0 Enterprise</span>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="w-[calc(100%-48px)] mt-[40px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[24px] p-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-10">
          
          {/* Email Input */}
          <div className="flex flex-col">
            <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Admin Email</label>
            <div className={`h-[54px] bg-[#13131F] border-w-[1.5px] rounded-[14px] px-[16px] flex items-center transition-all ${errorMsg && !lockoutUntil ? 'border-[#FF3B30]' : 'border-[#252538] focus-within:border-[#FF6B00] focus-within:shadow-[0_0_0_3px_rgba(255,107,0,0.12)]'}`}>
              <Mail size={20} className={`mr-[10px] ${errorMsg && !lockoutUntil ? 'text-[#FF3B30]' : 'text-[#6B6B6B]'} transition-colors`} />
              <input 
                type="email"
                placeholder="admin@streeteats.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!lockoutUntil}
                className="flex-1 bg-transparent text-[15px] font-dm-sans text-[#EFEFFF] placeholder:text-[#6B6B6B] outline-none"
              />
              {isValidEmail && <CheckCircle size={18} className="text-[#00C853]" />}
            </div>
            {errorMsg && !lockoutUntil && errorMsg.includes("format") && (
              <span className="mt-[4px] font-dm-sans text-[12px] text-[#FF3B30]">{errorMsg}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col mt-[14px]">
            <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Password</label>
            <div className={`h-[54px] bg-[#13131F] border-w-[1.5px] rounded-[14px] px-[16px] flex items-center transition-all ${errorMsg && !lockoutUntil ? 'border-[#FF3B30]' : 'border-[#252538] focus-within:border-[#FF6B00] focus-within:shadow-[0_0_0_3px_rgba(255,107,0,0.12)]'}`}>
              <Lock size={20} className={`mr-[10px] ${errorMsg && !lockoutUntil ? 'text-[#FF3B30]' : 'text-[#6B6B6B]'} transition-colors`} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!!lockoutUntil}
                className="flex-1 bg-transparent text-[15px] font-dm-sans text-[#EFEFFF] placeholder:text-[#6B6B6B] outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6B6B6B] focus:outline-none"
                disabled={!!lockoutUntil}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between mt-[14px]">
            <label className="flex items-center cursor-pointer group">
              <div className={`w-[20px] h-[20px] rounded-[6px] border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#FF6B00] border-[#FF6B00]' : 'bg-[#1C1C2E] border-[#252538] group-hover:border-[#FF6B00]'}`}>
                {rememberMe && <CheckCircle size={12} className="text-white fill-current" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={!!lockoutUntil}
              />
              <span className="ml-[8px] font-dm-sans text-[13px] text-[#6B6B6B]">Remember me</span>
            </label>
            
            <button 
              type="button"
              onClick={() => setShowForgotSheet(true)}
              className="font-dm-sans font-medium text-[13px] text-[#FF6B00]"
              disabled={!!lockoutUntil}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            onClick={handleLogin}
            disabled={loading || success || !!lockoutUntil}
            whileTap={{ scale: (loading || success || !!lockoutUntil) ? 1 : 0.97 }}
            className={`w-full mt-[24px] h-[56px] rounded-[16px] flex items-center justify-center font-dm-sans font-bold text-[16px] text-white transition-all overflow-hidden relative shadow-[0_8px_24px_rgba(255,107,0,0.4),0_2px_8px_rgba(255,107,0,0.2)] ${
              loading ? 'bg-[#CC5500]' : success ? 'bg-[#00C853]' : lockoutUntil ? 'bg-[#252538] opacity-50 shadow-none' : 'bg-gradient-to-r from-[#FF6B00] to-[#FF4500]'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-[10px]">
                <div className="w-[22px] h-[22px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-[10px]">
                <CheckCircle size={20} className="text-white" />
                <span>Access Granted</span>
              </div>
            ) : (
              <div className="flex items-center gap-[10px]">
                <Lock size={18} />
                <span>Login to Admin Panel</span>
              </div>
            )}
          </motion.button>
          
          {/* Error Cards */}
          <AnimatePresence>
            {errorMsg && !lockoutUntil && (
              <motion.div
                initial={{ opacity: 0, y: -10, x: 0 }}
                animate={{ opacity: 1, y: 0, x: [-8, 8, -8, 8, 0] }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-[12px] bg-[#130A0A] border border-[#FF3B30] rounded-[12px] p-[12px] flex flex-col overflow-hidden"
              >
                <div className="flex items-start gap-[8px]">
                  <XCircle size={18} className="text-[#FF3B30] shrink-0 mt-[2px]" />
                  <div className="flex flex-col">
                    <span className="font-dm-sans font-medium text-[13px] text-[#FF3B30]">
                      {errorMsg}
                    </span>
                    <span className="font-dm-sans text-[11px] text-[#FF9500] mt-[4px]">
                      {5 - failedAttempts} attempts remaining
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {lockoutUntil && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-[12px] bg-[#130A0A] border border-[#FF3B30] rounded-[12px] p-[12px] flex flex-col"
              >
                <span className="font-dm-sans font-semibold text-[14px] text-[#FF3B30]">
                  🔒 Account temporarily locked
                </span>
                <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px]">
                  30 minutes mein unlock ho jayega ya support se contact karo.
                </span>
                <span className="font-space-grotesk font-bold text-[18px] text-[#FF9500] mt-[8px]">
                  Unlocks in: {countdown}
                </span>
                <button className="mt-[12px] h-[36px] w-full rounded-[8px] border border-[#FF6B00] text-[#FF6B00] font-dm-sans font-medium text-[13px] flex items-center justify-center">
                  Contact Support
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Info Strip */}
        <div className="mt-[20px] flex items-center justify-center gap-[6px]">
          <Lock size={12} className="text-[#252538]" />
          <span className="font-dm-sans text-[11px] text-[#252538]">Secured by Firebase Auth · 256-bit encryption</span>
        </div>

        {/* Bottom Device Info */}
        <div className="absolute bottom-[40px] w-full flex justify-center">
          <span className="font-dm-sans text-[11px] text-[#1C1C2E]">Login attempt will be logged</span>
        </div>

        {/* Forgot Password Bottom Sheet */}
        <AnimatePresence>
          {showForgotSheet && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                onClick={() => setShowForgotSheet(false)}
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-[#13131F] rounded-t-[24px] p-[24px] z-50 pb-[40px]"
              >
                {forgotSent ? (
                  <div className="flex flex-col items-center justify-center py-[40px]">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#00C853]/10 flex items-center justify-center mb-[16px]">
                      <CheckCircle size={40} className="text-[#00C853]" />
                    </div>
                    <span className="font-baloo-2 font-bold text-[24px] text-[#EFEFFF]">Email bhej diya!</span>
                    <span className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[8px]">Check your inbox for reset link.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-[40px] h-[4px] bg-[#252538] rounded-full mb-[20px]" />
                    <h2 className="font-baloo-2 font-bold text-[20px] text-[#EFEFFF]">Password Reset</h2>
                    <p className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[4px] mb-[24px]">Admin email pe reset link bheja jayega</p>
                    
                    <div className="w-full h-[54px] bg-[#0A0A14] border border-[#252538] rounded-[14px] px-[16px] flex items-center focus-within:border-[#FF6B00]">
                      <Mail size={20} className="text-[#6B6B6B] mr-[10px]" />
                      <input 
                        type="email"
                        placeholder="Admin Email"
                        onChange={(e) => setForgotEmail(e.target.value)}
                        value={forgotEmail}
                        className="flex-1 bg-transparent font-dm-sans text-[15px] text-[#EFEFFF] outline-none"
                      />
                    </div>
                    
                    <button 
                      onClick={handleForgotSubmit}
                      disabled={!forgotEmail.includes('@')}
                      className="w-full mt-[24px] h-[54px] rounded-[16px] bg-gradient-to-r from-[#FF6B00] to-[#FF4500] font-dm-sans font-bold text-[16px] text-white disabled:opacity-50"
                    >
                      Send Reset Link &rarr;
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
