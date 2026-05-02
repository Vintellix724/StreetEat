'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { ChevronLeft, Bell, BellOff, Expand, MapPin, Phone, Check, Flame, ShoppingBag, PartyPopper, X } from 'lucide-react';

const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-[20px]" /> });

type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';

const VENDOR_POS: [number, number] = [28.6139, 77.2090]; // Example: New Delhi
const CUSTOMER_POS: [number, number] = [28.6130, 77.2085];

export default function OrderTrackingScreen() {
  const router = useRouter();
  
  const [status, setStatus] = useState<OrderStatus>('placed');
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  
  // Rating State
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Advanced Demo controls (only for showing transitions)
  useEffect(() => {
    if (status === 'completed' && !showRating) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FFD600', '#FFFFFF']
      });
      const t = setTimeout(() => {
        setShowRating(true);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status, showRating]);

  const handleCancelOrder = () => {
    setStatus('cancelled');
    setShowCancelModal(false);
  };

  const submitReview = () => {
    setRatingSubmitted(true);
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAF8] font-sans overflow-y-auto overflow-x-hidden text-[#1A1A1A]">
      
      {/* HEADER */}
      <div className="sticky top-0 h-[56px] px-[16px] flex items-center justify-between bg-white border-b border-[#EBEBEB] shrink-0 z-40 shadow-sm pt-safe">
        <button onClick={() => router.push('/customer-home')} className="w-[40px] flex items-center justify-start py-2">
          <ChevronLeft size={24} className="text-[#1A1A1A] -ml-1" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="font-baloo font-bold text-[17px] text-[#1A1A1A] leading-tight">Order #SF2847</span>
          <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-tight">Placed at 6:32 PM</span>
        </div>
        <button 
          onClick={() => setNotificationsMuted(!notificationsMuted)} 
          className="w-[40px] flex items-center justify-end py-2"
        >
          {notificationsMuted ? <BellOff size={22} className="text-[#6B6B6B]" /> : <Bell size={22} className="text-[#1A1A1A]" />}
        </button>
      </div>

      {/* STATUS BANNER */}
      <div className="mt-[12px] mx-[16px]">
        <AnimatePresence mode="wait">
          {status === 'placed' && (
            <motion.div key="waiting" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#FFF8E7] border-[1.5px] border-[#FFD600] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FFD600]"></div>
              <div className="flex items-center gap-[12px] ml-[8px]">
                <div className="text-[24px]">🕐</div>
                <div className="flex flex-col">
                  <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Vendor ka wait kar rahe hain...</span>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Usually 1-2 min mein accept hota hai</span>
                </div>
              </div>
            </motion.div>
          )}
          {status === 'accepted' && (
             <motion.div key="accepted" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#E8FFF4] border-[1.5px] border-[#00C853] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
             <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00C853]"></div>
             <div className="flex items-center gap-[12px] ml-[8px]">
               <div className="text-[24px]">👍</div>
               <div className="flex flex-col">
                 <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Vendor ne order accept kiya!</span>
                 <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Preparation start hogi jaldi</span>
               </div>
             </div>
           </motion.div>
          )}
          {status === 'preparing' && (
            <motion.div key="preparing" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#FFF0E6] border-[1.5px] border-[#FF6B00] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF6B00]"></div>
              <div className="flex items-center gap-[12px] ml-[8px]">
                <div className="text-[24px] animate-bounce">🔥</div>
                <div className="flex flex-col">
                  <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Aapka order ban raha hai!</span>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">~5 min mein ready hoga</span>
                </div>
              </div>
            </motion.div>
          )}
          {status === 'ready' && (
            <motion.div key="ready" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#E8FFF4] border-[1.5px] border-[#00C853] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00C853]"></div>
              <div className="flex items-center gap-[12px] ml-[8px]">
                <div className="text-[24px] animate-bounce">✅</div>
                <div className="flex flex-col">
                  <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Order ready hai! Pickup karo</span>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Sharma Ji Kulfi — 120m away</span>
                </div>
              </div>
            </motion.div>
          )}
          {status === 'completed' && (
            <motion.div key="completed" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#E8FFF4] border-[1.5px] border-[#00C853] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00C853]"></div>
              <div className="flex items-center gap-[12px] ml-[8px]">
                <PartyPopper size={24} className="text-[#00C853]" />
                <div className="flex flex-col">
                  <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Order complete! Enjoy karo 😋</span>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Aapko reward points mile hain!</span>
                </div>
              </div>
            </motion.div>
          )}
          {status === 'cancelled' && (
            <motion.div key="cancelled" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} className="h-[72px] bg-[#FFF0F0] border-[1.5px] border-[#FF3B30] rounded-[16px] p-[16px] flex items-center overflow-hidden relative shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF3B30]"></div>
              <div className="flex items-center gap-[12px] ml-[8px]">
                <X size={24} className="text-[#FF3B30]" />
                <div className="flex flex-col">
                  <span className="font-baloo font-semibold text-[16px] text-[#1A1A1A]">Order cancel ho gayi</span>
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Refund processed if applicable</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIVE MAP CARD */}
      {status !== 'cancelled' && (
        <div className="mt-[14px] mx-[16px] h-[200px] border-[1.5px] border-[#E8E8E8] rounded-[20px] overflow-hidden relative shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-10">
          <LiveMap vendorPos={VENDOR_POS} customerPos={CUSTOMER_POS} />
          <div className="absolute bottom-[12px] right-[12px] bg-white px-[12px] py-[6px] rounded-[20px] shadow-md flex items-center gap-1.5 border border-[#EBEBEB]">
            <MapPin size={14} className="text-[#FF6B00]" />
            <span className="font-dm-sans font-medium text-[13px] text-[#1A1A1A]">120m away</span>
          </div>
          <button className="absolute top-[12px] right-[12px] w-[36px] h-[36px] bg-white rounded-full shadow-md flex items-center justify-center border border-[#EBEBEB]">
            <Expand size={16} className="text-[#1A1A1A]" />
          </button>
        </div>
      )}

      {/* STATUS STEPPER */}
      {status !== 'cancelled' && (
        <div className="mt-[20px] mx-[16px] bg-white border border-[#EBEBEB] rounded-[20px] p-[20px_16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h3 className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A] mb-[16px]">Order Status</h3>
          
          <div className="flex flex-col gap-0 relative">
            {/* Base Lines */}
            <div className={`absolute left-[17px] top-[18px] bottom-[100px] w-[2px] transition-all duration-500 bg-[#E8E8E8]`}></div>
            {/* Animated Active Line */}
            <div className={`absolute left-[17px] top-[18px] w-[2px] transition-all duration-700 ease-out bg-[#00C853]`}
                 style={{ 
                   height: status === 'placed' ? '0%' : 
                           status === 'accepted' ? '33%' : 
                           status === 'preparing' ? '66%' : 
                           '100%' 
                 }}></div>

            {/* STEP 1 */}
            <div className="flex gap-[16px] mb-[30px] relative z-10">
              <div className="w-[36px] h-[36px] shrink-0 bg-[#00C853] rounded-full flex items-center justify-center border-2 border-[#00C853]">
                <Check size={18} className="text-white" />
              </div>
              <div className="flex flex-col pt-1.5">
                <span className="font-dm-sans font-semibold text-[14px] text-[#1A1A1A] leading-none mb-1">Order Placed</span>
                <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none">6:32 PM</span>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex gap-[16px] mb-[30px] relative z-10">
              <div className={`w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-500 border-2 ${status === 'placed' ? 'bg-[#F5F5F5] border-[#E8E8E8]' : 'bg-[#00C853] border-[#00C853]'}`}>
                {status !== 'placed' && <Check size={18} className="text-white" />}
              </div>
              <div className="flex flex-col pt-1.5">
                <span className={`font-dm-sans ${status !== 'placed' ? 'font-semibold text-[#1A1A1A]' : 'text-[#BBBBC0]'} text-[14px] leading-none mb-1`}>Vendor Accepted</span>
                {(status !== 'placed') && <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none">6:33 PM · Confirmed</span>}
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex gap-[16px] mb-[30px] relative z-10">
              <div className={`w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-500 border-2 ${
                ['preparing', 'ready', 'completed'].includes(status) 
                  ? (status === 'preparing' ? 'bg-[#FF6B00] border-[#FF6B00]' : 'bg-[#00C853] border-[#00C853]') 
                  : 'bg-[#F5F5F5] border-[#E8E8E8]'
              }`}>
                {status === 'preparing' ? <Flame size={18} className="text-white animate-bounce" /> : null}
                {['ready', 'completed'].includes(status) ? <Check size={18} className="text-white" /> : null}
              </div>
              <div className="flex flex-col pt-1.5 w-full">
                <span className={`font-dm-sans ${
                  ['preparing', 'ready', 'completed'].includes(status) ? 'font-semibold text-[#1A1A1A]' : 'text-[#BBBBC0]'
                } ${status === 'preparing' && 'text-[#FF6B00]'} text-[14px] leading-none mb-1`}>
                  {status === 'preparing' ? 'Ban Raha Hai...' : 'Food Prepared'}
                </span>
                
                {status === 'preparing' && (
                  <>
                    <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none mb-2">~5 min baki hai</span>
                    <div className="w-[160px] h-[3px] bg-[#F5F5F5] rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-[50%] bg-[#FF6B00] rounded-full opacity-50"
                      />
                    </div>
                  </>
                )}
                {['ready', 'completed'].includes(status) && <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none">Done</span>}
              </div>
            </div>

            {/* STEP 4 */}
            <div className="flex gap-[16px] relative z-10">
              <div className={`w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-500 border-2 ${
                ['ready', 'completed'].includes(status) ? 'bg-[#00C853] border-[#00C853]' : 'bg-[#F5F5F5] border-[#E8E8E8]'
              }`}>
                 {['ready', 'completed'].includes(status) ? <Check size={18} className="text-white" /> : <ShoppingBag size={18} className="text-[#BBBBC0]" />}
              </div>
              <div className="flex flex-col pt-1.5">
                <span className={`font-dm-sans ${['ready', 'completed'].includes(status) ? 'font-semibold text-[#1A1A1A]' : 'text-[#BBBBC0]'} text-[14px] leading-none mb-1`}>Ready for Pickup</span>
                {['ready', 'completed'].includes(status) ? (
                   <span className="font-dm-sans text-[12px] text-[#6B6B6B] leading-none">Collect from vendor now</span>
                ) : (
                  <span className="font-dm-sans text-[12px] text-[#BBBBC0] leading-none">Waiting...</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VENDOR CONTACT CARD */}
      <div className="mt-[14px] mx-[16px] bg-white border border-[#EBEBEB] rounded-[16px] p-[14px_16px] shadow-sm flex items-center justify-between">
        <div className="flex gap-[12px] items-center">
          <div className="w-[48px] h-[48px] rounded-[12px] bg-gray-100 relative overflow-hidden shrink-0">
            <Image src="https://picsum.photos/seed/vendor9/200/200" alt="Vendor" layout="fill" objectFit="cover" />
            <div className="absolute bottom-[2px] right-[2px] w-[10px] h-[10px] bg-[#00C853] rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A]">Sharma Ji Kulfi</span>
            <span className="font-dm-sans text-[12px] text-[#6B6B6B]">📍 Sector 14 · 120m away</span>
          </div>
        </div>
        <a href="tel:+1234567890" className="h-[38px] px-[14px] bg-[#FFF0E6] border-[1.5px] border-[#FF6B00] rounded-[20px] flex items-center gap-[6px] active:scale-95 transition-transform shrink-0 outline-none">
          <Phone size={14} className="text-[#FF6B00]" />
          <span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Call</span>
        </a>
      </div>

      {/* ORDER SUMMARY CARD */}
      <div className="mt-[14px] mx-[16px] bg-white border border-[#EBEBEB] rounded-[16px] p-[16px] shadow-sm mb-[16px]">
        <h3 className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A] mb-[12px]">Order Summary</h3>
        
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-[14px] text-[#1A1A1A]">Spl. Pani Puri × 2</span>
            <span className="font-space-grotesk font-medium text-[14px] text-[#1A1A1A]">₹50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-[14px] text-[#1A1A1A]">Mango Falooda × 1</span>
            <span className="font-space-grotesk font-medium text-[14px] text-[#1A1A1A]">₹60</span>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200 border-dashed border-b border-gray-300 my-[12px]"></div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Promo (STREETFREE)</span>
            <span className="font-space-grotesk text-[13px] text-[#00C853]">−₹20</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Platform Fee</span>
            <span className="font-dm-sans font-bold text-[13px] text-[#00C853]">₹0 FREE</span>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200 border-dashed border-b border-gray-300 my-[12px]"></div>

        <div className="flex justify-between items-center mb-[8px]">
          <span className="font-dm-sans font-bold text-[15px] text-[#1A1A1A]">Total Paid</span>
          <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">₹90</span>
        </div>

        <div className="inline-flex mt-[4px]">
          <span className="bg-[#F5F5F5] px-[12px] py-[4px] rounded-[20px] font-dm-sans text-[12px] text-[#6B6B6B]"> Paid via UPI 📱</span>
        </div>
      </div>

      {/* CANCEL ORDER SECTION */}
      {['placed', 'accepted'].includes(status) && (
        <div className="flex flex-col items-center gap-[4px] mb-[24px] mt-[8px]">
          <span className="font-dm-sans text-[13px] text-[#6B6B6B]">Need to cancel?</span>
          <button onClick={() => setShowCancelModal(true)} className="font-dm-sans font-medium text-[13px] text-[#FF3B30] underline underline-offset-2">Cancel Order</button>
        </div>
      )}

      {/* POST COMPLETION STATE (RATING) */}
      <AnimatePresence>
        {showRating && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mx-[16px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-[20px] p-[20px] mb-[16px] shadow-lg flex flex-col items-center"
          >
            {ratingSubmitted ? (
               <div className="flex flex-col items-center py-[10px]">
                 <div className="w-[48px] h-[48px] bg-white/20 rounded-full flex items-center justify-center mb-[12px]">
                   <Check size={24} className="text-white" />
                 </div>
                 <h3 className="font-baloo font-bold text-[20px] text-white">Review diya! ✅</h3>
                 <p className="font-dm-sans text-[14px] text-white/90">Shukriya support ke liye.</p>
               </div>
            ) : (
              <>
                <h3 className="font-baloo font-bold text-[20px] text-white mb-[16px]">Kaisa laga khana? ⭐</h3>
                
                <div className="flex gap-[8px] mb-[20px]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-75 focus-visible:outline-none"
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" className={star <= rating ? 'text-[#FFD600]' : 'text-white/40'} fill={star <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full flex flex-col gap-[12px]">
                    <textarea 
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value.substring(0, 200))}
                      placeholder="Apna experience batao..."
                      className="w-full h-[80px] bg-white/20 border border-white/60 rounded-[10px] p-[12px] text-white placeholder-white/70 font-dm-sans text-[14px] outline-none hide-scrollbar resize-none"
                    />
                    <button onClick={submitReview} className="w-full h-[48px] bg-white text-[#FF6B00] rounded-[12px] font-dm-sans font-bold text-[15px] active:scale-95 transition-transform">
                      Submit Review &rarr;
                    </button>
                    <button onClick={() => setRatingSubmitted(true)} className="font-dm-sans text-[13px] text-white/80 pb-1 mt-[4px]">
                      Skip &rarr;
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Again Button (shown if completed or cancelled) */}
      {['completed', 'cancelled'].includes(status) && (
        <div className="mx-[16px] mb-[32px]">
          <button onClick={() => router.push('/vendor/v4')} className="w-full h-[52px] border-[1.5px] border-[#FF6B00] text-[#FF6B00] bg-white rounded-[14px] font-dm-sans font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <span>🔁</span> Order Again
          </button>
        </div>
      )}

      {/* CANCEL CONFIRM MODAL/BOTTOM SHEET */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white rounded-t-[20px] p-[20px] pb-safe shadow-2xl z-50 flex flex-col items-center"
            >
              <div className="w-[40px] h-[4px] bg-gray-300 rounded-full mb-[20px]"></div>
              
              <h2 className="font-baloo font-bold text-[20px] text-[#1A1A1A] mb-[8px]">Order Cancel Karein?</h2>
              <p className="font-dm-sans text-[13px] text-[#6B6B6B] text-center px-[20px] mb-[20px]">
                Agar vendor ne accept kar liya hai toh cancellation possible nahi hogi.
              </p>

              <div className="w-full mb-[20px] max-w-[350px]">
                 <span className="font-dm-sans font-medium text-[13px] text-[#1A1A1A] mb-[10px] block">Cancel Reason:</span>
                 <div className="flex flex-wrap gap-[8px]">
                   {['Wrong order', 'Changed mind', 'Taking too long', 'Other'].map(r => (
                     <button
                       key={r}
                       onClick={() => setCancelReason(r)}
                       className={`px-[14px] py-[8px] rounded-full font-dm-sans text-[13px] border transition-colors ${cancelReason === r ? 'bg-[#FF3B30] text-white border-[#FF3B30]' : 'bg-white text-[#1A1A1A] border-[#E8E8E8]'}`}
                     >
                       {r}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="w-full flex flex-col gap-[12px] max-w-[350px]">
                <button 
                  onClick={handleCancelOrder}
                  className="w-full h-[52px] border-[1.5px] border-[#FF3B30] text-[#FF3B30] rounded-[14px] font-dm-sans font-bold text-[15px]"
                >
                  Cancel Order
                </button>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="w-full h-[52px] bg-[#FF6B00] text-white rounded-[14px] font-dm-sans font-bold text-[15px]"
                >
                  Keep Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
      {/* DEMO CONTROLS (Floating for AI preview) */}
      <div className="fixed bottom-[100px] right-[16px] flex flex-col gap-2 z-50 opacity-50 hover:opacity-100 transition-opacity p-2 bg-white/90 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
        <span className="text-[10px] font-bold text-center text-gray-500 uppercase tracking-wider">Demo States</span>
        {[
          { label: 'Placed', s: 'placed' },
          { label: 'Accptd', s: 'accepted' },
          { label: 'Prep', s: 'preparing' },
          { label: 'Ready', s: 'ready' },
          { label: 'Done', s: 'completed' },
        ].map(st => (
           <button 
             key={st.s} 
             onClick={() => setStatus(st.s as any)}
             className={`px-3 py-1.5 text-[11px] rounded-md font-medium border ${status === st.s ? 'bg-black text-white border-black' : 'bg-white border-gray-300 text-black'}`}
           >
             {st.label}
           </button>
        ))}
      </div>
      <div className="h-[20px]" />
    </div>
  );
}
