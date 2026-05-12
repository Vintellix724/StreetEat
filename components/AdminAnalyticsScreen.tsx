import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Upload, FileText, FileSpreadsheet, Mail, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- STUB DATA ---
const gmvData = [
  { day: 'Mon', gmv: 42000, rev: 2100 },
  { day: 'Tue', gmv: 38000, rev: 1900 },
  { day: 'Wed', gmv: 45000, rev: 2250 },
  { day: 'Thu', gmv: 52000, rev: 2600 },
  { day: 'Fri', gmv: 61000, rev: 3050 },
  { day: 'Sat', gmv: 68240, rev: 3412 },
  { day: 'Sun', gmv: 59000, rev: 2950 },
];

const hourlyData = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  orders: Math.floor(Math.random() * 100 * (i > 17 && i < 22 ? 3 : 1))
}));

const userGrowthData = [
  { date: 'Apr 24', users: 12100 },
  { date: 'Apr 25', users: 12250 },
  { date: 'Apr 26', users: 12400 },
  { date: 'Apr 27', users: 12550 },
  { date: 'Apr 28', users: 12690 },
  { date: 'Apr 29', users: 12847 },
];

const paymentData = [
  { day: 'Mon', upi: 180, cash: 60, wallet: 20 },
  { day: 'Tue', upi: 190, cash: 55, wallet: 18 },
  { day: 'Wed', upi: 210, cash: 65, wallet: 22 },
  { day: 'Thu', upi: 240, cash: 70, wallet: 30 },
  { day: 'Fri', upi: 280, cash: 85, wallet: 35 },
  { day: 'Sat', upi: 320, cash: 95, wallet: 40 },
];

const PIE_COLORS_ORDER = ['#00C853', '#FF3B30', '#FF9500'];
const orderPieData = [
  { name: 'Completed', value: 2794 },
  { name: 'Cancelled', value: 34 },
  { name: 'Declined', value: 19 },
];

