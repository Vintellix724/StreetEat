'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, Tag, X, Trash2, Loader2, Navigation, MapPin } from 'lucide-react';

const INITIAL_CART = [
  {
    id: 'm1',
    name: 'Spl. Pani Puri (6 pcs)',
    desc: 'Tangy, spicy, crispy gol gappe with imli water and green chutney',
    price: 25,
    qty: 2,
    photoUrl: 'https://picsum.photos/seed/kulfi2/200/200'
  },
  {
    id: 'm2',
    name: 'Mango Falooda',
    desc: 'Fresh mango pulp mixed with rabdi and sweet falooda sev',
    price: 60,
    qty: 1,
    photoUrl: 'https://picsum.photos/seed/kulfi3/200/200'
  }
];

const VENDOR_INFO = {
  id: 'v4',
  name: 'Raja Pani Puri Stall',
  address: 'Sector 14, Karol Bagh',
  distance: '200m',
  isOpen: true,
  photoUrl: 'https://picsum.photos/seed/kulfi1/800/600'
};

export default function CartScreen() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  
  // Promo State
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoActive, setPromoActive] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'wallet'>('upi');
  const [orderNote, setOrderNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Remove confirmation modal (kept simple with a window.confirm for web, or inline toggle)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, itemTotal - discountAmount);

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase();
    if (code === 'STREETFREE' || code === 'FIRST50') {
      if (itemTotal >= 50) {
        setPromoActive(true);
        setDiscountAmount(20);
        setPromoSuccess(`✅ ${code} applied! ₹20 off`);
        setPromoError('');
        setShowPromoInput(false);
      } else {
        setPromoError('❌ Minimum order value ₹50 required');
      }
    } else {
      setPromoError('❌ Invalid code. Try again.');
      setPromoSuccess('');
    }
  };

  const handleRemovePromo = () => {
    setPromoActive(false);
    setDiscountAmount(0);
    setPromoInput('');
    setPromoSuccess('');
    setPromoError('');
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    if (item.qty + delta === 0) {
      if (window.confirm("Is item ko hatao?")) {
          setCartItems(prev => prev.filter(i => i.id !== id));
      }
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(10, Math.max(0, i.qty + delta)) } : i));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Clear entire cart?")) {
      setCartItems([]);
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      // In a real app we'd navigate to tracking screen and pass order ID
      setCartItems([]);
      router.push('/tracking');
    }, 1500);
  };

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full w-full bg-[#FAFAF8] overflow-hidden text-[#1A1A1A]">
        <div className="h-[56px] pt-[16px] px-[16px] flex items-center bg-white border-b border-[#EBEBEB] shrink-0">
          <button onClick={() => router.back()} className="w-[32px] flex items-center justify-start">
            <ChevronLeft size={24} className="text-[#1A1A1A] -ml-1" />
          </button>
          <div className="flex-1 text-center font-baloo font-bold text-[18px] text-[#1A1A1A]">My Cart</div>
          <div className="w-[32px]"></div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
          <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center mb-[24px]">
             <span className="text-[48px] grayscale opacity-50">🍲</span>
          </div>
          <h2 className="font-baloo font-bold text-[24px] text-[#1A1A1A] mb-[8px]">Cart khali hai! 🛒</h2>
          <p className="font-dm-sans text-[14px] text-[#6B6B6B] mb-[32px] text-center">Kuch tasty add karo</p>
          <button 
            onClick={() => router.push('/customer-home')}
            className="w-[200px] h-[52px] bg-[#FF6B00] rounded-[14px] text-white font-dm-sans font-bold text-[15px] shadow-[0_4px_16px_rgba(255,107,0,0.3)] transition-transform active:scale-95 flex flex-col items-center justify-center"
          >
            Explore Vendors &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAF8] font-sans pb-[114px] overflow-y-auto overflow-x-hidden text-[#1A1A1A]">
      
      {/* HEADER */}
      <div className="sticky top-0 h-[56px] px-[16px] flex items-center justify-between bg-white border-b border-[#EBEBEB] shrink-0 z-30 shadow-sm">
        <button onClick={() => router.back()} className="w-[60px] flex items-center justify-start py-2">
          <ChevronLeft size={24} className="text-[#1A1A1A] -ml-1" />
        </button>
        <div className="flex-1 text-center font-baloo font-bold text-[18px] text-[#1A1A1A]">My Cart</div>
        <button onClick={handleClearAll} className="w-[60px] flex items-center justify-end font-dm-sans font-medium text-[13px] text-[#FF3B30] py-2">
          Clear All
        </button>
      </div>

      {/* VENDOR INFO STRIP */}
      <div className="mt-[12px] mx-[16px] bg-white border border-[#EBEBEB] rounded-[14px] p-[12px_14px] flex items-center justify-between shadow-sm cursor-pointer" onClick={() => router.push(`/vendor/${VENDOR_INFO.id}`)}>
        <div className="flex items-center gap-[12px] flex-1 pr-2">
          <div className="w-[40px] h-[40px] rounded-[10px] overflow-hidden bg-[#F5F5F5] shrink-0 relative">
            <Image src={VENDOR_INFO.photoUrl} alt={VENDOR_INFO.name} layout="fill" objectFit="cover" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="font-dm-sans font-semibold text-[14px] text-[#1A1A1A] truncate leading-tight">{VENDOR_INFO.name}</h3>
            <span className="font-dm-sans text-[12px] text-[#6B6B6B] truncate">{VENDOR_INFO.address} · {VENDOR_INFO.distance}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1.5 mb-[2px]">
            <div className="w-[6px] h-[6px] rounded-full bg-[#00C853] animate-pulse"></div>
            <span className="font-dm-sans font-medium text-[12px] text-[#00C853] leading-none mt-0.5">OPEN</span>
          </div>
          <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">+ Add More</span>
        </div>
      </div>

      {/* CART ITEMS SECTION */}
      <div className="mt-[16px]">
        <div className="px-[16px] mb-[8px] flex items-center gap-[6px]">
          <h2 className="font-dm-sans font-semibold text-[14px] text-[#1A1A1A]">Your Items</h2>
          <span className="font-dm-sans text-[13px] text-[#6B6B6B] bg-gray-100 px-2 py-0.5 rounded-full">{cartItems.length} items</span>
        </div>

        <div className="flex flex-col gap-[10px] px-[16px]">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, height: 0, marginTop: 0, marginBottom: 0, border: 'none', padding: 0 }}
                transition={{ duration: 0.25, ease: "easeIn" }}
                className="bg-white border border-[#EBEBEB] rounded-[14px] p-[12px_14px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                <div className="flex gap-[12px] mb-[12px]">
                  <div className="w-[50px] h-[50px] rounded-[10px] bg-[#F5F5F5] overflow-hidden shrink-0 relative">
                    <Image src={item.photoUrl} alt={item.name} layout="fill" objectFit="cover" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <h4 className="font-dm-sans font-semibold text-[14px] text-[#1A1A1A] truncate leading-tight">{item.name}</h4>
                    <p className="font-dm-sans text-[12px] text-[#6B6B6B] truncate mt-[2px]">{item.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="w-[28px] h-[28px] rounded-full bg-[#F5F5F5] border border-[#E8E8E8] flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <span className="font-bold text-[18px] text-[#FF6B00] leading-none pb-1">-</span>
                    </button>
                    <span className="w-[32px] text-center font-space-grotesk font-bold text-[16px] text-[#1A1A1A]">{item.qty}</span>
                    <button 
                      onClick={() => handleUpdateQty(item.id, +1)}
                      disabled={item.qty >= 10}
                      className={`w-[28px] h-[28px] rounded-full flex items-center justify-center active:scale-95 transition-transform ${item.qty >= 10 ? 'bg-[#FFD4B3] cursor-not-allowed' : 'bg-[#FF6B00]'}`}
                    >
                      <span className="font-bold text-[18px] text-white leading-none pb-0.5">+</span>
                    </button>
                  </div>
                  <div className="font-space-grotesk font-bold text-[15px] text-[#1A1A1A]">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* PROMO CODE SECTION */}
      <div className="mt-[16px] mx-[16px] bg-white rounded-[14px] p-[14px] transition-colors duration-300" 
           style={{ border: `1.5px dashed ${promoActive ? '#00C853' : promoError ? '#FF3B30' : '#E8E8E8'}` }}>
        
        {promoActive ? (
          <div className="flex items-center justify-between">
            <span className="font-dm-sans font-medium text-[13px] text-[#00C853]">{promoSuccess}</span>
            <button onClick={handleRemovePromo} className="font-dm-sans font-medium text-[13px] text-[#6B6B6B] flex items-center gap-1 hover:text-[#1A1A1A]">
              <X size={14} /> Remove
            </button>
          </div>
        ) : !showPromoInput ? (
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowPromoInput(true)}>
            <div className="flex items-center gap-[8px]">
              <Tag size={20} className="text-[#FF6B00]" />
              <span className="font-dm-sans font-medium text-[14px] text-[#1A1A1A]">Have a promo code?</span>
            </div>
            <span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Apply &rarr;</span>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <input 
                  type="text" 
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                  placeholder="Enter Code"
                  className="flex-1 h-[40px] bg-[#F5F5F5] border border-[#E8E8E8] rounded-[8px] px-[12px] font-dm-sans text-[14px] uppercase placeholder:normal-case outline-none focus:border-[#FF6B00] transition-colors"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="h-[40px] px-[16px] bg-[#FF6B00] text-white rounded-[8px] font-dm-sans font-medium text-[14px] active:scale-95 transition-transform"
                >
                  Apply
                </button>
              </div>
              {promoError && <span className="font-dm-sans text-[13px] text-[#FF3B30]">{promoError}</span>}
            </div>
            
            <div className="flex gap-[8px] overflow-x-auto no-scrollbar pb-1">
               <span className="font-dm-sans text-[12px] text-[#6B6B6B] self-center shrink-0">Suggestions:</span>
               {['STREETFREE', 'FIRST50'].map(code => (
                 <button 
                   key={code} 
                   onClick={() => setPromoInput(code)}
                   className="shrink-0 bg-gray-100 border border-gray-200 rounded-full px-[12px] py-[4px] font-dm-sans font-medium text-[12px] text-[#1A1A1A]"
                 >
                   {code}
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* PRICE BREAKDOWN CARD */}
      <div className="mt-[16px] mx-[16px] bg-white border border-[#EBEBEB] rounded-[16px] p-[16px] shadow-sm">
        <h3 className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A] mb-[12px]">Bill Summary</h3>
        
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center h-[28px]">
            <span className="font-dm-sans text-[14px] text-[#6B6B6B]">Item Total</span>
            <span className="font-space-grotesk text-[14px] text-[#1A1A1A]">₹{itemTotal}</span>
          </div>
          
          {promoActive && (
            <div className="flex justify-between items-center h-[28px]">
              <span className="font-dm-sans text-[14px] text-[#6B6B6B]">Promo ({promoInput.toUpperCase()})</span>
              <span className="font-space-grotesk text-[14px] text-[#00C853]">− ₹{discountAmount}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center h-[28px]">
            <div className="flex items-center gap-2">
              <span className="font-dm-sans text-[14px] text-[#6B6B6B]">Platform Fee</span>
              <span className="bg-[#E8FFF0] border border-[#00C853] px-[8px] py-[2px] rounded-[4px] font-dm-sans font-bold text-[10px] text-[#00C853] tracking-wide">FREE</span>
            </div>
            <span className="font-space-grotesk text-[14px] text-[#1A1A1A]">₹0</span>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200 border-dashed border-b border-gray-300 my-[12px]"></div>

        <div className="flex justify-between items-center h-[28px]">
          <span className="font-dm-sans font-bold text-[16px] text-[#1A1A1A]">Total</span>
          <span className="font-space-grotesk font-bold text-[20px] text-[#FF6B00]">₹{total}</span>
        </div>

        {promoActive && (
          <div className="mt-[16px] flex justify-center">
            <div className="bg-[#FFF0E6] border border-[#FF6B00] rounded-[20px] px-[14px] py-[6px] shadow-sm">
              <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">
                🎉 You save ₹{discountAmount} on this order!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT METHOD SECTION */}
      <div className="mt-[16px] mx-[16px]">
        <h3 className="font-dm-sans font-semibold text-[15px] text-[#1A1A1A] mb-[10px]">Pay With</h3>
        
        <div className="flex gap-[10px]">
          {[
            { id: 'upi', label: '📱 UPI' },
            { id: 'cash', label: '💵 Cash' },
            { id: 'wallet', label: '👛 Wallet' },
          ].map(pm => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id as any)}
              className={`flex-1 h-[44px] rounded-[12px] flex items-center justify-center transition-all ${
                paymentMethod === pm.id 
                  ? 'bg-[#FFF0E6] border-[1.5px] border-[#FF6B00]' 
                  : 'bg-white border-[1.5px] border-[#E8E8E8]'
              }`}
            >
              <span className={`font-dm-sans font-medium text-[14px] flex items-center ${paymentMethod === pm.id ? 'text-[#FF6B00]' : 'text-[#1A1A1A]'}`}>
                {pm.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-[12px]">
          <AnimatePresence mode="wait">
            {paymentMethod === 'upi' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="h-[44px] bg-white border border-[#E8E8E8] rounded-[10px] px-[12px] flex items-center justify-between">
                  <span className="font-dm-sans text-[14px] text-[#1A1A1A] truncate w-[200px]">📱 rahul@upi</span>
                  <button className="font-dm-sans font-medium text-[13px] text-[#4285F4]">Verify &rarr;</button>
                </div>
              </motion.div>
            )}
            
            {paymentMethod === 'cash' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-[#FFFEF0] border border-[#FDE047] p-[10px] rounded-[10px]">
                  <span className="font-dm-sans text-[13px] text-[#6B6B6B]">💵 Pay directly to vendor on pickup</span>
                </div>
              </motion.div>
            )}

            {paymentMethod === 'wallet' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-white border border-[#E8E8E8] p-[10px] rounded-[10px]">
                  <span className="font-dm-sans text-[13px] text-[#6B6B6B]">👛 StreetEats Wallet: <strong className="text-[#1A1A1A]">₹150</strong> available</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ORDER NOTE */}
      <div className="mt-[16px] mx-[16px]">
        <label className="block font-dm-sans font-medium text-[13px] text-[#1A1A1A] mb-[8px]">
          Add a note for vendor (optional)
        </label>
        <div className="relative">
          <textarea
            value={orderNote}
            onChange={e => setOrderNote(e.target.value.substring(0, 120))}
            placeholder="Jaise: Extra spicy, no onion..."
            className="w-full h-[80px] bg-white border-[1.5px] border-[#E8E8E8] rounded-[12px] p-[12px] font-dm-sans text-[14px] text-[#1A1A1A] resize-none outline-none focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all"
          />
          <span className="absolute bottom-[12px] right-[12px] font-dm-sans text-[11px] text-[#BBBBC0]">
            {orderNote.length}/120
          </span>
        </div>
      </div>

      {/* STICKY BOTTOM - PLACE ORDER */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[80px] bg-white border-t border-[#EBEBEB] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-[16px] flex items-center justify-between pb-safe z-40">
        <div className="flex flex-col">
          <span className="font-dm-sans text-[13px] text-[#6B6B6B] leading-[14px] mb-[2px]">Total</span>
          <span className="font-space-grotesk font-bold text-[22px] text-[#FF6B00] leading-none">₹{total}</span>
        </div>
        
        <button 
          onClick={handlePlaceOrder}
          disabled={!VENDOR_INFO.isOpen || isPlacingOrder}
          className={`w-[180px] h-[52px] rounded-[14px] flex items-center justify-center transition-all ${
            !VENDOR_INFO.isOpen 
              ? 'bg-[#FFD4B3] shadow-none cursor-not-allowed' 
              : isPlacingOrder 
                ? 'bg-[#D95A00] shadow-md cursor-wait'
                : 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] shadow-[0_6px_20px_rgba(255,107,0,0.35)] active:scale-[0.98]'
          }`}
        >
          {isPlacingOrder ? (
             <Loader2 size={20} className="text-white animate-spin" />
          ) : !VENDOR_INFO.isOpen ? (
             <span className="font-dm-sans font-bold text-[15px] text-white/80">Vendor Closed</span>
          ) : (
             <span className="font-dm-sans font-bold text-[15px] text-white">Place Order &rarr;</span>
          )}
        </button>
      </div>
    </div>
  );
}
