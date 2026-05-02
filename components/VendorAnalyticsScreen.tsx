'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  ChevronLeft, Upload, TrendingUp, TrendingDown,
  BarChart3, LineChart, CheckCircle2, XCircle, AlertCircle,
  Home, ClipboardList, Utensils, Settings, Check, X,
  Phone, Star
} from 'lucide-react';

const TIME_RANGES = ['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month', 'Custom'];

const CHART_DATA = [
  { day: 'Mon, 22', value: 1200, count: 18 },
  { day: 'Tue, 23', value: 1450, count: 21 },
  { day: 'Wed, 24', value: 1100, count: 15 },
  { day: 'Thu, 25', value: 1840, count: 25 },
  { day: 'Fri, 26', value: 2240, count: 32 }, // Peak
  { day: 'Sat, 27', value: 2100, count: 28 },
  { day: 'Sun, 28', value: 1310, count: 19 },
];
const MAX_VALUE = Math.max(...CHART_DATA.map(d => d.value));

const TOP_ITEMS = [
  { id: 't1', name: 'Malai Kulfi', sold: 124, revenue: 3720, photo: 'https://picsum.photos/seed/k1/100/100' },
  { id: 't2', name: 'Spl. Pani Puri', sold: 98, revenue: 4900, photo: 'https://picsum.photos/seed/k2/100/100' },
  { id: 't3', name: 'Mango Falooda', sold: 45, revenue: 2700, photo: 'https://picsum.photos/seed/k3/100/100' },
  { id: 't4', name: 'Dahi Puri', sold: 42, revenue: 1680, photo: 'https://picsum.photos/seed/k4/100/100' },
  { id: 't5', name: 'Masala Chaas', sold: 38, revenue: 760, photo: 'https://picsum.photos/seed/k5/100/100' },
];

const HEATMAP_DATA = Array.from({ length: 7 }, () => 
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 40))
);

