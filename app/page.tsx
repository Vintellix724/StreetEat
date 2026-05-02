'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Check for network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (!navigator.onLine) {
      setTimeout(() => setIsOffline(true), 0);
    }

    // 2. Setup the background logic and navigation timer
    const timer = setTimeout(() => {
      try {
        // Here we simulate the parallel background checks mentioned in the requirements:
        // - Check AsyncStorage: is user already logged in?
        // - Check user role: customer / vendor / admin?
        // - Load app config from Firebase RemoteConfig
        
        // Since Firebase isn't initialized yet in this fresh project, we'll
        // simulate a "null" auth state and navigate to the Role Selection screen.
        
        const cachedRole = localStorage.getItem('userRole');
        
        if (!cachedRole) {
          router.push('/role-select');
        } else if (cachedRole === 'customer') {
          router.push('/customer-home');
        } else if (cachedRole === 'vendor') {
          router.push('/vendor-dashboard');
        } else if (cachedRole === 'admin') {
          router.push('/admin-dashboard');
        }
      } catch (error) {
        console.error('Error during splash screen checks', error);
        router.push('/role-select');
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  // Screen size: 390x844px concept applied flexibly
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#1A1A2E]">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Offline Toast */}
      {isOffline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 px-4 py-2 bg-red-500/90 text-white rounded-full text-sm font-medium shadow-lg backdrop-blur-md z-50"
        >
          No internet connection
        </motion.div>
      )}

      {/* Center Content */}
      <div className="flex flex-col items-center z-10 w-full max-w-[390px] px-6">
        {/* LOGO ICON */}
        {/* opacity 0->1, scale 0.8->1.0, duration 400ms, ease-out-back */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} // equivalent to custom ease-out-back
          className="relative flex items-center justify-center w-[80px] h-[80px] bg-white/15 rounded-[20px] mb-4 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10"
        >
          {/* Custom SVG bowl+pin logo merged */}
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            {/* Pin */}
            <path d="M20 2C13.3726 2 8 7.37258 8 14C8 23 20 34 20 34C20 34 32 23 32 14C32 7.37258 26.6274 2 20 2Z" fill="transparent" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="14" r="4" fill="transparent" stroke="white" strokeWidth="2.5"/>
            {/* Bowl */}
            <path d="M2 30C2 39.9411 10.0589 48 20 48C29.9411 48 38 39.9411 38 30L2 30Z" fill="#FF6B00" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* APP NAME */}
        {/* opacity 0->1, translateY 20->0, duration 350ms, ease-out */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
          className="m-0 font-baloo text-[40px] font-[800] text-white tracking-[-1.5px]"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
        >
          StreetEats
        </motion.h1>

        {/* TAGLINE */}
        {/* opacity 0->1, duration 300ms, ease-in, delay 200ms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeIn', delay: 0.4 }} // Total delay logically starts around same time, aligning with requirement
          className="mt-2 font-dm-sans italic text-[15px] text-white/75 tracking-[0.3px]"
        >
          Apna Khana. Apna Dukaan.
        </motion.p>
      </div>

      {/* BOTTOM SECTION */}
      <div className="absolute bottom-[48px] flex flex-col items-center z-10 w-full">
        {/* LOADING BAR Container */}
        <div className="w-[160px] h-[3px] bg-white/20 rounded-[2px] overflow-hidden mb-2">
          {/* LOADING BAR Fill */}
          {/* width 0->160px, duration 2000ms, ease-in-out, delay 500ms */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
            className="h-full bg-white rounded-[2px]"
          />
        </div>

        {/* VERSION TEXT */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="m-0 font-mono text-[10px] text-white/40 uppercase tracking-[1px]"
        >
          v1.0.0
        </motion.p>
      </div>
    </div>
  );
}
