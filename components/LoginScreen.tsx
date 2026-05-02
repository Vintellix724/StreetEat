'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginScreenProps {
  role: 'customer' | 'vendor';
}

export default function LoginScreen({ role }: LoginScreenProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpSheet, setShowOtpSheet] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [otpError, setOtpError] = useState(false);
  const [shake, setShake] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP
  useEffect(() => {
    if (showOtpSheet && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showOtpSheet]);

  const handlePhoneChange = (val: string) => {
    // Only allow digits
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  const isPhoneValid = phoneNumber.length === 10 && /^[6-9]/.test(phoneNumber);

  const handleSendOtp = () => {
    if (!isPhoneValid) return;
    setIsSendingOtp(true);
    // Mock network request
    setTimeout(() => {
      setIsSendingOtp(false);
      setShowOtpSheet(true);
      setCountdown(30);
      setOtp(['', '', '', '']);
    }, 1200);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length > 1) return; // Prevent paste issues for now
    
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setOtpError(false);

    if (cleaned !== '' && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto verify on 4th digit
    if (index === 3 && cleaned !== '') {
      handleVerify(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpString: string) => {
    if (otpString.length !== 4) return;
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      if (otpString === '1234') { // Mock success condition
        if (role === 'customer') {
          const onboarded = localStorage.getItem('onboarded');
          router.push(onboarded === 'true' ? '/customer-home' : '/customer-profile-setup');
        } else {
          router.push('/vendor-dashboard');
        }
      } else {
        setOtpError(true);
        setShake(prev => prev + 1);
        setOtp(['', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    if (role === 'customer') {
      const onboarded = localStorage.getItem('onboarded');
      router.push(onboarded === 'true' ? '/customer-home' : '/customer-profile-setup');
    } else {
      router.push('/vendor-dashboard');
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full font-sans bg-[#FAFAF8] overflow-hidden">
      
      {/* TOP HALF - ILLUSTRATION */}
      <div className="relative h-[340px] shrink-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center overflow-hidden">
        
        {/* Role Badge */}
        <div 
          className={`absolute top-5 left-5 px-3 py-1.5 rounded-[12px] flex items-center gap-1.5 z-10 
            ${role === 'customer' ? 'bg-white text-[#FF6B00]' : 'bg-[#1A1A2E] text-white'}`}
        >
          <span className="text-[14px] leading-none">{role === 'customer' ? '🍴' : '🛒'}</span>
          <span className="font-dm-sans font-medium text-[13px] capitalize">{role}</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-5 right-5 w-[36px] h-[36px] rounded-full bg-white/25 flex items-center justify-center z-10 transition-colors hover:bg-white/40"
        >
          <ChevronLeft size={20} className="text-white pr-0.5" />
        </button>

        {/* Vector SVG Stall Illustration (Flat Style) */}
        <div className="relative w-full max-w-[280px] h-[200px] flex items-center justify-center mt-[-20px] svg-container">
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stars / Sparkles */}
            <path d="M 20 40 L 25 35 L 30 40 L 25 45 Z" fill="white" opacity="0.8" />
            <path d="M 170 30 L 173 27 L 176 30 L 173 33 Z" fill="white" opacity="0.6" />
            <path d="M 180 90 L 184 86 L 188 90 L 184 94 Z" fill="white" opacity="0.9" />
            <path d="M 30 110 L 33 107 L 36 110 L 33 113 Z" fill="white" opacity="0.7" />

            {/* String lights */}
            <path d="M 10 50 Q 50 70 100 50 T 190 50" stroke="white" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
            <circle cx="30" cy="58" r="2" fill="#FFE500" />
            <circle cx="70" cy="61" r="2" fill="#FFE500" />
            <circle cx="130" cy="61" r="2" fill="#FFE500" />
            <circle cx="170" cy="58" r="2" fill="#FFE500" />

            {/* Steam lines */}
            <path d="M 100 80 Q 95 70 100 60 T 100 40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M 115 85 Q 110 75 115 65 T 110 45" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M 85 85 Q 90 75 85 65 T 90 45" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

            {/* Canopy */}
            <path d="M 40 50 L 160 50 L 175 70 L 25 70 Z" fill="#1A1A2E" />
            <path d="M 40 50 L 60 50 L 55 70 L 25 70 Z" fill="white" />
            <path d="M 80 50 L 100 50 L 105 70 L 75 70 Z" fill="white" />
            <path d="M 120 50 L 140 50 L 145 70 L 115 70 Z" fill="white" />
            {/* Canopy scallops */}
            <circle cx="35" cy="70" r="10" fill="white" />
            <circle cx="55" cy="70" r="10" fill="#1A1A2E" />
            <circle cx="75" cy="70" r="10" fill="white" />
            <circle cx="95" cy="70" r="10" fill="#1A1A2E" />
            <circle cx="115" cy="70" r="10" fill="white" />
            <circle cx="135" cy="70" r="10" fill="#1A1A2E" />
            <circle cx="155" cy="70" r="10" fill="white" />
            <circle cx="170" cy="70" r="5" fill="#1A1A2E" />

            {/* Cart body */}
            <rect x="40" y="90" width="120" height="50" rx="8" fill="white" />
            <rect x="50" y="100" width="100" height="10" rx="5" fill="#1A1A2E" opacity="0.1" />
            
            {/* Pot */}
            <path d="M 80 90 L 80 110 C 80 120 120 120 120 110 L 120 90 Z" fill="#1A1A2E" />
            
            {/* Wheels */}
            <circle cx="60" cy="140" r="12" fill="none" stroke="#1A1A2E" strokeWidth="4" />
            <circle cx="60" cy="140" r="4" fill="#FFE500" />
            <circle cx="140" cy="140" r="12" fill="none" stroke="#1A1A2E" strokeWidth="4" />
            <circle cx="140" cy="140" r="4" fill="#FFE500" />
            
            {/* Poles */}
            <rect x="45" y="70" width="4" height="20" fill="white" />
            <rect x="151" y="70" width="4" height="20" fill="white" />
            
            {/* Ground line */}
            <path d="M 10 150 L 190 150" stroke="white" strokeWidth="2" strokeDasharray="8 8" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-[32px] overflow-hidden translate-y-[1px]">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-[120px]" preserveAspectRatio="none">
            <path fill="#FAFAF8" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,213.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* BOTTOM SHEET - FORM */}
      <div className="flex-1 bg-[#FAFAF8] px-[28px] pt-[24px] pb-[34px] flex flex-col z-10 shrink-0">
        
        {/* Heading */}
        <h1 className="font-baloo font-bold text-[26px] text-[#1A1A1A] m-0 leading-tight">
          {role === 'customer' ? 'Welcome Back! 👋' : 'Start Selling Today! 🚀'}
        </h1>
        <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-2 mb-6">
          Login ya signup — dono ek jagah
        </p>

        {/* Google Login Button */}
        <motion.button 
          whileHover={{ scale: 0.99 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center h-[54px] bg-white border-[1.5px] border-[#DADCE0] rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#F8F8F8] transition-colors relative"
        >
          <div className="absolute left-[18px] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <span className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A]">Continue with Google</span>
        </motion.button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-[1px] bg-[#E8E8E8]"></div>
          <span className="px-3 font-dm-sans text-[12px] text-[#BBBBC0]">OR</span>
          <div className="flex-1 h-[1px] bg-[#E8E8E8]"></div>
        </div>

        {/* Phone Input */}
        <div className="flex flex-col mb-4">
          <label className="font-dm-sans font-medium text-[13px] text-[#1A1A1A] mb-1">
            Phone Number
          </label>
          <div className={`flex items-center h-[54px] bg-white border-[1.5px] rounded-[14px] transition-all overflow-hidden ${phoneNumber.length > 0 && !isPhoneValid && phoneNumber.length === 10 ? 'border-[#FF3B30]' : 'border-[#E8E8E8] focus-within:border-[#FF6B00] focus-within:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]'}`}>
            <button className="flex items-center justify-center w-[88px] h-full shrink-0 border-r border-[#E8E8E8] hover:bg-gray-50 transition-colors">
              <span className="text-[20px] mr-1.5 leading-none">🇮🇳</span>
              <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A] mt-0.5">+91</span>
            </button>
            <input 
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter mobile number"
              className="flex-1 h-full pl-[14px] pr-4 font-dm-sans text-[16px] text-[#1A1A1A] placeholder:text-[#BBBBC0] outline-none bg-transparent"
              maxLength={10}
            />
          </div>
          {phoneNumber.length === 10 && !isPhoneValid && (
            <span className="font-dm-sans text-[12px] text-[#FF3B30] mt-1">Invalid number. Enter exactly 10 digits starting with 6-9.</span>
          )}
        </div>

        {/* Send OTP Button */}
        <motion.button
          whileHover={isPhoneValid && !isSendingOtp ? { scale: 0.99 } : {}}
          whileTap={isPhoneValid && !isSendingOtp ? { scale: 0.98 } : {}}
          onClick={handleSendOtp}
          disabled={!isPhoneValid || isSendingOtp}
          className={`flex items-center justify-center h-[54px] rounded-[14px] transition-colors mt-auto ${isPhoneValid ? 'bg-[#FF6B00] hover:bg-[#E65100]' : 'bg-[#FFD4B3]'} ${isSendingOtp && 'bg-[#FF6B00]'}`}
        >
          {isSendingOtp ? (
            <Loader2 size={20} className="text-white animate-spin" />
          ) : (
            <span className={`font-dm-sans font-bold text-[16px] ${isPhoneValid ? 'text-white' : 'text-white/80'}`}>
              Send OTP &rarr;
            </span>
          )}
        </motion.button>

        {/* Terms Text */}
        <p className="font-dm-sans text-[12px] text-[#6B6B6B] text-center mt-4 leading-[18px]">
          By continuing, you agree to our<br/>
          <Link href="#" className="text-[#FF6B00] underline decoration-[#FF6B00]/50 hover:decoration-[#FF6B00]">Terms of Service</Link> & <Link href="#" className="text-[#FF6B00] underline decoration-[#FF6B00]/50 hover:decoration-[#FF6B00]">Privacy Policy</Link>
        </p>

      </div>

      {/* OTP BOTTOM SHEET */}
      <AnimatePresence>
        {showOtpSheet && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpSheet(false)}
              className="absolute inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
            />
            
            {/* Sheet */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 h-[420px] bg-[#FAFAF8] rounded-t-[32px] z-50 flex flex-col items-center px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              {/* Handle */}
              <div className="w-[40px] h-[4px] rounded-full bg-[#E8E8E8] mt-3 mb-6 shrink-0" />

              <h2 className="font-baloo font-bold text-[24px] text-[#1A1A1A] m-0 mb-2">OTP Bhejo! 📱</h2>
              
              <p className="font-dm-sans text-[14px] text-[#6B6B6B] text-center mb-1">
                Code bheja gaya <span className="font-medium text-[#1A1A1A]">+91 {phoneNumber.slice(0,5)}-{phoneNumber.slice(5)}</span> pe
              </p>
              
              <button 
                onClick={() => setShowOtpSheet(false)}
                className="font-dm-sans text-[13px] text-[#FF6B00] hover:underline"
              >
                Number change karo
              </button>

              {/* OTP Input Boxes */}
              <motion.div 
                animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="flex gap-3 mt-8 mb-6"
              >
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="tel"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-[64px] h-[64px] rounded-[14px] border-[2px] text-center text-[28px] font-bold outline-none transition-all font-space-grotesk
                      ${otpError ? 'border-[#FF3B30]' : 
                        otp[index] !== '' ? 'border-[#FF6B00] bg-[#FFF8F5]' : 
                        'border-[#E8E8E8] bg-white focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)] focus:scale-[1.05]'
                      }
                    `}
                  />
                ))}
              </motion.div>
              
              {otpError && (
                <p className="font-dm-sans text-[13px] text-[#FF3B30] -mt-4 mb-4">Wrong OTP. Try again.</p>
              )}

              {/* Resend */}
              <div className="mt-2 mb-4 h-[20px] flex items-center justify-center">
                {countdown > 0 ? (
                  <p className="font-dm-sans text-[13px] text-[#6B6B6B]">
                    Resend OTP in <span className="font-medium">{countdown}s</span>
                  </p>
                ) : (
                  <button 
                    onClick={() => { setCountdown(30); setOtpError(false); }} // Mock resend
                    className="font-dm-sans text-[13px] text-[#FF6B00] underline decoration-[#FF6B00]/50 hover:decoration-[#FF6B00]"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <motion.button
                whileHover={otp.join('').length === 4 && !isVerifying ? { scale: 0.99 } : {}}
                whileTap={otp.join('').length === 4 && !isVerifying ? { scale: 0.98 } : {}}
                onClick={() => handleVerify(otp.join(''))}
                disabled={otp.join('').length !== 4 || isVerifying}
                className={`flex w-full items-center justify-center h-[54px] rounded-[14px] transition-colors mt-2 
                  ${otp.join('').length === 4 ? 'bg-[#FF6B00] hover:bg-[#E65100]' : 'bg-[#FFD4B3]'}
                  ${isVerifying && 'bg-[#FF6B00]'}
                `}
              >
                {isVerifying ? (
                  <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                  <span className={`font-dm-sans font-bold text-[16px] ${otp.join('').length === 4 ? 'text-white' : 'text-white/80'}`}>
                    Verify & Continue &rarr;
                  </span>
                )}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
