'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, Camera, X, Navigation, Edit2, Check, CheckCircle2, Sparkles, Rocket } from 'lucide-react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';

const VendorLocationMap = dynamic(() => import('./VendorLocationMap'), { ssr: false, loading: () => <div className="w-full h-full bg-[#1C1C2E] animate-pulse" /> });

const CATEGORIES = [
  { id: 'c1', label: 'Kulfi', icon: '🍡' },
  { id: 'c2', label: 'Chaat', icon: '🥘' },
  { id: 'c3', label: 'Chai', icon: '☕' },
  { id: 'c4', label: 'Momos', icon: '🌮' },
  { id: 'c5', label: 'Sandwich', icon: '🥪' },
  { id: 'c6', label: 'Maggi', icon: '🍜' },
  { id: 'c7', label: 'Juice', icon: '🥤' },
  { id: 'c8', label: 'Bhutta', icon: '🌽' },
  { id: 'c9', label: 'Tikka', icon: '🍢' },
  { id: 'c10', label: 'Salad', icon: '🥗' },
  { id: 'c11', label: 'Mithais', icon: '🍩' },
  { id: 'c12', label: 'Snacks', icon: '🌶' },
];

const SPICE_LEVELS = [
  { id: 'mild', label: '😊 Mild', color: '#00C853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.3)' },
  { id: 'medium', label: '🌶 Medium', color: '#FFD600', bg: 'rgba(255,214,0,0.1)', border: 'rgba(255,214,0,0.3)' },
  { id: 'spicy', label: '🌶🌶 Spicy', color: '#FF6B00', bg: 'rgba(255,107,0,0.1)', border: 'rgba(255,107,0,0.3)' },
  { id: 'extra', label: '🔥 Extra', color: '#FF3B30', bg: 'rgba(255,59,48,0.1)', border: 'rgba(255,59,48,0.3)' },
];