const PIE_COLORS_VENDOR = ['#00C853', '#FFD600', '#FF9500', '#FF3B30'];
const vendorPieData = [
  { name: 'Verified Open', value: 89 },
  { name: 'Verified Closed', value: 18 },
  { name: 'Pending', value: 12 },
  { name: 'Banned', value: 4 },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [showExport, setShowExport] = useState(false);
  const [chartType, setChartType] = useState('Bar');
  const [leaderboardType, setLeaderboardType] = useState('Vendors');
  const [userGrowthToggle, setUserGrowthToggle] = useState('Customers');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col bg-[#050508] min-h-screen text-white font-sans w-full max-w-[390px] mx-auto overflow-hidden relative">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#050508] border-b border-[#1C1C2E] px-[16px] pt-[52px] pb-[12px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <button onClick={() => router.back()} className="text-[#EFEFFF]">
            <ArrowLeft className="w-[24px] h-[24px]" />
          </button>
          <h1 className="font-baloo-2 font-bold text-[18px] text-[#EFEFFF]">Platform Analytics</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-[6px] h-[34px] px-[12px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[10px]"
          >
            <Upload className="w-[14px] h-[14px] text-[#FF6B00]" />
            <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Export</span>
          </button>

          {showExport && (
            <div className="absolute top-[40px] right-0 w-[160px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[12px] shadow-xl p-[8px] z-50">
              <button className="flex items-center gap-[12px] w-full p-[10px] hover:bg-[#1C1C2E] rounded-[8px] text-left">
                <FileText className="w-[16px] h-[16px] text-[#FF6B00]" />
                <span className="font-dm-sans text-[13px]">PDF Report</span>
              </button>
              <button className="flex items-center gap-[12px] w-full p-[10px] hover:bg-[#1C1C2E] rounded-[8px] text-left">
                <FileSpreadsheet className="w-[16px] h-[16px] text-[#FF6B00]" />
                <span className="font-dm-sans text-[13px]">CSV Data</span>
              </button>
              <button className="flex items-center gap-[12px] w-full p-[10px] hover:bg-[#1C1C2E] rounded-[8px] text-left">
                <Mail className="w-[16px] h-[16px] text-[#FF6B00]" />
                <span className="font-dm-sans text-[13px]">Email Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[40px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* TIME RANGE SELECTOR */}
        <div className="mt-[12px] px-[16px]">
          <div className="flex gap-[8px] overflow-x-auto hide-scrollbar pb-[4px]">
            {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month', 'This Year', 'Custom'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`whitespace-nowrap px-[16px] h-[32px] rounded-[20px] flex items-center justify-center border transition-colors ${
                  timeRange === range 
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white font-bold' 
                    : 'bg-[#0D0D14] border-[#1C1C2E] text-[#6B6B6B] font-regular'
                }`}
              >
                <span className="font-dm-sans text-[13px]">{range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* HERO REVENUE CARD */}
        <div className="mt-[14px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#0D0D14] border border-[#252538] rounded-[24px] p-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start">
            <span className="font-dm-sans font-medium text-[11px] text-[#6B6B6B] tracking-[1.5px] uppercase">Platform GMV</span>
            <div className="flex items-center gap-[4px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#00C853] animate-pulse" />
              <span className="font-dm-sans font-medium text-[11px] text-[#00C853]">Live</span>
            </div>
          </div>
          
          <div className="mt-[8px]">
            <span className="font-space-grotesk font-bold text-[48px] text-[#FF6B00] tracking-[-1px]">₹ 3,42,840</span>
          </div>
          
          <div className="mt-[6px] flex items-center gap-[4px] text-[#00C853]">
            <TrendingUp className="w-[14px] h-[14px]" />
            <span className="font-dm-sans font-medium text-[13px]">Platform Revenue (5%): ₹17,142</span>
          </div>
          <p className="font-dm-sans font-medium text-[13px] text-[#00C853]">↑ +₹48,240 vs last week</p>

          <div className="h-[1px] w-full bg-[#252538] my-[16px]" />

          {/* 2x3 Mini Stats Grid */}
          <div className="grid grid-cols-3 gap-y-[16px] gap-x-[12px]">
            {/* Cell 1 */}
            <div className="flex flex-col border-r border-[#252538]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Orders</span>
              <span className="font-space-grotesk font-bold text-[22px] text-white my-[2px]">2,847</span>
              <span className="font-dm-sans text-[11px] text-[#00C853]">↑ +284</span>
            </div>
            {/* Cell 2 */}
            <div className="flex flex-col border-r border-[#252538] pl-[8px]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Vendors</span>
              <span className="font-space-grotesk font-bold text-[22px] text-white my-[2px]">89</span>
              <span className="font-dm-sans text-[11px] text-[#00C853]">↑ +12</span>
            </div>
            {/* Cell 3 */}
            <div className="flex flex-col pl-[8px]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Users</span>
              <span className="font-space-grotesk font-bold text-[22px] text-white my-[2px]">12.8k</span>
              <span className="font-dm-sans text-[11px] text-[#00C853]">↑ +284</span>
            </div>
            {/* Cell 4 */}
            <div className="flex flex-col border-r border-[#252538]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Avg Order</span>
              <span className="font-space-grotesk font-bold text-[22px] text-white my-[2px]">₹120</span>
              <span className="font-dm-sans text-[11px] text-[#00C853]">↑ +₹4</span>
            </div>
            {/* Cell 5 */}
            <div className="flex flex-col border-r border-[#252538] pl-[8px]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Success %</span>
              <span className="font-space-grotesk font-bold text-[22px] text-[#00C853] my-[2px]">98.2%</span>
              <span className="font-dm-sans text-[11px] text-[#FF3B30]">-0.1%</span>
            </div>
            {/* Cell 6 */}
            <div className="flex flex-col pl-[8px]">
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Avg Rating</span>
              <div className="flex items-center my-[2px]">
                 <span className="text-[16px] mr-[4px]">⭐</span>
                 <span className="font-space-grotesk font-bold text-[22px] text-[#FFD600]">4.8</span>
              </div>
              <span className="font-dm-sans text-[11px] text-[#00C853]">+0.2</span>
            </div>
          </div>
        </div>

        {/* GMV CHART CARD */}
        <div className="mt-[16px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">💰 GMV & Revenue</h2>
            <div className="flex items-center bg-[#1C1C2E] rounded-[8px] p-[2px]">
              <button 
                onClick={() => setChartType('Bar')}
                className={`flex-1 h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${chartType === 'Bar' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Bar
              </button>
              <button 
                onClick={() => setChartType('Line')}
                className={`flex-1 h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${chartType === 'Line' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Line
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[12px] mt-[12px]">
            <div className="flex items-center gap-[4px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#FF6B00]" />
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">GMV</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#00C853]" />
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Revenue</span>
            </div>
          </div>

          <div className="h-[180px] mt-[16px] -ml-[20px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'Bar' ? (
                <BarChart data={gmvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C1C2E" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} width={50} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#1C1C2E', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', color: '#000', padding: '8px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '4px' }}
                  />
                  <Bar dataKey="gmv" fill="url(#gmvGradient)" radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="rev" fill="url(#revGradient)" radius={[4, 4, 0, 0]} barSize={8} />
                  <defs>
                    <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="#FF4500" />
                    </linearGradient>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C853" />
                      <stop offset="100%" stopColor="#009624" />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : (
                <LineChart data={gmvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C1C2E" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} width={50} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', color: '#000' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="gmv" stroke="#FF6B00" strokeWidth={2.5} dot={{ r: 4, fill: '#FF6B00', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="rev" stroke="#00C853" strokeWidth={2.5} dot={{ r: 4, fill: '#00C853', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#1C1C2E]">
             <div className="flex flex-col text-center w-1/3">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Total GMV</span>
               <span className="font-space-grotesk font-bold text-[16px] text-[#FF6B00]">₹3.42L</span>
             </div>
             <div className="w-[1px] h-[30px] bg-[#1C1C2E]" />
             <div className="flex flex-col text-center w-1/3">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Platform Rev</span>
               <span className="font-space-grotesk font-bold text-[16px] text-[#00C853]">₹17.1k</span>
             </div>
             <div className="w-[1px] h-[30px] bg-[#1C1C2E]" />
             <div className="flex flex-col text-center w-1/3">
               <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Avg/Day</span>
               <span className="font-space-grotesk font-bold text-[16px] text-white">₹48k</span>
             </div>
          </div>
        </div>

        {/* ORDERS ANALYTICS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">📦 Order Analytics</h2>
            <span className="font-dm-sans text-[13px] text-[#6B6B6B]">2,847 total</span>
          </div>

          <div className="flex gap-[12px] mt-[14px]">
            {/* Left Card: Donut */}
            <div className="flex-1 bg-[#13131F] rounded-[14px] p-[14px] flex flex-col items-center">
              <div className="w-[120px] h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                      {orderPieData.map((_, i) => <Cell key={`c-${i}`} fill={PIE_COLORS_ORDER[i % PIE_COLORS_ORDER.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-space-grotesk font-bold text-[24px] text-[#00C853]">98.2%</span>
                  <span className="font-dm-sans text-[10px] text-[#6B6B6B]">completion</span>
                </div>
              </div>
              <div className="mt-[12px] w-full">
                {orderPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-[6px] mb-[4px]">
                    <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: PIE_COLORS_ORDER[i] }} />
                    <span className="font-dm-sans text-[11px] text-[#EFEFFF] flex-1">{d.name}</span>
                    <span className="font-dm-sans font-medium text-[11px] text-[#6B6B6B]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Sparkline + Stats */}
            <div className="flex-1 bg-[#13131F] rounded-[14px] p-[14px] flex flex-col justify-between">
               <div className="h-[60px] w-full -ml-[10px] -mt-[10px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={hourlyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#00C853" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="orders" stroke="#00C853" fillOpacity={1} fill="url(#colorOrders)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-[8px]">
                 <span className="font-space-grotesk font-bold text-[22px] text-white">2,847</span>
                 <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Total Orders</p>
               </div>
               <div className="mt-[10px]">
                 <span className="font-space-grotesk font-bold text-[18px] text-[#FF6B00]">₹120 avg</span>
                 <p className="font-dm-sans text-[11px] text-[#6B6B6B]">Avg Order Value</p>
               </div>
            </div>
          </div>

          <div className="mt-[16px]">
            <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[12px]">Orders by Hour</h3>
            <div className="h-[60px] -ml-[25px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                   <Bar dataKey="orders" radius={[2, 2, 0, 0]}>
                     {hourlyData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={(index >= 18 && index <= 21) ? '#FF6B00' : '#1C1C2E'} />
                     ))}
                   </Bar>
                   <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} interval={5} dy={5} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-[12px] bg-[#1C1C2E] rounded-[8px] p-[8px] inline-flex">
               <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">🔥 Peak: 6–9 PM · 847 orders/hr</span>
            </div>
          </div>
        </div>

        {/* USER GROWTH CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">👥 User Growth</h2>
            <div className="flex items-center bg-[#1C1C2E] rounded-[8px] p-[2px]">
              <button 
                onClick={() => setUserGrowthToggle('Customers')}
                className={`h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${userGrowthToggle === 'Customers' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Customers
              </button>
              <button 
                onClick={() => setUserGrowthToggle('Vendors')}
                className={`h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${userGrowthToggle === 'Vendors' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Vendors
              </button>
            </div>
          </div>

          <div className="h-[160px] mt-[14px] -ml-[25px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={userGrowthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C1C2E" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} width={50} domain={['dataMin', 'dataMax']} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', color: '#000' }}
                   itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                 />
                 <defs>
                   <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={userGrowthToggle === 'Customers' ? "#00BCD4" : "#FF6B00"} stopOpacity={0.15}/>
                     <stop offset="95%" stopColor={userGrowthToggle === 'Customers' ? "#00BCD4" : "#FF6B00"} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area 
                   type="monotone" 
                   dataKey={userGrowthToggle === 'Customers' ? 'users' : 'vendors'} 
                   stroke={userGrowthToggle === 'Customers' ? "#00BCD4" : "#FF6B00"} 
                   strokeWidth={2.5} 
                   fillOpacity={1} 
                   fill="url(#colorUsers)" 
                   dot={{ r: 4, fill: userGrowthToggle === 'Customers' ? "#00BCD4" : "#FF6B00", strokeWidth: 0 }} 
                   activeDot={{ r: 6 }} 
                 />
               </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Metrics */}
          <div className="flex gap-[8px] mt-[14px]">
            <div className="flex-1 bg-[#13131F] rounded-[12px] p-[12px] border border-[#252538] text-center">
               <span className="font-space-grotesk font-bold text-[18px] text-white">1,247</span>
               <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Daily Active</p>
            </div>
            <div className="flex-1 bg-[#13131F] rounded-[12px] p-[12px] border border-[#252538] text-center">
               <span className="font-space-grotesk font-bold text-[18px] text-white">8,420</span>
               <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Weekly Active</p>
            </div>
            <div className="flex-1 bg-[#13131F] rounded-[12px] p-[12px] border border-[#252538] text-center">
               <span className="font-space-grotesk font-bold text-[18px] text-white">12.8k</span>
               <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Monthly Active</p>
            </div>
          </div>

          {/* Retention Row */}
          <div className="mt-[16px]">
            <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[12px]">User Retention</h3>
            <div className="flex flex-col gap-[8px]">
              {/* Day 1 */}
              <div className="flex items-center gap-[12px]">
                 <span className="w-[40px] font-dm-sans text-[11px] text-[#6B6B6B]">Day 1</span>
                 <div className="flex-1 h-[6px] bg-[#252538] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7]" style={{ width: '78%' }} />
                 </div>
                 <span className="w-[30px] text-right font-dm-sans text-[11px] text-[#6B6B6B]">78%</span>
              </div>
              {/* Day 7 */}
              <div className="flex items-center gap-[12px]">
                 <span className="w-[40px] font-dm-sans text-[11px] text-[#6B6B6B]">Day 7</span>
                 <div className="flex-1 h-[6px] bg-[#252538] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7]" style={{ width: '62%' }} />
                 </div>
                 <span className="w-[30px] text-right font-dm-sans text-[11px] text-[#6B6B6B]">62%</span>
              </div>
              {/* Day 30 */}
              <div className="flex items-center gap-[12px]">
                 <span className="w-[40px] font-dm-sans text-[11px] text-[#6B6B6B]">Day 30</span>
                 <div className="flex-1 h-[6px] bg-[#252538] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7]" style={{ width: '54%' }} />
                 </div>
                 <span className="w-[30px] text-right font-dm-sans text-[11px] text-[#6B6B6B]">54%</span>
              </div>
            </div>
          </div>
        </div>

        {/* VENDOR ANALYTICS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">🏪 Vendor Analytics</h2>

          <div className="flex flex-col items-center mt-[14px]">
             <div className="w-[140px] h-[140px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={vendorPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                     {vendorPieData.map((_, i) => <Cell key={`c-${i}`} fill={PIE_COLORS_VENDOR[i % PIE_COLORS_VENDOR.length]} />)}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="font-space-grotesk font-bold text-[28px] text-white">123</span>
                 <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Vendors</span>
               </div>
             </div>
             
             {/* Legend */}
             <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px] mt-[16px] w-full px-[10px]">
                <div className="flex items-center gap-[6px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#00C853]" />
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B] flex-1">Verified Open</span>
                  <span className="font-space-grotesk font-medium text-[13px] text-white">89 (72%)</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#FFD600]" />
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B] flex-1">V. Closed</span>
                  <span className="font-space-grotesk font-medium text-[13px] text-white">18 (15%)</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#FF9500]" />
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B] flex-1">Pending</span>
                  <span className="font-space-grotesk font-medium text-[13px] text-white">12 (10%)</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#FF3B30]" />
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B] flex-1">Banned</span>
                  <span className="font-space-grotesk font-medium text-[13px] text-white">4 (3%)</span>
                </div>
             </div>
          </div>

          <div className="mt-[20px] pt-[16px] border-t border-[#1C1C2E]">
            <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[10px]">Top Categories by Revenue</h3>
            <div className="flex flex-col gap-[12px]">
              {/* Category 1 */}
              <div>
                <div className="flex justify-between items-center mb-[4px]">
                  <span className="font-dm-sans font-semibold text-[13px] text-white">🍦 Kulfi</span>
                  <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹1,24,240</span>
                </div>
                <div className="flex items-center gap-[8px]">
                   <div className="flex-1 h-[4px] bg-[#252538] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFB347]" style={{ width: '82%' }} />
                   </div>
                   <span className="font-dm-sans text-[10px] text-[#6B6B6B]">82%</span>
                </div>
              </div>
              {/* Category 2 */}
              <div>
                <div className="flex justify-between items-center mb-[4px]">
                  <span className="font-dm-sans font-semibold text-[13px] text-white">🫔 Rolls</span>
                  <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹84,120</span>
                </div>
                <div className="flex items-center gap-[8px]">
                   <div className="flex-1 h-[4px] bg-[#252538] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFB347]" style={{ width: '64%' }} />
                   </div>
                   <span className="font-dm-sans text-[10px] text-[#6B6B6B]">64%</span>
                </div>
              </div>
              {/* Category 3 */}
              <div>
                <div className="flex justify-between items-center mb-[4px]">
                  <span className="font-dm-sans font-semibold text-[13px] text-white">🍔 Burgers</span>
                  <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹62,400</span>
                </div>
                <div className="flex items-center gap-[8px]">
                   <div className="flex-1 h-[4px] bg-[#252538] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFB347]" style={{ width: '45%' }} />
                   </div>
                   <span className="font-dm-sans text-[10px] text-[#6B6B6B]">45%</span>
                </div>
              </div>
              <button className="text-left mt-[4px]">
                <span className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">See all <span className="ml-[2px] leading-none">→</span></span>
              </button>
            </div>
          </div>
        </div>

        {/* GEOGRAPHIC HEATMAP CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
           <div className="flex justify-between items-center">
             <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">🗺 Geographic Activity</h2>
             <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Delhi NCR</span>
           </div>

           {/* Placeholder Map Card */}
           <div className="h-[200px] bg-[#13131F] border border-[#252538] rounded-[14px] mt-[14px] relative overflow-hidden flex items-center justify-center">
              {/* Fake heatmap blobs using divs */}
              <div className="absolute w-[80px] h-[80px] bg-[#FF6B00] opacity-30 blur-[20px] rounded-full top-[40%] left-[30%]" />
              <div className="absolute w-[60px] h-[60px] bg-[#FF4500] opacity-40 blur-[15px] rounded-full top-[45%] left-[60%]" />
              <div className="absolute w-[100px] h-[100px] bg-[#00C853] opacity-20 blur-[25px] rounded-full top-[20%] left-[50%]" />
              
              <div className="absolute top-[40%] left-[25%] bg-white rounded-full px-[8px] py-[2px] shadow-sm transform -translate-x-1/2 -translate-y-1/2"><span className="font-dm-sans font-medium text-[10px] text-[#1A1A1A]">Karol Bagh</span></div>
              <div className="absolute top-[50%] left-[65%] bg-white rounded-full px-[8px] py-[2px] shadow-sm transform -translate-x-1/2 -translate-y-1/2"><span className="font-dm-sans font-medium text-[10px] text-[#1A1A1A]">Lajpat Nagar</span></div>
              <div className="absolute top-[25%] left-[50%] bg-white rounded-full px-[8px] py-[2px] shadow-sm transform -translate-x-1/2 -translate-y-1/2"><span className="font-dm-sans font-medium text-[10px] text-[#1A1A1A]">CP</span></div>

              <div className="absolute top-[8px] right-[8px] w-[32px] h-[32px] bg-[#0D0D14] rounded-full flex items-center justify-center">
                <span className="text-white text-[14px]">⤢</span>
              </div>
           </div>

           <div className="mt-[14px]">
             <div className="flex font-dm-sans text-[11px] text-[#6B6B6B] pb-[8px] border-b border-[#1C1C2E]">
                <div className="flex-1">Area</div>
                <div className="w-[60px] text-right">Orders</div>
                <div className="w-[80px] text-right">Revenue</div>
             </div>
             <div className="flex font-dm-sans items-center py-[8px] border-b border-[#1C1C2E]">
                <div className="flex-1 font-semibold text-[13px] text-white">Karol Bagh</div>
                <div className="w-[60px] text-right font-space-grotesk font-bold text-[13px] text-white">847</div>
                <div className="w-[80px] text-right font-space-grotesk font-bold text-[13px] text-[#FF6B00]">₹68,240</div>
             </div>
             <div className="flex font-dm-sans items-center py-[8px] border-b border-[#1C1C2E] bg-[#13131F] px-[4px] -mx-[4px] rounded-[4px]">
                <div className="flex-1 font-semibold text-[13px] text-white">Lajpat Nagar</div>
                <div className="w-[60px] text-right font-space-grotesk font-bold text-[13px] text-white">623</div>
                <div className="w-[80px] text-right font-space-grotesk font-bold text-[13px] text-[#FF6B00]">₹48,120</div>
             </div>
             <div className="flex font-dm-sans items-center py-[8px] border-b border-[#1C1C2E]">
                <div className="flex-1 font-semibold text-[13px] text-white">Connaught Place</div>
                <div className="w-[60px] text-right font-space-grotesk font-bold text-[13px] text-white">412</div>
                <div className="w-[80px] text-right font-space-grotesk font-bold text-[13px] text-[#FF6B00]">₹36,840</div>
             </div>
             <div className="flex font-dm-sans items-center py-[8px] border-b border-[#1C1C2E] bg-[#13131F] px-[4px] -mx-[4px] rounded-[4px]">
                <div className="flex-1 font-semibold text-[13px] text-white">Saket</div>
                <div className="w-[60px] text-right font-space-grotesk font-bold text-[13px] text-white">287</div>
                <div className="w-[80px] text-right font-space-grotesk font-bold text-[13px] text-[#FF6B00]">₹24,200</div>
             </div>
           </div>
        </div>

        {/* PAYMENT ANALYTICS CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">💳 Payment Analytics</h2>

          <div className="mt-[14px]">
            <div className="w-full h-[20px] rounded-[10px] overflow-hidden flex">
               <div className="h-full bg-[#00BCD4]" style={{ width: '65%' }} />
               <div className="h-full bg-[#FFD600]" style={{ width: '25%' }} />
               <div className="h-full bg-[#9C27B0]" style={{ width: '10%' }} />
            </div>
            
            <div className="grid grid-cols-3 gap-[8px] mt-[10px]">
               <div>
                  <div className="flex items-center gap-[4px] mb-[2px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#00BCD4]" />
                    <span className="font-dm-sans text-[12px] text-[#EFEFFF]">UPI</span>
                  </div>
                  <span className="font-space-grotesk font-bold text-[13px] text-white block">65% · ₹2.2L</span>
               </div>
               <div>
                  <div className="flex items-center gap-[4px] mb-[2px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#FFD600]" />
                    <span className="font-dm-sans text-[12px] text-[#EFEFFF]">Cash</span>
                  </div>
                  <span className="font-space-grotesk font-bold text-[13px] text-white block">25% · ₹87K</span>
               </div>
               <div>
                  <div className="flex items-center gap-[4px] mb-[2px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#9C27B0]" />
                    <span className="font-dm-sans text-[12px] text-[#EFEFFF]">Wallet</span>
                  </div>
                  <span className="font-space-grotesk font-bold text-[13px] text-white block">10% · ₹34K</span>
               </div>
            </div>
          </div>

          <div className="mt-[14px]">
            <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[8px]">Daily Transactions</h3>
            <div className="h-[80px] -ml-[25px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={paymentData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} dy={5} />
                   <YAxis axisLine={false} tickLine={false} tick={false} width={0} />
                   <Line type="monotone" dataKey="upi" stroke="#00BCD4" strokeWidth={2} dot={false} />
                   <Line type="monotone" dataKey="cash" stroke="#FFD600" strokeWidth={2} dot={false} />
                   <Line type="monotone" dataKey="wallet" stroke="#9C27B0" strokeWidth={2} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-[8px]">
             <span className="font-space-grotesk font-bold text-[16px] text-white">Total Transactions: 2,847</span>
             <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Avg Transaction: ₹120</p>
          </div>

          <div className="mt-[12px] bg-[#1F0A0A] border border-[#FF3B30] rounded-[10px] p-[10px] flex justify-between items-center">
             <div>
               <span className="font-dm-sans font-semibold text-[13px] text-[#FF3B30] block">⚠ 34 failed transactions (1.2%)</span>
               <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px] block">Mostly UPI timeouts · ₹2,840 affected</span>
             </div>
             <button className="font-dm-sans text-[13px] text-[#FF3B30] shrink-0 ml-[8px]">Details <span className="ml-[2px] leading-none">→</span></button>
          </div>
        </div>

        {/* PLATFORM PERFORMANCE CARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">⚡ Platform Performance</h2>

          <div className="flex flex-col gap-[12px] mt-[14px]">
             {/* Row 1 */}
             <div>
               <div className="flex justify-between items-center">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Avg Acceptance Time</span>
                 <span className="font-space-grotesk font-bold text-[18px] text-[#00C853]">1m 42s</span>
               </div>
               <div className="w-full h-[4px] bg-[#252538] rounded-full overflow-hidden mt-[4px] mb-[4px]">
                  <div className="h-full bg-[#00C853]" style={{ width: '78%' }} />
               </div>
               <span className="font-dm-sans text-[11px] text-[#00C853]">↑ 18s faster than last week</span>
             </div>
             <div className="w-full h-[1px] bg-[#1C1C2E]" />
             
             {/* Row 2 */}
             <div>
               <div className="flex justify-between items-center mb-[2px]">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Avg Preparation Time</span>
                 <span className="font-space-grotesk font-bold text-[18px] text-[#FFD600]">4m 12s</span>
               </div>
               <span className="font-dm-sans text-[11px] text-[#6B6B6B]">─ Same as last week</span>
             </div>
             <div className="w-full h-[1px] bg-[#1C1C2E]" />

             {/* Row 3 */}
             <div>
               <div className="flex justify-between items-center mb-[2px]">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Auto-Decline Rate</span>
                 <span className="font-space-grotesk font-bold text-[18px] text-[#FF9500]">2.1%</span>
               </div>
               <span className="font-dm-sans text-[11px] text-[#00C853]">↓ 0.4% vs last week (improving)</span>
             </div>
             <div className="w-full h-[1px] bg-[#1C1C2E]" />

             {/* Row 4 */}
             <div>
               <div className="flex justify-between items-center mb-[2px]">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Orders with Reviews</span>
                 <span className="font-space-grotesk font-bold text-[18px] text-[#EFEFFF]">34%</span>
               </div>
               <span className="font-dm-sans text-[11px] text-[#00C853]">↑ +4% vs last month</span>
             </div>
             <div className="w-full h-[1px] bg-[#1C1C2E]" />

             {/* Row 5 */}
             <div>
               <div className="flex justify-between items-center mb-[2px]">
                 <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Repeat Orders</span>
                 <span className="font-space-grotesk font-bold text-[18px] text-[#00C853]">68%</span>
               </div>
               <span className="font-dm-sans text-[11px] text-[#6B6B6B]">68% customers ordered 2+ times</span>
             </div>
          </div>
        </div>

        {/* TOP PERFORMERS LEADERBOARD */}
        <div className="mt-[14px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[20px] p-[18px]">
          <div className="flex items-center justify-between mb-[14px]">
            <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">🏆 Top Performers</h2>
            <div className="flex items-center bg-[#1C1C2E] rounded-[8px] p-[2px]">
              <button 
                onClick={() => setLeaderboardType('Vendors')}
                className={`h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${leaderboardType === 'Vendors' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Vendors
              </button>
              <button 
                onClick={() => setLeaderboardType('Customers')}
                className={`h-[24px] px-[10px] rounded-[6px] font-dm-sans text-[12px] font-medium transition-colors ${leaderboardType === 'Customers' ? 'bg-[#FF6B00] text-white shadow' : 'text-[#6B6B6B]'}`}
              >
                Customers
              </button>
            </div>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center mb-[20px] pt-[20px]">
             {/* 2nd Place */}
             <div className="flex flex-col items-center">
                <div className="relative mb-[8px]">
                   <div className="w-[44px] h-[44px] rounded-[12px] border-[3px] border-[#EFEFFF] bg-[#252538] overflow-hidden">
                     {/* placeholder photo */}
                   </div>
                   <span className="absolute -top-[10px] -right-[10px] text-[18px]">🥈</span>
                </div>
                <span className="font-space-grotesk font-bold text-[14px] text-[#EFEFFF] mb-[4px]">₹98k</span>
                <div className="w-[60px] h-[80px] bg-gradient-to-t from-[#EFEFFF]/15 to-transparent rounded-t-[8px]" />
             </div>
             
             {/* 1st Place */}
             <div className="flex flex-col items-center mx-[10px]">
                <div className="relative mb-[8px]">
                   <div className="w-[52px] h-[52px] rounded-[14px] border-[3px] border-[#FFD600] bg-[#252538] overflow-hidden">
                     {/* placeholder photo */}
                   </div>
                   <span className="absolute -top-[12px] -right-[12px] text-[20px]">🥇</span>
                </div>
                <span className="font-dm-sans font-semibold text-[13px] text-white">Raju Chaat</span>
                <span className="font-space-grotesk font-bold text-[16px] text-[#FFD600] mb-[4px]">₹1.24L</span>
                <div className="w-[70px] h-[100px] bg-gradient-to-t from-[#FFD600]/30 to-transparent rounded-t-[8px]" />
             </div>

             {/* 3rd Place */}
             <div className="flex flex-col items-center">
                <div className="relative mb-[8px]">
                   <div className="w-[40px] h-[40px] rounded-[10px] border-[3px] border-[#FF6B00] bg-[#252538] overflow-hidden">
                     {/* placeholder photo */}
                   </div>
                   <span className="absolute -top-[8px] -right-[8px] text-[16px]">🥉</span>
                </div>
                <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00] mb-[4px]">₹84k</span>
                <div className="w-[60px] h-[60px] bg-gradient-to-t from-[#FF6B00]/20 to-transparent rounded-t-[8px]" />
             </div>
          </div>

          {/* List 4-10 */}
          <div className="flex flex-col gap-[10px]">
             {/* Row 4 */}
             <div className="flex items-center gap-[10px]">
                <span className="font-space-grotesk font-bold text-[14px] text-[#6B6B6B] w-[14px]">4</span>
                <div className="w-[32px] h-[32px] bg-[#252538] rounded-[8px]" />
                <span className="font-dm-sans text-[13px] text-white flex-1 truncate">Sharma Ji Kulfi</span>
                <div className="flex items-center gap-[8px] min-w-[100px] justify-end">
                   <div className="flex-1 max-w-[40px] h-[3px] bg-[#252538] rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-[#FF6B00]" style={{ width: '80%' }} />
                   </div>
                   <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹72,840</span>
                </div>
             </div>
             {/* Row 5 */}
             <div className="flex items-center gap-[10px]">
                <span className="font-space-grotesk font-bold text-[14px] text-[#6B6B6B] w-[14px]">5</span>
                <div className="w-[32px] h-[32px] bg-[#252538] rounded-[8px]" />
                <span className="font-dm-sans text-[13px] text-white flex-1 truncate">Delhi Paratha</span>
                <div className="flex items-center gap-[8px] min-w-[100px] justify-end">
                   <div className="flex-1 max-w-[40px] h-[3px] bg-[#252538] rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-[#FF6B00]" style={{ width: '60%' }} />
                   </div>
                   <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹54,200</span>
                </div>
             </div>
             {/* Row 6 */}
             <div className="flex items-center gap-[10px]">
                <span className="font-space-grotesk font-bold text-[14px] text-[#6B6B6B] w-[14px]">6</span>
                <div className="w-[32px] h-[32px] bg-[#252538] rounded-[8px]" />
                <span className="font-dm-sans text-[13px] text-white flex-1 truncate">Momo Hub</span>
                <div className="flex items-center gap-[8px] min-w-[100px] justify-end">
                   <div className="flex-1 max-w-[40px] h-[3px] bg-[#252538] rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-[#FF6B00]" style={{ width: '50%' }} />
                   </div>
                   <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00]">₹42,100</span>
                </div>
             </div>
          </div>
        </div>

        {/* AUTOMATED INSIGHTS CARD */}
        <div className="mt-[14px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#0D0D14] border border-[#FF6B00] rounded-[20px] p-[18px] mb-[40px]">
          <div className="flex items-center justify-between mb-[14px]">
             <h2 className="font-baloo-2 font-semibold text-[17px] text-[#EFEFFF]">✨ AI Insights</h2>
             <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Auto-generated</span>
          </div>

          <div className="flex flex-col gap-[10px]">
             {/* Insight 1: Positive */}
             <div className="bg-[#0A1F0F] border border-[#00C853] rounded-[12px] p-[12px] pl-[16px] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00C853]" />
                <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[4px]">📈 Revenue 28% up this week</h3>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Kulfi vendors are driving growth. Consider onboarding more in South Delhi.</p>
             </div>

             {/* Insight 2: Warning */}
             <div className="bg-[#1F1A09] border border-[#FFD600] rounded-[12px] p-[12px] pl-[16px] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FFD600]" />
                <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[4px]">⚠ 8 vendors idle for 3+ days</h3>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[6px]">Send re-engagement push to inactive vendors.</p>
                <button className="font-dm-sans font-medium text-[12px] text-[#FFD600]">Take Action <span className="ml-[2px] leading-none">→</span></button>
             </div>

             {/* Insight 3: Opportunity */}
             <div className="bg-[#0A0A1F] border border-[#00BCD4] rounded-[12px] p-[12px] pl-[16px] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00BCD4]" />
                <h3 className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF] mb-[4px]">💡 Sunday evenings underserved</h3>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Only 12 vendors open Sunday 7-10PM. High customer demand, low supply.</p>
             </div>

             {/* Insight 4: Alert */}
             <div className="bg-[#1F0A0A] border border-[#FF3B30] rounded-[12px] p-[12px] relative">
                <h3 className="font-dm-sans font-semibold text-[13px] text-[#FF3B30] mb-[4px]">🚨 Cancellation spike: Sector 14</h3>
                <p className="font-dm-sans text-[12px] text-[#6B6B6B] mb-[6px]">34% cancellation rate — 3x normal. Investigate vendors in this area.</p>
                <button className="font-dm-sans font-medium text-[12px] text-[#FF3B30]">Investigate <span className="ml-[2px] leading-none">→</span></button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
