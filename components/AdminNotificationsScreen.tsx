import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, Trash2, Megaphone, ChevronDown, ChevronUp, 
  Store, Package, AlertTriangle, Flag, AlertCircle, CreditCard, 
  Clock, Bell, CheckCircle, Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- STUB DATA ---
const STUB_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'new_vendor',
    title: 'New Vendor Registration',
    detail: 'Ramesh Chaat Corner — Lajpat Nagar',
    subdetail: '3 items added · Awaiting approval',
    time: '2m ago',
    isRead: false,
    dateGroup: 'Today'
  },
  {
    id: 'n2',
    type: 'system_alert',
    title: 'System Alert',
    detail: 'High server load detected (94%)',
    subdetail: 'Response times degraded · Monitor closely',
    time: '5m ago',
    isRead: false,
    dateGroup: 'Today'
  },
  {
    id: 'n3',
    type: 'user_report',
    title: 'User Report',
    detail: 'Rahul K. reported Sharma Ji Kulfi',
    subdetail: 'Reason: Wrong item delivered',
    time: '1h ago',
    isRead: false,
    dateGroup: 'Today'
  },
  {
    id: 'n4',
    type: 'broadcast_sent',
    title: 'Broadcast Sent',
    detail: 'Festival Offer: 20% off! 🎊',
    subdetail: 'Aaj Eid hai! Sabke liye 20% off sab orders par. Code: EID20',
    time: '2h ago',
    isRead: true,
    stats: { sent: 12847, delivered: 11203, opened: 4847 },
    dateGroup: 'Today'
  },
  {
    id: 'n5',
    type: 'payment_failed',
    title: 'Payment Gateway Issue',
    detail: 'UPI timeouts increasing',
    subdetail: '34 failed transactions in last hour',
    time: 'Yesterday',
    isRead: true,
    dateGroup: 'Yesterday'
  }
];

