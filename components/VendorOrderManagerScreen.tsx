'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Search, X, CircleDot, Phone, Check, Package, ClipboardList, Minus, Plus, Home, Utensils, BarChart3, Settings } from 'lucide-react';

type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

type OrderItem = { name: string; qty: number; price: number };

type Order = {
  id: string;
  status: OrderStatus;
  placedAt: Date;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  distance?: string;
  note?: string;
  cancelReason?: string;
  rating?: number;
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'SF2847',
    status: 'placed',
    placedAt: new Date(Date.now() - 2 * 60000), // 2 mins ago
    items: [{ name: 'Spl. Pani Puri', qty: 2, price: 50 }, { name: 'Dahi Puri', qty: 1, price: 30 }],
    total: 80,
    paymentMethod: 'UPI',
    distance: '200m away',
    note: 'Extra spicy, no onion',
  },
  {
    id: 'SF2846',
    status: 'placed',
    placedAt: new Date(Date.now() - 5 * 60000), // 5 mins ago
    items: [{ name: 'Mango Falooda', qty: 1, price: 60 }],
    total: 60,
    paymentMethod: 'Cash',
    distance: '350m away',
  },
  {
    id: 'SF2841',
    status: 'preparing',
    placedAt: new Date(Date.now() - 15 * 60000),
    items: [{ name: 'Malai Kulfi', qty: 3, price: 90 }, { name: 'Mango Kulfi', qty: 1, price: 30 }],
    total: 120,
    paymentMethod: 'Wallet',
  },
  {
    id: 'SF2838',
    status: 'ready',
    placedAt: new Date(Date.now() - 25 * 60000),
    items: [{ name: 'Cheese Sandwich', qty: 1, price: 50 }],
    total: 50,
    paymentMethod: 'UPI',
  },
  {
    id: 'SF2835',
    status: 'completed',
    placedAt: new Date(Date.now() - 60 * 60000),
    items: [{ name: 'Kulfi', qty: 2, price: 40 }, { name: 'Juice', qty: 1, price: 35 }],
    total: 75,
    paymentMethod: 'UPI',
    rating: 5.0,
  },
  {
    id: 'SF2820',
    status: 'cancelled',
    placedAt: new Date(Date.now() - 120 * 60000),
    items: [{ name: 'Momos', qty: 1, price: 55 }],
    total: 55,
    paymentMethod: 'UPI',
    cancelReason: 'Cancelled by customer',
  }
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'placed', label: '🆕 New' },
  { id: 'preparing', label: '🔥 Preparing' },
  { id: 'ready', label: '✅ Ready' },
  { id: 'completed', label: '📦 Completed' },
  { id: 'cancelled', label: '❌ Cancelled' },
];

const DATE_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'This Month'];

const formatTimeAgo = (date: Date) => {
  const minDiff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minDiff < 60) return `${minDiff} min ago`;
  const hrsDiff = Math.floor(minDiff / 60);
  return `${hrsDiff} hr${hrsDiff > 1 ? 's' : ''} ago`;
};

