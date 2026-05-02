'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  Bell, Search, Mic, MapPin, X, Heart, Home, 
  Map as MapIcon, Package, User as UserIcon, Navigation, ChevronRight
} from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
});

// Mock Vendors Data
const MOCK_VENDORS = [
  {
    id: 'v1',
    name: 'Sharma Ji Kulfi',
    category: 'kulfi',
    rating: 4.8,
    reviews: 234,
    distance: '120m',
    items: ['Malai', 'Mango', 'Falooda'],
    price: 20,
    isOpen: true,
    location: [28.6519, 77.1909] as [number, number],
  },
  {
    id: 'v2',
    name: 'Ramu Chai Wala',
    category: 'chai',
    rating: 4.5,
    reviews: 156,
    distance: '200m',
    items: ['Masala Chai', 'Samosa', 'Bun Maska'],
    price: 15,
    isOpen: true,
    location: [28.6521, 77.1915] as [number, number],
  },
  {
    id: 'v3',
    name: 'Delicious Momos',
    category: 'momos',
    rating: 4.2,
    reviews: 89,
    distance: '400m',
    items: ['Veg Momos', 'Chicken Momos', 'Chili Potato'],
    price: 40,
    isOpen: false,
    location: [28.6500, 77.1900] as [number, number],
  }
];

const TOP_PICKS = [
  {
    id: 'v4',
    name: 'Raja Pani Puri Stall',
    category: 'chaat',
    rating: 4.9,
    reviews: 1200,
    distance: '200m',
    address: 'Sector 14 · Near Bus Stand',
    items: ['Spl. Puri', 'Dahi', 'Ragda'],
    minPrice: 15,
    maxPrice: 60,
    waitTime: '~5 min',
    isOpen: true,
  },
  {
    id: 'v1',
    name: 'Sharma Ji Kulfi',
    category: 'kulfi',
    rating: 4.8,
    reviews: 234,
    distance: '120m',
    address: 'Main Market Ground',
    items: ['Malai', 'Mango', 'Falooda'],
    minPrice: 20,
    maxPrice: 40,
    waitTime: '~2 min',
    isOpen: true,
  }
];

