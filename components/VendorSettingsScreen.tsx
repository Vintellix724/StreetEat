'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Camera, CheckCircle, Clock, MapPin, Package, IndianRupee as Rupee, 
  CreditCard, Bell, BarChart2, Star, Megaphone, Smartphone, Wallet, ClipboardList, 
  Target, Globe, Palette, Type, Vibrate, Lock, Shield, HelpCircle, MessageCircle, 
  FileText, Info, LogOut, Pause, Trash2, ChevronRight, Pencil, Home, Utensils, 
  Settings as SettingsIcon, ChartBar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SectionLabel = ({ text }: { text: string }) => (
  <div className="mt-[24px] mb-[12px] px-[16px]">
    <span className="font-dm-sans font-semibold text-[12px] text-[#6B6B6B] uppercase tracking-[1.5px]">{text}</span>
  </div>
);

const SettingRow = ({ 
  icon: Icon, 
  iconBg, 
  iconColor, 
  label, 
  sublabel, 
  rightElement, 
  onClick,
  isDanger = false 
}: any) => (
  <div 
    onClick={onClick}
    className={`h-[56px] px-[16px] border-b border-[#1C1C2E] flex items-center justify-between ${onClick ? 'cursor-pointer active:bg-[#1C1C2E]' : ''}`}
  >
    <div className="flex items-center gap-[12px]">
      <div className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex flex-col justify-center">
        <span className={`font-dm-sans font-medium text-[14px] leading-tight ${isDanger ? 'text-[#FF3B30]' : (isDanger === 'warn' ? 'text-[#FF9500]' : 'text-[#EFEFFF]')}`}>
          {label}
        </span>
        {sublabel && (
          <span className={`font-dm-sans text-[12px] mt-[2px] leading-tight ${sublabel.color || 'text-[#6B6B6B]'}`}>
            {sublabel.text}
          </span>
        )}
      </div>
    </div>
    <div>{rightElement}</div>
  </div>
);

