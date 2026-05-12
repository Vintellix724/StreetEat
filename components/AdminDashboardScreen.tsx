import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, Check, X, Eye, TrendingUp, Users, Store, Package, 
  Map as MapIcon, ChevronRight, BarChart3, Tag, Settings,
  AlertTriangle, CheckCircle2, ShieldAlert, Activity, ArrowUpRight,
  Clock, XCircle, Search, Home as HomeIcon, ChevronDown, ListCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';

const StaticMapComponent = dynamic(() => import('@/components/StaticMapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#1C1C2E] animate-pulse rounded-[20px]" />
});

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [revenueCount, setRevenueCount] = useState(0);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Simulate count up for revenue
    const interval = setInterval(() => {
      setRevenueCount(prev => {
        if (prev >= 48240) {
          clearInterval(interval);
          return 48240;
        }
        return prev + 1206;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="w-full min-h-screen bg-[#050508]" />;

  return (
    <div className="w-full min-h-screen bg-[#050508] font-sans pb-[80px] flex justify-center">
      <div className="w-full max-w-[390px] relative bg-[#050508] text-white overflow-hidden flex flex-col h-[100dvh]">
        
        {/* STICKY TOP BAR */}
        <div className="sticky top-0 w-full pt-[52px] h-[116px] px-[16px] bg-[#050508] border-b border-[#1C1C2E] flex items-center justify-between z-50 shrink-0">
          <div>
            <h1 className="font-baloo font-bold text-[20px] text-[#FF6B00] leading-none mb-[2px]">StreetEats</h1>
            <p className="font-dm-sans text-[11px] text-[#6B6B6B] leading-none">Admin Panel</p>
          </div>
          <div className="flex items-center gap-[14px]">
            <button className="relative p-2" onClick={() => router.push('/admin-alerts')}>
              <Bell size={24} className="text-[#EFEFFF]" />
              <div className="absolute top-[6px] right-[6px] w-[14px] h-[14px] bg-[#FF3B30] rounded-full flex items-center justify-center border-2 border-[#050508] animate-pulse">
                <span className="font-jetbrains font-bold text-[8px] text-white">4</span>
              </div>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF4500] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <span className="font-space-grotesk font-bold text-[16px] text-white">A</span>
              </button>
              
              {showAvatarDropdown && (
                <div className="absolute top-[44px] right-0 w-[200px] bg-[#1C1C2E] rounded-[16px] shadow-2xl border border-[#252538] py-[12px] z-50">
                  <div className="px-[16px] pb-[8px] border-b border-[#252538] mb-[8px]">
                    <p className="font-dm-sans text-[10px] text-[#6B6B6B]">Logged in as:</p>
                    <p className="font-dm-sans font-medium text-[12px] text-white truncate">abcdmt2p2@gmail.com</p>
                  </div>
                  <button 
                    onClick={() => { localStorage.clear(); router.replace('/role-select'); }}
                    className="w-full text-left px-[16px] py-[8px] font-dm-sans font-medium text-[13px] text-[#FF3B30] hover:bg-[#252538] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-[20px]">
          {/* PLATFORM HEALTH BANNER */}
          <div className="mt-[12px] mx-[16px] rounded-[16px] p-[14px] px-[16px] bg-[#0A1F0F] border-[1.5px] border-[#00C853] flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-[#00C853]" />
            <div className="flex items-center gap-[8px] ml-[8px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#00C853] animate-pulse" />
              <span className="font-dm-sans font-bold text-[13px] text-[#00C853]">All Systems Operational</span>
            </div>
            <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Last check: 2 min ago</span>
          </div>

          {/* HERO STATS CARD */}
          <div className="mt-[14px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#0D0D14] border border-[#252538] rounded-[24px] p-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-[8px]">
              <h2 className="font-dm-sans font-medium text-[11px] text-[#6B6B6B] tracking-[1.5px]">PLATFORM REVENUE TODAY</h2>
              <div className="flex items-center gap-[6px]">
                <Activity size={14} className="text-[#FF6B00]" />
                <span className="font-dm-sans font-medium text-[11px] text-[#00C853] flex items-center gap-[4px]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#00C853] animate-pulse" />
                  Live
                </span>
              </div>
            </div>
            
            <h3 className="font-space-grotesk font-bold text-[48px] text-[#FF6B00] tracking-[-1px] leading-tight mb-[4px]">
              ₹{revenueCount.toLocaleString()}
            </h3>
            <p className="font-dm-sans font-medium text-[13px] text-[#00C853]">↑ +₹8,420 vs yesterday</p>

            <div className="h-[1px] w-full bg-[#252538] my-[16px]" />

            <div className="grid grid-cols-2 gap-y-[16px] gap-x-[12px]">
              <div>
                <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Active Orders</p>
                <div className="font-space-grotesk font-bold text-[26px] text-white">247</div>
                <p className="font-dm-sans text-[11px] text-[#00C853]">↑ +12 live now</p>
              </div>
              <div>
                <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Active Vendors</p>
                <div className="font-space-grotesk font-bold text-[26px] text-white">89</div>
                <p className="font-dm-sans text-[11px] text-[#00C853]">↑ +3 today</p>
              </div>
              <div className="pr-[12px] border-r border-[#252538]">
                <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Total Users</p>
                <div className="font-space-grotesk font-bold text-[26px] text-white">12,847</div>
                <p className="font-dm-sans text-[11px] text-[#6B6B6B]">+284 this week</p>
              </div>
              <div className="pl-[12px]">
                <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Platform GMV</p>
                <div className="font-space-grotesk font-bold text-[26px] text-[#FF6B00]">₹2.4L</div>
                <p className="font-dm-sans text-[11px] text-[#6B6B6B]">This month</p>
              </div>
            </div>
          </div>

          {/* LIVE PLATFORM MAP */}
          <div className="mt-[16px] mx-[16px] h-[220px] rounded-[20px] border-[1.5px] border-[#252538] overflow-hidden relative">
            <StaticMapComponent location={[28.6139, 77.2090]} />
            <div className="absolute top-[12px] left-[12px] bg-white/10 backdrop-blur-md rounded-[8px] px-[10px] py-[6px] shadow-sm z-10 border border-[#252538]">
              <p className="font-dm-sans font-medium text-[11px] text-[#00C853] mb-[2px]">● 89 Open</p>
              <p className="font-dm-sans font-medium text-[11px] text-[#6B6B6B]">● 34 Closed</p>
            </div>
            <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px] z-10">
              <button className="w-[32px] h-[32px] bg-[#13131F] border border-[#252538] rounded-full flex items-center justify-center text-white active:bg-white/10">
                +
              </button>
              <button className="w-[32px] h-[32px] bg-[#13131F] border border-[#252538] rounded-full flex items-center justify-center text-white active:bg-white/10">
                -
              </button>
            </div>
            <button className="absolute bottom-[12px] right-[12px] w-[36px] h-[36px] bg-[#13131F] border border-[#252538] rounded-full flex items-center justify-center text-white active:bg-white/10 z-10">
              ⤢
            </button>
          </div>

          {/* LIVE ORDERS FEED */}
          <div className="mt-[20px]">
            <div className="px-[16px] flex justify-between items-center mb-[12px]">
              <div className="flex items-center">
                <div className="w-[8px] h-[8px] rounded-full bg-[#FF3B30] animate-pulse mr-[6px]" />
                <h3 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">Live Orders</h3>
                <div className="ml-[8px] bg-[#FF3B30] px-[8px] py-[2px] rounded-[12px] min-w-[22px] flex justify-center items-center">
                  <span className="font-space-grotesk font-bold text-[11px] text-white">247 active</span>
                </div>
              </div>
              <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">View All &rarr;</button>
            </div>
            
            <div className="w-full overflow-x-auto no-scrollbar pb-[4px]">
              <div className="flex gap-[12px] px-[16px] w-max">
                {/* Order 1 */}
                <div className="w-[200px] bg-[#13131F] border border-[#252538] rounded-[16px] p-[14px]">
                  <div className="flex justify-between items-center mb-[8px]">
                    <span className="font-jetbrains font-bold text-[13px] text-[#EFEFFF]">#SF2847</span>
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Just now</span>
                  </div>
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] truncate">Sharma Ji Kulfi</p>
                  <div className="mt-[6px] inline-block bg-[#FFB300]/20 px-[8px] py-[2px] rounded-[6px]">
                    <span className="font-dm-sans font-bold text-[11px] text-[#FFB300]">Waiting</span>
                  </div>
                  <div className="mt-[8px]">
                    <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">₹80</span>
                  </div>
                </div>

                {/* Order 2 */}
                <div className="w-[200px] bg-[#13131F] border border-[#252538] rounded-[16px] p-[14px]">
                  <div className="flex justify-between items-center mb-[8px]">
                    <span className="font-jetbrains font-bold text-[13px] text-[#EFEFFF]">#SF2846</span>
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">2 min ago</span>
                  </div>
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] truncate">Ramesh Chaat Corner</p>
                  <div className="mt-[6px] inline-block bg-[#FF6B00]/20 px-[8px] py-[2px] rounded-[6px]">
                    <span className="font-dm-sans font-bold text-[11px] text-[#FF6B00]">Preparing</span>
                  </div>
                  <div className="mt-[8px]">
                    <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">₹120</span>
                  </div>
                </div>
                
                {/* Order 3 */}
                <div className="w-[200px] bg-[#13131F] border border-[#252538] rounded-[16px] p-[14px]">
                  <div className="flex justify-between items-center mb-[8px]">
                    <span className="font-jetbrains font-bold text-[13px] text-[#EFEFFF]">#SF2845</span>
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">5 min ago</span>
                  </div>
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] truncate">Gupta Burgers</p>
                  <div className="mt-[6px] inline-block bg-[#00C853]/20 px-[8px] py-[2px] rounded-[6px]">
                    <span className="font-dm-sans font-bold text-[11px] text-[#00C853]">Ready</span>
                  </div>
                  <div className="mt-[8px]">
                    <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">₹250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PENDING APPROVALS */}
          <div className="mt-[20px]">
            <div className="px-[16px] flex justify-between items-center mb-[12px]">
              <div className="flex items-center">
                <h3 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">⏳ Pending Approvals</h3>
                <div className="ml-[8px] bg-[#FFD600] w-[22px] h-[22px] rounded-full flex justify-center items-center">
                  <span className="font-space-grotesk font-bold text-[11px] text-[#0A0A14]">3</span>
                </div>
              </div>
              <button className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">View All &rarr;</button>
            </div>

            <div className="mx-[16px] bg-[#13131F] border-[1.5px] border-[#FFD600] rounded-[20px] p-[16px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[4px] h-full bg-[#FFD600]" />
              
              <div className="flex pl-[4px]">
                <div className="relative">
                  <div className="w-[44px] h-[44px] bg-[#252538] rounded-[12px] flex shrink-0" />
                  <div className="absolute top-[-4px] left-[-4px] bg-[#1C1C2E] border border-[#FFD600] rounded-[4px] px-[8px] py-[2px]">
                    <span className="font-dm-sans font-bold text-[10px] text-[#FFD600]">New Vendor</span>
                  </div>
                </div>
                
                <div className="ml-[12px] flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">Ramesh Chaat Corner</h4>
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">2 hrs ago</span>
                  </div>
                  <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">📍 Lajpat Nagar, Delhi</p>
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">🍽 Chaat · Gol Gappe · Dahi Puri</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[#252538] my-[12px]" />
              
              <p className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[12px]">1 item added · No photo yet · 0 reviews</p>
              
              <div className="flex justify-between gap-[10px]">
                <button className="flex-1 h-[40px] bg-[#00C853] rounded-[10px] flex items-center justify-center gap-[6px] active:scale-95 transition-transform">
                  <Check size={14} className="text-white" />
                  <span className="font-dm-sans font-bold text-[13px] text-white">Approve</span>
                </button>
                <button className="flex-1 h-[40px] bg-[#1C1C2E] border-[1.5px] border-[#FF3B30] rounded-[10px] flex items-center justify-center gap-[6px] active:scale-95 transition-transform">
                  <X size={14} className="text-[#FF3B30]" />
                  <span className="font-dm-sans font-bold text-[13px] text-[#FF3B30]">Reject</span>
                </button>
                <button className="flex-1 h-[40px] bg-[#1C1C2E] border border-[#252538] rounded-[10px] flex items-center justify-center gap-[6px] active:scale-95 transition-transform">
                  <Eye size={14} className="text-[#6B6B6B]" />
                  <span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Review</span>
                </button>
              </div>
            </div>
          </div>

          {/* REVENUE CHART CARD */}
          <div className="mt-[20px] mx-[16px] bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
            <div className="flex justify-between items-center mb-[16px]">
              <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">💰 Platform Revenue</h3>
              <div className="flex bg-[#1C1C2E] rounded-[8px] p-[2px]">
                <button className="h-[28px] px-[12px] bg-[#FF6B00] rounded-[6px] font-dm-sans font-medium text-[11px] text-white">7D</button>
                <button className="h-[28px] px-[12px] font-dm-sans font-medium text-[11px] text-[#6B6B6B]">30D</button>
                <button className="h-[28px] px-[12px] font-dm-sans font-medium text-[11px] text-[#6B6B6B]">90D</button>
              </div>
            </div>
            <div className="h-[160px] w-full flex items-end justify-between relative pt-[20px]">
              {/* Gridlines */}
              <div className="absolute top-[20px] w-full h-[1px] bg-[#1C1C2E]" />
              <div className="absolute top-[60px] w-full h-[1px] bg-[#1C1C2E]" />
              <div className="absolute top-[100px] w-full h-[1px] bg-[#1C1C2E]" />
              <div className="absolute top-[140px] w-full h-[1px] bg-[#1C1C2E]" />
              
              {/* Bars */}
              {[30, 45, 60, 40, 80, 50, 100].map((height, i) => (
                <div key={i} className="w-1/8 flex flex-col items-center gap-[4px] relative z-10">
                  {i === 6 && (
                    <div className="absolute -top-[24px] flex flex-col items-center">
                      <span className="font-dm-sans font-bold text-[10px] text-[#FF6B00]">₹8.2K</span>
                      <ArrowUpRight size={10} className="text-[#FF6B00]" />
                    </div>
                  )}
                  <div 
                    className="w-[18px] bg-gradient-to-b from-[#FF6B00] to-[#FF4500] rounded-t-[6px] relative overflow-hidden" 
                    style={{ height: `${height}%`, transform: i === 6 ? 'scale(1.05)' : 'none' }}
                  >
                    <div className="absolute bottom-0 w-full bg-white/20" style={{ height: '30%' }} />
                  </div>
                  <span className="font-dm-sans text-[10px] text-[#6B6B6B]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="h-[1px] w-full bg-[#252538] my-[16px]" />
            
            <div className="flex divide-x divide-[#252538]">
              <div className="flex-1 px-[4px]">
                <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Total GMV</p>
                <p className="font-space-grotesk font-bold text-[16px] text-white">₹24,840</p>
              </div>
              <div className="flex-1 px-[16px]">
                <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Platform Revenue</p>
                <p className="font-space-grotesk font-bold text-[16px] text-white">₹1,242</p>
              </div>
              <div className="flex-1 pl-[16px]">
                <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Avg/Day</p>
                <p className="font-space-grotesk font-bold text-[16px] text-white">₹3,548</p>
              </div>
            </div>
          </div>

          {/* PLATFORM METRICS 2x2 GRID */}
          <div className="mt-[16px] px-[16px]">
            <h3 className="font-baloo font-bold text-[18px] text-[#EFEFFF] mb-[12px]">Platform Health</h3>
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
                <Package size={22} className="text-[#00C853] mb-[8px]" />
                <div className="font-space-grotesk font-bold text-[28px] text-[#00C853]">98.2%</div>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] leading-tight">Order Success<br/>Rate</p>
                <p className="font-dm-sans text-[11px] text-[#FF3B30] mt-[8px]">-0.1% vs last month</p>
              </div>
              <div className="bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
                <CheckCircle2 size={22} className="text-[#FFD600] mb-[8px]" />
                <div className="font-space-grotesk font-bold text-[28px] text-[#FFD600]">4.8</div>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] leading-tight">Avg Platform<br/>Rating</p>
                <p className="font-dm-sans text-[11px] text-[#00C853] mt-[8px]">+0.2 vs last month</p>
              </div>
              <div className="bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
                <Clock size={22} className="text-white mb-[8px]" />
                <div className="font-space-grotesk font-bold text-[28px] text-white">4.2 <span className="text-[16px]">min</span></div>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] leading-tight">Avg Order<br/>Prep Time</p>
                <p className="font-dm-sans text-[11px] text-[#00C853] mt-[8px]">-0.8 min (improving ↑)</p>
              </div>
              <div className="bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
                <Users size={22} className="text-white mb-[8px]" />
                <div className="font-space-grotesk font-bold text-[28px] text-white">72%</div>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[4px] leading-tight">User Retention<br/>(30 days)</p>
                <p className="font-dm-sans text-[11px] text-[#00C853] mt-[8px]">+4% vs last month</p>
              </div>
            </div>
          </div>

          {/* TOP VENDORS TODAY */}
          <div className="mt-[16px] mx-[16px] bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
            <div className="flex justify-between items-center mb-[14px]">
              <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">🏆 Top Vendors Today</h3>
              <span className="font-dm-sans text-[12px] text-[#FF6B00]">By revenue</span>
            </div>
            
            <div className="flex flex-col gap-[12px]">
              {[
                { rank: 1, name: "Sharma Ji Kulfi", loc: "Karol Bagh", rev: "₹8,240", progress: 100, color: "#FFD600" },
                { rank: 2, name: "Ramesh Chaat Corner", loc: "Lajpat Nagar", rev: "₹6,120", progress: 75, color: "#EFEFFF" },
                { rank: 3, name: "Gupta Burgers", loc: "South Ex", rev: "₹4,890", progress: 60, color: "#FF6B00" },
                { rank: 4, name: "Momo Hub", loc: "CP", rev: "₹3,450", progress: 40, color: "#6B6B6B" },
                { rank: 5, name: "Lassi Shop", loc: "Chandni Chowk", rev: "₹2,100", progress: 25, color: "#6B6B6B" },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-[12px] hover:bg-[#1C1C2E] p-[4px] rounded-[12px] transition-colors cursor-pointer">
                  <div className="w-[16px] flex justify-center">
                    <span className="font-space-grotesk font-bold text-[16px]" style={{ color: v.color }}>{v.rank}</span>
                  </div>
                  <div className="w-[36px] h-[36px] bg-[#252538] rounded-[8px] shrink-0" />
                  <div className="flex-1">
                    <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] leading-none mb-[4px]">{v.name}</p>
                    <p className="font-dm-sans text-[11px] text-[#6B6B6B] leading-none mb-[6px]">📍 {v.loc}</p>
                    <div className="flex items-center gap-[8px]">
                      <div className="flex-1 h-[4px] bg-[#252538] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFB347]" style={{ width: `${v.progress}%` }} />
                      </div>
                      <span className="font-space-grotesk text-[14px] text-[#FF6B00] leading-none shrink-0">{v.rev}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full text-right mt-[12px] font-dm-sans text-[13px] text-[#FF6B00]">See all vendors &rarr;</button>
          </div>

          {/* RECENT ACTIVITY FEED */}
          <div className="mt-[16px] mx-[16px] bg-[#0D0D14] border border-[#252538] rounded-[20px] p-[18px]">
            <div className="flex justify-between items-center mb-[14px]">
              <h3 className="font-baloo font-semibold text-[17px] text-[#EFEFFF]">📋 Recent Activity</h3>
              <div className="flex items-center gap-[6px]">
                <span className="font-dm-sans font-medium text-[11px] text-[#00C853]">Live</span>
                <div className="w-[6px] h-[6px] rounded-full bg-[#00C853] animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center h-[52px] border-b border-[#1C1C2E]">
                <div className="w-[36px] h-[36px] bg-[#1C2E1C] rounded-full flex items-center justify-center shrink-0">
                  <Store size={18} className="text-[#00C853]" />
                </div>
                <div className="ml-[12px] flex-1">
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">New vendor registered</p>
                  <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Ramesh Chaat · Lajpat Nagar</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B]">2 min ago</p>
                  <button className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">Review &rarr;</button>
                </div>
              </div>
              <div className="flex items-center h-[52px] border-b border-[#1C1C2E]">
                <div className="w-[36px] h-[36px] bg-[#1C1C2E] rounded-full flex items-center justify-center shrink-0">
                  <Package size={18} className="text-[#FF6B00]" />
                </div>
                <div className="ml-[12px] flex-1">
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">New massive order</p>
                  <p className="font-dm-sans text-[12px] text-[#6B6B6B]">₹1,240 at Sharma Ji Kulfi</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B]">5 min ago</p>
                </div>
              </div>
              <div className="flex items-center h-[52px] border-b border-[#1C1C2E]">
                <div className="w-[36px] h-[36px] bg-[#2E2C1C] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[14px]">⭐</span>
                </div>
                <div className="ml-[12px] flex-1">
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">5-star review added</p>
                  <p className="font-dm-sans text-[12px] text-[#6B6B6B]">For Gupta Burgers</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B]">12 min ago</p>
                </div>
              </div>
              <div className="flex items-center h-[52px] border-b border-[#1C1C2E]">
                <div className="w-[36px] h-[36px] bg-[#2E1C1C] rounded-full flex items-center justify-center shrink-0">
                  <XCircle size={18} className="text-[#FF3B30]" />
                </div>
                <div className="ml-[12px] flex-1">
                  <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">Order cancelled</p>
                  <p className="font-dm-sans text-[12px] text-[#6B6B6B]">#SF2834 · Vendor busy</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B]">18 min ago</p>
                </div>
              </div>
            </div>
            
            <button className="w-full text-left mt-[12px] font-dm-sans text-[13px] text-[#FF6B00]">View all activity &rarr;</button>
          </div>

          {/* SYSTEM ALERTS */}
          <div className="mt-[16px] mx-[16px] bg-[#0D0D14] border-[1.5px] border-[#FF9500] rounded-[20px] p-[18px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-[#FF9500]" />
            <div className="flex items-center justify-between mb-[12px] pl-[4px]">
              <div className="flex items-center">
                <AlertTriangle size={18} className="text-[#FF9500] mr-[8px]" />
                <h3 className="font-baloo font-semibold text-[17px] text-[#FF9500]">System Alerts</h3>
              </div>
              <span className="font-dm-sans font-medium text-[12px] text-[#FF9500]">2 alerts</span>
            </div>
            
            <div className="flex flex-col gap-[12px] pl-[4px]">
              <div className="bg-[#1A1409] border border-[#FF9500] rounded-[12px] p-[12px] px-[14px]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-[8px]">
                    <AlertTriangle size={16} className="text-[#FF9500] mt-[2px] shrink-0" />
                    <div>
                      <h4 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">High order volume on server</h4>
                      <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">98% capacity — monitor closely</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-dm-sans text-[11px] text-[#6B6B6B]">5 min ago</span>
                    <button className="font-dm-sans font-medium text-[12px] text-[#6B6B6B] mt-[4px]">Dismiss ✕</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1A0909] border border-[#FF3B30] rounded-[12px] p-[12px] px-[14px]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-[8px]">
                    <ShieldAlert size={16} className="text-[#FF3B30] mt-[2px] shrink-0" />
                    <div>
                      <h4 className="font-dm-sans font-semibold text-[13px] text-[#FF3B30]">Payment Gateway Delayed</h4>
                      <p className="font-dm-sans text-[12px] text-[#FF3B30]/70 mt-[2px]">UPI processing failing randomly</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-dm-sans text-[11px] text-[#FF3B30]/70">12 min ago</span>
                    <button className="font-dm-sans font-medium text-[12px] text-[#FF3B30]/70 mt-[4px]">Dismiss ✕</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS GRID */}
          <div className="mt-[20px] px-[16px]">
            <h3 className="font-baloo font-bold text-[18px] text-[#EFEFFF] mb-[12px]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-[12px]">
              <button onClick={() => router.push('/admin-users')} className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all">
                <Users size={26} className="text-[#00BCD4]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Users</span>
              </button>
              <button onClick={() => router.push('/admin-vendors')} className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all">
                <Store size={26} className="text-[#FF6B00]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Vendors</span>
              </button>
              <button 
                onClick={() => router.push('/admin-analytics')}
                className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all"
              >
                <BarChart3 size={26} className="text-[#FF6B00]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Analytics</span>
              </button>
              <button 
                onClick={() => router.push('/admin-notifications')}
                className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all"
              >
                <Bell size={26} className="text-[#FF9500]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Notify All</span>
              </button>
              <button className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all">
                <Tag size={26} className="text-[#00C853]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Promo Codes</span>
              </button>
              <button className="bg-[#0D0D14] border border-[#252538] rounded-[16px] p-[16px] h-[80px] flex flex-col items-center justify-center gap-[8px] active:scale-95 active:border-[#FF6B00] transition-all">
                <Settings size={26} className="text-[#6B6B6B]" />
                <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">System Settings</span>
              </button>
            </div>
          </div>

          <div className="h-[40px]" />
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="absolute bottom-[0px] w-full h-[64px] pb-[safe-area-inset-bottom] bg-[#050508] border-t border-[#1C1C2E] flex items-center justify-between px-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-[60] shrink-0">
          {[
            { id: 'home', icon: HomeIcon, label: 'Home', badge: null },
            { id: 'users', icon: Users, label: 'Users', badge: null },
            { id: 'vendors', icon: Store, label: 'Vendors', badge: null },
            { id: 'stats', icon: BarChart3, label: 'Stats', badge: null },
            { id: 'alerts', icon: Bell, label: 'Alerts', badge: 4 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'users') router.push('/admin-users');
                  if (tab.id === 'vendors') router.push('/admin-vendors');
                }}
                className="flex flex-col items-center justify-center w-[60px] h-[56px] relative rounded-xl transition-all"
              >
                {isActive && (
                  <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[24px] h-[3px] bg-[#FF6B00] rounded-[2px]" />
                )}
                <div className="relative">
                  <Icon 
                    size={24} 
                    className={`transition-colors ${isActive ? 'text-[#FF6B00] fill-[#FF6B00]' : 'text-[#6B6B6B]'}`} 
                  />
                  {tab.badge && (
                    <div className={`absolute -top-[4px] -right-[4px] w-[14px] h-[14px] bg-[#FF3B30] rounded-full border-2 border-[#050508] flex items-center justify-center ${isActive ? '' : 'animate-pulse'}`}>
                      <span className="font-jetbrains text-[8px] text-white font-bold leading-none">{tab.badge}</span>
                    </div>
                  )}
                </div>
                <span className={`font-dm-sans text-[11px] mt-[4px] transition-colors ${isActive ? 'text-[#FF6B00] font-medium' : 'text-[#6B6B6B]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
