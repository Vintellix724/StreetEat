import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, X, ChevronRight, Check, Ban, Upload, MessageSquare,
  PauseCircle, AlertCircle, ShoppingBag, Star, DollarSign, MapPin,
  Clock, Phone, Copy, Eye, SlidersHorizontal, Flag, AlertTriangle, Store
} from 'lucide-react';
import dynamic from 'next/dynamic';

const StaticMapComponent = dynamic(() => import('@/components/StaticMapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#1C1C2E] animate-pulse rounded-[12px]" />
});

export default function AdminVendorManagerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [activeSortFilter, setActiveSortFilter] = useState('Top Revenue');
  
  // Sheet states
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showVendorDetailSheet, setShowVendorDetailSheet] = useState(false);
  const [showRejectSheet, setShowRejectSheet] = useState(false);
  const [showMessageSheet, setShowMessageSheet] = useState(false);
  const [showBanSheet, setShowBanSheet] = useState(false);

  // Detail Tab
  const [detailTab, setDetailTab] = useState('Overview');

  // Bulk Mode
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const mockVendors = [
    {
      id: 'vnd_1',
      vid: 'VND-2847-SHRM',
      name: 'Sharma Ji Kulfi',
      state: 'verified', // verified, pending, paused, banned
      isOpen: true,
      location: 'Sector 14, Karol Bagh, Delhi',
      categories: ['Kulfi', 'Drinks'],
      orders: 142,
      rating: '4.9',
      revenue: '48,240',
      revenueNum: 48240,
      goalNum: 58000,
      joined: 'March 2024',
      itemsCount: 12,
      phone: '+91 98765 43210',
      upi: 'sharmaji@upi',
      email: 'sharma@email.com',
      commissionRate: 5,
      isFeatured: false
    },
    {
      id: 'vnd_2',
      vid: 'VND-9921-RMSH',
      name: 'Ramesh Chaat Corner',
      state: 'pending',
      isOpen: false,
      location: 'Lajpat Nagar, Delhi',
      categories: ['Chaat'],
      itemsCount: 1,
      hasPhoto: false,
      registered: '2hrs ago',
    },
    {
      id: 'vnd_3',
      vid: 'VND-3344-GUPT',
      name: 'Gupta Burgers',
      state: 'paused',
      isOpen: false,
      location: 'South Ex, Delhi',
      categories: ['Fast Food'],
      returnDate: '5 May 2025',
      holidayMode: true
    },
    {
      id: 'vnd_4',
      vid: 'VND-1122-FRAUD',
      name: 'Fake Vendor 123',
      state: 'banned',
      isOpen: false,
      location: 'Unknown',
      bannedAt: '7 days ago',
      banReason: 'Policy violation'
    }
  ];

  const vendorStatuses = ['All', 'Verified', 'Pending', 'Open', 'Closed', 'Paused', 'Banned'];
  const vendorCategories = ['All', 'Kulfi', 'Chaat', 'Chai', 'Momos', 'Juice', 'Fast Food'];
  const vendorSorts = ['Top Revenue', 'Top Rated', 'Newest', 'Most Orders', 'Flagged First'];

  const filteredVendors = mockVendors.filter(v => {
    if (activeStatusFilter !== 'All') {
      if (activeStatusFilter === 'Verified' && v.state !== 'verified') return false;
      if (activeStatusFilter === 'Pending' && v.state !== 'pending') return false;
      if (activeStatusFilter === 'Paused' && v.state !== 'paused') return false;
      if (activeStatusFilter === 'Banned' && v.state !== 'banned') return false;
      if (activeStatusFilter === 'Open' && !v.isOpen) return false;
      if (activeStatusFilter === 'Closed' && v.isOpen) return false;
    }
    if (activeCategoryFilter !== 'All') {
      if (!v.categories?.includes(activeCategoryFilter)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !(v.location || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleVendorSelection = (id: string) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(vid => vid !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
  };

  const handleOpenVendor = (v: any) => {
    if (isBulkMode) {
      toggleVendorSelection(v.id);
      return;
    }
    setSelectedVendor(v);
    setShowVendorDetailSheet(true);
    setDetailTab('Overview');
  };

  const handleLongPress = (id: string) => {
    if (!isBulkMode) {
      setIsBulkMode(true);
      setSelectedVendors([id]);
    }
  };

  let pressTimer: NodeJS.Timeout;

  const startPress = (id: string) => {
    pressTimer = setTimeout(() => {
      handleLongPress(id);
    }, 500);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div className="w-full h-[100dvh] bg-[#050508] font-sans flex justify-center">
      <div className="w-full max-w-[390px] h-full relative bg-[#050508] flex flex-col overflow-hidden">
        
        {/* STICKY TOP BAR */}
        <div className="w-full h-[116px] pt-[52px] px-[16px] bg-[#050508] border-b border-[#1C1C2E] flex items-center justify-between shrink-0 z-40">
          {isBulkMode ? (
            <>
              <button onClick={() => { setIsBulkMode(false); setSelectedVendors([]); }} className="font-dm-sans font-medium text-[15px] text-white flex items-center gap-[4px]">
                &larr; Exit
              </button>
              <h1 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">{selectedVendors.length} selected</h1>
              <button 
                onClick={() => setSelectedVendors(mockVendors.map(v => v.id))}
                className="font-dm-sans font-medium text-[15px] text-[#FF6B00]"
              >
                Select All
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-[12px]">
                <button onClick={() => router.back()} className="w-[40px] h-[40px] flex items-center justify-center -ml-[8px] active:scale-95">
                  <ArrowLeft size={24} className="text-[#EFEFFF]" />
                </button>
                <h1 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">Vendor Manager</h1>
              </div>
              <button 
                className="h-[34px] px-[12px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[10px] flex items-center justify-center gap-[6px] active:scale-95 transition-transform"
              >
                <Upload size={14} className="text-[#EFEFFF]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Export</span>
              </button>
            </>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          
          {/* SEARCH BAR */}
          <div className="mt-[12px] mx-[16px]">
            <div className={`h-[48px] bg-[#0D0D14] border-[1.5px] rounded-[14px] flex items-center px-[16px] transition-colors ${searchQuery ? 'border-[#FF6B00] shadow-[0_0_0_3px_rgba(255,107,0,0.10)]' : 'border-[#1C1C2E]'}`}>
              <Search size={20} className="text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search by name, location, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-dm-sans text-[14px] text-[#EFEFFF] placeholder:text-[#6B6B6B] mx-[10px]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="active:scale-95">
                  <X size={20} className="text-[#6B6B6B]" />
                </button>
              )}
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="mt-[12px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[14px] p-[12px] overflow-x-auto no-scrollbar">
            <div className="flex divide-x divide-[#1C1C2E] w-max">
              <div className="flex flex-col items-center px-[12px]">
                <span className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">123</span>
                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Total Vendors</span>
              </div>
              <div className="flex flex-col items-center px-[12px]">
                <span className="font-space-grotesk font-bold text-[20px] text-[#00C853]">89</span>
                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Open Now</span>
              </div>
              <div className="flex flex-col items-center px-[12px]">
                <span className="font-space-grotesk font-bold text-[20px] text-[#FFD600]">8</span>
                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Pending</span>
              </div>
              <div className="flex flex-col items-center px-[12px]">
                <span className="font-space-grotesk font-bold text-[20px] text-[#FF9500]">12</span>
                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Paused</span>
              </div>
              <div className="flex flex-col items-center px-[12px]">
                <span className="font-space-grotesk font-bold text-[20px] text-[#FF3B30]">14</span>
                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Banned</span>
              </div>
            </div>
          </div>

          {/* FILTER ROWS */}
          <div className="mt-[10px] w-full overflow-x-auto no-scrollbar pb-[4px]">
            <div className="flex gap-[8px] px-[16px] w-max">
              {vendorStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(status)}
                  className={`h-[32px] px-[16px] rounded-[20px] flex items-center justify-center transition-colors ${
                    activeStatusFilter === status 
                      ? 'bg-[#FF6B00] font-dm-sans font-bold text-[13px] text-white border border-[#FF6B00]' 
                      : 'bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]'
                  }`}
                >
                  {status === 'Verified' && '✅ '}
                  {status === 'Pending' && '⏳ '}
                  {status === 'Open' && '🟢 '}
                  {status === 'Closed' && '🔴 '}
                  {status === 'Paused' && '⏸ '}
                  {status === 'Banned' && '🚫 '}
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-[4px] w-full overflow-x-auto no-scrollbar pb-[4px]">
            <div className="flex gap-[8px] px-[16px] w-max">
              {vendorCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`h-[32px] px-[16px] rounded-[20px] flex items-center justify-center transition-colors ${
                    activeCategoryFilter === cat 
                      ? 'bg-[#FF6B00] font-dm-sans font-bold text-[13px] text-white border border-[#FF6B00]' 
                      : 'bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]'
                  }`}
                >
                  {cat === 'Kulfi' && '🍡 '}
                  {cat === 'Chaat' && '🥘 '}
                  {cat === 'Chai' && '☕ '}
                  {cat === 'Momos' && '🌮 '}
                  {cat === 'Juice' && '🥤 '}
                  {cat}
                </button>
              ))}
              <button className="h-[32px] px-[16px] rounded-[20px] bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]">
                + More
              </button>
            </div>
          </div>

          <div className="mt-[4px] w-full overflow-x-auto no-scrollbar pb-[8px]">
            <div className="flex gap-[8px] px-[16px] w-max">
              {vendorSorts.map(sort => (
                <button
                  key={sort}
                  onClick={() => setActiveSortFilter(sort)}
                  className={`h-[32px] px-[16px] rounded-[20px] flex items-center justify-center transition-colors ${
                    activeSortFilter === sort 
                      ? 'bg-[#FF6B00] font-dm-sans font-bold text-[13px] text-white border border-[#FF6B00]' 
                      : 'bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]'
                  }`}
                >
                  {sort === 'Top Revenue' && '↕ '}
                  {sort === 'Top Rated' && '⭐ '}
                  {sort === 'Newest' && '🆕 '}
                  {sort === 'Most Orders' && '📦 '}
                  {sort === 'Flagged First' && '⚠ '}
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* VENDOR CARDS */}
          <div className="mt-[4px] mx-[16px] flex flex-col gap-[10px]">
            {filteredVendors.length === 0 ? (
              <div className="py-[60px] flex flex-col items-center justify-center">
                <Store size={48} className="text-[#252538] mb-[16px]" />
                <p className="font-dm-sans font-medium text-[15px] text-[#6B6B6B] text-center">Koi vendor nahi mila</p>
                <p className="font-dm-sans text-[13px] text-[#6B6B6B] text-center mt-[4px]">Filter change karke dekho</p>
              </div>
            ) : (
              filteredVendors.map(v => {
                const isSelected = selectedVendors.includes(v.id);
                
                if (v.state === 'verified') {
                  return (
                    <div
                      key={v.id}
                      onMouseDown={() => startPress(v.id)}
                      onMouseUp={cancelPress}
                      onMouseLeave={cancelPress}
                      onTouchStart={() => startPress(v.id)}
                      onTouchEnd={cancelPress}
                      onClick={() => handleOpenVendor(v)}
                      className={`w-full bg-[#0D0D14] rounded-[20px] p-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-colors relative cursor-pointer
                        ${isSelected ? 'border-[4px] border-[#FF6B00] bg-[#1C1C2E]' : 'border border-[#1C1C2E]'}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-[16px] left-[16px] w-[22px] h-[22px] bg-[#FF6B00] rounded-full flex items-center justify-center z-20 shadow-md">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <div className="flex">
                        <div className="relative shrink-0">
                          <div className={`w-[56px] h-[56px] rounded-[14px] bg-[#1C1C2E] overflow-hidden ${isSelected ? 'opacity-80' : ''}`} />
                          <div className={`absolute -top-[4px] -right-[4px] w-[10px] h-[10px] rounded-full border-2 border-[#0D0D14] ${v.isOpen ? 'bg-[#00C853] animate-pulse' : 'bg-[#FF3B30]'}`} />
                        </div>
                        <div className="ml-[12px] flex-1 min-w-0">
                          <div className="flex items-center">
                            <h3 className="font-dm-sans font-semibold text-[15px] text-[#EFEFFF] truncate">{v.name}</h3>
                            <div className="ml-[8px] bg-[#0A1F0F] border border-[#00C853] rounded-[4px] px-[8px] py-[2px] shrink-0">
                              <span className="font-dm-sans font-bold text-[10px] text-[#00C853]">✅ Verified</span>
                            </div>
                          </div>
                          <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[3px] truncate">📍 {v.location}</p>
                          <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">{v.categories?.join(' · ')}</p>
                        </div>
                        <div className="flex items-center shrink-0 ml-[8px]">
                          <ChevronRight size={20} className="text-[#6B6B6B]" />
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-[#1C1C2E] my-[12px]" />

                      <div className="flex gap-[16px] mb-[8px]">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">📦 {v.orders} orders</span>
                        <span className="font-dm-sans text-[12px] text-[#FFD600]">⭐ {v.rating}</span>
                        <span className="font-dm-sans text-[12px] text-[#FF6B00]">💰 ₹{v.revenue}</span>
                      </div>

                      <div className="flex justify-between mb-[4px]">
                        <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Today: ₹{v.revenue || '0'}</span>
                        <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Goal: ₹{(v.goalNum || 1000).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-[4px] bg-[#252538] rounded-[3px] overflow-hidden mb-[8px]">
                        <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFB347]" style={{ width: `${((v.revenueNum || 0)/(v.goalNum || 1000))*100}%` }} />
                      </div>
                      <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Member since {v.joined} · {v.orders} orders total</p>
                    </div>
                  );
                }

                if (v.state === 'pending') {
                  return (
                    <div
                      key={v.id}
                      onClick={() => handleOpenVendor(v)}
                      className="w-full bg-[#0D0D14] rounded-[20px] p-[16px] border-[1.5px] border-[#FFD600] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-[4px] h-full bg-[#FFD600]" />
                      <div className="pl-[4px]">
                        <div className="flex items-center gap-[8px] mb-[4px]">
                          <h3 className="font-dm-sans font-semibold text-[15px] text-[#EFEFFF]">{v.name}</h3>
                          <div className="bg-[#1C1A09] border border-[#FFD600] rounded-[4px] px-[8px] py-[2px]">
                            <span className="font-dm-sans font-bold text-[10px] text-[#FFD600]">⏳ Pending</span>
                          </div>
                        </div>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[10px]">
                          {v.itemsCount} item{v.itemsCount !== 1 ? 's' : ''} · {v.hasPhoto ? 'Photos attached' : 'No photo'} · Registered {v.registered}
                        </p>
                        
                        <div className="flex gap-[8px]">
                          <button onClick={(e) => { e.stopPropagation(); /* handle approve */ }} className="flex-1 h-[38px] bg-[#00C853] rounded-[10px] font-dm-sans font-bold text-[13px] text-white flex justify-center items-center gap-[4px] active:scale-95">
                            <Check size={14} /> Approve
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setShowRejectSheet(true); }} className="flex-1 h-[38px] bg-transparent border-[1.5px] border-[#FF3B30] rounded-[10px] font-dm-sans font-bold text-[13px] text-[#FF3B30] flex justify-center items-center gap-[4px] active:scale-95">
                            <X size={14} /> Reject
                          </button>
                          <button className="flex-1 h-[38px] bg-[#13131F] border border-[#252538] rounded-[10px] font-dm-sans font-medium text-[13px] text-[#6B6B6B] flex justify-center items-center gap-[4px] active:scale-95">
                            <Eye size={14} /> View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (v.state === 'paused') {
                  return (
                    <div key={v.id} className="w-full bg-[#0D0D14] opacity-[0.85] rounded-[20px] p-[16px] border border-[#FF9500]">
                      <h3 className="font-dm-sans font-medium text-[12px] text-[#FF9500] mb-[2px]">⏸ PAUSED · Holiday Mode</h3>
                      <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[8px]">Returns: {v.returnDate}</p>
                      <button className="w-full h-[32px] rounded-[8px] border border-[#FF9500] font-dm-sans font-medium text-[12px] text-[#FF9500] active:bg-[#FF9500]/10">
                        Force Activate
                      </button>
                    </div>
                  );
                }

                if (v.state === 'banned') {
                  return (
                    <div key={v.id} className="w-full bg-[#0D0907] opacity-[0.70] rounded-[20px] p-[16px] border border-[#FF3B30]">
                      <h3 className="font-dm-sans text-[15px] text-[#6B6B6B] mb-[4px]">{v.name}</h3>
                      <p className="font-dm-sans font-medium text-[12px] text-[#FF3B30] mb-[2px]">🚫 Banned · {v.bannedAt}</p>
                      <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[8px]">Reason: {v.banReason}</p>
                      <button className="w-[120px] h-[32px] rounded-[8px] border border-[#FF3B30] font-dm-sans font-medium text-[12px] text-[#FF3B30] active:bg-[#FF3B30]/10">
                        Unban Vendor
                      </button>
                    </div>
                  );
                }

                return null;
              })
            )}
          </div>
          <div className="h-[40px]" />
        </div>

        {/* BULK ACTION BAR */}
        {isBulkMode && (
          <div className="absolute bottom-[0] left-0 w-full h-[64px] pb-[safe-area-inset-bottom] bg-[#0D0D14] border-t border-[#1C1C2E] flex items-center justify-between px-[16px] z-50 shrink-0">
            <button className="flex flex-col items-center gap-[4px] active:scale-95">
              <Check size={20} className="text-[#00C853]" />
              <span className="font-dm-sans font-medium text-[11px] text-[#00C853]">Approve All</span>
            </button>
            <button onClick={() => setShowMessageSheet(true)} className="flex flex-col items-center gap-[4px] active:scale-95">
              <MessageSquare size={20} className="text-[#FF6B00]" />
              <span className="font-dm-sans font-medium text-[11px] text-[#FF6B00]">Notify All</span>
            </button>
            <button className="flex flex-col items-center gap-[4px] active:scale-95">
              <PauseCircle size={20} className="text-[#FF9500]" />
              <span className="font-dm-sans font-medium text-[11px] text-[#FF9500]">Pause All</span>
            </button>
            <button className="flex flex-col items-center gap-[4px] active:scale-95">
              <Ban size={20} className="text-[#FF3B30]" />
              <span className="font-dm-sans font-medium text-[11px] text-[#FF3B30]">Ban All</span>
            </button>
          </div>
        )}

        {/* VENDOR DETAIL SHEET */}
        {showVendorDetailSheet && selectedVendor && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVendorDetailSheet(false)} />
            <div className="w-full h-[92%] bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-full flex justify-center pt-[12px] pb-[8px] absolute top-0 z-20 bg-gradient-to-b from-[#0D0D14] to-transparent">
                <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
              </div>
              
              <div 
                className="flex-1 overflow-y-auto px-[20px] pt-[30px] pb-[40px] overscroll-y-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* Hero Header */}
                <div className="flex items-center">
                  <div className="w-[72px] h-[72px] rounded-[18px] bg-[#1C1C2E] shadow-[0_4px_16px_rgba(0,0,0,0.4)] shrink-0" />
                  <div className="ml-[14px]">
                    <h2 className="font-baloo font-bold text-[22px] text-[#EFEFFF] leading-none mb-[2px]">{selectedVendor.name}</h2>
                    <p className="font-dm-sans text-[13px] text-[#6B6B6B] mb-[6px]">📍 {selectedVendor.location}</p>
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <div className="px-[8px] py-[2px] rounded-[6px] bg-[#0A1F0F] border border-[#00C853]">
                        <span className="font-dm-sans font-bold text-[10px] text-[#00C853]">✅ Verified</span>
                      </div>
                      <div className="px-[8px] py-[2px] rounded-[6px] bg-[#0A1F0F] flex items-center gap-[4px]">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#00C853]" />
                        <span className="font-dm-sans font-bold text-[10px] text-[#00C853]">Open</span>
                      </div>
                      <span className="font-dm-sans text-[12px] text-[#6B6B6B]">{selectedVendor.categories?.join(' · ')}</span>
                    </div>
                    <div className="mt-[8px] flex items-center gap-[6px]">
                      <span className="font-jetbrains text-[11px] text-[#252538]">{selectedVendor.vid}</span>
                      <button className="text-[#6B6B6B]"><Copy size={12} /></button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex gap-[8px] mt-[16px]">
                  <div className="flex-1 bg-[#13131F] rounded-[12px] p-[10px] flex flex-col items-center">
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Orders</span>
                    <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">{selectedVendor.orders}</span>
                  </div>
                  <div className="flex-1 bg-[#13131F] rounded-[12px] p-[10px] flex flex-col items-center">
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Revenue</span>
                    <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">₹48K</span>
                  </div>
                  <div className="flex-1 bg-[#13131F] rounded-[12px] p-[10px] flex flex-col items-center">
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Rating</span>
                    <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">{selectedVendor.rating}⭐</span>
                  </div>
                  <div className="flex-1 bg-[#13131F] rounded-[12px] p-[10px] flex flex-col items-center">
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Items</span>
                    <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">{selectedVendor.itemsCount}</span>
                  </div>
                </div>

                {/* Detail Tab Bar */}
                <div className="flex border-b border-[#1C1C2E] mt-[24px]">
                  {['Overview', 'Orders', 'Menu', 'Reviews', 'Settings'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`flex-1 pb-[8px] relative ${
                        detailTab === tab 
                          ? 'font-dm-sans font-semibold text-[13px] text-[#FF6B00]' 
                          : 'font-dm-sans text-[13px] text-[#6B6B6B]'
                      }`}
                    >
                      {tab}
                      {detailTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B00]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="mt-[20px] pb-[40px]">
                  
                  {detailTab === 'Overview' && (
                    <div className="flex flex-col gap-[20px]">
                      <div>
                        <h3 className="font-space-grotesk font-bold text-[18px] text-[#FF6B00] mb-[12px]">₹48,240 this week</h3>
                        <div className="h-[100px] flex items-end gap-[8px] border-b border-[#1C1C2E] pb-[4px]">
                          {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-[4px]">
                              <div className="w-full bg-gradient-to-b from-[#FF6B00] to-[#FF4500] rounded-t-[4px]" style={{ height: `${h}%` }} />
                              <span className="font-dm-sans text-[10px] text-[#6B6B6B]">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[2px]">Operating Hours</h4>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Mon-Sat · 9AM-10PM</p>
                      </div>

                      <div className="flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                          <span className="font-dm-sans text-[13px] text-[#EFEFFF]">{selectedVendor.phone}</span>
                          <span className="font-dm-sans text-[13px] text-[#FF6B00]">Call</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-dm-sans text-[13px] text-[#EFEFFF]">{selectedVendor.upi}</span>
                          <span className="font-dm-sans text-[13px] text-[#FF6B00]">Copy</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-dm-sans text-[13px] text-[#EFEFFF]">{selectedVendor.email}</span>
                        </div>
                      </div>

                      <div className="w-full h-[120px] rounded-[12px] border border-[#252538] overflow-hidden relative">
                        <StaticMapComponent location={[28.6139, 77.2090]} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-[12px] h-[12px] bg-[#FF6B00] rounded-full border-2 border-white shadow-lg" />
                        </div>
                        <div className="absolute bottom-[8px] right-[8px] bg-black/50 backdrop-blur-md px-[12px] py-[4px] rounded-[12px]">
                          <span className="font-dm-sans text-[11px] text-white">Open in Maps &rarr;</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-[4px]">
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Joined: March 15, 2024</p>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Verified by: Admin Vikram</p>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Verified on: March 16, 2024</p>
                      </div>
                    </div>
                  )}

                  {detailTab === 'Orders' && (
                    <div>
                      <div className="flex gap-[8px] mb-[16px]">
                        <button className="px-[12px] py-[6px] rounded-[16px] bg-[#FF6B00] font-dm-sans text-[12px] text-white">All</button>
                        <button className="px-[12px] py-[6px] rounded-[16px] bg-[#13131F] border border-[#252538] font-dm-sans text-[12px] text-[#EFEFFF]">Completed</button>
                        <button className="px-[12px] py-[6px] rounded-[16px] bg-[#13131F] border border-[#252538] font-dm-sans text-[12px] text-[#EFEFFF]">Cancelled</button>
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="pb-[12px] border-b border-[#1C1C2E] flex justify-between items-start">
                            <div>
                              <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">#SF284{i} · 3 items · ₹80</p>
                              <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">Rahul Kumar · UPI · 2 days ago</p>
                            </div>
                            <div className="bg-[#0A1F0F] rounded-[4px] px-[6px] py-[2px]">
                              <span className="font-dm-sans text-[10px] text-[#00C853] font-bold">Done</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full text-center mt-[12px] font-dm-sans text-[13px] text-[#FF6B00]">Load 10 more</button>
                    </div>
                  )}

                  {detailTab === 'Menu' && (
                    <div>
                      <div className="flex justify-between items-center mb-[16px]">
                        <p className="font-dm-sans text-[13px] text-[#6B6B6B]">12 items · 2 sold out · 1 hidden</p>
                        <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">View Full Menu &rarr;</button>
                      </div>
                      <div className="flex flex-col gap-[16px]">
                        {[
                          { name: 'Malai Check Kulfi', cat: 'Kulfi', price: 80, state: 'available' },
                          { name: 'Pista Kulfi', cat: 'Kulfi', price: 90, state: 'sold_out' },
                          { name: 'Rose Falooda', cat: 'Drinks', price: 120, state: 'hidden' },
                        ].map((m, i) => (
                           <div key={i} className="flex justify-between items-center">
                             <div className="flex items-center gap-[12px]">
                               <div className="w-[40px] h-[40px] bg-[#1C1C2E] rounded-[8px]" />
                               <div>
                                 <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">{m.name}</p>
                                 <p className="font-dm-sans text-[11px] text-[#6B6B6B]">{m.cat}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-[12px]">
                               <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹{m.price}</span>
                               <button className="w-[50px] font-dm-sans font-medium text-[11px] text-[#EFEFFF] bg-[#252538] rounded-[4px] py-[2px]">{m.state === 'available' ? 'Hide' : 'Show'}</button>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailTab === 'Reviews' && (
                    <div>
                      <div className="flex items-center gap-[20px] mb-[20px]">
                        <div className="flex flex-col items-center">
                          <span className="font-space-grotesk font-bold text-[32px] text-[#FFD600]">4.9 ⭐</span>
                          <span className="font-dm-sans text-[13px] text-[#6B6B6B]">89 reviews</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-[2px]">
                          {[5, 4, 3, 2, 1].map((s, i) => (
                            <div key={i} className="flex items-center gap-[8px]">
                              <span className="font-dm-sans text-[10px] text-[#6B6B6B] w-[8px]">{s}</span>
                              <div className="flex-1 h-[6px] bg-[#252538] rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFD600]" style={{ width: s === 5 ? '80%' : s === 4 ? '15%' : '2%' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-[16px]">
                        {[1, 2].map(i => (
                          <div key={i} className="pb-[16px] border-b border-[#1C1C2E]">
                            <div className="flex justify-between items-start mb-[8px]">
                              <div className="flex items-center gap-[8px]">
                                <div className="w-[32px] h-[32px] bg-[#252538] rounded-full flex justify-center items-center font-bold text-[12px]">R</div>
                                <div>
                                  <p className="font-dm-sans text-[13px] text-[#EFEFFF]">Rahul Kumar</p>
                                  <div className="flex items-center gap-[6px]">
                                    <span className="text-[10px] text-[#FFD600]">⭐⭐⭐⭐⭐</span>
                                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">2 days ago</span>
                                  </div>
                                </div>
                              </div>
                              <button className="font-dm-sans font-medium text-[12px] text-[#FF3B30] flex items-center gap-[4px]">
                                <Flag size={12} /> Flag
                              </button>
                            </div>
                            <p className="font-dm-sans text-[13px] text-[#EFEFFF]">Best kulfi in Karol Bagh! Highly recommended.</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailTab === 'Settings' && (
                    <div className="flex flex-col gap-[20px]">
                      <div className="flex justify-between items-center pb-[16px] border-b border-[#1C1C2E]">
                        <div>
                          <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Verification</p>
                          <p className="font-dm-sans text-[13px] text-[#00C853] mt-[2px]">✅ Verified</p>
                        </div>
                        <button className="font-dm-sans font-medium text-[13px] text-[#FF3B30]">Revoke</button>
                      </div>

                      <div className="flex justify-between items-center pb-[16px] border-b border-[#1C1C2E]">
                        <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Vendor Active</p>
                        <div className="w-[44px] h-[24px] bg-[#00C853] rounded-full flex items-center p-[2px] justify-end">
                           <div className="w-[20px] h-[20px] bg-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pb-[16px] border-b border-[#1C1C2E]">
                        <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Featured on Home Screen</p>
                        <div className="w-[44px] h-[24px] bg-[#252538] rounded-full flex items-center p-[2px]">
                           <div className="w-[20px] h-[20px] bg-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pb-[16px] border-b border-[#1C1C2E]">
                        <div>
                          <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Platform Commission</p>
                          <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">5% (default)</p>
                        </div>
                        <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Edit</button>
                      </div>

                      <div className="pb-[16px] border-b border-[#1C1C2E]">
                        <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF] mb-[10px]">Search Priority Boost</p>
                        <div className="flex gap-[8px]">
                          {['None', 'Low', 'High', 'Top'].map(p => (
                             <button key={p} className={`px-[12px] py-[6px] rounded-[8px] font-dm-sans text-[12px] ${p === 'None' ? 'bg-[#FF6B00] text-white' : 'bg-[#1C1C2E] text-[#6B6B6B]'}`}>
                               {p}
                             </button>
                          ))}
                        </div>
                      </div>

                      <div className="pb-[16px] border-b border-[#1C1C2E]">
                        <div className="flex justify-between items-center mb-[8px]">
                          <p className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Internal Notes</p>
                          <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Save Note</button>
                        </div>
                        <textarea className="w-full h-[80px] bg-[#13131F] border border-[#252538] rounded-[10px] p-[12px] font-dm-sans italic text-[13px] text-[#6B6B6B] resize-none outline-none focus:border-[#FF6B00]" defaultValue="Verified in person on 15 March..." />
                      </div>

                      <div className="flex justify-between items-center pb-[16px] border-b border-[#1C1C2E] p-[12px] bg-[#1F0A0A] border-[1.5px] border-[#FF3B30] rounded-[12px]">
                        <div>
                          <p className="font-dm-sans font-medium text-[14px] text-[#FF3B30]">Force Close Stall</p>
                          <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">Emergency close — overrides vendor</p>
                        </div>
                        <div className="w-[44px] h-[24px] bg-[#252538] rounded-full flex items-center p-[2px]">
                           <div className="w-[20px] h-[20px] bg-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      <button onClick={() => setShowBanSheet(true)} className="w-full h-[44px] bg-[#1F0A0A] border-[1.5px] border-[#FF3B30] rounded-[12px] font-dm-sans font-bold text-[14px] text-[#FF3B30]">
                        🚫 Ban This Vendor
                      </button>

                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* REJECT BOTTOM SHEET */}
        {showRejectSheet && (
          <div className="absolute inset-0 z-[70] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectSheet(false)} />
            <div className="w-full bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[34px]">
              <div className="w-full flex justify-center pt-[12px] pb-[16px]"><div className="w-[40px] h-[4px] bg-[#252538] rounded-full" /></div>
              <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF] text-center">Reject Karein?</h2>
              <p className="font-dm-sans text-[13px] text-[#6B6B6B] text-center mt-[4px] mb-[20px]">Vendor ko reason ke saath notify kiya jayega</p>
              
              <div className="px-[20px] flex flex-col gap-[20px]">
                <div className="flex flex-wrap gap-[8px]">
                  {['Incomplete info', 'Duplicate listing', 'Wrong location', 'Fake vendor', 'Low quality photos', 'Other'].map(r => (
                    <button key={r} className="px-[12px] py-[6px] rounded-[8px] font-dm-sans text-[12px] bg-[#13131F] border border-[#252538] text-[#EFEFFF]">
                      {r}
                    </button>
                  ))}
                </div>
                
                <textarea 
                  placeholder="Vendor ko message..." 
                  className="w-full h-[80px] bg-[#13131F] border border-[#252538] rounded-[12px] p-[12px] font-dm-sans text-[14px] text-[#EFEFFF] resize-none outline-none focus:border-[#FF3B30]"
                />
                
                <div className="flex flex-col gap-[12px]">
                  <button className="w-full h-[54px] rounded-[16px] bg-gradient-to-r from-[#FF3B30] to-[#FF0000] font-dm-sans font-bold text-[16px] text-white">
                    Send Rejection
                  </button>
                  <button onClick={() => setShowRejectSheet(false)} className="w-full h-[44px] font-dm-sans font-medium text-[14px] text-[#6B6B6B]">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BAN VENDOR SHEET */}
        {showBanSheet && (
           <div className="absolute inset-0 z-[70] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBanSheet(false)} />
             <div className="w-full bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[34px]">
               <div className="w-full flex justify-center pt-[12px] pb-[16px]"><div className="w-[40px] h-[4px] bg-[#252538] rounded-full" /></div>
               <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF] text-center mb-[20px]">User ko ban karein?</h2>
               {/* Same implementation as screen 17 */}
                 <div className="px-[20px] flex flex-col gap-[20px]">
                 <div>
                   <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[10px]">BAN DURATION</label>
                   <div className="flex flex-wrap gap-[10px]">
                     {['24 Hours', '3 Days', '7 Days', '30 Days', 'Permanent'].map(d => (
                       <button key={d} className={`px-[14px] py-[8px] rounded-[20px] font-dm-sans font-medium text-[13px] ${d === 'Permanent' ? 'bg-[#FF6B00] text-white' : 'bg-[#13131F] border border-[#252538] text-[#EFEFFF]'}`}>
                         {d}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[10px]">BAN REASON (required)</label>
                   <div className="flex flex-wrap gap-[8px]">
                     {['Fraudulent activity', 'Fake reviews', 'Abusive behavior', 'Spam'].map(r => (
                       <button key={r} className={`px-[12px] py-[6px] rounded-[8px] font-dm-sans text-[12px] bg-[#13131F] border border-[#252538] text-[#EFEFFF]`}>
                         {r}
                       </button>
                     ))}
                   </div>
                   <textarea 
                     placeholder="Additional details..." 
                     className="w-full h-[80px] bg-[#13131F] border border-[#252538] rounded-[12px] mt-[10px] p-[12px] font-dm-sans text-[14px] text-[#EFEFFF] resize-none outline-none focus:border-[#FF3B30]"
                   />
                 </div>
                 
                 <div className="flex flex-col gap-[12px] mt-[10px]">
                   <button className="w-full h-[54px] rounded-[16px] bg-gradient-to-r from-[#FF3B30] to-[#FF0000] font-dm-sans font-bold text-[16px] text-white">
                     Confirm Ban
                   </button>
                   <button onClick={() => setShowBanSheet(false)} className="w-full h-[44px] font-dm-sans font-medium text-[14px] text-[#6B6B6B]">
                     Cancel
                   </button>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* MESSAGE SHEET */}
        {showMessageSheet && (
          <div className="absolute inset-0 z-[70] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMessageSheet(false)} />
            <div className="w-full h-[60%] bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
               <div className="w-full flex justify-center pt-[12px] pb-[8px]"><div className="w-[40px] h-[4px] bg-[#252538] rounded-full" /></div>
               <div className="px-[20px] pb-[16px]">
                 <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF]">📣 Vendor ko Message Bhejo</h2>
               </div>
               
               <div className="flex-1 overflow-y-auto px-[20px] pb-[100px] flex flex-col gap-[16px]">
                 <div className="bg-[#13131F] rounded-[10px] p-[10px]">
                   <p className="font-dm-sans text-[13px] text-[#6B6B6B]">To: <span className="text-[#EFEFFF]">{isBulkMode ? `${selectedVendors.length} vendors selected` : selectedVendor?.name}</span></p>
                 </div>
                 
                 <div>
                   <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Title</label>
                   <input type="text" className="w-full h-[48px] bg-[#13131F] border border-[#252538] rounded-[12px] px-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00]" maxLength={60} />
                 </div>
                 <div>
                   <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Message</label>
                   <textarea className="w-full h-[100px] bg-[#13131F] border border-[#252538] rounded-[12px] p-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00] resize-none" maxLength={200} />
                 </div>
                  <div>
                    <div className="flex flex-wrap gap-[8px]">
                      {['Verification approved', 'Action required', 'Policy reminder'].map(t => (
                        <button key={t} className="px-[12px] py-[6px] rounded-[8px] font-dm-sans text-[12px] bg-[#1C1C2E] text-[#EFEFFF]">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
               
               <div className="absolute bottom-[0] left-[0] w-full p-[20px] pb-[34px] bg-[#0D0D14] border-t border-[#1C1C2E]">
                 <button 
                   onClick={() => setShowMessageSheet(false)}
                   className="w-full h-[54px] rounded-[16px] bg-gradient-to-r from-[#FF6B00] to-[#FF4500] font-dm-sans font-bold text-[16px] text-white active:scale-[0.98] transition-transform shadow-[0_8px_20px_rgba(255,107,0,0.3)]"
                 >
                   Send to Vendor &rarr;
                 </button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
