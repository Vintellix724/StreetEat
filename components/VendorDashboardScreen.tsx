'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  Home, ClipboardList, Utensils, BarChart3, Settings, 
  TrendingUp, Star, Users, Repeat, Check, X, Megaphone,
  ChartBar
} from 'lucide-react';

type Order = {
  id: string;
  time: string;
  items?: { name: string; qty: number; price: number }[];
  desc?: string;
  total: number;
  rating?: number;
  distance?: string;
  status: string;
};

const MOCK_NEW_ORDER: Order = {
  id: 'SF2847',
  time: '2 min ago',
  items: [{ name: 'Spl. Pani Puri', qty: 2, price: 50 }, { name: 'Dahi Puri', qty: 1, price: 30 }],
  total: 80,
  distance: '180m',
  status: 'placed'
};

const MOCK_IN_PROGRESS: Order = {
  id: 'SF2841',
  time: '8 min ago',
  items: [{ name: 'Malai Kulfi', qty: 3, price: 90 }, { name: 'Mango Kulfi', qty: 1, price: 30 }],
  total: 120,
  status: 'preparing'
};

const MOCK_COMPLETED: Order = {
  id: 'SF2835',
  time: '35 min ago',
  desc: 'Kulfi × 2, Drink × 1',
  total: 75,
  rating: 5.0,
  status: 'completed'
};

const TOP_SELLING = [
  { id: 't1', name: 'Malai Kulfi', sold: 67, earnings: 2010, photo: 'https://picsum.photos/seed/kulfi1/100/100', progress: 100 },
  { id: 't2', name: 'Spl. Pani Puri', sold: 45, earnings: 1125, photo: 'https://picsum.photos/seed/kulfi2/100/100', progress: 67 },
  { id: 't3', name: 'Mango Falooda', sold: 30, earnings: 1800, photo: 'https://picsum.photos/seed/kulfi3/100/100', progress: 44 },
];

