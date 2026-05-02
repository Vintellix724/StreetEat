'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Camera, Check, MapPin, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

const FOOD_OPTIONS = [
  { id: 'kulfi', label: 'Kulfi', emoji: '🍡' },
  { id: 'chaat', label: 'Chaat', emoji: '🥘' },
  { id: 'chai', label: 'Chai', emoji: '☕' },
  { id: 'momos', label: 'Momos', emoji: '🌮' },
  { id: 'tikka', label: 'Tikka', emoji: '🍢' },
  { id: 'sandwich', label: 'Sandwich', emoji: '🥪' },
  { id: 'maggi', label: 'Maggi', emoji: '🍜' },
  { id: 'juice', label: 'Juice', emoji: '🧃' },
  { id: 'bhutta', label: 'Bhutta', emoji: '🌽' },
  { id: 'lassi', label: 'Lassi', emoji: '🥤' },
  { id: 'mithais', label: 'Mithais', emoji: '🍩' },
  { id: 'spicy', label: 'Spicy Food', emoji: '🌶' },
];

export default function CustomerProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);

  // Step 1 State
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preferences, setPreferences] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 State
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [city, setCity] = useState('');
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed automatic redirect to allow editing profile
  useEffect(() => {
    // Intentionally empty to prevent redirect back to home when clicking Profile tab
  }, []);

  const handleNextStep = () => {
    if (name.trim().length >= 2) {
      setDirection(1);
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep(1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate image compression & upload
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setPhotoUrl(url);
        setIsUploading(false);
      }, 1500);
    }
  };

  const togglePreference = (id: string) => {
    setPreferences(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const requestLocation = () => {
    setLocationState('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          setTimeout(() => {
            setCity('Karol Bagh, New Delhi');
            setLocationState('granted');
          }, 800);
        },
        (error) => {
          setLocationState('denied');
          setShowManualSearch(true);
        }
      );
    } else {
      setLocationState('denied');
      setShowManualSearch(true);
    }
  };

  const handleManualSelect = (selectedCity: string) => {
    setCity(selectedCity);
    setLocationState('granted');
    setShowManualSearch(false);
  };

  const finalizeSetup = () => {
    setIsSubmitting(true);
    // Simulate Firestore batch write & AsyncStorage update
    setTimeout(() => {
      localStorage.setItem('onboarded', 'true');
      localStorage.setItem('userCity', city || 'Unknown');
      router.replace('/customer-home');
    }, 1500);
  };

  const skipLocation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('onboarded', 'true');
      router.replace('/customer-home');
    }, 1000);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAF8] font-sans overflow-hidden text-[#1A1A1A]">
      
      {/* GLOBAL HEADER */}
      <div className="h-[56px] pt-[16px] px-[24px] bg-[#FAFAF8] flex items-center justify-between shrink-0 z-20">
        <div className="w-[32px]">
          {step === 2 && (
            <button onClick={handlePrevStep} className="p-1 -ml-1 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full">
              <ChevronLeft size={24} className="text-[#1A1A1A]" />
            </button>
          )}
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center">
          <div className="w-[10px] h-[10px] rounded-full bg-[#FF6B00]"></div>
          <div className="relative w-[40px] h-[2px] bg-[#E8E8E8] mx-0.5 overflow-hidden">
            <motion.div 
              initial={{ width: step === 2 ? '100%' : '0%' }}
              animate={{ width: step === 2 ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 bg-[#FF6B00]"
            />
          </div>
          <div className={`w-[10px] h-[10px] rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#FF6B00]' : 'bg-[#E8E8E8]'}`}></div>
        </div>
        
        <div className="w-[32px]">
          {/* Skip button logic was requested to be near food preferences or omitted, we'll keep it clean as requested. */}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 relative overflow-x-hidden overflow-y-auto">
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 pb-[32px] px-[24px]"
            >
              {/* Heading Block */}
              <div className="mt-[24px]">
                <h1 className="font-baloo font-bold text-[28px] text-[#1A1A1A] m-0">Apna profile banao! ✨</h1>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[8px]">Sirf 2 steps — 1 minute se kam</p>
              </div>

              {/* Avatar Upload Container */}
              <div className="flex flex-col items-center justify-center mt-[28px]">
                <div className="relative">
                  <div className="w-[100px] h-[100px] rounded-full border-[3px] border-[#FF6B00] shadow-[0_4px_16px_rgba(255,107,0,0.2)] bg-[#FFF0E6] flex items-center justify-center overflow-hidden">
                    {photoUrl ? (
                      <Image src={photoUrl} alt="Profile" layout="fill" objectFit="cover" />
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                        <Loader2 className="animate-spin text-[#FF6B00]" size={24} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[#FF6B00] border-[2px] border-[#FAFAF8] rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-[8px] font-dm-sans text-[13px] text-[#FF6B00] hover:underline"
                >
                  Photo change karo
                </button>
              </div>

              {/* Name Input */}
              <div className="mt-[28px] focus-within:z-10 relative">
                <label className="block font-dm-sans font-medium text-[13px] text-[#1A1A1A] mb-[6px]">Aapka naam</label>
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jaise: Rahul Kumar"
                    className="w-full h-[54px] bg-white border-[1.5px] border-[#E8E8E8] rounded-[14px] px-[16px] font-dm-sans text-[16px] text-[#1A1A1A] placeholder:text-[#BBBBC0] outline-none transition-all focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
                  />
                  {name.trim().length >= 2 && (
                    <div className="absolute right-[16px] pointer-events-none">
                      <Check size={18} className="text-[#00C853]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Food Preferences */}
              <div className="mt-[28px]">
                <div className="flex justify-between items-end mb-[4px]">
                  <h2 className="font-dm-sans font-medium text-[14px] text-[#1A1A1A] m-0">Aapko kya pasand hai? 😋</h2>
                  <div className="flex items-center gap-2">
                    <span className="font-dm-sans font-medium text-[10px] bg-[#FF6B00] text-white px-2 py-0.5 rounded-full leading-none">
                      {preferences.length}/5
                    </span>
                    <button className="font-dm-sans text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Skip &rarr;</button>
                  </div>
                </div>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[12px]">Select karo (multiple allowed)</p>
                
                <div className="flex flex-wrap gap-[10px]">
                  {FOOD_OPTIONS.map(opt => {
                    const isSelected = preferences.includes(opt.id);
                    const isMaxedOut = preferences.length >= 5 && !isSelected;
                    return (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.95 }}
                        animate={isSelected ? { scale: 1.03 } : { scale: 1 }}
                        onClick={() => togglePreference(opt.id)}
                        disabled={isMaxedOut}
                        className={`h-[38px] px-[14px] border-[1.5px] rounded-[20px] flex items-center transition-all ${
                          isSelected 
                            ? 'bg-[#FFF0E6] border-[#FF6B00]' 
                            : 'bg-white border-[#E8E8E8]'
                        } ${isMaxedOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-[16px] mr-[6px]">{opt.emoji}</span>
                        <span className={`font-dm-sans font-medium text-[13px] ${isSelected ? 'text-[#FF6B00]' : 'text-[#1A1A1A]'}`}>
                          {opt.label}
                        </span>
                        {isSelected && <Check size={14} className="ml-1 text-[#FF6B00]" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Continue Button */}
              <motion.button
                whileHover={name.trim().length >= 2 ? { scale: 0.99 } : {}}
                whileTap={name.trim().length >= 2 ? { scale: 0.97 } : {}}
                disabled={name.trim().length < 2}
                onClick={handleNextStep}
                className={`w-full h-[56px] mt-[32px] mb-[32px] rounded-[16px] flex items-center justify-center transition-all ${
                  name.trim().length >= 2 
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] shadow-[0_6px_20px_rgba(255,107,0,0.35)]' 
                    : 'bg-[#FFD4B3] shadow-none cursor-not-allowed'
                }`}
              >
                <span className={`font-dm-sans font-bold text-[16px] ${name.trim().length >= 2 ? 'text-white' : 'text-white/80'}`}>Continue &rarr;</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 pb-[32px] px-[24px]"
            >
              {/* Heading Block */}
              <div className="mt-[24px]">
                <h1 className="font-baloo font-bold text-[28px] text-[#1A1A1A] m-0">Aap kahan hain? 📍</h1>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[8px]">Nearby vendors dhundne ke liye location chahiye</p>
              </div>

              {/* Location Permission Card */}
              <div className="mt-[24px] bg-white border-[1.5px] border-[#E8E8E8] rounded-[20px] p-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF6B00]"></div>
                
                <div className="flex flex-col items-center text-center">
                  <span className="text-[48px] leading-none mb-3">📍</span>
                  <h3 className="font-baloo font-semibold text-[18px] text-[#1A1A1A] m-0 leading-tight">Location Access Allow Karo</h3>
                  <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-2 mb-4 leading-relaxed">
                    Aapke aas paas ke vendors,<br/>deals aur live tracking ke liye
                  </p>
                  
                  <div className="w-full h-[1px] bg-[#E8E8E8] mb-4" />
                  
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-start gap-2 text-left">
                      <Check size={16} className="text-[#00C853] shrink-0 mt-0.5" />
                      <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Vendors 500m ke andar dikhenge</span>
                    </div>
                    <div className="flex items-start gap-2 text-left">
                      <Check size={16} className="text-[#00C853] shrink-0 mt-0.5" />
                      <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Real-time order tracking milega</span>
                    </div>
                    <div className="flex items-start gap-2 text-left">
                      <Check size={16} className="text-[#00C853] shrink-0 mt-0.5" />
                      <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Location kabhi background mein use nahi hogi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allow Location Button / Status */}
              <div className="mt-[20px]">
                {locationState === 'idle' || locationState === 'loading' ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={requestLocation}
                    disabled={locationState === 'loading'}
                    className="w-full h-[56px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-[16px] shadow-[0_6px_20px_rgba(255,107,0,0.35)] flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    {locationState === 'loading' ? (
                      <Loader2 className="animate-spin text-white" size={20} />
                    ) : (
                      <>
                        <MapPin size={18} className="text-white fill-white" />
                        <span className="font-dm-sans font-bold text-[16px] text-white">Allow Location Access</span>
                      </>
                    )}
                  </motion.button>
                ) : locationState === 'granted' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-[#F0FFF4] border-[1.5px] border-[#00C853] rounded-[16px] p-4 flex flex-col items-center justify-center relative shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-[#00C853] mb-1">
                      <Check size={18} className="stroke-[3]" />
                      <span className="font-baloo font-bold text-[18px]">Location Detected!</span>
                    </div>
                    <span className="font-dm-sans font-medium text-[14px] text-[#1A1A1A]">{city}</span>
                    <button onClick={() => { setShowManualSearch(true); setLocationState('denied'); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-dm-sans text-emerald-700 underline">Change</button>
                  </motion.div>
                ) : (
                  <div className="w-full text-center p-3 bg-gray-100 rounded-[12px] border border-gray-200">
                    <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Location permission nahi mili. Manually city select karo.</span>
                  </div>
                )}
              </div>

              {/* Manual Option */}
              {locationState !== 'granted' && !showManualSearch && (
                <button 
                  onClick={() => setShowManualSearch(true)}
                  className="w-full text-center mt-[12px] font-dm-sans text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                >
                  Ya manually city enter karo
                </button>
              )}

              {/* Manual Search Input */}
              {showManualSearch && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-[16px] relative"
                >
                  <div className="flex items-center bg-white border-[1.5px] border-[#E8E8E8] rounded-[12px] h-[48px] px-3 focus-within:border-[#FF6B00]">
                    <Search size={18} className="text-[#BBBBC0] shrink-0" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="City ya area search karo..."
                      className="flex-1 h-full bg-transparent border-none outline-none px-3 font-dm-sans text-[14px] text-[#1A1A1A]"
                    />
                  </div>

                  {/* Mock Dropdown */}
                  {searchQuery.length > 1 && (
                    <div className="absolute top-[52px] left-0 right-0 bg-white border border-[#E8E8E8] rounded-[12px] shadow-lg z-30 max-h-[200px] overflow-y-auto">
                      {['Karol Bagh, New Delhi', 'Connaught Place, New Delhi', 'Chandni Chowk, New Delhi'].map((loc, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleManualSelect(loc)}
                          className="w-full flex items-center h-[44px] px-3 hover:bg-gray-50 border-b border-[#E8E8E8] last:border-0 text-left"
                        >
                          <MapPin size={16} className="text-[#BBBBC0] mr-2 shrink-0" />
                          <span className="font-dm-sans text-[14px] text-[#1A1A1A] truncate">{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Let's Go Button */}
              <AnimatePresence>
                {locationState === 'granted' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="mt-[28px]"
                  >
                    <button
                      onClick={finalizeSetup}
                      disabled={isSubmitting}
                      className="w-full h-[56px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-[16px] shadow-[0_8px_24px_rgba(255,107,0,0.4)] flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin text-white" size={24} />
                      ) : (
                        <span className="font-dm-sans font-bold text-[18px] text-white">Let&apos;s Eat! 🎉</span>
                      )}
                    </button>
                    <button 
                      onClick={skipLocation}
                      disabled={isSubmitting}
                      className="w-full mt-[16px] text-center font-dm-sans text-[12px] text-[#6B6B6B] hover:text-[#1A1A1A]"
                    >
                      Location baad mein bhi de sakte ho &rarr;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
