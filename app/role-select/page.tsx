'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Check, WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (!navigator.onLine) {
      setTimeout(() => setIsOffline(true), 0);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRoleSelect = (role: 'customer' | 'vendor') => {
    // In a real app we might use navigator.vibrate for haptics
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // Light haptic
    }

    if (role === 'customer') {
      router.push('/customer-login');
    } else {
      router.push('/vendor-login');
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#1A1A1A] font-sans pb-[34px] overflow-y-auto overflow-x-hidden">
      {/* Offline Banner */}
      {isOffline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-[#FFF3E0]"
        >
          <WifiOff size={16} className="text-[#FF6B00]" />
          <span className="text-[#FF6B00] text-sm font-medium">No internet · Some features may not work</span>
        </motion.div>
      )}

      {/* HEADER */}
      <div className="pt-[60px] px-6 flex items-center justify-center gap-2 shrink-0">
        <div className="flex items-center justify-center w-[36px] h-[36px] bg-gradient-to-br from-[#FF6B00] to-[#E65100] rounded-[10px] shadow-sm">
          {/* Small bowl+pin icon */}
          <svg width="18" height="22" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C13.3726 2 8 7.37258 8 14C8 23 20 34 20 34C20 34 32 23 32 14C32 7.37258 26.6274 2 20 2Z" fill="transparent" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="14" r="4" fill="transparent" stroke="white" strokeWidth="3"/>
            <path d="M2 30C2 39.9411 10.0589 48 20 48C29.9411 48 38 39.9411 38 30L2 30Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-baloo font-semibold text-[20px] text-white">StreetEats</span>
      </div>

      {/* HERO TEXT BLOCK */}
      <div className="mt-[48px] px-7 flex flex-col items-center text-center shrink-0">
        <p className="font-dm-sans text-[17px] text-[#A0A0A0]">Welcome to</p>
        <h1 className="font-baloo font-bold text-[32px] text-white tracking-[-0.5px] leading-tight m-0">StreetEats! 🎉</h1>
        <p className="mt-3 font-dm-sans text-[15px] text-[#A0A0A0]">Pehle batao — aap kaun hain?</p>
      </div>

      {/* ROLE CARDS SECTION */}
      <div className="mt-[40px] px-5 flex flex-col gap-4 shrink-0">
        
        {/* CUSTOMER CARD */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRoleSelect('customer')}
          className="relative text-left w-full bg-white rounded-[20px] border-2 border-[#EBEBEB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden transition-colors hover:border-[#FF6B00] hover:bg-[#FFFCFA] group flex flex-col"
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF6B00] rounded-l-[20px]" />
          
          {/* Top Row */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[40px] leading-none">🍴</span>
            <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#FFF0E6] rounded-full transition-transform group-hover:translate-x-1 shrink-0">
              <ArrowRight size={16} className="text-[#FF6B00]" />
            </div>
          </div>
          
          <h2 className="font-baloo font-bold text-[24px] text-[#1A1A1A] m-0">Customer</h2>
          <p className="font-dm-sans text-[14px] text-[#6B6B6B] leading-[20px] mt-1 mb-4 pr-4">
            Apne aas paas ka street food dhundho aur order karo
          </p>
          
          <div className="h-[1px] bg-gray-100 w-full mb-3" />
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Free delivery</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Live tracking</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">UPI payments</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Reviews</span></div>
          </div>
        </motion.button>

        {/* VENDOR CARD */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRoleSelect('vendor')}
          className="relative text-left w-full bg-[#1A1A2E] rounded-[20px] border-2 border-[#252538] p-6 shadow-[0_4px_24px_rgba(26,26,46,0.3)] overflow-hidden transition-colors hover:border-[#FF6B00] group flex flex-col"
        >
          {/* Right accent bar */}
          <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-[#FF6B00] rounded-r-[20px]" />
          
          {/* Top Row */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[40px] leading-none">🛒</span>
            <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#FF6B00]/20 rounded-full transition-transform group-hover:translate-x-1 shrink-0">
              <ArrowRight size={16} className="text-[#FF6B00]" />
            </div>
          </div>
          
          <h2 className="font-baloo font-bold text-[24px] text-[#EFEFFF] m-0">Vendor</h2>
          <p className="font-dm-sans text-[14px] text-white/70 leading-[20px] mt-1 mb-4 pr-4">
            Apna stall register karo aur zyada customers pao
          </p>
          
          <div className="h-[1px] bg-white/10 w-full mb-3" />
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Free sign up</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Live orders</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Earnings</span></div>
            <div className="flex items-center gap-1.5"><Check size={14} className="text-[#00C853] shrink-0"/><span className="font-dm-sans text-[12px] text-[#00C853] whitespace-nowrap overflow-hidden text-ellipsis">Analytics</span></div>
          </div>
        </motion.button>
      </div>

      {/* BOTTOM SECTION */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-auto pt-8 pb-4 flex justify-center shrink-0"
      >
        <Link 
          href="https://admin.streeteats.app" 
          target="_blank"
          className="font-dm-sans text-[13px] text-[#A0A0A0] border-b border-dashed border-[#555] pb-0.5 hover:text-white hover:border-[#888] transition-colors"
        >
          Admin portal →
        </Link>
      </motion.div>
    </div>
  );
}
