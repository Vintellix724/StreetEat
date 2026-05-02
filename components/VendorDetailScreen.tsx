'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChevronLeft, Share2, Heart, Phone, Navigation, Star, MapPin, X, Download } from 'lucide-react';

const StaticMapComponent = dynamic(() => import('@/components/StaticMapComponent'), { ssr: false });

const MOCK_VENDOR = {
  id: 'v1',
  name: 'Sharma Ji Kulfi',
  rating: 4.9,
  reviews: 1247,
  distance: '200m',
  isOpen: true,
  openTill: '10:00 PM',
  phone: '9876543210',
  address: 'Sector 14, Near Bus Stand, Karol Bagh, New Delhi',
  lat: 28.6519,
  lon: 77.1909,
  waitTime: '~5 min wait time',
  queueStatus: 'No queue right now',
  photoUrl: 'https://picsum.photos/seed/kulfi1/800/600',
  saved: false,
};

const MOCK_MENU = [
  {
    id: 'm1',
    category: 'Specials',
    name: 'Spl. Malai Kulfi (2 pcs)',
    description: 'Rich, creamy traditional kulfi made with pure milk and saffron.',
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    price: 40,
    photoUrl: 'https://picsum.photos/seed/kulfi2/200/200'
  },
  {
    id: 'm2',
    category: 'Specials',
    name: 'Mango Falooda',
    description: 'Fresh mango pulp mixed with rabdi and sweet falooda sev.',
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    price: 60,
    photoUrl: 'https://picsum.photos/seed/kulfi3/200/200'
  },
  {
    id: 'm3',
    category: 'Ice Creams',
    name: 'Pista Badam Scoop',
    description: 'Chilled scope loaded with pistachios and almonds.',
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    isAvailable: false,
    price: 35,
    photoUrl: 'https://picsum.photos/seed/kulfi4/200/200'
  }
];

const MOCK_CATEGORIES = ['All', 'Specials', 'Ice Creams', 'Drinks'];

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Rahul K.', initials: 'R', date: '3 days ago', rating: 5, text: 'Best kulfi in the area! Sharma ji ka haath bahut acha hai. Fresh ingredients, perfect sweetness level.' },
  { id: 'r2', author: 'Priya M.', initials: 'P', date: '1 week ago', rating: 4, text: 'Very crowded on weekends but the falooda is totally worth the wait.' }
];