const Toggle = ({ value, onChange, activeColor = 'bg-[#FF6B00]' }: any) => (
  <div 
    onClick={() => onChange(!value)}
    className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 cursor-pointer ${value ? activeColor : 'bg-[#252538]'}`}
  >
    <div className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform duration-300 shadow-sm ${value ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
  </div>
);

const Stepper = ({ value, min, max, step, onChange, suffix = '' }: any) => (
  <div className="flex items-center gap-[12px]">
    <button 
      onClick={() => value > min && onChange(value - step)}
      className="w-[28px] h-[28px] rounded-full bg-[#1C1C2E] flex items-center justify-center text-[#EFEFFF] active:scale-95 disabled:opacity-50"
      disabled={value <= min}
    >
      -
    </button>
    <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF] min-w-[30px] text-center">
      {value}{suffix}
    </span>
    <button 
      onClick={() => value < max && onChange(value + step)}
      className="w-[28px] h-[28px] rounded-full bg-[#1C1C2E] flex items-center justify-center text-[#EFEFFF] active:scale-95 disabled:opacity-50"
      disabled={value >= max}
    >
      +
    </button>
  </div>
);

export default function VendorSettingsScreen() {
  const router = useRouter();

  // Simulated vendor state
  const [vendorData] = useState({
    name: 'Sharma Ji Kulfi',
    handle: '@sharmajikulfistall',
    isVerified: true,
    rating: 4.9,
    memberSince: 'March 2024',
    phone: '+91 98765 43210',
    upiId: 'sharmaji@upi',
    bio: '30 saal se Karol Bagh mein...',
    walletBalance: 350,
  });

  // Toggles
  const [autoClose, setAutoClose] = useState(false);
  const [holidayMode, setHolidayMode] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [orderSound, setOrderSound] = useState(true);
  const [orderReminder, setOrderReminder] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [reviewNotif, setReviewNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [appLock, setAppLock] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Steppers
  const [maxOrders, setMaxOrders] = useState(5);
  const [prepTime, setPrepTime] = useState(5);
  const [minOrder] = useState(0);

  // Bottom Sheets
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [hoursSheetOpen, setHoursSheetOpen] = useState(false);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [walletSheetOpen, setWalletSheetOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0A0A14] flex justify-center font-sans pb-[100px]">
      <div className="w-full max-w-[390px] relative bg-[#0A0A14]">
        
        {/* STICKY TOP BAR */}
        <div className="sticky top-0 w-full h-[116px] pt-[52px] px-[16px] bg-[#0A0A14] border-b border-[#252538] flex items-center justify-between z-40">
          <button onClick={() => router.back()} className="w-[40px] h-[40px] flex items-center justify-center -ml-[8px] active:scale-95">
            <ArrowLeft size={24} className="text-[#EFEFFF]" />
          </button>
          <h1 className="font-baloo-2 font-bold text-[18px] text-[#EFEFFF]">Settings</h1>
          <div className="w-[40px]"></div>
        </div>

        {/* VENDOR PROFILE CARD (Hero) */}
        <div className="mt-[16px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#13131F] border border-[#252538] rounded-[24px] p-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center">
            {/* Left Photo */}
            <div className="relative w-[80px] h-[80px] rounded-[20px] bg-[#252538] flex-shrink-0">
              <div className="w-full h-full rounded-[20px] overflow-hidden bg-[url('https://picsum.photos/seed/kulfi/200/200')] bg-cover bg-center" />
              <button 
                onClick={() => setProfileSheetOpen(true)}
                className="absolute -bottom-[6px] -right-[6px] w-[28px] h-[28px] bg-[#FF6B00] rounded-full flex items-center justify-center border-2 border-[#1C1C2E] shadow-sm"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>

            {/* Right Info */}
            <div className="ml-[14px] flex-1">
              <h2 className="font-baloo-2 font-bold text-[20px] text-[#EFEFFF] leading-tight flex items-center gap-[6px]">
                {vendorData.name}
              </h2>
              <p className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[2px]">{vendorData.handle}</p>
              
              <div className="flex items-center gap-[8px] mt-[8px]">
                {vendorData.isVerified ? (
                  <div className="px-[8px] py-[3px] bg-[#0F2318] border border-[#00C853] rounded-[6px] flex items-center gap-[4px]">
                    <span className="font-dm-sans font-medium text-[11px] text-[#00C853]">✅ Verified</span>
                  </div>
                ) : (
                  <div className="px-[8px] py-[3px] bg-[#1C1C2E] border border-[#FFD600] rounded-[6px] flex items-center gap-[4px]">
                    <span className="font-dm-sans font-medium text-[11px] text-[#FFD600]">⏳ Pending Verification</span>
                  </div>
                )}
                <div className="flex items-center gap-[4px]">
                  <span className="font-dm-sans font-medium text-[12px] text-[#FFD600]">⭐ {vendorData.rating}</span>
                </div>
              </div>
              
              <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[6px]">Member since {vendorData.memberSince}</p>
            </div>
          </div>

          <button 
            onClick={() => setProfileSheetOpen(true)}
            className="w-full h-[36px] bg-[#1C1C2E] border border-[#252538] rounded-[10px] mt-[16px] flex items-center justify-center gap-[6px] active:scale-[0.98] transition-transform"
          >
            <Pencil size={14} className="text-[#FF6B00]" />
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Edit Profile</span>
          </button>
        </div>

        {/* SECTION 1 — STALL OPERATIONS */}
        <SectionLabel text="Stall Operations" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={Clock} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Operating Hours" sublabel={{text: "Mon–Sat · 9AM – 10PM"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => setHoursSheetOpen(true)}
          />
          <SettingRow 
            icon={Clock} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Auto-Close Stall" sublabel={{text: "Automatically band ho jayega"}}
            rightElement={<Toggle value={autoClose} onChange={setAutoClose} />}
          />
          {autoClose && (
            <div className="bg-[#1A1A24] p-[16px] border-b border-[#1C1C2E]">
              <span className="font-dm-sans text-[13px] text-[#EFEFFF] block mb-[10px]">Band hoga:</span>
              <div className="flex gap-[8px] mb-[8px]">
                {['9PM', '10PM', '11PM', '12AM'].map(t => (
                  <button key={t} className={`flex-1 py-[6px] rounded-[8px] font-dm-sans font-medium text-[12px] ${t === '10PM' ? 'bg-[#FF6B00] text-white' : 'bg-[#252538] text-[#EFEFFF]'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Iske baad stall auto-closed ho jayega</span>
            </div>
          )}
          <SettingRow 
            icon={MapPin} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Holiday Mode" sublabel={{text: "Temporarily stall band karo"}}
            rightElement={<Toggle value={holidayMode} onChange={setHolidayMode} activeColor="bg-[#FF3B30]" />}
          />
          {holidayMode && (
            <div className="bg-[#1C1C2E] border-x-0 border-y border-[#FF3B30] p-[12px] flex items-center justify-between">
              <div>
                <span className="font-dm-sans font-medium text-[13px] text-[#FF3B30] block">🏖 Holiday Mode Active</span>
                <span className="font-dm-sans text-[12px] text-[#FF3B30] opacity-80">Returns 5 May · Tap to end early</span>
              </div>
              <button 
                onClick={() => setHolidayMode(false)}
                className="px-[12px] py-[6px] bg-[#FF3B30] rounded-[6px] font-dm-sans text-[12px] text-white active:scale-95"
              >
                End Early
              </button>
            </div>
          )}
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={MapPin} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="Stall Location" sublabel={{text: "Sector 14, Karol Bagh"}}
              rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* SECTION 2 — ORDER PREFERENCES */}
        <SectionLabel text="Order Preferences" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={CheckCircle} iconBg="bg-[#0F2318]" iconColor="text-[#00C853]"
            label="Auto-Accept Orders" 
            sublabel={{
              text: autoAccept ? "Orders automatically accept honge" : "Manually accept karna padega",
              color: autoAccept ? "text-[#00C853]" : "text-[#6B6B6B]"
            }}
            rightElement={<Toggle value={autoAccept} onChange={setAutoAccept} activeColor="bg-[#00C853]" />}
          />
          <SettingRow 
            icon={Package} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Max Simultaneous Orders" sublabel={{text: "Ek waqt mein kitne orders handle karo"}}
            rightElement={<Stepper value={maxOrders} min={1} max={20} step={1} onChange={setMaxOrders} />}
          />
          <SettingRow 
            icon={Clock} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Default Prep Time" sublabel={{text: "Naye orders ke liye default time"}}
            rightElement={<Stepper value={prepTime} min={2} max={30} step={1} onChange={setPrepTime} suffix="m" />}
          />
          <SettingRow 
            icon={Rupee} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Minimum Order Value" sublabel={{text: "Is se kam pe order nahi hoga"}}
            rightElement={<span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">₹ {minOrder}</span>}
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={CreditCard} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="Payment Methods" sublabel={{text: "UPI · Cash · Wallet"}}
              rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* SECTION 3 — NOTIFICATIONS */}
        <SectionLabel text="Notifications" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={Bell} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="New Order Sound" sublabel={{text: "Naya order aane par sound bajao"}}
            rightElement={<Toggle value={orderSound} onChange={setOrderSound} activeColor="bg-[#00C853]" />}
          />
          {orderSound && (
            <div className="bg-[#1A1A24] p-[16px] border-b border-[#1C1C2E] overflow-x-auto whitespace-nowrap hide-scrollbar">
              <div className="flex gap-[8px]">
                {['Ding', 'Chime', 'Drum', 'Classic', 'Loud'].map(s => (
                  <button key={s} className={`px-[12px] py-[6px] rounded-[20px] border ${s==='Ding' ? 'border-[#FF6B00] bg-[#FF6B00]/10' : 'border-[#252538] bg-[#1C1C2E]'} font-dm-sans text-[12px] text-[#EFEFFF]`}>
                    🔔 {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <SettingRow 
            icon={Clock} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Unaccepted Order Reminder" sublabel={{text: "Alert if order not accepted in 1min"}}
            rightElement={<Toggle value={orderReminder} onChange={setOrderReminder} />}
          />
          <SettingRow 
            icon={BarChart2} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Daily Earnings Summary" sublabel={{text: "Din ke ant mein summary milegi"}}
            rightElement={<Toggle value={dailySummary} onChange={setDailySummary} />}
          />
          <SettingRow 
            icon={Star} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="New Review Alert"
            rightElement={<Toggle value={reviewNotif} onChange={setReviewNotif} />}
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={Megaphone} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="StreetEats Tips & Updates" sublabel={{text: "Business tips aur app updates"}}
              rightElement={<Toggle value={promoNotif} onChange={setPromoNotif} />}
            />
          </div>
        </div>

        {/* SECTION 4 — EARNINGS & PAYMENTS */}
        <SectionLabel text="Earnings & Payments" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={Smartphone} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Primary UPI ID" sublabel={{text: vendorData.upiId}}
            rightElement={<span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Edit</span>}
            onClick={() => {}}
          />
          <SettingRow 
            icon={Wallet} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="StreetEats Wallet" sublabel={{text: `₹${vendorData.walletBalance} available`, color: 'text-[#00C853]'}}
            rightElement={<span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Withdraw &rarr;</span>}
            onClick={() => setWalletSheetOpen(true)}
          />
          <SettingRow 
            icon={ClipboardList} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Transaction History"
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={Target} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="Daily Earnings Goal" sublabel={{text: "₹2,000 / day"}}
              rightElement={<span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Edit</span>}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* SECTION 5 — APPEARANCE & APP */}
        <SectionLabel text="Appearance & App" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={Globe} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="App Language" sublabel={{text: "Hindi + English (Hinglish)"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={Palette} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Theme" sublabel={{text: "Dark (default for vendor)"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={Type} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Text Size"
            rightElement={
              <div className="flex items-center gap-[4px] text-[#EFEFFF]">
                <span className="text-[10px]">A</span>
                <div className="w-[40px] h-[4px] bg-[#252538] rounded-full mx-[4px] relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-[#FF6B00] rounded-full"></div>
                </div>
                <span className="text-[14px]">A</span>
              </div>
            }
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={Vibrate} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="Vibration / Haptics" sublabel={{text: "Button taps pe vibration"}}
              rightElement={<Toggle value={haptics} onChange={setHaptics} />}
            />
          </div>
        </div>

        {/* SECTION 6 — SECURITY */}
        <SectionLabel text="Security" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={Lock} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="App Lock" sublabel={{text: "Fingerprint ya PIN se lock karo"}}
            rightElement={<Toggle value={appLock} onChange={setAppLock} />}
          />
          <SettingRow 
            icon={Smartphone} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Active Devices" sublabel={{text: "2 devices logged in"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={Smartphone} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Change Phone Number"
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={Shield} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="Two-Factor Authentication" sublabel={{text: "Extra security for your account"}}
              rightElement={<Toggle value={twoFactor} onChange={setTwoFactor} />}
              onClick={() => alert("Coming Soon")}
            />
          </div>
        </div>

        {/* SECTION 7 — SUPPORT & LEGAL */}
        <SectionLabel text="Support & Legal" />
        <div className="mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] overflow-hidden">
          <SettingRow 
            icon={HelpCircle} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Help Center"
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={MessageCircle} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Contact Support" sublabel={{text: "WhatsApp ya email pe baat karo"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={Star} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Rate StreetEats" sublabel={{text: "Play Store pe review do"}}
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={FileText} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Privacy Policy"
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <SettingRow 
            icon={FileText} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
            label="Terms of Service"
            rightElement={<ChevronRight size={16} className="text-[#6B6B6B]" />}
            onClick={() => {}}
          />
          <div className="border-b-0 border-[#1C1C2E]">
            <SettingRow 
              icon={Info} iconBg="bg-[#1C1C2E]" iconColor="text-[#EFEFFF]"
              label="App Version"
              rightElement={<span className="font-dm-sans text-[12px] text-[#6B6B6B]">v1.0.0 (Build 42)</span>}
            />
          </div>
        </div>

        {/* DANGER ZONE SECTION */}
        <div className="mt-[24px]">
          <div className="mb-[10px] px-[16px]">
            <span className="font-dm-sans font-semibold text-[12px] text-[#FF3B30] uppercase tracking-[1.5px]">Danger Zone</span>
          </div>
          <div className="mx-[16px] bg-[#130A0A] border border-[#FF3B30] rounded-[20px] overflow-hidden py-[4px]">
            <SettingRow 
              icon={LogOut} iconBg="bg-[#1C1C2E]" iconColor="text-[#FF9500]"
              label="Logout" isDanger="warn"
              rightElement={<ChevronRight size={16} className="text-[#FF9500]" />}
              onClick={() => setLogoutAlertOpen(true)}
            />
            <SettingRow 
              icon={Pause} iconBg="bg-[#1C1C2E]" iconColor="text-[#FF3B30]"
              label="Pause Stall Permanently" sublabel={{text: "Temporarily StreetEats se hatao", color: "text-[#FF3B30] opacity-80"}}
              isDanger={true}
              rightElement={<ChevronRight size={16} className="text-[#FF3B30]" />}
              onClick={() => {}}
            />
            <div className="border-b-0 border-[#1C1C2E]">
              <SettingRow 
                icon={Trash2} iconBg="bg-[#130A0A]" iconColor="text-[#FF3B30]"
                label="Delete Account" sublabel={{text: "Sab data permanently delete ho jayega", color: "text-[#FF3B30] opacity-80"}}
                isDanger={true}
                rightElement={<ChevronRight size={16} className="text-[#FF3B30]" />}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* LOGOUT BOTTOM STRIP */}
        <div className="mt-[24px] mb-[40px] px-[16px]">
          <p className="font-jetbrains text-[11px] text-[#252538] text-center">Vendor ID: VND-2847-SHRM</p>
        </div>


        {/* BOTTOM NAVIGATION BAR (Dark) */}
        <div className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#0A0A14] border-t border-[#252538] flex items-center justify-between px-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-[60]">
          {[
            { id: 'home', icon: Home, label: 'Home', badge: 0, path: '/vendor-dashboard' },
            { id: 'orders', icon: ClipboardList, label: 'Orders', badge: 0, path: '/vendor-orders' },
            { id: 'menu', icon: Utensils, label: 'Menu', badge: 0, path: '/vendor-menu' },
            { id: 'stats', icon: ChartBar, label: 'Stats', badge: 0, path: '/vendor-analytics' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings', badge: 0, path: '/vendor-settings' },
          ].map(tab => {
            const isActive = tab.id === 'settings';
            const Icon = tab.icon;
            
            return (
              <div key={tab.id} onClick={() => tab.path !== '#' && router.push(tab.path)} className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer">
                {isActive && (
                  <div className="absolute top-[-1px] w-[24px] h-[3px] bg-[#FF6B00] rounded-b-[2px]"></div>
                )}
                
                <div className="relative">
                  <Icon size={24} className={isActive ? 'text-[#FF6B00] fill-[#FF6B00]/20' : 'text-[#6B6B6B]'} />
                  {tab.badge > 0 && (
                    <div className="absolute top-[-4px] right-[-8px] min-w-[16px] h-[16px] bg-[#FF3B30] rounded-full flex items-center justify-center px-[4px] border border-[#0A0A14] animate-pulse">
                      <span className="font-space-grotesk font-bold text-[10px] text-white leading-none mt-[1px]">{tab.badge}</span>
                    </div>
                  )}
                </div>
                <span className={`font-dm-sans mt-[4px] ${isActive ? 'font-medium text-[11px] text-[#FF6B00]' : 'text-[11px] text-[#6B6B6B]'}`}>
                  {tab.label}
                </span>
              </div>
            );
          })}
        </div>


        {/* MODALS / BOTTOM SHEETS Overlay */}
        <AnimatePresence>
          {profileSheetOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setProfileSheetOpen(false)}
                className="fixed inset-0 bg-black/60 z-[100]"
              />
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[90vh] bg-[#13131F] rounded-t-[24px] z-[101] flex flex-col"
              >
                <div className="w-full flex justify-center pt-[12px] pb-[20px]">
                  <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
                </div>
                
                <div className="flex-1 overflow-y-auto px-[20px] pb-[100px]">
                  <h3 className="font-baloo-2 font-bold text-[22px] text-[#EFEFFF] mb-[24px]">Edit Profile</h3>
                  
                  {/* Form fields skeleton */}
                  <div className="space-y-[20px]">
                    <div>
                      <label className="font-dm-sans font-medium text-[13px] text-[#6B6B6B] block mb-[8px]">Stall ka naam</label>
                      <input type="text" defaultValue={vendorData.name} className="w-full h-[52px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] px-[16px] font-dm-sans text-[15px] text-[#EFEFFF] outline-none focus:border-[#FF6B00]" />
                    </div>
                    
                    <div>
                      <label className="font-dm-sans font-medium text-[13px] text-[#6B6B6B] block mb-[8px]">Phone Number</label>
                      <div className="w-full h-[52px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] px-[16px] flex items-center justify-between">
                        <span className="font-dm-sans text-[15px] text-[#EFEFFF]">{vendorData.phone}</span>
                        <button className="px-[12px] py-[6px] bg-[#FF6B00] rounded-[6px] font-dm-sans font-medium text-[12px] text-white">Verify</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="font-dm-sans font-medium text-[13px] text-[#6B6B6B] block mb-[8px]">UPI ID (payment collect karne ke liye)</label>
                      <div className="w-full h-[52px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] px-[16px] flex items-center justify-between">
                        <input type="text" defaultValue={vendorData.upiId} className="flex-1 bg-transparent font-dm-sans text-[15px] text-[#EFEFFF] outline-none" />
                        <span className="font-dm-sans font-medium text-[12px] text-[#00C853] ml-[10px]">✓ verified</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="font-dm-sans font-medium text-[13px] text-[#6B6B6B] block mb-[8px]">Apne stall ke baare mein (optional)</label>
                      <textarea 
                        defaultValue={vendorData.bio} 
                        placeholder="30 saal se Karol Bagh mein..."
                        className="w-full h-[80px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] px-[16px] py-[12px] font-dm-sans text-[15px] text-[#EFEFFF] outline-none focus:border-[#FF6B00] resize-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-[20px] bg-gradient-to-t from-[#13131F] to-transparent">
                  <button 
                    onClick={() => setProfileSheetOpen(false)}
                    className="w-full h-[54px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] rounded-[16px] font-dm-sans font-bold text-[16px] text-white active:scale-[0.98] transition-transform shadow-[0_8px_20px_rgba(255,107,0,0.3)]"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {hoursSheetOpen && (
             <>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setHoursSheetOpen(false)}
               className="fixed inset-0 bg-black/60 z-[100]"
             />
             <motion.div 
               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[75vh] bg-[#13131F] rounded-t-[24px] z-[101] flex flex-col pt-[12px]"
             >
               <div className="w-full flex justify-center pb-[20px]">
                 <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
               </div>
               
               <div className="flex-1 overflow-y-auto px-[20px] pb-[100px]">
                 <h3 className="font-baloo-2 font-bold text-[20px] text-[#EFEFFF] mb-[20px]">Operating Hours</h3>
                 
                 <div className="mb-[24px]">
                 <span className="font-dm-sans text-[13px] text-[#EFEFFF] block mb-[10px]">Quick Presets</span>
                 <div className="flex gap-[8px] overflow-x-auto hide-scrollbar">
                    {['Morning 6-12', 'Afternoon 12-6', 'Evening 4-10', 'Night 8-12', 'Custom'].map((p, i) => (
                      <button key={p} className={`px-[12px] py-[6px] rounded-[12px] font-dm-sans font-medium text-[12px] whitespace-nowrap ${i === 4 ? 'bg-[#FF6B00] text-white' : 'bg-[#1C1C2E] border border-[#252538] text-[#EFEFFF]'}`}>
                        {p}
                      </button>
                    ))}
                 </div>
                 </div>

                 <div className="flex gap-[16px] mb-[24px]">
                    <div className="flex-1">
                      <span className="font-dm-sans text-[13px] text-[#EFEFFF] block mb-[8px]">Khulne ka waqt</span>
                      <div className="h-[48px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] flex items-center justify-center font-space-grotesk font-bold text-[16px] text-[#00C853]">9:00 AM</div>
                    </div>
                    <div className="flex-1">
                      <span className="font-dm-sans text-[13px] text-[#EFEFFF] block mb-[8px]">Bandh hone ka waqt</span>
                      <div className="h-[48px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] flex items-center justify-center font-space-grotesk font-bold text-[16px] text-[#FF3B30]">10:00 PM</div>
                    </div>
                 </div>

                 <div className="mb-[24px]">
                    <span className="font-dm-sans text-[13px] text-[#EFEFFF] block mb-[10px]">Open Days</span>
                    <div className="flex flex-wrap gap-[10px]">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button key={day} className={`w-[42px] h-[42px] rounded-full flex items-center justify-center font-dm-sans font-medium text-[13px] ${day === 'Sun' ? 'bg-[#1C1C2E] border border-[#252538] text-[#6B6B6B]' : 'bg-[#FF6B00] text-white'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                 </div>

               </div>

               <div className="absolute bottom-0 left-0 w-full p-[20px] bg-gradient-to-t from-[#13131F] to-transparent">
                  <button 
                    onClick={() => setHoursSheetOpen(false)}
                    className="w-full h-[54px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] rounded-[16px] font-dm-sans font-bold text-[16px] text-white active:scale-[0.98] transition-transform"
                  >
                    Save Hours
                  </button>
                </div>
             </motion.div>
           </>
          )}

          {walletSheetOpen && (
             <>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setWalletSheetOpen(false)}
               className="fixed inset-0 bg-black/60 z-[100]"
             />
             <motion.div 
               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#13131F] rounded-t-[24px] z-[101] flex flex-col pt-[12px] pb-[40px] px-[20px]"
             >
               <div className="w-full flex justify-center mb-[20px]">
                 <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
               </div>
               
               <h3 className="font-baloo-2 font-bold text-[20px] text-[#EFEFFF] mb-[16px]">Withdraw Balance</h3>
               
               <div className="bg-[#1C1C2E] border border-[#252538] rounded-[16px] p-[20px] mb-[24px] flex flex-col items-center">
                  <span className="font-dm-sans text-[14px] text-[#6B6B6B] mb-[8px]">Current Balance</span>
                  <span className="font-space-grotesk font-bold text-[40px] text-[#00C853]">₹350</span>
               </div>

               <p className="font-dm-sans text-[13px] text-[#6B6B6B] mb-[20px] text-center px-[20px]">
                 Funds will be transferred to your UPI ID: <strong className="text-[#EFEFFF]">{vendorData.upiId}</strong>
               </p>

               <button 
                 onClick={() => setWalletSheetOpen(false)}
                 className="w-full h-[54px] bg-[#0F2318] border border-[#00C853] rounded-[16px] font-dm-sans font-bold text-[16px] text-[#00C853] active:scale-[0.98] transition-transform"
               >
                 Withdraw to UPI
               </button>
               <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[12px] text-center">
                 Min withdrawal: ₹100. Processing: 1-2 business days.
               </p>
             </motion.div>
           </>
          )}

          {logoutAlertOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-[20px]"
              >
                <div className="w-full max-w-[350px] bg-[#1C1C2E] rounded-[24px] p-[24px] border border-[#252538]">
                  <div className="w-[48px] h-[48px] bg-[#FF9500]/10 rounded-full flex items-center justify-center mb-[16px]">
                    <LogOut size={24} className="text-[#FF9500]" />
                  </div>
                  <h3 className="font-baloo-2 font-bold text-[20px] text-[#EFEFFF] mb-[8px]">Logout karein?</h3>
                  <p className="font-dm-sans text-[14px] text-[#6B6B6B] mb-[24px]">Aapka session securely end ho jayega.</p>
                  <div className="flex gap-[12px]">
                    <button 
                      onClick={() => setLogoutAlertOpen(false)}
                      className="flex-1 h-[48px] bg-[#252538] rounded-[12px] font-dm-sans font-medium text-[15px] text-[#EFEFFF] active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => router.push('/')}
                      className="flex-1 h-[48px] bg-[#FF9500] rounded-[12px] font-dm-sans font-bold text-[15px] text-white active:scale-95"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