const SCHEDULED_NOTIFICATIONS = [
  {
    id: 's1',
    title: 'Festival Offer',
    time: 'Sends 5 May · 6:00 PM',
    preview: '20% off for Eid celebration...',
    audience: '→ All Users · 12,847'
  }
];

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [composeExpanded, setComposeExpanded] = useState(true);
  const [audience, setAudience] = useState('All Users');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [schedule, setSchedule] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All (24)');
  const [notifications, setNotifications] = useState(STUB_NOTIFICATIONS);
  const [showDetailSheet, setShowDetailSheet] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const audiences = ['All Users', 'Customers Only', 'Vendors Only', 'Active Vendors', 'Pending Vendors', 'Delhi Only', 'Custom Segment'];
  const filters = ['All (24)', `🔴 Unread (${unreadCount})`, '📣 Broadcasts (8)', '🏪 Vendor Alerts (6)', '👤 User Reports (4)', '⚠ System (3)', '✅ Read (20)'];

  const templates = [
    { label: '🎉 New Feature', title: 'Nayi feature aa gayi! 🎉', msg: 'StreetEats mein aaj se nayi feature available hai. Try karo!' },
    { label: '🏷️ Promo Offer', title: 'Special Promo! 🏷️', msg: 'Use code PROMO20 for 20% off.' },
    { label: '⚠ Policy Update', title: 'Important Policy Update ⚠', msg: 'Please review the latest changes to our terms.' }
  ];

  return (
    <div className="flex flex-col bg-[#050508] min-h-screen text-white font-sans w-full max-w-[390px] mx-auto overflow-hidden relative">
      
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 z-50 bg-[#050508] border-b border-[#1C1C2E] px-[16px] pt-[52px] pb-[12px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <button onClick={() => router.back()} className="text-[#EFEFFF]">
            <ArrowLeft className="w-[24px] h-[24px]" />
          </button>
          <div className="flex items-center gap-[8px]">
            <h1 className="font-baloo-2 font-bold text-[18px] text-[#EFEFFF]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-[#FF3B30] text-white font-dm-sans font-bold text-[11px] px-[8px] py-[2px] rounded-[10px]">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-[10px]">
          <button onClick={handleMarkAllRead} className="flex items-center gap-[4px] font-dm-sans font-medium text-[12px] text-[#FF6B00]">
            <Check className="w-[14px] h-[14px]" /> Mark All Read
          </button>
          <button onClick={handleClearAll} className="flex items-center gap-[4px] font-dm-sans font-medium text-[12px] text-[#6B6B6B]">
            <Trash2 className="w-[14px] h-[14px]" /> Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[40px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* BROADCAST COMPOSE CARD */}
        <div className="mt-[12px] mx-[16px] bg-gradient-to-br from-[#1C1C2E] to-[#0D0D14] border-[1.5px] border-[#FF6B00] rounded-[20px] p-[16px] shadow-[0_4px_20px_rgba(255,107,0,0.15)] transition-all overflow-hidden duration-300">
           <div className="flex items-center justify-between" onClick={() => setComposeExpanded(!composeExpanded)}>
             <div className="flex items-center gap-[8px]">
               <Megaphone className="w-[20px] h-[20px] text-[#FF6B00]" />
               <h2 className="font-baloo-2 font-semibold text-[16px] text-[#EFEFFF]">Broadcast Message</h2>
             </div>
             <button className="text-[#FF6B00]">
               {composeExpanded ? <ChevronUp className="w-[16px] h-[16px]" /> : <ChevronDown className="w-[16px] h-[16px]" />}
             </button>
           </div>

           {composeExpanded && (
             <div className="mt-[14px] animate-fade-in">
                {/* Target Audience */}
                <div>
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Kisko bhejein?</label>
                   <div className="flex gap-[8px] overflow-x-auto hide-scrollbar mt-[8px] pb-[4px]">
                      {audiences.map(a => (
                        <button 
                          key={a}
                          onClick={() => setAudience(a)}
                          className={`whitespace-nowrap h-[30px] px-[12px] rounded-[20px] font-dm-sans text-[12px] border transition-colors ${audience === a ? 'bg-[#FF6B00] border-[#FF6B00] text-white font-bold' : 'bg-[#13131F] border-[#252538] text-[#6B6B6B]'}`}
                        >
                          {a}
                        </button>
                      ))}
                   </div>
                   <p className="font-dm-sans text-[12px] text-[#00C853] mt-[6px]">→ 12,847 users will receive this</p>
                </div>

                {/* Title */}
                <div className="mt-[14px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF] flex justify-between">Title * <span className="text-[#6B6B6B]">{title.length}/60</span></label>
                   <input 
                     value={title}
                     onChange={(e) => setTitle(e.target.value.substring(0, 60))}
                     placeholder="Jaise: New feature launch! 🎉"
                     className="w-full h-[48px] bg-[#13131F] border-[1.5px] border-[#252538] rounded-[12px] px-[14px] mt-[4px] font-dm-sans text-[14px] text-[#EFEFFF] placeholder-[#6B6B6B] focus:border-[#FF6B00] focus:shadow-[0_0_0_2px_rgba(255,107,0,0.2)] focus:outline-none transition-all"
                   />
                </div>

                {/* Message */}
                <div className="mt-[12px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF] flex justify-between">Message * <span className="text-[#6B6B6B]">{message.length}/200</span></label>
                   <textarea 
                     value={message}
                     onChange={(e) => setMessage(e.target.value.substring(0, 200))}
                     placeholder="Poora message likho..."
                     className="w-full h-[80px] bg-[#13131F] border-[1.5px] border-[#252538] rounded-[12px] p-[12px] mt-[4px] font-dm-sans text-[14px] text-[#EFEFFF] placeholder-[#6B6B6B] focus:border-[#FF6B00] focus:shadow-[0_0_0_2px_rgba(255,107,0,0.2)] focus:outline-none transition-all resize-none"
                   />
                </div>

                {/* Templates */}
                <div className="mt-[12px]">
                   <p className="font-dm-sans text-[12px] text-[#6B6B6B]">Quick Templates:</p>
                   <div className="flex gap-[8px] overflow-x-auto hide-scrollbar mt-[6px] pb-[4px]">
                      {templates.map(t => (
                        <button 
                          key={t.label}
                          onClick={() => { setTitle(t.title); setMessage(t.msg); }}
                          className="whitespace-nowrap h-[28px] px-[10px] bg-[#13131F] border border-[#252538] rounded-[20px] font-dm-sans text-[12px] text-[#6B6B6B] hover:text-[#EFEFFF] transition-colors"
                        >
                          {t.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Deep Link */}
                <div className="mt-[12px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Deep Link (optional)</label>
                   <div className="relative mt-[4px]">
                     <select className="w-full h-[40px] bg-[#13131F] border border-[#252538] rounded-[10px] px-[14px] font-dm-sans text-[14px] text-[#6B6B6B] appearance-none focus:outline-none">
                       <option>No deep link</option>
                       <option>→ Home Screen</option>
                       <option>→ Vendor List</option>
                       <option>→ Profile Page</option>
                     </select>
                     <ChevronDown className="w-[16px] h-[16px] text-[#6B6B6B] absolute right-[14px] top-[12px] pointer-events-none" />
                   </div>
                </div>

                {/* Schedule */}
                <div className="mt-[12px]">
                   <div className="flex justify-between items-center">
                     <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Schedule for later?</span>
                     <button 
                       onClick={() => setSchedule(!schedule)}
                       className={`w-[40px] h-[24px] rounded-full p-[2px] transition-colors ${schedule ? 'bg-[#FF6B00]' : 'bg-[#252538]'}`}
                     >
                       <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform ${schedule ? 'translate-x-[16px]' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   {schedule && (
                     <div className="flex items-center gap-[8px] mt-[10px] animate-fade-in text-[#6B6B6B]">
                       <div className="flex-1 h-[40px] bg-[#13131F] border border-[#252538] rounded-[10px] flex items-center px-[12px] font-dm-sans text-[13px]">
                         📅 5 May 2025
                       </div>
                       <div className="flex-1 h-[40px] bg-[#13131F] border border-[#252538] rounded-[10px] flex items-center px-[12px] font-dm-sans text-[13px]">
                         🕐 6:00 PM
                       </div>
                     </div>
                   )}
                </div>

                {/* Send Button */}
                <button 
                  disabled={!title || !message}
                  className={`w-full h-[50px] rounded-[14px] font-dm-sans font-bold text-[15px] flex items-center justify-center gap-[8px] mt-[16px] transition-all
                    ${(!title || !message) 
                      ? 'bg-[#1C1C2E] text-[#6B6B6B]' 
                      : 'bg-gradient-to-r from-[#FF6B00] to-[#FF4500] text-white shadow-[0_6px_20px_rgba(255,107,0,0.35)]'
                    }
                  `}
                >
                  <Megaphone className="w-[18px] h-[18px]" />
                  Send Broadcast
                </button>
             </div>
           )}
        </div>

        {/* FILTER TAB BAR */}
        <div className="sticky top-[76px] z-40 bg-[#050508] border-b border-[#1C1C2E] mt-[16px] px-[16px] pb-[8px]">
           <div className="flex gap-[8px] overflow-x-auto hide-scrollbar">
             {filters.map(f => (
               <button
                 key={f}
                 onClick={() => setActiveFilter(f)}
                 className={`whitespace-nowrap h-[32px] px-[16px] rounded-[20px] font-dm-sans text-[13px] border transition-colors ${activeFilter === f ? 'bg-[#FF6B00] border-[#FF6B00] text-white font-bold' : 'bg-[#0D0D14] border-[#1C1C2E] text-[#6B6B6B]'}`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="mt-[10px] mx-[16px] flex flex-col gap-[8px]">
          
          {/* Today Group */}
          <div className="sticky top-[116px] bg-[#050508] py-[10px] z-30">
            <span className="font-dm-sans font-semibold text-[12px] text-[#6B6B6B] uppercase tracking-[1.5px]">Today</span>
          </div>

          {/* Render Notifications */}
          {notifications.filter(n => n.dateGroup === 'Today').map(n => (
            <div 
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`relative overflow-hidden transition-all cursor-pointer ${
                !n.isRead 
                  ? 'bg-[#0D0D14] border border-[#FF6B00] rounded-[18px] shadow-[0_0_16px_rgba(255,107,0,0.10)] p-[14px] pl-[20px]' 
                  : 'bg-[#0A0A0F] border border-[#1C1C2E] opacity-80 rounded-[18px] p-[14px] pl-[16px]'
              }`}
            >
               {!n.isRead && (
                 <>
                   <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF6B00] rounded-l-[18px]" />
                   <div className="absolute top-[14px] right-[14px] w-[8px] h-[8px] bg-[#FF6B00] rounded-full animate-pulse" />
                 </>
               )}

               <div className="flex items-start gap-[12px]">
                 {/* Icon */}
                 <div className={`w-[40px] h-[40px] rounded-full border flex flex-shrink-0 items-center justify-center
                    ${n.type === 'new_vendor' ? 'bg-[#0A1F0F] border-[#00C853] text-[#00C853]' : ''}
                    ${n.type === 'system_alert' ? 'bg-[#1F0A0A] border-[#FF3B30] text-[#FF3B30]' : ''}
                    ${n.type === 'user_report' ? 'bg-[#1F0A0A] border-[#FF9500] text-[#FF9500]' : ''}
                    ${n.type === 'broadcast_sent' ? 'bg-[#1C1C2E] border-[#FF6B00] text-[#FF6B00]' : ''}
                    ${n.type === 'payment_failed' ? 'bg-[#1F0A0A] border-[#FF3B30] text-[#FF3B30]' : ''}
                 `}>
                    {n.type === 'new_vendor' && <Store className="w-[18px] h-[18px]" />}
                    {n.type === 'system_alert' && <AlertTriangle className="w-[18px] h-[18px]" />}
                    {n.type === 'user_report' && <AlertCircle className="w-[18px] h-[18px]" />}
                    {n.type === 'broadcast_sent' && <Megaphone className="w-[18px] h-[18px]" />}
                    {n.type === 'payment_failed' && <CreditCard className="w-[18px] h-[18px]" />}
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 min-w-0 pr-[20px]">
                   <h3 className={`font-dm-sans ${!n.isRead ? 'font-semibold text-[#EFEFFF]' : 'font-regular text-[#D0D0D0]'} text-[14px] truncate`}>
                     {n.title}
                   </h3>
                   <p className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[3px] line-clamp-2">
                     {n.detail}
                   </p>
                   {n.subdetail && (
                     <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">
                       {n.subdetail}
                     </p>
                   )}
                 </div>

                 {/* Time */}
                 <span className="font-dm-sans text-[11px] text-[#6B6B6B] flex-shrink-0 pt-[2px]">{n.time}</span>
               </div>

               {/* Stats Preview for Broadcast */}
               {n.type === 'broadcast_sent' && n.stats && (
                 <div className="mt-[10px]">
                    <p className="font-dm-sans font-semibold text-[12px] text-[#EFEFFF] mb-[6px]">📊 Delivery Report</p>
                    <div className="flex items-center gap-[4px] bg-[#13131F] rounded-[8px] p-[8px]">
                       <div className="flex-1 text-center border-r border-[#252538]">
                         <span className="font-space-grotesk font-bold text-[14px] text-white block">{n.stats.sent}</span>
                         <span className="font-dm-sans text-[10px] text-[#6B6B6B]">Sent</span>
                       </div>
                       <div className="flex-1 text-center border-r border-[#252538]">
                         <span className="font-space-grotesk font-bold text-[14px] text-[#00C853] block">{n.stats.delivered}</span>
                         <span className="font-dm-sans text-[10px] text-[#00C853]">{Math.round((n.stats.delivered/n.stats.sent)*100)}%</span>
                       </div>
                       <div className="flex-1 text-center">
                         <span className="font-space-grotesk font-bold text-[14px] text-[#FF6B00] block">{n.stats.opened}</span>
                         <span className="font-dm-sans text-[10px] text-[#FF6B00]">{Math.round((n.stats.opened/n.stats.sent)*100)}%</span>
                       </div>
                    </div>
                 </div>
               )}

               {/* Action Area */}
               {!n.isRead && n.type === 'new_vendor' && (
                 <div className="bg-[#13131F] rounded-[10px] p-[8px] mt-[10px] flex gap-[8px]">
                   <button className="flex-1 h-[32px] bg-[#0A1F0F] text-[#00C853] font-dm-sans font-medium text-[13px] rounded-[8px] border border-[#00C853]/30">✓ Approve</button>
                   <button className="flex-1 h-[32px] bg-[#1F0A0A] text-[#FF3B30] font-dm-sans font-medium text-[13px] rounded-[8px] border border-[#FF3B30]/30">✕ Reject</button>
                 </div>
               )}
               {!n.isRead && n.type === 'system_alert' && (
                 <div className="bg-[#13131F] rounded-[10px] p-[8px] mt-[10px] flex justify-end">
                   <button className="text-[#FF6B00] font-dm-sans font-medium text-[12px]">View Details →</button>
                 </div>
               )}
            </div>
          ))}

          {/* Yesterday Group */}
          <div className="sticky top-[116px] bg-[#050508] py-[10px] z-30 mt-[10px]">
            <span className="font-dm-sans font-semibold text-[12px] text-[#6B6B6B] uppercase tracking-[1.5px]">Yesterday</span>
          </div>

          {notifications.filter(n => n.dateGroup === 'Yesterday').map(n => (
            <div 
              key={n.id}
              className={`relative overflow-hidden transition-all bg-[#0A0A0F] border border-[#1C1C2E] opacity-80 rounded-[18px] p-[14px] pl-[16px]`}
            >
               <div className="flex items-start gap-[12px]">
                 <div className={`w-[40px] h-[40px] rounded-full border flex flex-shrink-0 items-center justify-center bg-[#1F0A0A] border-[#FF3B30] text-[#FF3B30]`}>
                    <CreditCard className="w-[18px] h-[18px]" />
                 </div>
                 
                 <div className="flex-1 min-w-0 pr-[20px]">
                   <h3 className={`font-dm-sans font-regular text-[#D0D0D0] text-[14px] truncate`}>
                     {n.title}
                   </h3>
                   <p className="font-dm-sans text-[13px] text-[#6B6B6B] mt-[3px] line-clamp-2">
                     {n.detail}
                   </p>
                   {n.subdetail && (
                     <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">
                       {n.subdetail}
                     </p>
                   )}
                 </div>
                 <span className="font-dm-sans text-[11px] text-[#6B6B6B] flex-shrink-0 pt-[2px]">{n.time}</span>
               </div>
            </div>
          ))}

          {/* SCHEDULED SECTION */}
          {SCHEDULED_NOTIFICATIONS.length > 0 && (
            <div className="mt-[20px]">
               <div className="flex items-center gap-[8px] mb-[12px]">
                  <h2 className="font-baloo-2 font-bold text-[16px] text-[#EFEFFF]">⏰ Scheduled</h2>
                  <div className="w-[22px] h-[22px] bg-[#FFD600] rounded-full flex items-center justify-center">
                     <span className="font-space-grotesk font-bold text-[11px] text-[#0A0A14]">{SCHEDULED_NOTIFICATIONS.length}</span>
                  </div>
               </div>
               
               {SCHEDULED_NOTIFICATIONS.map(s => (
                 <div key={s.id} className="bg-[#0D0D14] border-[1.5px] border-dashed border-[#FFD600] rounded-[18px] p-[14px]">
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-[2px]">
                         <span className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">{s.title}</span>
                         <span className="font-dm-sans text-[12px] text-[#6B6B6B] truncate">{s.preview}</span>
                       </div>
                       <span className="font-dm-sans text-[11px] text-[#FFD600] text-right">{s.time}</span>
                    </div>
                    <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[8px]">{s.audience}</p>
                    
                    <div className="flex gap-[8px] mt-[10px]">
                      <button className="flex-1 h-[32px] bg-[#13131F] border border-[#252538] rounded-[8px] font-dm-sans font-medium text-[12px] text-[#EFEFFF]">✏️ Edit</button>
                      <button className="flex-1 h-[32px] bg-[#13131F] border border-[#FF3B30] rounded-[8px] font-dm-sans font-medium text-[12px] text-[#FF3B30]">🗑 Cancel</button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {notifications.length === 0 && (
             <div className="flex flex-col items-center justify-center py-[60px]">
                <Bell className="w-[56px] h-[56px] text-[#252538] mb-[16px]" />
                <h2 className="font-baloo-2 font-bold text-[22px] text-[#EFEFFF]">Sab clear hai!</h2>
                <p className="font-dm-sans text-[14px] text-[#6B6B6B]">Koi pending notification nahi</p>
                <div className="mt-[8px] bg-[#0A1F0F] rounded-[12px] px-[12px] py-[4px] border border-[#00C853]/30">
                  <span className="font-dm-sans font-medium text-[13px] text-[#00C853]">✅ Platform healthy hai</span>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