const FILTERS = [
  { id: 'near_me', label: 'Near Me', emoji: '🔥' },
  { id: 'top_rated', label: 'Top Rated', emoji: '⭐' },
  { id: 'open_now', label: 'Open Now', emoji: '🕐' },
  { id: 'kulfi', label: 'Kulfi', emoji: '🍡' },
  { id: 'chaat', label: 'Chaat', emoji: '🥘' },
  { id: 'chai', label: 'Chai', emoji: '☕' },
  { id: 'momos', label: 'Momos', emoji: '🌮' },
  { id: 'under_50', label: 'Under ₹50', emoji: '💰' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶' },
];

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('near_me');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userCity, setUserCity] = useState('Karol Bagh, Delhi');
  const [activeTab, setActiveTab] = useState('home');
  const [savedVendors, setSavedVendors] = useState<string[]>([]);
  
  // Mock User Location (Delhi)
  const userLocation: [number, number] = [28.6515, 77.1912];

  useEffect(() => {
    // Read cached city
    const savedCity = localStorage.getItem('userCity');
    if (savedCity && savedCity !== userCity) {
      setTimeout(() => setUserCity(savedCity), 0);
    }
  }, [userCity]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedVendors(prev => 
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAF8] font-sans overflow-hidden text-[#1A1A1A]">
      
      {/* STICKY HEADER */}
      <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] pt-[52px] px-[16px] pb-[8px] z-30 shrink-0">
        {/* Row 1 - Location + Icons */}
        <div className="h-[48px] flex items-center justify-between">
          <button className="flex items-center gap-1 active:bg-[#FFF0E6] rounded-[8px] transition-colors py-1 px-1 -ml-1">
            <MapPin size={18} className="text-[#FF6B00] fill-white" />
            <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">{userCity}</span>
            <span className="text-[#FF6B00] text-[12px] ml-1">▼</span>
          </button>
          
          <div className="flex items-center gap-[12px]">
            <button className="relative">
              <Bell size={24} className="text-[#1A1A1A]" />
              <div className="absolute top-0 right-0 w-[8px] h-[8px] bg-[#FF3B30] rounded-full border-[1.5px] border-white"></div>
            </button>
            <div className="w-[32px] h-[32px] rounded-full border-[2px] border-[#FF6B00] bg-[#FFF0E6] flex items-center justify-center overflow-hidden">
              <span className="font-baloo font-bold text-[#FF6B00] text-[14px]">R</span>
            </div>
          </div>
        </div>

        {/* Row 2 - Search Bar */}
        <div className={`mt-[8px] h-[44px] rounded-[12px] flex items-center px-[4px] transition-all ${
          isSearchFocused 
            ? 'bg-white border-[1.5px] border-[#FF6B00] shadow-[0_0_0_3px_rgba(255,107,0,0.08)]' 
            : 'bg-[#F5F5F5] border-[1.5px] border-transparent'
        }`}>
          <div className="pl-[8px] pr-[4px]">
            <Search size={18} className="text-[#BBBBC0]" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search chai, kulfi, momos..."
            className="flex-1 bg-transparent border-none outline-none font-dm-sans text-[14px] text-[#1A1A1A] placeholder:text-[#BBBBC0]"
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="p-[8px]">
              <X size={18} className="text-[#BBBBC0]" />
            </button>
          ) : (
            <button className="p-[8px]">
              <Mic size={18} className="text-[#BBBBC0]" />
            </button>
          )}
        </div>

        {/* Row 3 - Filter Chips */}
        <div className="mt-[8px] flex overflow-x-auto no-scrollbar gap-[8px] pb-[4px]">
          {FILTERS.map(filter => (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              animate={activeFilter === filter.id ? { scale: 1.04 } : { scale: 1 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`h-[32px] px-[12px] rounded-[20px] flex items-center whitespace-nowrap border transition-colors shrink-0 ${
                activeFilter === filter.id 
                  ? 'bg-[#FF6B00] border-[#FF6B00] text-white' 
                  : 'bg-[#F5F5F5] border-[#E8E8E8] text-[#1A1A1A]'
              }`}
            >
              <span className="text-[14px] mr-[6px]">{filter.emoji}</span>
              <span className="font-dm-sans font-medium text-[13px]">{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pb-[80px]">
        
        {activeTab === 'home' && (
          <>
            {/* Hero Banner */}
            <div className="mt-[16px] mx-[16px] h-[160px] rounded-[20px] overflow-hidden relative shadow-sm">
              <div className="absolute inset-0 bg-[#E8E8E8]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,46,0.85)] to-[rgba(26,26,46,0)]" />
              
              <button 
                onClick={() => setActiveTab('map')}
                className="absolute top-[16px] right-[16px] w-[40px] h-[40px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-white/30"
              >
                <MapIcon size={18} className="text-white fill-white" />
              </button>
              
              <div className="absolute bottom-[16px] left-[16px]">
                <div className="flex items-center gap-2 mb-[4px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#00C853] animate-pulse"></div>
                  <span className="font-dm-sans font-medium text-[13px] text-white">17 vendors open near you</span>
                </div>
                
                <div className="flex items-end gap-[8px]">
                  <h2 className="font-baloo font-bold text-[20px] text-white leading-tight">Closest: Sharma Ji Kulfi</h2>
                  <div className="bg-[#FF6B00] rounded-[20px] px-[10px] py-[4px]">
                    <span className="font-dm-sans font-medium text-[12px] text-white">120m &rarr;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Near You */}
        <div className="mt-[24px]">
          <div className="px-[16px] flex justify-between items-center">
            <h3 className="font-baloo font-bold text-[18px] text-[#1A1A1A]">🔥 Trending Near You</h3>
            <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00] hover:underline">
              See all &rarr;
            </button>
          </div>
          
          <div className="mt-[12px] overflow-x-auto no-scrollbar pl-[16px] flex gap-[12px] pb-[4px]">
            {MOCK_VENDORS.map((vendor) => (
              <div 
                key={vendor.id} 
                className="w-[200px] shrink-0 bg-white rounded-[16px] border-[1px] border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => router.push(`/vendor/${vendor.id}`)}
              >
                <div className="h-[140px] w-full bg-[#F5F5F5] relative">
                  {/* Photo spacer */}
                  {vendor.isOpen ? (
                    <div className="absolute top-[8px] right-[8px] bg-[#00C853] rounded-[20px] px-[8px] py-[4px] flex items-center gap-1 shadow-sm">
                      <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
                      <span className="font-dm-sans font-bold text-[10px] text-white">OPEN</span>
                    </div>
                  ) : (
                    <div className="absolute top-[8px] right-[8px] bg-[#FF3B30] rounded-[20px] px-[8px] py-[4px] shadow-sm">
                      <span className="font-dm-sans font-bold text-[10px] text-white">CLOSED</span>
                    </div>
                  )}
                </div>
                <div className={`p-[12px] ${!vendor.isOpen ? 'opacity-75' : ''}`}>
                  <h4 className="font-baloo font-semibold text-[15px] text-[#1A1A1A] truncate">{vendor.name}</h4>
                  <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">
                    ⭐ {vendor.rating} ({vendor.reviews}) <span className="mx-1">•</span> 📍 {vendor.distance}
                  </div>
                  <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] truncate">
                    {vendor.items.join(' · ')}
                  </div>
                  <div className={`font-space-grotesk font-medium text-[14px] mt-[6px] ${vendor.isOpen ? 'text-[#FF6B00]' : 'text-gray-400 line-through'}`}>
                    ₹{vendor.price} onwards
                  </div>
                </div>
              </div>
            ))}
            {/* Spacer for right scrolling margin */}
            <div className="w-[4px] shrink-0"></div>
          </div>
        </div>

        {/* Mini Map Section */}
        <div className="mt-[24px]">
          <div className="px-[16px] flex justify-between items-center mb-[12px]">
            <h3 className="font-baloo font-bold text-[18px] text-[#1A1A1A]">📍 On Your Map</h3>
            <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00] hover:underline">
              Open full map &rarr;
            </button>
          </div>
          
          <div className="mx-[16px] relative h-[180px] rounded-[20px] border-[1.5px] border-[#E8E8E8] shadow-sm bg-gray-100 overflow-hidden">
            <MapComponent userLocation={userLocation} vendors={MOCK_VENDORS} />
            <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 bg-white px-[12px] py-[6px] rounded-full shadow-md z-[400] pointer-events-none">
              <span className="font-dm-sans font-medium text-[12px] text-[#1A1A1A]">5 vendors within 500m</span>
            </div>
          </div>
        </div>

        {/* Top Picks Section */}
        <div className="mt-[24px]">
          <div className="px-[16px] mb-[12px]">
            <h3 className="font-baloo font-bold text-[18px] text-[#1A1A1A]">⭐ Top Picks For You</h3>
            <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Based on your taste 🍡</p>
          </div>
          
          <div className="px-[16px] flex flex-col gap-[12px]">
            {TOP_PICKS.map((vendor) => (
              <div 
                key={vendor.id} 
                className="w-full bg-white rounded-[20px] border-[1px] border-[#EBEBEB] shadow-[0_3px_16px_rgba(0,0,0,0.07)] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => router.push(`/vendor/${vendor.id}`)}
              >
                <div className="h-[160px] w-full bg-[#F5F5F5] relative">
                  {/* Photo area */}
                  <div className="absolute top-[12px] right-[12px] flex items-center gap-[8px]">
                    {vendor.isOpen && (
                      <div className="bg-[#00C853] rounded-[20px] px-[8px] py-[4px] flex items-center gap-1 shadow-sm">
                        <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
                        <span className="font-dm-sans font-bold text-[10px] text-white">OPEN</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => toggleSave(vendor.id, e)}
                      className="w-[32px] h-[32px] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                    >
                      <Heart 
                        size={16} 
                        className={savedVendors.includes(vendor.id) ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-[#1A1A1A]'} 
                      />
                    </button>
                  </div>
                </div>
                
                <div className="p-[16px]">
                  <h4 className="font-baloo font-bold text-[17px] text-[#1A1A1A] leading-tight">
                    {vendor.category === 'chaat' ? '🥘' : '🍡'} {vendor.name}
                  </h4>
                  <div className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[2px]">
                    {vendor.address}
                  </div>
                  <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px]">
                    ⭐ {vendor.rating} <span className="mx-1">•</span> {vendor.reviews} reviews <span className="mx-1">•</span> {vendor.distance} away
                  </div>
                  <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] truncate">
                    Popular: {vendor.items.join(' · ')}
                  </div>
                  
                  <div className="mt-[16px] pt-[12px] border-t border-[#E8E8E8] flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">
                        ₹{vendor.minPrice} – ₹{vendor.maxPrice}
                      </span>
                      <span className="font-dm-sans text-[12px] text-[#6B6B6B]">
                        Wait: {vendor.waitTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-[8px]">
                      <button className="px-[14px] h-[36px] rounded-[10px] border-[1.5px] border-[#FF6B00] text-[#FF6B00] font-dm-sans font-medium text-[13px] transition-colors hover:bg-[#FFF0E6]">
                        View Menu
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/vendor/${vendor.id}`); }}
                        className="px-[14px] h-[36px] rounded-[10px] bg-[#FF6B00] text-white font-dm-sans font-bold text-[13px] shadow-[0_4px_12px_rgba(255,107,0,0.3)] transition-transform active:scale-95"
                      >
                        Order ₹{vendor.minPrice} &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {activeTab === 'map' && (
          <div className="w-full h-full relative">
            <MapComponent userLocation={userLocation} vendors={MOCK_VENDORS} />
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 bg-white px-[20px] py-[10px] rounded-full shadow-lg z-[400] flex items-center gap-2">
              <div className="w-[8px] h-[8px] rounded-full bg-[#00C853] animate-pulse"></div>
              <span className="font-dm-sans font-bold text-[14px] text-[#1A1A1A]">17 vendors nearby</span>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="px-[16px] py-[24px]">
            <h3 className="font-baloo font-bold text-[24px] text-[#1A1A1A] mb-[4px]">Saved Vendors 💖</h3>
            <p className="font-dm-sans text-[14px] text-[#6B6B6B] mb-[20px]">Your favorite street food spots</p>
            {savedVendors.length === 0 ? (
              <div className="text-center py-[40px]">
                <span className="text-[40px] mb-4 block">📍</span>
                <p className="font-dm-sans text-[#6B6B6B]">You haven&apos;t saved any vendors yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-[12px]">
                {MOCK_VENDORS.concat(TOP_PICKS as any).filter(v => savedVendors.includes(v.id)).map((vendor, i) => (
                  <div key={i} className="flex border border-[#E8E8E8] rounded-[16px] p-[12px] bg-white gap-[12px] shadow-sm">
                     <div className="w-[80px] h-[80px] rounded-[10px] bg-[#F5F5F5] shrink-0" />
                     <div className="flex-1">
                       <h4 className="font-baloo font-semibold text-[15px]">{vendor.name}</h4>
                       <p className="font-dm-sans text-[12px] text-[#6B6B6B]">⭐ {vendor.rating}</p>
                       <button className="mt-2 text-[#FF6B00] font-dm-sans font-bold text-[13px] border border-[#FF6B00] rounded-md px-3 py-1">View</button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="px-[16px] py-[24px]">
            <div className="flex items-center gap-[16px] mb-[32px]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#E8E8E8] shadow-sm flex flex-col items-center justify-center border-2 border-white overflow-hidden">
                <span className="font-dm-sans font-bold text-[#BBBBC0] text-[24px]">AS</span>
              </div>
              <div>
                <h3 className="font-baloo font-bold text-[24px] text-[#1A1A1A]">Aman Singh</h3>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B]">Foodie since 2026</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-[12px]">
              <div className="bg-white border border-[#E8E8E8] rounded-[16px] overflow-hidden shadow-sm">
                <button className="w-full h-[54px] px-[16px] flex items-center justify-between border-b border-[#E8E8E8] active:bg-[#F5F5F5] transition-colors" onClick={() => router.push('/customer-profile-setup')}>
                  <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A]">Edit Profile Details</span>
                  <ChevronRight size={18} className="text-[#BBBBC0]" />
                </button>
                <button className="w-full h-[54px] px-[16px] flex items-center justify-between border-b border-[#E8E8E8] active:bg-[#F5F5F5] transition-colors">
                  <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A]">Payment Methods</span>
                  <ChevronRight size={18} className="text-[#BBBBC0]" />
                </button>
                <button className="w-full h-[54px] px-[16px] flex items-center justify-between active:bg-[#F5F5F5] transition-colors">
                  <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A]">Address Book</span>
                  <ChevronRight size={18} className="text-[#BBBBC0]" />
                </button>
              </div>
              
              <div className="bg-white border border-[#E8E8E8] rounded-[16px] overflow-hidden shadow-sm">
                <button className="w-full h-[54px] px-[16px] flex items-center justify-between border-b border-[#E8E8E8] active:bg-[#F5F5F5] transition-colors">
                  <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A]">Help & Support</span>
                  <ChevronRight size={18} className="text-[#BBBBC0]" />
                </button>
                <button className="w-full h-[54px] px-[16px] flex items-center justify-between active:bg-[#F5F5F5] transition-colors">
                  <span className="font-dm-sans font-medium text-[15px] text-[#1A1A1A]">About StreetEats</span>
                  <ChevronRight size={18} className="text-[#BBBBC0]" />
                </button>
              </div>

              <div className="mt-[24px]">
                <button onClick={() => { localStorage.clear(); router.replace('/role-select'); }} className="w-full h-[54px] bg-[#FFF0E6] text-[#FF3B30] font-dm-sans font-bold text-[16px] rounded-[16px] flex items-center justify-center transition-opacity active:opacity-80">
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EBEBEB] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-[8px] pb-safe z-40">
        <div className="h-[64px] flex items-center justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'map', icon: MapIcon, label: 'Map' },
            { id: 'orders', icon: Package, label: 'Orders', badge: true },
            { id: 'saved', icon: Heart, label: 'Saved' },
            { id: 'profile', icon: UserIcon, label: 'Profile' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'orders') {
                    router.push('/tracking');
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className="flex flex-col items-center justify-center w-[60px] h-[56px] relative rounded-xl transition-all"
              >
                <div className="relative">
                  <Icon 
                    size={22} 
                    className={`transition-colors ${isActive ? 'text-[#FF6B00]' : 'text-[#BBBBC0]'}`}
                    fill={isActive ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {tab.badge && (
                    <div className="absolute -top-[2px] -right-[2px] w-[8px] h-[8px] bg-[#FF3B30] rounded-full animate-pulse border border-white"></div>
                  )}
                </div>
                <span className={`font-dm-sans text-[11px] mt-[4px] transition-colors ${isActive ? 'font-medium text-[#FF6B00]' : 'font-regular text-[#BBBBC0]'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-[6px] w-[4px] h-[4px] bg-[#FF6B00] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