export default function VendorAnalyticsScreen() {
  const router = useRouter();
  
  const [activeRange, setActiveRange] = useState('Last 7 Days');
  const [activeChart, setActiveChart] = useState<'Bar' | 'Line'>('Bar');
  const [topItemsBy, setTopItemsBy] = useState<'Revenue' | 'Qty'>('Revenue');
  
  const [displayEarnings, setDisplayEarnings] = useState(0);
  const TARGET_EARNINGS = 11240;

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayEarnings(Math.floor(easeProgress * TARGET_EARNINGS));
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayEarnings(TARGET_EARNINGS);
    };
    
    requestAnimationFrame(animate);
  }, [activeRange]);

  const maxRevenue = Math.max(...TOP_ITEMS.map(i => i.revenue));
  const maxSold = Math.max(...TOP_ITEMS.map(i => i.sold));

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0A0A14] font-sans overflow-hidden text-[#EFEFFF]">
      
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 h-[64px] px-[16px] flex items-center justify-between bg-[#0A0A14] border-b border-[#252538] shrink-0 z-40 pt-safe">
        <button onClick={() => router.push('/vendor-dashboard')} className="w-[40px] flex items-center justify-start py-2">
          <ChevronLeft size={24} className="text-[#EFEFFF] -ml-1" />
        </button>
        <span className="font-baloo font-bold text-[18px] text-[#EFEFFF] flex-1 text-center">Analytics</span>
        <button className="h-[34px] px-[12px] bg-[#13131F] border border-[#252538] rounded-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform">
          <Upload size={14} className="text-[#EFEFFF]" />
          <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Export</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] hide-scrollbar relative">
        
        {/* TIME RANGE SELECTOR */}
        <div className="mt-[12px] px-[16px] overflow-x-auto no-scrollbar flex gap-[8px]">
          {TIME_RANGES.map(range => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`shrink-0 h-[32px] px-[14px] rounded-[20px] font-dm-sans text-[13px] transition-colors border ${
                activeRange === range 
                  ? 'bg-[#FF6B00] border-[#FF6B00] font-bold text-white' 
                  : 'bg-[#13131F] border border-[#252538] text-[#6B6B6B] font-regular'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* HERO STATS CARD */}
        <div className="mt-[14px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#13131F] border border-[#252538] rounded-[24px] p-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
           <div className="font-dm-sans font-medium text-[12px] text-[#6B6B6B] tracking-[1.5px] uppercase">
             {activeRange}
           </div>
           
           <div className="mt-[8px] font-space-grotesk font-bold text-[48px] text-[#FF6B00] tracking-[-1px] leading-none">
             ₹{displayEarnings.toLocaleString('en-IN')}
           </div>

           <div className="mt-[8px] flex items-center gap-[4px]">
             <TrendingUp size={14} className="text-[#00C853]" />
             <span className="font-dm-sans font-medium text-[13px] text-[#00C853]">+₹2,140 vs last week</span>
           </div>

           <div className="w-full h-[1px] bg-[#252538] my-[16px]"></div>

           <div className="grid grid-cols-2 gap-y-[16px]">
             <div className="flex flex-col border-r border-[#252538] pr-[16px]">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Orders</span>
               <span className="font-space-grotesk font-bold text-[22px] text-[#EFEFFF]">142</span>
               <span className="font-dm-sans text-[11px] text-[#00C853] mt-[2px]">↑ +23 vs last</span>
             </div>
             <div className="flex flex-col pl-[16px]">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Avg Order</span>
               <span className="font-space-grotesk font-bold text-[22px] text-[#EFEFFF]">₹79</span>
               <span className="font-dm-sans text-[11px] text-[#00C853] mt-[2px]">↑ +₹4 vs last</span>
             </div>
             <div className="flex flex-col border-r border-[#252538] pr-[16px] pt-[16px] border-t border-[#252538]/0 relative after:absolute after:top-0 after:left-0 after:right-[16px] after:h-[1px] after:bg-[#252538]">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Customers</span>
               <span className="font-space-grotesk font-bold text-[22px] text-[#EFEFFF]">89</span>
               <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">68% returning</span>
             </div>
             <div className="flex flex-col pl-[16px] pt-[16px] relative after:absolute after:top-0 after:left-[16px] after:right-0 after:h-[1px] after:bg-[#252538]">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Rating</span>
               <span className="font-space-grotesk font-bold text-[22px] text-[#FFD600]">⭐ 4.9</span>
               <span className="font-dm-sans text-[11px] text-[#00C853] mt-[2px]">↑ +0.2 vs last</span>
             </div>
           </div>
        </div>

        {/* EARNINGS CHART CARD */}
        <div className="mt-[16px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center">
            <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">💰 Earnings</h3>
            <div className="flex gap-[6px]">
              {(['Bar', 'Line'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveChart(type)}
                  className={`h-[28px] px-[10px] rounded-[8px] font-dm-sans text-[12px] flex items-center gap-[4px] transition-colors ${
                    activeChart === type ? 'bg-[#FF6B00] text-white' : 'bg-[#1C1C2E] text-[#6B6B6B]'
                  }`}
                >
                  {type === 'Bar' ? <BarChart3 size={12} /> : <LineChart size={12} />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[180px] mt-[16px] relative w-full flex items-end justify-between">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-[20px] pb-[16px] z-0 pointer-events-none">
               {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-[1px] bg-[#1C1C2E]"></div>)}
            </div>
            
            {activeChart === 'Bar' ? (
               CHART_DATA.map((d, i) => (
                 <div key={i} className="flex flex-col items-center gap-[4px] z-10 w-[12%] group relative">
                   {i === 4 && (
                     <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                       <span className="font-dm-sans font-bold text-[10px] text-[#FF6B00] whitespace-nowrap">Best: ₹2,240</span>
                       <div className="w-[0px] h-[0px] border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#FF6B00]"></div>
                     </div>
                   )}
                   <div 
                     className={`w-full rounded-t-[6px] transition-all bg-gradient-to-t from-[#FF4500] to-[#FF6B00] ${
                       i === CHART_DATA.length - 2 ? 'brightness-125 scale-105 transform origin-bottom' : ''
                     }`}
                     style={{ height: `${Math.max(4, (d.value / MAX_VALUE) * 140)}px` }}
                   ></div>
                   <span className="font-dm-sans text-[10px] text-[#6B6B6B] truncate w-full text-center">{d.day.split(',')[0]}</span>
                 </div>
               ))
            ) : (
              <div className="absolute inset-0 z-10 w-full h-[140px] top-[20px]">
                <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Simplified line path drawing for mock */}
                  <path 
                    d={`M 0,${140 - (CHART_DATA[0].value/MAX_VALUE)*140} 
                        C 20,${140 - (CHART_DATA[0].value/MAX_VALUE)*140} 30,${140 - (CHART_DATA[1].value/MAX_VALUE)*140} 55,${140 - (CHART_DATA[1].value/MAX_VALUE)*140}
                        S 80,${140 - (CHART_DATA[2].value/MAX_VALUE)*140} 110,${140 - (CHART_DATA[2].value/MAX_VALUE)*140}
                        S 140,${140 - (CHART_DATA[3].value/MAX_VALUE)*140} 165,${140 - (CHART_DATA[3].value/MAX_VALUE)*140}
                        S 190,${140 - (CHART_DATA[4].value/MAX_VALUE)*140} 220,${140 - (CHART_DATA[4].value/MAX_VALUE)*140}
                        S 240,${140 - (CHART_DATA[5].value/MAX_VALUE)*140} 275,${140 - (CHART_DATA[5].value/MAX_VALUE)*140}
                        S 300,${140 - (CHART_DATA[6].value/MAX_VALUE)*140} 330,${140 - (CHART_DATA[6].value/MAX_VALUE)*140}
                    `} 
                    fill="none" stroke="#FF6B00" strokeWidth="2.5" 
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ORDERS DONUT CHART CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
          <div className="flex justify-between items-center">
             <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">📦 Orders</h3>
             <span className="font-dm-sans text-[13px] text-[#6B6B6B]">142 total</span>
          </div>

          <div className="flex flex-col items-center mt-[14px]">
             <div className="relative w-[160px] h-[160px] flex items-center justify-center">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                 {/* Background circle */}
                 <circle cx="80" cy="80" r="70" fill="none" stroke="#1C1C2E" strokeWidth="16" />
                 {/* Completed 88% */}
                 <circle cx="80" cy="80" r="70" fill="none" stroke="#00C853" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.88)} strokeLinecap="round" />
                 {/* Cancelled 8% */}
                 <circle cx="80" cy="80" r="70" fill="none" stroke="#FF3B30" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.08)} strokeLinecap="round" transform="rotate(316.8 80 80)" />
                 {/* Declined 4% */}
                 <circle cx="80" cy="80" r="70" fill="none" stroke="#FF9500" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.04)} strokeLinecap="round" transform="rotate(345.6 80 80)" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                 <span className="font-space-grotesk font-bold text-[32px] text-[#EFEFFF] leading-none">142</span>
                 <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Orders</span>
               </div>
             </div>
          </div>

          <div className="mt-[16px] flex flex-col">
            {[
              { label: 'Completed', count: 125, percent: '88%', color: '#00C853' },
              { label: 'Cancelled', count: 11, percent: '8%', color: '#FF3B30' },
              { label: 'Declined', count: 6, percent: '4%', color: '#FF9500' },
            ].map((stat, i) => (
              <div key={i} className={`flex items-center justify-between h-[40px] ${i < 2 ? 'border-b border-[#1C1C2E]' : ''}`}>
                <div className="flex items-center gap-[8px] w-[100px]">
                  <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <span className="font-dm-sans text-[13px]" style={{ color: stat.color }}>{stat.label}</span>
                </div>
                <span className="font-space-grotesk text-[13px] text-[#EFEFFF]">{stat.count} orders</span>
                <span className="font-dm-sans text-[13px] text-[#6B6B6B] w-[30px] text-right">{stat.percent}</span>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center mt-[12px]">
            <div className="bg-[#0F2318] border border-[#00C853] px-[16px] py-[6px] rounded-[20px]">
              <span className="font-dm-sans font-medium text-[13px] text-[#00C853]">✅ 88% completion rate</span>
            </div>
          </div>
        </div>

        {/* PEAK HOURS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
           <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">⏰ Peak Hours</h3>
           <span className="font-dm-sans text-[12px] text-[#6B6B6B]">When do you get most orders?</span>

           <div className="mt-[16px] flex w-full relative">
             <div className="flex flex-col justify-between h-full pt-[20px] pr-[8px]">
               {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                 <span key={d} className="font-dm-sans text-[10px] text-[#6B6B6B] h-[24px] flex items-center">{d}</span>
               ))}
             </div>
             <div className="flex-1 flex flex-col">
               <div className="flex justify-between mb-[4px]">
                 {['9AM','11','1PM','3','5','7','9PM'].map(h => (
                    <span key={h} className="font-dm-sans text-[10px] text-[#6B6B6B] w-[36px] text-center">{h}</span>
                 ))}
               </div>
               <div className="flex flex-col gap-[3px]">
                  {HEATMAP_DATA.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-[3px] justify-between">
                      {row.map((val, cIdx) => {
                        let color = '#1C1C2E';
                        if (val > 30) color = '#FFB347';
                        else if (val > 15) color = '#FF6B00';
                        else if (val > 5) color = '#CC5500';
                        else if (val > 0) color = '#7B3A0A';
                        
                        return (
                          <div 
                            key={cIdx} 
                            className="h-[24px] rounded-[4px] flex-1"
                            style={{ backgroundColor: color }}
                          />
                        )
                      })}
                    </div>
                  ))}
               </div>
             </div>
           </div>

           <div className="w-full flex justify-center mt-[16px]">
             <div className="bg-[#1C1C2E] border border-[#FF6B00] px-[16px] py-[8px] rounded-[12px]">
               <span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">🔥 Busiest: Friday 6–8 PM</span>
             </div>
           </div>
        </div>

        {/* TOP ITEMS PERFORMANCE CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
           <div className="flex justify-between items-center mb-[14px]">
              <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">🔥 Top Items</h3>
              <button 
                onClick={() => setTopItemsBy(prev => prev === 'Revenue' ? 'Qty' : 'Revenue')}
                className="font-dm-sans text-[12px] text-[#FF6B00]"
              >
                By {topItemsBy.toLowerCase()}
              </button>
           </div>
           
           <div className="flex flex-col gap-[14px]">
             {TOP_ITEMS.sort((a,b) => topItemsBy === 'Revenue' ? b.revenue - a.revenue : b.sold - a.sold).slice(0,5).map((item, idx) => (
                <div key={item.id} className="flex gap-[12px] items-center">
                  <span className={`w-[12px] font-space-grotesk font-bold text-[16px] text-center ${
                    idx === 0 ? 'text-[#FFD600]' : idx === 1 ? 'text-[#EFEFFF]' : idx === 2 ? 'text-[#FF6B00]' : 'text-[#6B6B6B]'
                  }`}>{idx + 1}</span>
                  <div className="w-[40px] h-[40px] rounded-[8px] overflow-hidden relative shrink-0">
                    <Image src={item.photo} alt={item.name} layout="fill" objectFit="cover" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF] truncate">{item.name}</span>
                    <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">{item.sold} sold · ₹{item.revenue.toLocaleString()} earned</span>
                    <div className="w-full h-[4px] bg-[#252538] rounded-[3px] mt-[6px] overflow-hidden relative">
                       <div 
                         className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF6B00] to-[#FFB347] rounded-[3px]"
                         style={{ width: `${topItemsBy === 'Revenue' ? (item.revenue/maxRevenue)*100 : (item.sold/maxSold)*100}%` }}
                       />
                    </div>
                  </div>
                </div>
             ))}
           </div>
           
           <button onClick={() => router.push('/vendor-menu')} className="w-full text-right mt-[16px] font-dm-sans text-[12px] text-[#FF6B00]">
             See all items &rarr;
           </button>
        </div>

        {/* CUSTOMER INSIGHTS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
          <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF] mb-[14px]">👥 Customer Insights</h3>

          <div className="flex flex-col">
            {/* ROW 1 */}
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">New vs Returning</span>
            <div className="h-[10px] w-full rounded-[6px] flex gap-[2px] mt-[8px]">
              <div className="bg-[#FF6B00] rounded-l-[6px]" style={{ width: '32%' }}></div>
              <div className="bg-[#00C853] rounded-r-[6px]" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-[6px]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">🟠 New: 29 (32%)</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">🟢 Returning: 60 (68%)</span>
            </div>

            <div className="w-full h-[1px] bg-[#252538] my-[14px]"></div>

            {/* ROW 2 */}
            <div className="flex justify-between items-center">
               <div className="flex flex-col">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">📍 Avg Customer Distance</span>
                 <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">320m average</span>
               </div>
               <span className="font-space-grotesk font-bold text-[22px] text-[#EFEFFF]">320m</span>
            </div>

            <div className="w-full h-[1px] bg-[#252538] my-[14px]"></div>

            {/* ROW 3 */}
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF] mb-[8px]">Payment Methods</span>
            <div className="flex flex-col gap-[6px]">
              {[
                { label: '📱 UPI', pct: 65, color: '#00BCD4' },
                { label: '💵 Cash', pct: 25, color: '#FFD600' },
                { label: '👛 Wallet', pct: 10, color: '#9C27B0' },
              ].map(pm => (
                <div key={pm.label} className="flex items-center gap-[12px]">
                   <span className="font-dm-sans text-[12px] text-[#EFEFFF] w-[65px]">{pm.label}</span>
                   <div className="flex-1 h-[4px] bg-[#252538] rounded-[3px] overflow-hidden">
                     <div className="h-full rounded-[3px]" style={{ width: `${pm.pct}%`, backgroundColor: pm.color }}></div>
                   </div>
                   <span className="font-dm-sans text-[12px] text-[#EFEFFF] w-[30px] text-right">{pm.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RATINGS & REVIEWS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
          <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF] mb-[14px]">⭐ Ratings Overview</h3>
          
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="font-space-grotesk font-bold text-[52px] text-[#FFD600] leading-none">4.9</span>
              <div className="flex mt-[4px]">
                {[...Array(5)].map((_,i) => <Star key={i} size={20} className="fill-[#FFD600] text-[#FFD600]" />)}
              </div>
              <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px]">89 reviews total</span>
            </div>

            <div className="flex-1 ml-[20px] flex flex-col gap-[4px] justify-center mt-[-6px]">
               {[
                 { stars: 5, pct: 82 },
                 { stars: 4, pct: 12 },
                 { stars: 3, pct: 4 },
                 { stars: 2, pct: 1 },
                 { stars: 1, pct: 1 },
               ].map(r => (
                 <div key={r.stars} className="flex items-center gap-[8px]">
                   <span className="font-dm-sans text-[11px] text-[#6B6B6B] w-[14px]">{r.stars}★</span>
                   <div className="flex-1 h-[4px] bg-[#252538] rounded-[3px] overflow-hidden">
                     <div className="h-full bg-[#FFD600] rounded-[3px]" style={{ width: `${r.pct}%` }}></div>
                   </div>
                   <span className="font-dm-sans text-[11px] text-[#6B6B6B] w-[24px] text-right">{r.pct}%</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-[14px] flex flex-col">
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">📈 Rating trend this week:</span>
            <div className="h-[40px] w-full mt-[6px] relative">
              <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                <path d="M 0,20 Q 20,20 40,10 T 100,25 T 160,15 T 220,10 T 280,5 T 340,5" fill="none" stroke="#FFD600" strokeWidth="2" />
                <path d="M 0,40 L 0,20 Q 20,20 40,10 T 100,25 T 160,15 T 220,10 T 280,5 T 340,5 L 340,40 Z" fill="#FFD600" opacity="0.1" />
              </svg>
            </div>
            <span className="font-dm-sans font-medium text-[12px] text-[#00C853] mt-[6px]">+0.2 from last week</span>
          </div>

          <div className="mt-[14px]">
             <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">What customers say:</span>
             <div className="flex flex-wrap gap-[8px] mt-[8px]">
                {['😋 Tasty (42)', '⚡ Fast (31)', '🌶 Spicy (28)', '💰 Value (24)', '😊 Friendly (18)'].map(kw => (
                  <div key={kw} className="bg-[#1C1C2E] border border-[#252538] rounded-[20px] px-[10px] h-[28px] flex items-center">
                    <span className="font-dm-sans text-[12px] text-[#EFEFFF]">{kw}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* GOAL TRACKER CARD */}
        <div className="mt-[14px] mx-[16px] mb-[40px] bg-[#13131F] border border-[#252538] rounded-[20px] p-[18px]">
          <div className="flex justify-between items-center mb-[14px]">
            <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">🎯 Daily Goal</h3>
            <button className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">Edit ✏️</button>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-space-grotesk font-bold text-[18px] text-[#EFEFFF]">₹1,840 / ₹2,000</span>
            <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">92%</span>
          </div>

          <div className="w-full h-[14px] bg-[#252538] rounded-[8px] mt-[10px] relative">
             <motion.div 
               className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF6B00] to-[#FFB347] rounded-[8px]"
               initial={{ width: 0 }}
               animate={{ width: '92%' }}
               transition={{ duration: 1, delay: 0.2 }}
             />
             <div className="absolute top-1/2 -translate-y-1/2 left-[25%] w-[4px] h-[4px] bg-white rounded-full"></div>
             <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-[4px] h-[4px] bg-white rounded-full"></div>
             <div className="absolute top-1/2 -translate-y-1/2 left-[75%] w-[4px] h-[4px] bg-white rounded-full"></div>
             {/* <div className="absolute top-1/2 -translate-y-1/2 right-1 text-[10px]">🏁</div> */}
          </div>

          <div className="mt-[14px]">
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">This Week&apos;s Goals:</span>
            <div className="flex justify-between mt-[10px] px-[8px]">
              {[
                { d: 'MON', status: 'achieved' },
                { d: 'TUE', status: 'missed' },
                { d: 'WED', status: 'partial', val: 80 },
                { d: 'THU', status: 'achieved' },
                { d: 'FRI', status: 'achieved' },
                { d: 'SAT', status: 'achieved' },
                { d: 'SUN', status: 'today', val: 92 },
              ].map(day => (
                <div key={day.d} className="flex flex-col items-center gap-[6px]">
                  <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${
                    day.status === 'achieved' ? 'bg-[#00C853]' :
                    day.status === 'missed' ? 'bg-[#1C1C2E] border border-[#252538]' :
                    day.status === 'partial' ? 'bg-[#FF6B00]' :
                    'bg-transparent border-[2px] border-[#FF6B00]'
                  }`}>
                    {day.status === 'achieved' && <Check size={16} className="text-white" strokeWidth={3} />}
                    {day.status === 'missed' && <X size={14} className="text-[#FF3B30]" />}
                    {day.status === 'partial' && <span className="font-space-grotesk font-bold text-[10px] text-white">{day.val}%</span>}
                    {day.status === 'today' && <span className="font-space-grotesk font-bold text-[10px] text-[#FF6B00]">{day.val}%</span>}
                  </div>
                  <span className="font-dm-sans text-[10px] text-[#6B6B6B]">{day.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center mt-[10px]">
            <div className="bg-[#1C1C2E] border border-[#FF6B00] px-[16px] py-[6px] rounded-[20px]">
              <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">🔥 3-day goal streak!</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM NAVIGATION BAR (Dark) */}
      <div className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#0A0A14] border-t border-[#252538] flex items-center justify-between px-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-[60]">
        {[
          { id: 'home', icon: Home, label: 'Home', badge: 0, path: '/vendor-dashboard' },
          { id: 'orders', icon: ClipboardList, label: 'Orders', badge: 0, path: '/vendor-orders' },
          { id: 'menu', icon: Utensils, label: 'Menu', badge: 0, path: '/vendor-menu' },
          { id: 'stats', icon: BarChart3, label: 'Stats', badge: 0, path: '/vendor-analytics' },
          { id: 'settings', icon: Settings, label: 'Settings', badge: 0, path: '/vendor-settings' },
        ].map(tab => {
          const isActive = tab.id === 'stats';
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