export default function VendorOrderManagerScreen() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeDate, setActiveDate] = useState('Today');
  
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null); // orderId
  const [showDetailModal, setShowDetailModal] = useState<Order | null>(null);

  // Filters
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Status filter
      if (activeStatus !== 'all' && o.status !== activeStatus) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesItem = o.items.some(i => i.name.toLowerCase().includes(query));
        if (!matchesId && !matchesItem) return false;
      }
      
      // Date filter (Mock logic for 'Today')
      // Assuming all mocks are "Today" for visual simplicity.
      
      return true;
    }).sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
  }, [orders, activeStatus, searchQuery]);

  const newOrdersCount = orders.filter(o => o.status === 'placed').length;

  const handleAccept = (id: string, prepTime: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'preparing' } : o));
  };

  const handleDecline = (reason: string) => {
    if (!showDeclineModal) return;
    setOrders(prev => prev.map(o => o.id === showDeclineModal ? { ...o, status: 'cancelled', cancelReason: reason } : o));
    setShowDeclineModal(null);
  };

  const handleReady = (id: string) => {
    if (window.confirm("Mark this order as ready?")) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'ready' } : o));
    }
  };

  const handleCollected = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed' } : o));
  };

  // Quick stats calculations
  const totalOrders = filteredOrders.length;
  const totalEarned = filteredOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  
  return (
    <div className="relative flex flex-col h-full w-full bg-[#0A0A14] font-sans overflow-hidden text-[#EFEFFF]">
      
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 h-[64px] px-[16px] flex items-center justify-between bg-[#0A0A14] border-b border-[#252538] shrink-0 z-40 pt-safe transition-all">
        {isSearchExpanded ? (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex items-center h-full gap-3">
            <div className="flex-1 h-[40px] bg-[#13131F] border-[1.5px] border-[#FF6B00] rounded-[12px] flex items-center px-[14px]">
              <Search size={16} className="text-[#6B6B6B] mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                placeholder="Order ID ya item dhundo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-dm-sans text-[14px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none"
              />
            </div>
            <button onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); }} className="p-2 -mr-2">
              <X size={20} className="text-[#6B6B6B]" />
            </button>
          </motion.div>
        ) : (
          <>
            <button onClick={() => router.push('/vendor-dashboard')} className="w-[40px] flex items-center justify-start py-2">
              <ChevronLeft size={24} className="text-[#EFEFFF] -ml-1" />
            </button>
            <span className="font-baloo font-bold text-[18px] text-[#EFEFFF] flex-1 text-center">Order Manager</span>
            <button onClick={() => setIsSearchExpanded(true)} className="w-[40px] flex items-center justify-end py-2">
              <Search size={22} className="text-[#EFEFFF]" />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] hide-scrollbar relative">
        
        {/* LIVE ORDER ALERT BANNER */}
        <AnimatePresence>
          {newOrdersCount > 0 && activeStatus !== 'placed' && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }} 
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }} 
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="mx-[16px] overflow-hidden"
            >
              <div className="bg-[#1C1C2E] border-[1.5px] border-[#FF6B00] rounded-[14px] p-[12px_14px] flex items-center justify-between relative shadow-[0_0_12px_rgba(255,107,0,0.15)] glow-pulse">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF6B00]"></div>
                <div className="flex items-center gap-[6px] pl-[8px]">
                  <div className="w-[8px] h-[8px] bg-[#FF3B30] rounded-full animate-pulse"></div>
                  <span className="font-dm-sans font-bold text-[14px] text-[#FF6B00]">{newOrdersCount} naye orders hain!</span>
                </div>
                <button 
                  onClick={() => setActiveStatus('placed')}
                  className="bg-[#FF6B00] h-[32px] px-[12px] rounded-[8px] font-dm-sans font-bold text-[12px] text-white active:scale-95 transition-transform"
                >
                  View &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATUS FILTER TAB BAR */}
        <div className="mt-[12px] px-[16px] overflow-x-auto no-scrollbar flex gap-[8px]">
          {STATUS_FILTERS.map(status => {
            const count = status.id === 'all' ? orders.length : orders.filter(o => o.status === status.id).length;
            return (
              <button
                key={status.id}
                onClick={() => setActiveStatus(status.id)}
                className={`shrink-0 h-[32px] px-[14px] rounded-[20px] font-dm-sans text-[13px] transition-colors border ${
                  activeStatus === status.id 
                    ? 'bg-[#FF6B00] font-bold text-white border-[#FF6B00]' 
                    : 'bg-[#13131F] border-[#252538] text-[#6B6B6B] font-regular'
                }`}
              >
                {status.label} <span className={activeStatus === status.id ? 'text-white' : 'text-[#6B6B6B]'}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* DATE FILTER ROW */}
        <div className="mt-[10px] px-[16px] overflow-x-auto no-scrollbar flex gap-[8px]">
          {DATE_FILTERS.map(date => (
            <button
              key={date}
              onClick={() => setActiveDate(date)}
              className={`shrink-0 h-[30px] px-[12px] rounded-[20px] font-dm-sans text-[12px] transition-colors border ${
                activeDate === date 
                  ? 'bg-[#1C1C2E] font-medium text-[#FF6B00] border-[#FF6B00]' 
                  : 'bg-[#13131F] border-[#252538] text-[#6B6B6B] font-regular'
              }`}
            >
              {date}
            </button>
          ))}
          <button className="shrink-0 h-[30px] px-[12px] rounded-[20px] font-dm-sans text-[12px] text-[#6B6B6B] bg-[#13131F] border border-[#252538]">
            Custom Range
          </button>
        </div>

        {/* SUMMARY STATS STRIP */}
        <div className="mt-[12px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[14px] p-[12px_16px] flex justify-between">
          <div className="flex flex-col">
            <span className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">{totalOrders}</span>
            <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Total Orders</span>
          </div>
          <div className="w-[1px] bg-[#252538] mx-[10px]"></div>
          <div className="flex flex-col">
             <span className="font-space-grotesk font-bold text-[20px] text-[#FF6B00]">₹{totalEarned}</span>
             <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Total Earned</span>
          </div>
          <div className="w-[1px] bg-[#252538] mx-[10px]"></div>
          <div className="flex flex-col flex-1 pl-[10px]">
             <span className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">6 min</span>
             <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Avg Prep Time</span>
          </div>
        </div>

        {/* ORDER CARDS LIST */}
        <div className="mt-[8px]">
          {filteredOrders.length === 0 ? (
            <div className="py-[60px] flex flex-col items-center justify-center opacity-70">
              <ClipboardList size={48} className="text-[#252538] mb-[16px]" />
              <span className="font-dm-sans font-medium text-[15px] text-[#6B6B6B]">Koi order nahi mila</span>
              <span className="font-dm-sans text-[13px] text-[#6B6B6B] mt-1">{searchQuery ? 'Order ID ya item naam check karo' : 'Is filter ko change karke dekho'}</span>
            </div>
          ) : (
             <AnimatePresence mode="popLayout">
               {filteredOrders.map(order => (
                 <OrderCard 
                   key={order.id} 
                   order={order} 
                   formatTimeAgo={formatTimeAgo}
                   onAccept={handleAccept}
                   onDecline={() => setShowDeclineModal(order.id)}
                   onReady={() => handleReady(order.id)}
                   onCollected={() => handleCollected(order.id)}
                   onViewDetail={() => ['completed','cancelled'].includes(order.status) ? setShowDetailModal(order) : null}
                 />
               ))}
             </AnimatePresence>
          )}
        </div>
      </div>

      {/* DECLINE MODAL */}
      <AnimatePresence>
        {showDeclineModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowDeclineModal(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#13131F] rounded-t-[20px] p-[24px] pb-safe shadow-2xl z-50">
               <div className="w-[40px] h-[4px] bg-[#252538] rounded-full mx-auto mb-[20px]"></div>
               <h3 className="font-baloo font-bold text-[20px] text-[#EFEFFF] text-center mb-[16px]">Decline Reason?</h3>
               <div className="flex flex-wrap gap-[10px] mb-[24px] justify-center">
                 {['Bahut busy hoon', 'Item nahi hai', 'Band ho raha hoon', 'Technical issue'].map(reason => (
                   <button 
                     key={reason}
                     onClick={() => handleDecline(reason)}
                     className="bg-[#1C1C2E] border border-[#252538] rounded-full px-[16px] py-[10px] font-dm-sans text-[13px] text-[#EFEFFF] active:scale-95 transition-all outline-none"
                   >
                     {reason}
                   </button>
                 ))}
               </div>
               <button onClick={() => setShowDeclineModal(null)} className="w-full h-[50px] font-dm-sans font-bold text-[15px] text-[#6B6B6B]">Cancel</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR (Dark) */}
      <div className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#0A0A14] border-t border-[#252538] flex items-center justify-between px-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-[60]">
        {[
          { id: 'home', icon: Home, label: 'Home', badge: 0, path: '/vendor-dashboard' },
          { id: 'orders', icon: ClipboardList, label: 'Orders', badge: newOrdersCount, path: '/vendor-orders' },
          { id: 'menu', icon: Utensils, label: 'Menu', badge: 0, path: '/vendor-menu' },
          { id: 'stats', icon: BarChart3, label: 'Stats', badge: 0, path: '/vendor-analytics' },
          { id: 'settings', icon: Settings, label: 'Settings', badge: 0, path: '/vendor-settings' },
        ].map(tab => {
          const isActive = tab.id === 'orders';
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
      
      {/* DETAIL MODAL (Placeholder for completing visual) */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div initial={{ y: '100%' }} animate={{ y: '30%' }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 bg-[#13131F] rounded-t-[24px] z-50 shadow-2xl pb-safe flex flex-col">
            <div className="w-[40px] h-[4px] bg-[#252538] rounded-full mx-auto mt-[16px] mb-[16px] shrink-0"></div>
            <div className="flex-1 overflow-y-auto px-[24px]">
               <h2 className="font-space-grotesk font-bold text-[22px] text-[#EFEFFF]">#{showDetailModal.id}</h2>
               <p className="font-dm-sans font-medium text-[14px] text-[#00C853] mt-1 capitalize">{showDetailModal.status === 'cancelled' ? '❌ Cancelled' : '✅ Completed'} · {formatTimeAgo(showDetailModal.placedAt)}</p>
               <div className="w-full h-[1px] bg-[#252538] my-[16px]"></div>
               <div className="flex flex-col gap-[8px]">
                 {showDetailModal.items.map((it, i) => (
                   <div key={i} className="flex justify-between font-dm-sans text-[14px] text-[#EFEFFF]"><span className="opacity-80">• {it.name} × {it.qty}</span><span className="font-space-grotesk font-medium">₹{it.price}</span></div>
                 ))}
               </div>
               <div className="w-full h-[1px] bg-[#252538] my-[16px]"></div>
               <div className="flex justify-between font-space-grotesk font-bold text-[18px] text-[#FF6B00]"><span>Total Paid</span><span>₹{showDetailModal.total}</span></div>
               
               <div className="mt-[24px] flex flex-col items-center">
                 <button onClick={() => setShowDetailModal(null)} className="bg-[#252538] px-[24px] py-[8px] rounded-full font-dm-sans text-[14px] text-[#EFEFFF]">Close</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes borderPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
          50% { box-shadow: 0 0 20px 0 rgba(255, 107, 0, 0.2); border-color: rgba(255, 107, 0, 0.4); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
        }
        .glow-pulse { animation: borderPulse 1.2s infinite; }
      `}} />
    </div>
  );
}

// ----------------------------------------------------
// CARD COMPONENTS
// ----------------------------------------------------

function OrderCard({ order, formatTimeAgo, onAccept, onDecline, onReady, onCollected, onViewDetail }: any) {
  const [prepTime, setPrepTime] = useState(5);

  if (order.status === 'placed') {
    return (
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mx-[16px] mt-[8px] bg-[#13131F] border-[1.5px] border-[#FF6B00] rounded-[20px] p-[16px] shadow-[0_0_20px_rgba(255,107,0,0.15)] glow-pulse overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-mono font-bold text-[14px] text-[#EFEFFF]">#{order.id}</div>
            <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">{formatTimeAgo(order.placedAt)} · {order.items.reduce((s:any,i:any)=>s+i.qty,0)} items</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-space-grotesk font-bold text-[20px] text-[#FF6B00]">₹{order.total}</div>
            <div className="font-dm-sans font-medium text-[12px] text-[#FF9500] mt-[2px]">⏱ 2:45</div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#252538] my-[12px]"></div>

        <div className="flex flex-col gap-[6px]">
          {order.items.map((item: any, i: number) => (
             <div key={i} className="flex justify-between items-center w-full">
             <span className="font-dm-sans text-[13px] text-[#EFEFFF] whitespace-nowrap">• {item.name} × {item.qty}</span>
             <div className="flex-1 mx-[12px] border-b-[1px] border-dotted border-[#252538] relative top-[-4px]"></div>
             <span className="font-space-grotesk font-medium text-[13px] text-[#EFEFFF] whitespace-nowrap">₹{item.price}</span>
           </div>
          ))}
        </div>
        
        {order.note && (
          <div className="mt-[8px] bg-[#1C1C2E] rounded-[8px] p-[8px_10px]">
            <span className="font-dm-sans italic text-[12px] text-[#6B6B6B]">📝 {order.note}</span>
          </div>
        )}

        <div className="w-full h-[1px] bg-[#252538] my-[12px]"></div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-dm-sans font-medium text-[12px] text-[#6B6B6B]">{order.paymentMethod === 'UPI' ? '📱 UPI' : order.paymentMethod === 'Cash' ? '💵 Cash' : '👛 Wallet'}</span>
            <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-1">📍 {order.distance || 'Near you'}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[4px]">Est. prep:</span>
             <div className="flex items-center gap-[12px] bg-[#1C1C2E] border border-[#252538] rounded-full p-[4px_8px]">
               <button onClick={() => setPrepTime(Math.max(2, prepTime-2))} className="w-[20px] h-[20px] bg-[#252538] rounded-full flex items-center justify-center"><Minus size={12} className="text-[#EFEFFF]"/></button>
               <span className="font-space-grotesk font-bold text-[13px] text-[#EFEFFF] w-[35px] text-center">{prepTime} min</span>
               <button onClick={() => setPrepTime(Math.min(30, prepTime+2))} className="w-[20px] h-[20px] bg-[#252538] rounded-full flex items-center justify-center"><Plus size={12} className="text-[#EFEFFF]"/></button>
             </div>
          </div>
        </div>

        <div className="flex gap-[10px] mt-[12px]">
           <button onClick={() => onAccept(order.id, prepTime)} className="flex-[2] h-[46px] bg-[#00C853] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"><Check size={16} className="text-white" strokeWidth={3} /><span className="font-dm-sans font-bold text-[15px] text-white">ACCEPT</span></button>
           <button onClick={onDecline} className="flex-[1] h-[46px] bg-[#1C1C2E] border-[1.5px] border-[#FF3B30] rounded-[12px] flex items-center justify-center active:scale-95 transition-transform"><span className="font-dm-sans font-bold text-[14px] text-[#FF3B30]">✕ DECLINE</span></button>
        </div>
      </motion.div>
    );
  }

  if (order.status === 'preparing') {
    return (
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mx-[16px] mt-[8px] bg-[#13131F] border-[1.5px] border-[#00C853] rounded-[20px] p-[16px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-dm-sans font-bold text-[13px] text-[#00C853]">🔥 PREPARING</span>
            </div>
            <div className="font-mono text-[14px] text-[#EFEFFF] mt-1">#{order.id}</div>
            <div className="font-dm-sans text-[12px] text-[#6B6B6B] mt-1">Accepted 8 min ago</div>
          </div>
          <div className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">₹{order.total}</div>
        </div>

        <div className="my-[16px] flex flex-col items-center relative py-[10px]">
          <svg className="w-[80px] h-[80px]" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#252538" strokeWidth="4" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#FF6B00" strokeWidth="4" strokeDasharray="226" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 40 40)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-space-grotesk font-bold text-[24px] text-[#FF6B00] leading-none mt-2">4:30</span>
            <span className="font-dm-sans text-[10px] text-[#6B6B6B]">remaining</span>
          </div>
        </div>

        <div className="font-dm-sans text-[13px] text-[#6B6B6B] mb-[16px] text-center w-full truncate">
           {order.items.map((i:any)=>`${i.name} ×${i.qty}`).join(', ')}
        </div>

        <div className="flex flex-col gap-[8px]">
          <button onClick={onReady} className="w-full h-[46px] bg-[#1C1C2E] border-[1.5px] border-[#00C853] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"><Check size={16} className="text-[#00C853]" strokeWidth={3} /><span className="font-dm-sans font-bold text-[15px] text-[#00C853]">Mark Ready</span></button>
          <button className="w-full h-[38px] bg-transparent border border-[#252538] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"><Phone size={14} className="text-[#6B6B6B]" /><span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Call Customer</span></button>
        </div>
      </motion.div>
    )
  }

  if (order.status === 'ready') {
    return (
       <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mx-[16px] mt-[8px] bg-[#13131F] border-[1.5px] border-[#00C853] rounded-[20px] p-[16px]">
         <div className="flex justify-between items-start">
           <div className="flex flex-col">
             <span className="font-dm-sans font-bold text-[14px] text-[#00C853]">✅ Ready for Pickup</span>
             <span className="font-mono text-[14px] text-[#EFEFFF] mt-1">#{order.id}</span>
             <span className="font-dm-sans text-[12px] text-[#FF9500] mt-1">Waiting since 3 min</span>
           </div>
           <div className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">₹{order.total}</div>
         </div>
         <div className="flex gap-[10px] mt-[16px]">
           <button onClick={onCollected} className="flex-[2] h-[46px] bg-[#00C853] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"><Package size={16} className="text-white"/><span className="font-dm-sans font-bold text-[15px] text-white">Mark Collected</span></button>
           <button className="flex-[1] h-[46px] bg-[#1C1C2E] border border-[#252538] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"><Phone size={14} className="text-[#6B6B6B]" /><span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Call</span></button>
         </div>
       </motion.div>
    )
  }

  // Completed or Cancelled
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: order.status === 'completed' ? 0.8 : 0.6 }} onClick={onViewDetail} className="mx-[16px] mt-[8px] bg-[#0F0F1A] border border-[#1C1C2E] rounded-[20px] p-[14px] cursor-pointer active:scale-[0.98] transition-transform">
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col">
          {order.status === 'completed' ? (
            <span className="font-mono text-[13px] text-[#6B6B6B]">#{order.id}</span>
          ) : (
            <span className="font-mono text-[13px] text-[#6B6B6B]">#{order.id} · ❌ Cancelled</span>
          )}
          <span className={`font-dm-sans text-[12px] mt-1 truncate max-w-[200px] ${order.status === 'cancelled' ? 'text-[#FF3B30]' : 'text-[#6B6B6B]'}`}>
            {order.status === 'cancelled' ? (order.cancelReason || 'Cancelled') : order.items.map((i:any)=>`${i.name} ×${i.qty}`).join(', ')}
          </span>
          <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-1 overflow-hidden opacity-70">{formatTimeAgo(order.placedAt)}</span>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className={`font-space-grotesk font-bold text-[16px] ${order.status === 'cancelled' ? 'text-[#6B6B6B] line-through decoration-1 decoration-[#FF3B30]' : 'text-[#EFEFFF]'}`}>₹{order.total}</span>
          {order.rating && (
            <span className="font-dm-sans font-medium text-[12px] text-[#FFD600] mt-[2px]">⭐ {order.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