export default function VendorOnboardingScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1 State
  const [stallName, setStallName] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stallPhoto, setStallPhoto] = useState<string | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  // Step 2 State
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.2090]); // Delhi
  const [address, setAddress] = useState('Sector 14, Karol Bagh, New Delhi');
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('10:00 PM');
  
  // Step 3 State
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState<string | null>(null);
  const [spiceLevel, setSpiceLevel] = useState<string | null>(null);
  const [itemDesc, setItemDesc] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [itemPhoto, setItemPhoto] = useState<string | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleNext1 = () => {
    if (stallName.trim().length >= 2 && selectedCategories.length >= 1) {
      setStep(2);
    }
  };

  const handleNext2 = () => {
    setStep(3);
  };

  const handleStartSelling = () => {
    if (!itemName || !itemPrice) {
      alert("Please enter item name and price.");
      return;
    }
    
    setIsSuccess(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#FFD600', '#FFFFFF']
    });

    setTimeout(() => {
      router.push('/vendor-dashboard');
    }, 2500);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0A0A14] font-sans overflow-hidden text-[#EFEFFF]">
      
      {/* GLOBAL TOP BAR */}
      {!isSuccess && (
        <div className="flex flex-col shrink-0 z-40 bg-[#0A0A14] pt-safe">
          <div className="h-[56px] px-[16px] flex items-center justify-between">
            <button onClick={handleBack} className="w-[40px] flex items-center justify-start py-2">
              <ChevronLeft size={24} className="text-[#EFEFFF] -ml-1" />
            </button>
            <span className="font-baloo font-bold text-[17px] text-[#EFEFFF] flex-1 text-center">Stall Setup</span>
            <span className="font-dm-sans text-[13px] text-[#6B6B6B] w-[40px] text-right">Step {step}/3</span>
          </div>
          <div className="w-full h-[4px] bg-[#252538] relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-[#FF6B00]"
              initial={{ width: `${(1/3)*100}%` }}
              animate={{ width: `${(step/3)*100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-white rounded-full ml-[-3px]"
              initial={{ left: `${(1/3)*100}%` }}
              animate={{ left: `${(step/3)*100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* CONTENT AREA (Animated steps) */}
      <div className="flex-1 overflow-x-hidden relative">
        <AnimatePresence initial={false} mode="wait">
          
          {/* STEP 1: STALL INFO */}
          {step === 1 && !isSuccess && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto pb-[40px]"
            >
              <div className="px-[24px] mt-[24px]">
                <h1 className="font-baloo font-bold text-[26px] text-[#EFEFFF] leading-tight">Apne stall ke baare mein batao 🛒</h1>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[6px]">Sirf 3 steps — 3 minute se kam</p>
              </div>

              {/* STALL PHOTO UPLOAD */}
              <div className="mt-[28px] flex flex-col items-center">
                <input type="file" accept="image/*" ref={fileInputRef1} className="hidden" onChange={(e) => handleImageUpload(e, setStallPhoto)} />
                <div 
                  className="w-[160px] h-[160px] rounded-[20px] bg-[#13131F] border-[2px] border-dashed border-[#252538] flex flex-col items-center justify-center relative cursor-pointer"
                  onClick={() => !stallPhoto && fileInputRef1.current?.click()}
                >
                  {stallPhoto ? (
                    <>
                      <img src={stallPhoto} alt="Stall" className="w-full h-full object-cover rounded-[18px]" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); fileInputRef1.current?.click(); }}
                        className="absolute bottom-[-10px] right-[-10px] w-[32px] h-[32px] bg-[#FF6B00] rounded-full flex items-center justify-center border-2 border-[#0A0A14] shadow-md"
                      >
                        <Camera size={14} className="text-white" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setStallPhoto(null); }}
                        className="absolute top-[-8px] right-[-8px] w-[28px] h-[28px] bg-red-500/90 rounded-full flex items-center justify-center border-2 border-[#0A0A14]"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Camera size={40} className="text-[#FF6B00] mb-[8px]" />
                      <span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Stall ki photo daalo</span>
                      <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Tap to upload</span>
                    </>
                  )}
                </div>
                <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[12px] text-center max-w-[200px]">
                  💡 Saaf aur bright photo zyada customers attract karte hain
                </p>
              </div>

              {/* STALL NAME INPUT */}
              <div className="mt-[24px] px-[24px]">
                <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Stall ka naam *</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={stallName}
                    onChange={(e) => setStallName(e.target.value)}
                    placeholder="Jaise: Sharma Ji Kulfi"
                    className="w-full h-[54px] bg-[#13131F] border-[1.5px] border-[#252538] rounded-[14px] px-[16px] font-dm-sans text-[16px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)] transition-all"
                  />
                  {stallName.trim().length >= 2 && (
                    <Check size={18} className="text-[#00C853] absolute right-[16px] top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>

              {/* YEARS IN BUSINESS */}
              <div className="mt-[24px] px-[24px]">
                <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Kitne saalon se hain? (optional)</label>
                <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-[4px]">
                  {['< 1 yr', '1–3', '3–5', '5–10', '10+'].map(year => (
                    <button
                      key={year}
                      onClick={() => setYearsInBusiness(year)}
                      className={`shrink-0 h-[38px] px-[14px] rounded-[20px] border-[1.5px] font-dm-sans font-medium text-[13px] transition-colors ${
                        yearsInBusiness === year 
                          ? 'bg-[#1C1C2E] border-[#FF6B00] text-[#FF6B00]' 
                          : 'bg-[#13131F] border-[#252538] text-[#6B6B6B]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* FOOD CATEGORY CHIPS */}
              <div className="mt-[24px] px-[24px]">
                <div className="flex justify-between items-end mb-[10px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Aap kya bechte ho? *</label>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Select all that apply</span>
                </div>
                
                <div className="flex flex-wrap gap-[10px] mb-[12px]">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        whileTap={{ scale: 0.95 }}
                        className={`h-[38px] px-[12px] rounded-[20px] border-[1.5px] font-dm-sans font-medium text-[13px] transition-colors flex items-center justify-center ${
                          isSelected 
                            ? 'bg-[#1C1C2E] border-[#FF6B00] text-[#FF6B00]' 
                            : 'bg-[#13131F] border-[#252538] text-[#6B6B6B]'
                        }`}
                      >
                        <span className="mr-1">{cat.icon}</span> {cat.label}
                      </motion.button>
                    )
                  })}
                </div>

                {selectedCategories.length > 0 && (
                  <div className="inline-block bg-[#1C1C2E] border border-[#FF6B00] px-[12px] py-[4px] rounded-full">
                    <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">{selectedCategories.length} selected</span>
                  </div>
                )}
              </div>

              {/* NEXT BUTTON */}
              <div className="mt-[32px] px-[24px]">
                <button
                  onClick={handleNext1}
                  disabled={stallName.trim().length < 2 || selectedCategories.length === 0}
                  className={`w-full h-[56px] rounded-[16px] font-dm-sans font-bold text-[16px] flex items-center justify-center transition-all ${
                    stallName.trim().length >= 2 && selectedCategories.length >= 1
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white shadow-[0_6px_20px_rgba(255,107,0,0.35)] active:scale-[0.97]'
                      : 'bg-[#2A2A3E] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                >
                  Next: Set Location &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION SETUP */}
          {step === 2 && !isSuccess && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto pb-[40px]"
            >
              <div className="px-[24px] mt-[24px]">
                <h1 className="font-baloo font-bold text-[26px] text-[#EFEFFF] leading-tight">Aapka stall kahan hai? 📍</h1>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[6px]">Pin drag karke exact location set karo</p>
              </div>

              {/* INTERACTIVE MAP */}
              <div className="mt-[16px] mx-[16px] h-[260px] rounded-[20px] overflow-hidden border-[1.5px] border-[#252538] relative z-10">
                <VendorLocationMap position={position} onPositionChange={setPosition} />
                <button className="absolute top-[16px] right-[16px] w-[40px] h-[40px] bg-[#1C1C2E] border border-[#252538] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)] flex items-center justify-center z-[1000] active:scale-95">
                  <Navigation size={20} className="text-[#FF6B00]" />
                </button>
              </div>

              {/* DETECTED ADDRESS */}
              <div className="mt-[12px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[12px] p-[12px] flex items-center justify-between">
                <div className="flex gap-[12px] items-start">
                  <div className="mt-0.5">
                    <span className="text-[16px]">📍</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-dm-sans font-medium text-[14px] text-[#EFEFFF] leading-tight mb-1">{address.split(',')[0]}, {address.split(',')[1]}</span>
                    <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-tight">{address.split(',').slice(2).join(',')} Delhi 110005</span>
                  </div>
                </div>
                <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00] shrink-0 outline-none">Edit ✏️</button>
              </div>

              {/* OPERATING HOURS */}
              <div className="mt-[24px] px-[24px]">
                <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[12px]">Aap kab open rehte ho?</label>
                
                {/* Time Picker Mock Row */}
                <div className="flex items-center gap-[12px] mb-[16px]">
                  <div className="flex-1">
                    <span className="block font-dm-sans text-[12px] text-[#6B6B6B] mb-[6px]">Khulne ka time</span>
                    <div className="h-[44px] bg-[#13131F] border border-[#252538] rounded-[10px] flex items-center justify-center font-dm-sans text-[14px] text-[#EFEFFF]">
                      {openTime}
                    </div>
                  </div>
                  <div className="mt-[24px] text-[#6B6B6B]">&rarr;</div>
                  <div className="flex-1">
                    <span className="block font-dm-sans text-[12px] text-[#6B6B6B] mb-[6px]">Bandh hone ka time</span>
                    <div className="h-[44px] bg-[#13131F] border border-[#252538] rounded-[10px] flex items-center justify-center font-dm-sans text-[14px] text-[#EFEFFF]">
                      {closeTime}
                    </div>
                  </div>
                </div>

                {/* Day Toggles */}
                 <div className="flex gap-[8px] overflow-x-auto no-scrollbar pb-[4px]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`shrink-0 w-[44px] h-[44px] rounded-[8px] border font-dm-sans text-[12px] flex items-center justify-center transition-colors ${
                        activeDays.includes(day) 
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white font-bold' 
                          : 'bg-[#13131F] border-[#252538] text-[#6B6B6B] font-regular'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEXT BUTTON */}
              <div className="mt-[32px] px-[24px]">
                <button
                  onClick={handleNext2}
                  className="w-full h-[56px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white rounded-[16px] font-dm-sans font-bold text-[16px] flex items-center justify-center shadow-[0_6px_20px_rgba(255,107,0,0.35)] active:scale-[0.97] transition-transform"
                >
                  Next: Add Your Menu &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FIRST MENU ITEM */}
          {step === 3 && !isSuccess && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto pb-[40px]"
            >
              <div className="px-[24px] mt-[24px]">
                <h1 className="font-baloo font-bold text-[26px] text-[#EFEFFF] leading-tight">Apna pehla item add karo! 🍽</h1>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] mt-[6px]">Customers yahi dekhenge pehle</p>
              </div>

              {/* AI IMPORT BANNER */}
              <div className="mt-[20px] mx-[24px] bg-gradient-to-r from-[#1C1C2E] to-[#13131F] border-[1.5px] border-[#FF6B00] rounded-[16px] p-[14px_16px]">
                <div className="flex gap-[12px] mb-[12px]">
                   <Sparkles size={20} className="text-[#FFD600] shrink-0 mt-0.5" />
                   <div>
                     <h3 className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">AI se menu import karo</h3>
                     <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-1">Menu board ki photo lo — hum automatically items add kar denge!</p>
                   </div>
                </div>
                <button 
                  onClick={() => alert("Coming soon")}
                  className="w-full h-[40px] bg-[#FF6B00] rounded-[12px] flex items-center justify-center gap-2"
                >
                  <Camera size={16} className="text-white" />
                  <span className="font-dm-sans font-medium text-[13px] text-white">Photo se Import karo</span>
                </button>
              </div>

              {/* ADD FIRST ITEM CARD */}
              <div className="mt-[20px] mx-[24px] bg-[#13131F] border-[2px] border-dashed border-[#FF6B00] rounded-[20px] p-[20px]">
                {/* Photo Upload */}
                <input type="file" accept="image/*" ref={fileInputRef2} className="hidden" onChange={(e) => handleImageUpload(e, setItemPhoto)} />
                <div 
                  onClick={() => !itemPhoto && fileInputRef2.current?.click()}
                  className="w-full h-[120px] bg-[#1C1C2E] rounded-[12px] flex flex-col items-center justify-center relative cursor-pointer overflow-hidden border border-[#252538]"
                >
                  {itemPhoto ? (
                    <>
                      <img src={itemPhoto} alt="Item" className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemPhoto(null); }}
                        className="absolute top-[8px] right-[8px] w-[28px] h-[28px] bg-red-500/90 rounded-full flex items-center justify-center border border-[#0A0A14]"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Camera size={32} className="text-[#FF6B00] mb-[8px]" />
                      <span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Item ki photo daalo</span>
                    </>
                  )}
                </div>

                {/* Item Name */}
                <div className="mt-[14px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Item ka naam *</label>
                  <input 
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Jaise: Malai Kulfi"
                    className="w-full h-[54px] bg-[#13131F] border-[1.5px] border-[#252538] rounded-[14px] px-[16px] font-dm-sans text-[15px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>

                {/* Price Input */}
                <div className="mt-[12px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Price (₹) *</label>
                  <div className="flex h-[54px]">
                    <div className="bg-[#1C1C2E] border-y-[1.5px] border-l-[1.5px] border-[#252538] rounded-l-[14px] px-[14px] flex items-center justify-center shrink-0">
                      <span className="font-dm-sans font-bold text-[16px] text-[#FF6B00]">₹</span>
                    </div>
                    <input 
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-[#13131F] border-y-[1.5px] border-r-[1.5px] border-l-0 border-[#252538] rounded-r-[14px] px-[16px] font-space-grotesk font-bold text-[18px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-[16px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Category</label>
                  <div className="flex flex-wrap gap-[8px]">
                    {CATEGORIES.filter(c => selectedCategories.length === 0 || selectedCategories.includes(c.id)).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setItemCategory(cat.id)}
                        className={`h-[34px] px-[12px] rounded-[16px] border-[1.5px] font-dm-sans font-medium text-[12px] transition-colors flex items-center ${
                          itemCategory === cat.id 
                            ? 'bg-[#1C1C2E] border-[#FF6B00] text-[#FF6B00]' 
                            : 'bg-[#13131F] border-[#252538] text-[#6B6B6B]'
                        }`}
                      >
                         <span className="mr-1 text-[12px]">{cat.icon}</span> {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div className="mt-[16px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Teekha kitna? 🌶</label>
                  <div className="grid grid-cols-2 gap-[8px]">
                    {SPICE_LEVELS.map(level => (
                       <button
                       key={level.id}
                       onClick={() => setSpiceLevel(level.id)}
                       style={{ 
                         backgroundColor: spiceLevel === level.id ? level.bg : '#13131F',
                         borderColor: spiceLevel === level.id ? level.border : '#252538',
                         color: spiceLevel === level.id ? level.color : '#6B6B6B'
                       }}
                       className="h-[40px] rounded-[10px] border-[1.5px] font-dm-sans font-medium text-[13px] transition-colors"
                     >
                       {level.label}
                     </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-[16px]">
                  <label className="block font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Short description (optional)</label>
                  <textarea 
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value.substring(0, 120))}
                    placeholder="Iske baare mein kuch batao..."
                    className="w-full h-[70px] bg-[#13131F] border-[1.5px] border-[#252538] rounded-[12px] p-[12px] font-dm-sans text-[14px] text-[#EFEFFF] placeholder-[#6B6B6B] resize-none outline-none focus:border-[#FF6B00]"
                  />
                </div>

                {/* Available Toggle */}
                <div className="mt-[16px] flex items-center justify-between">
                  <span className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Abhi available hai?</span>
                  <button 
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`w-[48px] h-[28px] rounded-full p-[2px] transition-colors ${isAvailable ? 'bg-[#00C853]' : 'bg-[#252538]'}`}
                  >
                    <motion.div 
                      className={`w-[24px] h-[24px] bg-white rounded-full shadow-sm`}
                      animate={{ x: isAvailable ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Add Another Link */}
              <div className="mt-[12px] px-[24px] flex items-center justify-between">
                <button className="font-dm-sans font-medium text-[14px] text-[#FF6B00] outline-none">
                  + Add another item
                </button>
                {/* Example if >1 item: <span className="font-dm-sans text-[13px] text-[#00C853] flex items-center gap-1"><Check size={14}/> 1 item added</span> */}
              </div>

              {/* FINAL CTA */}
              <div className="mt-[32px] px-[24px] flex flex-col items-center gap-[16px]">
                <button
                  onClick={handleStartSelling}
                  className="w-full h-[60px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white rounded-[18px] font-dm-sans font-bold text-[18px] flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,107,0,0.45)] active:scale-[0.96] transition-transform"
                >
                  <Rocket size={20} className="text-white" />
                  Start Selling!
                </button>
                
                <button onClick={() => router.push('/vendor-dashboard')} className="font-dm-sans text-[13px] text-[#6B6B6B] hover:text-[#EFEFFF] transition-colors">
                  Menu baad mein bhi add kar sakte ho &rarr;
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#0A0A14] z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeOut", times: [0, 0.6, 1] }} 
              className="w-[100px] h-[100px] bg-[#00C853] rounded-full flex items-center justify-center mb-[24px]"
            >
              <Check size={50} className="text-white" strokeWidth={3} />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-baloo font-bold text-[28px] text-white"
            >
              Stall ready hai! 🎉
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-dm-sans text-[16px] text-[#6B6B6B] mt-[8px]"
            >
              Aapka stall ab live hai
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