export default function VendorDashboardScreen() {
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [orders, setOrders] = useState([MOCK_NEW_ORDER, MOCK_IN_PROGRESS, MOCK_COMPLETED]);
  
  // Earnings Count Up
  const [displayEarnings, setDisplayEarnings] = useState(0);
  const TARGET_EARNINGS = 1840;

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayEarnings(Math.floor(easeProgress * TARGET_EARNINGS));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayEarnings(TARGET_EARNINGS);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  const handleToggleStatus = () => {
    if (isOpen) {
      if (window.confirm("Stall band karein? Customers aapko order nahi kar payenge")) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleAcceptOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'preparing' } : o));
  };

  const handleReadyOrder = (id: string) => {
    if (window.confirm("Order ready hai?")) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed' } : o));
    }
  };

  const handleDeclineOrder = (id: string) => {
    if (window.confirm("Kya aap yeh order decline karna chahte hain?")) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const liveOrdersCount = orders.filter(o => ['placed', 'preparing'].includes(o.status)).length;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0A0A14] font-sans overflow-hidden text-[#EFEFFF]">
      
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 h-[64px] px-[16px] flex items-center justify-between bg-[#0A0A14] border-b border-[#252538] shrink-0 z-40 pt-safe">
        <div className="flex flex-col justify-center py-2 h-full">
          <span className="font-baloo font-bold text-[20px] text-[#EFEFFF] leading-none mb-1">Namaste, Sharma Ji 🙏</span>
          <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none">Saturday, 2 May</span>
        </div>
        
        <button 
          onClick={handleToggleStatus}
          className={`relative w-[100px] h-[40px] rounded-[20px] overflow-hidden transition-all duration-400 flex items-center shadow-lg active:scale-95 ${
            isOpen ? 'bg-[#00C853] shadow-[0_4px_16px_rgba(0,200,83,0.3)]' : 'bg-[#1C1C2E] border-[1.5px] border-[#FF3B30]'
          }`}
        >
          <motion.div 
            layout
            className="flex items-center w-full px-[12px]"
            initial={false}
            animate={{ justifyContent: isOpen ? 'flex-start' : 'flex-end' }}
          >
            {isOpen && (
              <motion.div layoutId="knob" className="w-[14px] h-[14px] bg-white rounded-full flex shrink-0 shadow-[0_0_16px_rgba(0,200,83,0.8)] mr-[6px]">
                 <div className="w-full h-full rounded-full animate-ping bg-white opacity-40"></div>
              </motion.div>
            )}
            <motion.span layout className={`font-dm-sans font-bold text-[14px] ${isOpen ? 'text-white' : 'text-[#FF3B30]'} whitespace-nowrap`}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </motion.span>
            {!isOpen && (
              <motion.div layoutId="knob" className="w-[14px] h-[14px] bg-[#FF3B30] rounded-full flex shrink-0 ml-[6px]" />
            )}
          </motion.div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] hide-scrollbar">
        
        {/* UNVERIFIED BANNER */}
        {!isVerified && (
          <div className="mx-[16px] mt-[16px] bg-[#1C1C2E] border-[1.5px] border-[#FFD600] rounded-[16px] p-[16px] relative overflow-hidden flex gap-[12px]">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FFD600]"></div>
            <div className="text-[20px] shrink-0 mt-0.5">⏳</div>
            <div className="flex flex-col">
              <span className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">Verification Pending</span>
              <span className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[4px]">
                Aapka stall review mein hai. 1-2 business days mein approve hoga. Tab tak aap setup complete kar sakte ho
              </span>
              <button className="font-dm-sans font-medium text-[13px] text-[#FFD600] mt-[8px] self-start" onClick={() => router.push('/vendor-dashboard')}>
                Complete Profile &rarr;
              </button>
            </div>
          </div>
        )}

        {/* EARNINGS HERO CARD */}
        <div className="mt-[16px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#13131F] border border-[#252538] rounded-[24px] p-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center">
            <span className="font-dm-sans font-medium text-[12px] text-[#6B6B6B] tracking-[1.5px] uppercase">Today&apos;s Earnings</span>
            <div className="flex items-center gap-[4px]">
              <TrendingUp size={16} className="text-[#FF6B00]" />
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">vs yesterday</span>
            </div>
          </div>
          
          <div className="mt-[8px] font-space-grotesk font-bold text-[44px] text-[#FF6B00] tracking-[-1px] leading-none">
            ₹{displayEarnings.toLocaleString('en-IN')}
          </div>

          <div className="mt-[20px]">
            <div className="flex justify-between items-center">
              <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Daily Goal</span>
              <span className="font-space-grotesk font-medium text-[12px] text-[#EFEFFF]">₹{TARGET_EARNINGS.toLocaleString('en-IN')} / ₹2,000</span>
            </div>
            <div className="mt-[8px] w-full h-[10px] bg-[#252538] rounded-[6px] relative">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FF6B00] to-[#FFB347] rounded-[6px]"
                initial={{ width: '0%' }}
                animate={{ width: `${(TARGET_EARNINGS/2000)*100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
              <div className="absolute top-[-6px] right-0 translate-x-[50%] flex flex-col items-center">
                <div className="w-[6px] h-[6px] bg-[#6B6B6B] rotate-45 transform origin-bottom border-t border-l border-[#252538]"></div>
                <span className="font-dm-sans text-[10px] text-[#6B6B6B] mt-[2px]">Goal</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#252538] mt-[20px] mb-[16px]"></div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-space-grotesk font-bold text-[24px] text-[#EFEFFF] leading-none">23</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">Orders Today</span>
            </div>
            <div className="w-[1px] h-full min-h-[30px] bg-[#252538]"></div>
            <div className="flex flex-col">
              <span className="font-space-grotesk font-bold text-[24px] text-[#EFEFFF] leading-none">₹80</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">Avg Order</span>
            </div>
            <div className="w-[1px] h-full min-h-[30px] bg-[#252538]"></div>
            <div className="flex flex-col">
              <span className="font-space-grotesk font-bold text-[24px] text-[#FFD600] leading-none">⭐ 4.9</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">Rating</span>
            </div>
          </div>
        </div>

        {/* LIVE ORDERS SECTION */}
        <div className="mt-[24px]">
          <div className="px-[16px] flex justify-between items-center mb-[12px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[8px] h-[8px] bg-[#FF3B30] rounded-full animate-pulse"></div>
              <h2 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">Live Orders</h2>
              {liveOrdersCount > 0 && (
                <div className="w-[22px] h-[22px] bg-[#FF3B30] rounded-full flex items-center justify-center -ml-1">
                  <span className="font-space-grotesk font-bold text-[12px] text-white leading-none mt-0.5">{liveOrdersCount}</span>
                </div>
              )}
            </div>
            <button onClick={() => router.push('/vendor-orders')} className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">View All &rarr;</button>
          </div>

          <div className="flex flex-col gap-[10px]">
             {orders.length === 0 && (
               <div className="py-[32px] flex flex-col items-center justify-center opacity-70">
                 <ClipboardList size={40} className="text-[#252538] mb-[12px]" />
                 <span className="font-dm-sans font-medium text-[15px] text-[#6B6B6B]">Abhi koi order nahi</span>
                 <span className="font-dm-sans text-[13px] text-[#6B6B6B] flex items-center">Customers dhundh rahe hain<span className="animate-pulse">...</span></span>
               </div>
             )}

            <AnimatePresence mode="popLayout">
              {orders.map((order, idx) => {
                if (order.status === 'placed') {
                  // NEW ORDER URGENT
                  return (
                    <motion.div 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mx-[16px] bg-[#13131F] border-[1.5px] border-[#FF6B00] rounded-[20px] p-[16px] relative overflow-hidden shadow-[0_0_24px_rgba(255,107,0,0.2)]"
                    >
                      {/* Pulsing glow using an absolute div behind everything */}
                      <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }} 
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[2px] border-[#FF6B00] rounded-[20px] pointer-events-none" 
                      />

                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center">
                          <span className="font-dm-sans font-bold text-[13px] text-[#FF6B00] tracking-[0.5px]">🆕 NEW ORDER</span>
                          <span className="font-mono text-[12px] text-[#6B6B6B] ml-[8px]">#{order.id}</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <span className="font-dm-sans text-[12px] text-[#6B6B6B]">{order.time}</span>
                          <span className="bg-[#FF6B00] rounded-[4px] px-[8px] py-[2px] font-dm-sans font-bold text-[10px] text-white">NEW</span>
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-[#252538] my-[12px] relative z-10"></div>

                      <div className="flex flex-col gap-[8px] relative z-10">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between items-center w-full">
                            <span className="font-dm-sans text-[14px] text-[#EFEFFF] whitespace-nowrap">{item.name} × {item.qty}</span>
                            <div className="flex-1 mx-[12px] border-b-[1.5px] border-dotted border-[#252538] relative top-[-4px]"></div>
                            <span className="font-space-grotesk font-medium text-[14px] text-[#EFEFFF] whitespace-nowrap">₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full h-[1px] bg-[#252538] my-[12px] relative z-10"></div>

                      <div className="flex justify-between items-end relative z-10">
                        <div className="flex flex-col">
                          <span className="font-space-grotesk font-bold text-[16px] text-[#FF6B00]">Total: ₹{order.total}</span>
                          <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px]">📍 Customer 180m away</span>
                        </div>
                        <div className="flex flex-col gap-[6px] items-center">
                          <button 
                            onClick={() => handleAcceptOrder(order.id)}
                            className="bg-[#00C853] w-[110px] h-[44px] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                          >
                            <Check size={16} className="text-white" strokeWidth={3} />
                            <span className="font-dm-sans font-bold text-[15px] text-white">ACCEPT</span>
                          </button>
                          <button 
                            onClick={() => handleDeclineOrder(order.id)}
                            className="font-dm-sans font-medium text-[13px] text-[#FF3B30] w-full text-center py-1 outline-none"
                          >
                            ✕ Decline
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                } else if (order.status === 'preparing') {
                  // IN PROGRESS CARD
                  return (
                    <motion.div 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mx-[16px] bg-[#13131F] border-[1.5px] border-[#00C853] rounded-[20px] p-[16px]"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-dm-sans font-bold text-[13px] text-[#00C853] tracking-[0.5px]">🔥 PREPARING</span>
                          <span className="font-mono text-[12px] text-[#6B6B6B] ml-[8px]">#{order.id}</span>
                        </div>
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Accepted 8 min ago</span>
                      </div>

                      <div className="flex flex-col gap-[8px] my-[16px]">
                        {order.items?.map((item, i) => (
                           <div key={i} className="flex justify-between items-center w-full">
                           <span className="font-dm-sans text-[14px] text-[#EFEFFF] whitespace-nowrap">{item.name} × {item.qty}</span>
                           <div className="flex-1 mx-[12px] border-b-[1.5px] border-dotted border-[#252538] relative top-[-4px]"></div>
                           <span className="font-space-grotesk font-medium text-[14px] text-[#EFEFFF] whitespace-nowrap">₹{item.price}</span>
                         </div>
                        ))}
                      </div>

                      <div className="flex flex-col mt-[8px]">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[6px]">⏱ Est. wait: 5 min remaining</span>
                        <div className="w-full h-[4px] bg-[#252538] rounded-full overflow-hidden">
                           <div className="h-full bg-[#00C853] rounded-full w-[60%]"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-[16px]">
                        <div className="flex flex-col">
                          <span className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">Total: ₹{order.total}</span>
                          <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Customer waiting</span>
                        </div>
                        <button 
                          onClick={() => handleReadyOrder(order.id)}
                          className="bg-[#1C1C2E] border-[1.5px] border-[#00C853] w-[130px] h-[44px] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          <Check size={16} className="text-[#00C853]" strokeWidth={3} />
                          <span className="font-dm-sans font-bold text-[14px] text-[#00C853]">Mark Ready</span>
                        </button>
                      </div>
                    </motion.div>
                  )
                } else if (order.status === 'completed') {
                  // COMPLETED RECENT
                  return (
                    <motion.div 
                      key={order.id}
                      layout
                      className="mx-[16px] bg-[#0F0F1A] border border-[#1C1C2E] rounded-[20px] p-[14px] opacity-75"
                    >
                      <div className="flex justify-between items-center mb-[8px]">
                        <span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">✅ COMPLETED</span>
                        <span className="font-mono text-[12px] text-[#6B6B6B]">#{order.id} · {order.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[13px] text-[#6B6B6B]">{order.desc}</span>
                        <div className="flex items-center gap-[12px]">
                          <span className="font-space-grotesk font-medium text-[14px] text-[#6B6B6B]">₹{order.total}</span>
                          {order.rating && (
                            <span className="font-dm-sans font-medium text-[13px] text-[#FFD600]">⭐ {order.rating.toFixed(1)}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                }
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* QUICK STATS 2x2 GRID */}
        <div className="mt-[24px]">
          <div className="px-[16px] mb-[12px]">
             <h2 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">Quick Stats</h2>
          </div>
          <div className="px-[16px] grid grid-cols-2 gap-[12px]">
            <div className="bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
              <Users size={22} className="text-[#FF6B00] mb-[8px]" />
              <div className="font-space-grotesk font-bold text-[28px] text-white">23</div>
              <div className="font-dm-sans text-[12px] text-[#6B6B6B]">Orders Today</div>
              <div className="font-dm-sans text-[11px] text-[#00C853] mt-[4px]">↑ +3 vs yesterday</div>
            </div>
            
            <div className="bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
              <span className="font-space-grotesk text-[22px] text-[#FF6B00] font-bold block mb-[8px] leading-none">₹</span>
              <div className="font-space-grotesk font-bold text-[28px] text-white">11,240</div>
              <div className="font-dm-sans text-[12px] text-[#6B6B6B]">This Week</div>
              <div className="font-dm-sans text-[11px] text-[#00C853] mt-[4px]">↑ +₹1,240 vs last</div>
            </div>

            <div className="bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
              <Star size={22} className="text-[#FFD600] mb-[8px]" />
              <div className="font-space-grotesk font-bold text-[28px] text-[#FFD600]">4.9</div>
              <div className="font-dm-sans text-[12px] text-[#6B6B6B]">Avg Rating</div>
              <div className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">Last 30 days</div>
            </div>

            <div className="bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
              <Repeat size={22} className="text-[#00BCD4] mb-[8px]" />
              <div className="font-space-grotesk font-bold text-[28px] text-white">68%</div>
              <div className="font-dm-sans text-[12px] text-[#6B6B6B]">Repeat Customers</div>
              <div className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[4px]">This month</div>
            </div>
          </div>
        </div>

        {/* TODAY'S PERFORMANCE MINI CHART */}
        <div className="mt-[20px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)] relative">
           <div className="flex justify-between items-center mb-[14px]">
             <h3 className="font-baloo font-semibold text-[16px] text-[#EFEFFF]">Aaj ka trend 📊</h3>
             <button className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">View details &rarr;</button>
           </div>

           <div className="h-[80px] w-full flex items-end justify-between px-[4px] relative">
             {/* Peak Indicator */}
             <div className="absolute top-[-10px] left-[55%] -translate-x-[50%] flex flex-col items-center">
               <span className="font-dm-sans text-[10px] text-[#FF6B00]">Peak</span>
               <div className="w-[0px] h-[0px] border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-[#FF6B00]"></div>
             </div>

             {[20, 35, 15, 45, 60, 80, 50, 65].map((h, i) => (
               <div key={i} className="flex flex-col items-center gap-[4px] group">
                 <div 
                   className={`w-[24px] rounded-t-[4px] transition-all bg-gradient-to-t from-[#FF8C38] to-[#FF6B00] ${i === 5 ? 'brightness-125 scale-y-105 transform origin-bottom' : ''}`}
                   style={{ height: `${h}px` }}
                 ></div>
                 <span className="font-dm-sans text-[10px] text-[#6B6B6B]">
                   {['11AM', '12', '1PM', '2', '3', '4', '5', '6PM'][i]}
                 </span>
               </div>
             ))}
           </div>
        </div>

        {/* TOP SELLING TODAY */}
        <div className="mt-[16px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
          <h3 className="font-baloo font-semibold text-[16px] text-[#EFEFFF] mb-[12px]">🔥 Top Selling Today</h3>
          
          <div className="flex flex-col gap-[12px]">
            {TOP_SELLING.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-[12px]">
                <span className={`w-[12px] font-space-grotesk font-bold text-[16px] text-center ${
                  idx === 0 ? 'text-[#FFD600]' : idx === 1 ? 'text-[#EFEFFF]' : 'text-[#FF6B00]'
                }`}>{idx + 1}</span>
                <div className="w-[40px] h-[40px] rounded-[8px] bg-gray-800 shrink-0 overflow-hidden relative">
                  <Image src={item.photo} alt={item.name} layout="fill" objectFit="cover" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-[4px]">
                    <span className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF] truncate">{item.name}</span>
                    <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹{(item.earnings).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <span className="font-dm-sans text-[12px] text-[#6B6B6B] w-[45px]">{item.sold} sold</span>
                    <div className="flex-1 h-[4px] bg-[#252538] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-[16px] font-dm-sans text-[12px] text-[#FF6B00] w-full text-center outline-none">
            See all items &rarr;
          </button>
        </div>

        {/* QUICK ACTIONS ROW */}
        <div className="mt-[20px] mx-[16px] flex gap-[10px]">
          {[
            { id: 'menu', label: 'Menu', icon: <Utensils size={26} className="text-[#FF6B00] mb-[6px]" />, path: '/vendor-menu' },
            { id: 'stats', label: 'Stats', icon: <ChartBar size={26} className="text-[#FF6B00] mb-[6px]" />, path: '/vendor-analytics' },
            { id: 'promote', label: 'Promote', icon: <Megaphone size={26} className="text-[#FFD600] mb-[6px]" />, path: '#' },
          ].map(action => (
            <button 
              key={action.id}
              onClick={() => action.path !== '#' ? router.push(action.path) : alert('Coming soon!')}
              className="flex-1 h-[80px] bg-[#13131F] border border-[#252538] rounded-[16px] flex flex-col items-center justify-center active:scale-95 transition-transform"
            >
              {action.icon}
              <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">{action.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* BOTTOM NAVIGATION BAR (Dark) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#0A0A14] border-t border-[#252538] flex items-center justify-between px-[12px] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-50">
        {[
          { id: 'home', icon: Home, label: 'Home', badge: 0, path: '/vendor-dashboard' },
          { id: 'orders', icon: ClipboardList, label: 'Orders', badge: liveOrdersCount, path: '/vendor-orders' },
          { id: 'menu', icon: Utensils, label: 'Menu', badge: 0, path: '/vendor-menu' },
          { id: 'stats', icon: BarChart3, label: 'Stats', badge: 0, path: '/vendor-analytics' },
          { id: 'settings', icon: Settings, label: 'Settings', badge: 0, path: '/vendor-settings' },
        ].map(tab => {
          const isActive = tab.id === 'home';
          const Icon = tab.icon;
          
          return (
            <div key={tab.id} onClick={() => tab.path !== '#' && router.push(tab.path)} className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer">
              {isActive && (
                <div className="absolute top-[-1px] w-[24px] h-[3px] bg-[#FF6B00] rounded-b-[2px]"></div>
              )}
              
              <div className="relative">
                <Icon size={24} className={isActive ? 'text-[#FF6B00] fill-[#FF6B00]' : 'text-[#6B6B6B]'} />
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

    </div>
  );
}