const MOCK_GALLERY = [
  'https://picsum.photos/seed/kulfiall1/400/400',
  'https://picsum.photos/seed/kulfiall2/400/400',
  'https://picsum.photos/seed/kulfiall3/400/400',
  'https://picsum.photos/seed/kulfiall4/400/400',
  'https://picsum.photos/seed/kulfiall5/400/400',
  'https://picsum.photos/seed/kulfiall6/400/400',
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function VendorDetailScreen() {
  const router = useRouter();
  const [vendor, setVendor] = useState(MOCK_VENDOR);
  const [activeTab, setActiveTab] = useState<'Menu' | 'Reviews' | 'Info' | 'Gallery'>('Menu');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSaved, setIsSaved] = useState(vendor.saved);
  
  // Gallery Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleUpdateCart = (item: typeof MOCK_MENU[0], delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, qty: newQty } : i);
      }
      if (delta > 0) {
        return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
      }
      return prev;
    });
  };

  const getQty = (id: string) => cart.find(i => i.id === id)?.qty || 0;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAF8] font-sans pb-[80px] overflow-y-auto overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[260px] shrink-0">
        <Image 
          src={vendor.photoUrl} 
          alt={vendor.name} 
          layout="fill" 
          objectFit="cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Floating Buttons */}
        <div className="absolute top-[20px] left-[16px] right-[16px] flex justify-between z-10">
          <button onClick={() => router.back()} className="w-[40px] h-[40px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-white/30">
            <ChevronLeft size={24} className="text-white pr-0.5" />
          </button>
          <div className="flex gap-[10px]">
            <button className="w-[40px] h-[40px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-white/30">
              <Share2 size={18} className="text-white" />
            </button>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="w-[40px] h-[40px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-white/30"
            >
              <Heart size={18} className={isSaved ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-white'} />
            </button>
          </div>
        </div>

        {/* Vendor Info Overlay */}
        <div className="absolute bottom-[16px] left-[16px]">
          {vendor.isOpen ? (
            <div className="inline-flex items-center bg-[#00C853]/25 backdrop-blur-md border border-[#00C853] rounded-[20px] px-[12px] py-[4px] mb-[8px]">
              <div className="w-[6px] h-[6px] rounded-full bg-white animate-pulse mr-1.5" />
              <span className="font-dm-sans font-medium text-[13px] text-white leading-none">OPEN</span>
            </div>
          ) : (
            <div className="inline-flex items-center bg-[#FF3B30]/25 backdrop-blur-md border border-[#FF3B30] rounded-[20px] px-[12px] py-[4px] mb-[8px]">
              <div className="w-[6px] h-[6px] rounded-full bg-white mr-1.5" />
              <span className="font-dm-sans font-medium text-[13px] text-white leading-none">CLOSED · Opens 9AM</span>
            </div>
          )}
          
          <h1 className="font-baloo font-bold text-[26px] text-white m-0 leading-tight drop-shadow-md">
            {vendor.name}
          </h1>
          
          <div className="font-dm-sans font-medium text-[13px] text-white/85 mt-[6px]">
            ⭐ {vendor.rating} <span className="mx-1.5">•</span> {vendor.reviews} reviews <span className="mx-1.5">•</span> 📍 {vendor.distance}
          </div>
        </div>
      </div>

      {/* STICKY INFO CARD */}
      <div className="sticky top-0 bg-white border-b border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-[14px_16px] z-30 shrink-0">
        <div className="flex gap-[10px]">
          <button className="flex-1 h-[36px] bg-[#F5F5F5] border border-[#E8E8E8] rounded-[20px] flex items-center justify-center gap-[6px]">
            <Phone size={15} className="text-[#FF6B00] fill-[#FF6B00]" />
            <span className="font-dm-sans font-medium text-[13px] text-[#1A1A1A]">Call</span>
          </button>
          <button className="flex-1 h-[36px] bg-[#F5F5F5] border border-[#E8E8E8] rounded-[20px] flex items-center justify-center gap-[6px]">
            <Navigation size={15} className="text-[#FF6B00]" />
            <span className="font-dm-sans font-medium text-[13px] text-[#1A1A1A]">Directions</span>
          </button>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 h-[36px] rounded-[20px] flex items-center justify-center gap-[6px] transition-colors border ${
              isSaved ? 'bg-[#FFF0E6] border-[#FF6B00]' : 'bg-[#F5F5F5] border-[#E8E8E8]'
            }`}
          >
            <Heart size={15} className={isSaved ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-[#FF6B00]'} />
            <span className={`font-dm-sans font-medium text-[13px] ${isSaved ? 'text-[#FF6B00]' : 'text-[#1A1A1A]'}`}>Saved</span>
          </button>
        </div>
        
        <div className="mt-[10px] flex gap-[6px] items-center">
          <span className="text-[14px] leading-none">🕐</span>
          <span className="font-dm-sans text-[13px] text-[#6B6B6B]">{vendor.queueStatus} · {vendor.waitTime}</span>
        </div>
      </div>

      {/* STICKY TAB BAR */}
      <div className="sticky top-[88px] bg-white border-b border-[#EBEBEB] h-[44px] flex z-30 shrink-0 relative">
        {['Menu', 'Reviews', 'Info', 'Gallery'].map((tab, idx) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 flex justify-center items-center font-dm-sans text-[14px] transition-colors ${
              activeTab === tab ? 'font-semibold text-[#FF6B00]' : 'font-regular text-[#6B6B6B]'
            }`}
          >
            {tab}
          </button>
        ))}
        {/* Animated Underline */}
        <motion.div 
          className="absolute bottom-0 h-[2.5px] bg-[#FF6B00] w-1/4"
          animate={{ x: `${['Menu', 'Reviews', 'Info', 'Gallery'].indexOf(activeTab) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 z-10 w-full relative">
        
        <AnimatePresence mode="wait">
          {activeTab === 'Menu' && (
            <motion.div 
              key="Menu"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pb-[20px]"
            >
              {/* Category Pills */}
              <div className="flex overflow-x-auto no-scrollbar gap-[8px] px-[16px] mt-[12px] pb-[4px]">
                {MOCK_CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`h-[32px] px-[14px] rounded-[20px] font-dm-sans font-medium text-[13px] whitespace-nowrap transition-colors border ${
                      activeCategory === cat ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' : 'bg-[#F5F5F5] border-[#E8E8E8] text-[#6B6B6B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              {MOCK_MENU.filter(m => activeCategory === 'All' || m.category === activeCategory).map(item => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id} className="mx-[16px] mt-[12px] bg-white border border-[#EBEBEB] rounded-[16px] p-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex justify-between">
                    <div className="flex-1 pr-[12px]">
                      <h3 className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A] mb-[6px]">{item.name}</h3>
                      <div className="flex items-center gap-[6px] mb-[4px] flex-wrap">
                        {item.isVeg && <div className="border border-green-600 rounded-[2px] p-[1px]"><div className="w-[6px] h-[6px] rounded-full bg-green-600"/></div>}
                        {item.isSpicy && <span className="text-[12px]">🌶🌶 Medium Spicy</span>}
                        {item.isBestseller && (
                          <span className="bg-[#FF6B00] rounded-[4px] px-[8px] py-[2px] font-dm-sans font-medium text-[10px] text-white">🔥 Bestseller</span>
                        )}
                      </div>
                      <p className="font-dm-sans text-[12px] text-[#6B6B6B] leading-[16px] line-clamp-2 mb-[8px]">
                        {item.description}
                      </p>
                      <div className="mb-[8px]">
                        {item.isAvailable ? (
                          <span className="font-dm-sans text-[12px] text-[#00C853]">✅ Available</span>
                        ) : (
                          <span className="font-dm-sans text-[12px] text-[#FF3B30]">❌ Sold Out</span>
                        )}
                      </div>
                      <div className="font-space-grotesk font-semibold text-[17px] text-[#1A1A1A]">
                        ₹{item.price}
                      </div>
                    </div>

                    <div className="w-[100px] shrink-0 flex flex-col items-center">
                      <div className="w-[100px] h-[80px] rounded-[10px] bg-[#F5F5F5] overflow-hidden relative mb-[8px]">
                        <Image src={item.photoUrl} alt={item.name} layout="fill" objectFit="cover" />
                      </div>
                      
                      {!item.isAvailable ? (
                        <div className="w-full h-[32px] rounded-[20px] bg-gray-200 flex items-center justify-center">
                          <span className="font-dm-sans font-bold text-[13px] text-gray-500">Sold Out</span>
                        </div>
                      ) : qty > 0 ? (
                        <div className="w-full h-[32px] rounded-[20px] bg-[#FFF0E6] border-[1.5px] border-[#FF6B00] flex items-center justify-between px-[12px]">
                          <button onClick={() => handleUpdateCart(item, -1)} className="font-bold text-[18px] text-[#FF6B00] leading-none pb-1">-</button>
                          <motion.span key={qty} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="font-space-grotesk font-bold text-[15px] text-[#FF6B00]">{qty}</motion.span>
                          <button onClick={() => handleUpdateCart(item, +1)} className="font-bold text-[18px] text-[#FF6B00] leading-none pb-0.5">+</button>
                        </div>
                      ) : (
                        <button onClick={() => handleUpdateCart(item, +1)} className="w-full h-[32px] rounded-[20px] bg-[#FF6B00] flex items-center justify-center transition-transform active:scale-95">
                          <span className="font-dm-sans font-bold text-[13px] text-white">+ ADD</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'Reviews' && (
            <motion.div 
              key="Reviews"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pb-[20px] pt-[12px]"
            >
              {/* Rating Summary Card */}
              <div className="mx-[16px] bg-white border border-[#EBEBEB] rounded-[16px] p-[16px] mb-[12px] flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="font-space-grotesk font-bold text-[48px] text-[#1A1A1A] leading-none">{vendor.rating}</span>
                  <div className="flex text-[#FFD600] text-[16px] my-[4px]">
                    ★★★★★
                  </div>
                  <span className="font-dm-sans text-[13px] text-[#6B6B6B]">{vendor.reviews} reviews</span>
                </div>
                
                <div className="flex-1 ml-[24px] flex flex-col gap-[4px]">
                  {[
                    { stars: '5★', pct: 82, w: '82%' },
                    { stars: '4★', pct: 12, w: '12%' },
                    { stars: '3★', pct: 4, w: '4%' },
                    { stars: '2★', pct: 1, w: '1%' },
                    { stars: '1★', pct: 1, w: '1%' },
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-[8px] text-[12px] font-dm-sans text-[#6B6B6B]">
                      <span className="w-[20px]">{row.stars}</span>
                      <div className="flex-1 h-[4px] bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6B00]" style={{ width: row.w }} />
                      </div>
                      <span className="w-[24px] text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <div className="flex flex-col gap-[10px] px-[16px]">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="bg-white border border-[#EBEBEB] rounded-[14px] p-[14px]">
                    <div className="flex justify-between items-start mb-[8px]">
                      <div className="flex items-center gap-[10px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-blue-100 flex items-center justify-center font-baloo font-bold text-blue-600 text-[16px]">
                          {r.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-dm-sans font-semibold text-[14px] text-[#1A1A1A]">{r.author}</span>
                          <span className="font-dm-sans text-[12px] text-[#BBBBC0]">{r.date}</span>
                        </div>
                      </div>
                      <div className="text-[#FFD600] text-[14px]">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}
                      </div>
                    </div>
                    <p className="font-dm-sans text-[13px] text-[#1A1A1A] leading-[18px]">&quot;{r.text}&quot;</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Info' && (
            <motion.div 
              key="Info"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pb-[20px] pt-[12px] flex flex-col gap-[12px]"
            >
              <div className="mx-[16px] bg-white border border-[#EBEBEB] rounded-[14px] p-[16px] flex flex-col items-start">
                <div className="flex items-center gap-[8px] mb-[6px] text-[#1A1A1A] font-dm-sans font-medium text-[15px]">
                  <MapPin size={18} className="text-[#FF6B00]" /> Address
                </div>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] leading-[20px] ml-[26px]">
                  Sector 14, Near Bus Stand,<br/>Karol Bagh, New Delhi
                </p>
                <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00] ml-[26px] mt-[8px]">
                  Open in Maps &rarr;
                </button>
              </div>

              <div className="mx-[16px] bg-white border border-[#EBEBEB] rounded-[14px] p-[16px]">
                <div className="flex items-center gap-[8px] mb-[6px] text-[#1A1A1A] font-dm-sans font-medium text-[15px]">
                  <span className="text-[18px]">🕐</span> Timings
                </div>
                <div className="ml-[26px] font-dm-sans text-[14px] text-[#6B6B6B] leading-[22px]">
                  <p>Mon–Sat: 9:00 AM – 10:00 PM</p>
                  <p>Sunday: 10:00 AM – 9:00 PM</p>
                  <p className="font-medium text-[#00C853] mt-[4px]">Today: OPEN (closes in 3h 20m)</p>
                </div>
              </div>

              <div className="mx-[16px] bg-white border border-[#EBEBEB] rounded-[14px] p-[16px] flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-[8px] mb-[4px] text-[#1A1A1A] font-dm-sans font-medium text-[15px]">
                    <Phone size={18} className="text-[#FF6B00] fill-[#FF6B00]" /> Contact
                  </div>
                  <p className="font-dm-sans text-[14px] text-[#6B6B6B] ml-[26px]">
                    +91 {vendor.phone.slice(0, 5)} {vendor.phone.slice(5)}
                  </p>
                </div>
                <button className="px-[16px] h-[36px] bg-[#FFF0E6] text-[#FF6B00] border border-[#FF6B00] rounded-[20px] font-dm-sans font-medium text-[13px]">
                  Call Now
                </button>
              </div>

              <div className="mx-[16px] bg-white border border-[#EBEBEB] rounded-[14px] p-[16px]">
                <div className="flex items-center gap-[8px] mb-[6px] text-[#1A1A1A] font-dm-sans font-medium text-[15px]">
                  <span className="text-[18px]">💳</span> Payment Accepted
                </div>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B] ml-[26px]">
                  💵 Cash  ·  📱 UPI  ·  💳 Cards
                </p>
              </div>

              {/* Mini Map */}
              <div className="mx-[16px] h-[160px] rounded-[16px] relative overflow-hidden bg-gray-100 border border-[#E8E8E8] mt-[4px] pointer-events-none">
                <StaticMapComponent location={[vendor.lat, vendor.lon]} />
                <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-auto">
                    {/* Add invisible layer to intercept clicks so map doesn't zoom/drag */}
                    <button className="absolute bottom-[16px] bg-white/90 backdrop-blur-md px-[16px] py-[8px] rounded-full shadow-md font-dm-sans font-medium text-[13px] text-[#1A1A1A]">
                        Get Directions &rarr;
                    </button>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'Gallery' && (
            <motion.div 
              key="Gallery"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-[16px]"
            >
              <div className="grid grid-cols-3 gap-[4px]">
                {MOCK_GALLERY.map((src, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className="relative w-full aspect-square bg-[#F5F5F5] rounded-[8px] overflow-hidden"
                  >
                    <Image src={src} alt="Gallery" layout="fill" objectFit="cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STICKY BOTTOM CART BAR */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-fit bg-[#FF6B00] px-[20px] pb-safe z-[100] cursor-pointer"
            onClick={() => router.push(`/cart`)}
          >
            <div className="h-[64px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[36px] h-[36px] rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[18px]">🛒</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-dm-sans font-medium text-[14px] text-white leading-tight">
                    {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <span className="font-space-grotesk font-bold text-[18px] text-white">
                ₹{cartTotal}
              </span>
              
              <div className="flex items-center gap-[4px]">
                <span className="font-dm-sans font-bold text-[15px] text-white">View Cart</span>
                <span className="text-white text-[16px] leading-none mb-0.5">&rarr;</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black max-w-[390px] mx-auto flex flex-col"
          >
            <div className="h-[60px] flex items-center justify-between px-[20px] shrink-0">
              <button onClick={() => setLightboxOpen(false)} className="w-[40px] h-[40px] flex items-center justify-start">
                <X size={24} className="text-white" />
              </button>
              <span className="font-dm-sans text-white text-[14px]">{lightboxIndex + 1} / {MOCK_GALLERY.length}</span>
              <button className="w-[40px] h-[40px] flex items-center justify-end">
                <Download size={20} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
               <Image src={MOCK_GALLERY[lightboxIndex]} alt="Enlarged" layout="fill" objectFit="contain" />
               {/* Note: swipe handling would go here, mock with absolute buttons for demo if needed */}
               {lightboxIndex > 0 && (
                 <button className="absolute left-[10px] w-[40px] h-[40px] flex flex-col justify-center items-center bg-black/50 rounded-full" onClick={() => setLightboxIndex(prev => prev-1)}>
                    <ChevronLeft size={30} className="text-white pr-1" />
                 </button>
               )}
               {lightboxIndex < MOCK_GALLERY.length - 1 && (
                 <button className="absolute right-[10px] w-[40px] h-[40px] flex flex-col justify-center items-center bg-black/50 rounded-full" onClick={() => setLightboxIndex(prev => prev+1)}>
                    <ChevronLeft size={30} className="text-white pr-1 rotate-180" />
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
