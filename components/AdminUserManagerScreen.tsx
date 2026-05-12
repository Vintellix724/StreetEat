import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, Search, X, ChevronRight, MoreVertical, 
  User, UserCheck, Shield, Ban, Activity, ShoppingBag, 
  MessageSquare, Star, Clock, MapPin, Smartphone, CreditCard,
  AlertTriangle, Copy, Trash2
} from 'lucide-react';
import Image from 'next/image';

export default function AdminUserManagerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('');
  
  // Sheet states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetailSheet, setShowUserDetailSheet] = useState(false);
  const [showAddAdminSheet, setShowAddAdminSheet] = useState(false);
  const [showBanSheet, setShowBanSheet] = useState(false);
  const [showMessageSheet, setShowMessageSheet] = useState(false);

  // Detail Sheet Tab
  const [detailTab, setDetailTab] = useState('Orders');

  const filterRoles = ['All', 'Customers', 'Vendors', 'Admins'];
  const filterStatuses = ['Active', 'Banned', 'Unverified'];

  const mockUsers = [
    {
      id: 'usr_1',
      uid: 'abc123xyz789',
      role: 'customer',
      state: 'active',
      name: 'Rahul Kumar',
      phone: '+91 98765 43210',
      email: 'rahul@gmail.com',
      orders: 23,
      spent: '1,840',
      joined: 'Mar 2024',
      lastActive: '2 hrs ago',
      ratingGiven: '4.8',
      wallet: 350
    },
    {
      id: 'usr_2',
      uid: 'vnd_445xyz',
      role: 'vendor',
      state: 'pending',
      name: 'Ramesh Chaat Corner',
      phone: '+91 91234 56780',
      email: 'ramesh@business.com',
      fulfilled: 142,
      earned: '48K',
      rating: '4.9',
      joined: 'Jan 2024',
      lastActive: '5 mins ago',
      wallet: 12400
    },
    {
      id: 'usr_3',
      uid: 'adm_999xyz',
      role: 'admin',
      state: 'active',
      name: 'Vikram Admin',
      phone: '+91 99999 11111',
      email: 'vikram@streeteats.app',
      lastLogin: '2 hours ago',
      sessions: 2,
      actions: 284,
      joined: 'Dec 2023',
      lastActive: 'Just now',
      wallet: 0
    },
    {
      id: 'usr_4',
      uid: 'usr_bad99',
      role: 'customer',
      state: 'banned',
      name: 'Fraud User',
      phone: '+91 88888 22222',
      email: 'scammer@fake.com',
      orders: 0,
      spent: '0',
      joined: 'Apr 2024',
      lastActive: '3 days ago',
      banReason: 'Fraudulent orders',
      wallet: 0
    }
  ];

  const filteredUsers = mockUsers.filter(u => {
    if (activeRoleFilter !== 'All') {
      if (activeRoleFilter === 'Customers' && u.role !== 'customer') return false;
      if (activeRoleFilter === 'Vendors' && u.role !== 'vendor') return false;
      if (activeRoleFilter === 'Admins' && u.role !== 'admin') return false;
    }
    if (activeStatusFilter) {
      if (activeStatusFilter === 'Active' && u.state !== 'active') return false;
      if (activeStatusFilter === 'Banned' && u.state !== 'banned') return false;
      if (activeStatusFilter === 'Unverified' && u.state !== 'pending') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.phone.includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getRoleAvatarConfig = (user: any) => {
    if (user.role === 'customer') return { badge: 'bg-[#00BCD4]', icon: User };
    if (user.role === 'vendor') return { badge: 'bg-[#FF6B00]', icon: ShoppingBag };
    if (user.role === 'admin') return { badge: 'bg-[#FF3B30]', icon: Shield };
    return { badge: 'bg-[#6B6B6B]', icon: User };
  };

  const getStatusDot = (state: string) => {
    if (state === 'active') return 'bg-[#00C853]';
    if (state === 'banned') return 'bg-[#FF3B30]';
    if (state === 'pending') return 'bg-[#FFD600]';
    return 'bg-[#6B6B6B]';
  };

  const handleOpenUser = (u: any) => {
    setSelectedUser(u);
    setShowUserDetailSheet(true);
    setDetailTab('Orders');
  };

  return (
    <div className="w-full h-[100dvh] bg-[#050508] font-sans flex justify-center">
      <div className="w-full max-w-[390px] h-full relative bg-[#050508] flex flex-col overflow-hidden">
        
        {/* STICKY TOP BAR */}
        <div className="w-full h-[116px] pt-[52px] px-[16px] bg-[#050508] border-b border-[#1C1C2E] flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-[12px]">
            <button onClick={() => router.back()} className="w-[40px] h-[40px] flex items-center justify-center -ml-[8px] active:scale-95">
              <ArrowLeft size={24} className="text-[#EFEFFF]" />
            </button>
            <h1 className="font-baloo font-bold text-[18px] text-[#EFEFFF]">User Manager</h1>
          </div>
          <button 
            onClick={() => setShowAddAdminSheet(true)}
            className="h-[34px] px-[12px] bg-[#FF6B00] rounded-[10px] flex items-center justify-center gap-[6px] active:scale-95 transition-transform"
          >
            <Plus size={14} className="text-white font-bold" />
            <span className="font-dm-sans font-bold text-[13px] text-white">Add Admin</span>
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          
          {/* SEARCH BAR */}
          <div className="mt-[12px] mx-[16px]">
            <div className={`h-[48px] bg-[#0D0D14] border-[1.5px] rounded-[14px] flex items-center px-[16px] transition-colors ${searchQuery ? 'border-[#FF6B00] shadow-[0_0_0_3px_rgba(255,107,0,0.10)]' : 'border-[#1C1C2E]'}`}>
              <Search size={20} className="text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
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
          <div className="mt-[12px] mx-[16px] bg-[#0D0D14] border border-[#1C1C2E] rounded-[14px] p-[12px] px-[16px] flex divide-x divide-[#1C1C2E]">
            <div className="flex-1 flex flex-col items-center">
              <span className="font-space-grotesk font-bold text-[20px] text-[#EFEFFF]">12,847</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Total Users</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-space-grotesk font-bold text-[20px] text-[#00C853]">11,203</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Active</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-space-grotesk font-bold text-[20px] text-[#FF3B30]">84</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Banned</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-space-grotesk font-bold text-[20px] text-[#FF6B00]">+284</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B]">New Today</span>
            </div>
          </div>

          {/* FILTER ROW */}
          <div className="mt-[10px] w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-[8px] px-[16px] w-max pb-[8px]">
              {filterRoles.map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRoleFilter(role)}
                  className={`h-[32px] px-[16px] rounded-[20px] flex items-center justify-center transition-colors ${
                    activeRoleFilter === role 
                      ? 'bg-[#FF6B00] font-dm-sans font-bold text-[13px] text-white border border-[#FF6B00]' 
                      : 'bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]'
                  }`}
                >
                  {role === 'Customers' && '👤 '}
                  {role === 'Vendors' && '🏪 '}
                  {role === 'Admins' && '🔐 '}
                  {role}
                </button>
              ))}
              <div className="w-[1px] h-[20px] bg-[#252538] mx-[4px] self-center" />
              {filterStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(activeStatusFilter === status ? '' : status)}
                  className={`h-[32px] px-[16px] rounded-[20px] flex items-center justify-center transition-colors ${
                    activeStatusFilter === status 
                      ? 'bg-[#FF6B00] font-dm-sans font-bold text-[13px] text-white border border-[#FF6B00]' 
                      : 'bg-[#0D0D14] border border-[#1C1C2E] font-dm-sans text-[13px] text-[#6B6B6B]'
                  }`}
                >
                  {status === 'Active' && '✅ '}
                  {status === 'Banned' && '🚫 '}
                  {status === 'Unverified' && '⏳ '}
                  {status}
                </button>
              ))}
              <div className="w-[1px] h-[20px] bg-[#252538] mx-[4px] self-center" />
              <button className="h-[32px] px-[16px] rounded-[20px] bg-[#0D0D14] border border-[#1C1C2E] flex items-center justify-center font-dm-sans text-[13px] text-[#6B6B6B] whitespace-nowrap">
                ↕ Newest First
              </button>
            </div>
          </div>

          {/* USER LIST */}
          <div className="mt-[12px] mx-[16px] flex flex-col gap-[10px]">
            {filteredUsers.length === 0 ? (
              <div className="py-[60px] flex flex-col items-center justify-center">
                <Search size={48} className="text-[#252538] mb-[16px]" />
                <p className="font-dm-sans font-medium text-[15px] text-[#6B6B6B] text-center">Koi user nahi mila</p>
                <p className="font-dm-sans text-[13px] text-[#6B6B6B] text-center mt-[4px]">Naam, phone ya email se try karo</p>
              </div>
            ) : (
              filteredUsers.map(u => {
                const config = getRoleAvatarConfig(u);
                
                // Card border color based on role and status
                let borderColor = 'border-[#1C1C2E]';
                let opacity = 'opacity-100';
                let bgName = 'bg-[#0D0D14]';
                if (u.role === 'admin') borderColor = 'border-[#FF6B00]';
                if (u.role === 'vendor') borderColor = 'border-[#252538]';
                if (u.state === 'banned') {
                  borderColor = 'border-[#FF3B30]';
                  opacity = 'opacity-65';
                  bgName = 'bg-[#0D0907]';
                }

                return (
                  <button 
                    key={u.id}
                    onClick={() => handleOpenUser(u)}
                    className={`w-full ${bgName} ${borderColor} ${u.role === 'admin' ? 'border-[1.5px]' : 'border'} rounded-[20px] p-[14px] px-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.3)] flex text-left active:scale-[0.98] transition-transform ${opacity} relative overflow-hidden`}
                  >
                    {u.role === 'admin' && (
                      <div className="absolute top-0 left-0 w-[3px] h-full bg-[#FF6B00]" />
                    )}
                    
                    <div className="relative shrink-0">
                      <div className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#252538] to-[#1C1C2E] flex items-center justify-center">
                        <span className="font-space-grotesk font-bold text-[20px] text-white">
                          {u.name.charAt(0)}
                        </span>
                      </div>
                      <div className={`absolute -bottom-[4px] -right-[4px] w-[18px] h-[18px] ${config.badge} rounded-full border-2 border-[#0D0D14] flex items-center justify-center`}>
                        <config.icon size={10} className="text-white" />
                      </div>
                    </div>
                    
                    <div className="ml-[12px] flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-y-[4px]">
                        <h3 className={`font-dm-sans font-semibold text-[14px] mr-[6px] truncate ${u.state === 'banned' ? 'text-[#6B6B6B] line-through' : 'text-[#EFEFFF]'}`}>
                          {u.name}
                        </h3>
                        {u.state !== 'banned' && (
                          <div className={`w-[6px] h-[6px] rounded-full ${getStatusDot(u.state)} shrink-0`} />
                        )}
                        {u.role === 'admin' && (
                          <div className="ml-[8px] bg-[#FF6B00] rounded-[4px] px-[6px] py-[2px]">
                            <span className="font-dm-sans font-bold text-[10px] text-white leading-none">ADMIN</span>
                          </div>
                        )}
                      </div>
                      
                      {u.state === 'banned' ? (
                        <>
                          <p className="font-dm-sans font-medium text-[12px] text-[#FF3B30] mt-[2px]">🚫 Banned · {u.lastActive}</p>
                          <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px] truncate">Reason: {u.banReason}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col mt-[3px]">
                            <span className="font-dm-sans text-[12px] text-[#6B6B6B] truncate">{u.phone}</span>
                            <span className="font-dm-sans text-[12px] text-[#6B6B6B] truncate">{u.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-[10px] mt-[6px] flex-wrap">
                            {u.role === 'customer' && (
                              <>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">📦 {u.orders} orders</span>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">💰 ₹{u.spent} spent</span>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">📅 Joined {u.joined}</span>
                              </>
                            )}
                            {u.role === 'vendor' && (
                              <>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">📦 {u.fulfilled} fulfilled</span>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">⭐ {u.rating} rating</span>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">💰 {u.earned} earned</span>
                              </>
                            )}
                            {u.role === 'admin' && (
                              <>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Last login: {u.lastLogin}</span>
                                <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Actions: {u.actions} this month</span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 flex flex-col items-end">
                      {u.role === 'admin' ? (
                        <span className="font-dm-sans font-medium text-[12px] text-[#FF6B00]">Manage &rarr;</span>
                      ) : (
                        <ChevronRight size={20} className="text-[#6B6B6B] mb-[4px]" />
                      )}
                      {u.state !== 'banned' && u.role !== 'admin' && (
                        <span className="font-dm-sans text-[10px] text-[#6B6B6B]">{u.lastActive}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* BOTTOM SHEETS */}
        
        {/* User Detail Sheet */}
        {showUserDetailSheet && selectedUser && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUserDetailSheet(false)} />
            <div className="w-full h-[90%] bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-full flex justify-center pt-[12px] pb-[8px] absolute top-0 z-20 bg-gradient-to-b from-[#0D0D14] to-transparent">
                <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
              </div>
              
              <div className="flex-1 overflow-y-auto px-[20px] pt-[30px] pb-[120px]">
                {/* Header */}
                <div className="flex">
                  <div className="relative shrink-0">
                    <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#252538] to-[#1C1C2E] flex items-center justify-center">
                      <span className="font-space-grotesk font-bold text-[28px] text-white">
                        {selectedUser.name.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-[22px] h-[22px] ${getRoleAvatarConfig(selectedUser).badge} rounded-full border-[3px] border-[#0D0D14] flex items-center justify-center`}>
                      <User size={12} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="ml-[14px]">
                    <h2 className="font-baloo font-bold text-[22px] text-[#EFEFFF] leading-none mb-[4px]">{selectedUser.name}</h2>
                    <p className="font-dm-sans text-[13px] text-[#6B6B6B] leading-snug">{selectedUser.phone}</p>
                    <p className="font-dm-sans text-[13px] text-[#6B6B6B] leading-snug mb-[6px]">{selectedUser.email}</p>
                    
                    <div className="flex items-center gap-[8px]">
                      {selectedUser.state === 'active' && (
                        <div className="px-[8px] py-[2px] rounded-[6px] bg-[#0A1F0F] border border-[#00C853] flex items-center gap-[4px]">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#00C853]" />
                          <span className="font-dm-sans font-bold text-[10px] text-[#00C853]">Active</span>
                        </div>
                      )}
                      {selectedUser.state === 'banned' && (
                        <div className="px-[8px] py-[2px] rounded-[6px] bg-[#1F0A0A] border border-[#FF3B30] flex items-center gap-[4px]">
                          <Ban size={10} className="text-[#FF3B30]" />
                          <span className="font-dm-sans font-bold text-[10px] text-[#FF3B30]">Banned</span>
                        </div>
                      )}
                      {selectedUser.state === 'pending' && (
                        <div className="px-[8px] py-[2px] rounded-[6px] bg-[#1C1A09] border border-[#FFD600] flex items-center gap-[4px]">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#FFD600]" />
                          <span className="font-dm-sans font-bold text-[10px] text-[#FFD600]">Pending</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-[8px] flex items-center gap-[6px]">
                      <span className="font-jetbrains text-[11px] text-[#252538]">UID: {selectedUser.uid}</span>
                      <button className="text-[#6B6B6B] active:text-white">
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-[10px] mt-[20px]">
                  <div className="flex-1 bg-[#13131F] border border-[#1C1C2E] rounded-[12px] p-[10px] px-[12px]">
                    <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Orders</p>
                    <p className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">
                      {selectedUser.orders ?? selectedUser.fulfilled ?? 0}
                    </p>
                  </div>
                  <div className="flex-1 bg-[#13131F] border border-[#1C1C2E] rounded-[12px] p-[10px] px-[12px]">
                    <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Spent</p>
                    <p className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">
                      ₹{selectedUser.spent ?? '0'}
                    </p>
                  </div>
                  <div className="flex-1 bg-[#13131F] border border-[#1C1C2E] rounded-[12px] p-[10px] px-[12px]">
                    <p className="font-dm-sans text-[11px] text-[#6B6B6B] mb-[2px]">Rating</p>
                    <p className="font-space-grotesk font-bold text-[16px] text-[#EFEFFF]">
                      {selectedUser.ratingGiven ?? selectedUser.rating ?? '-'}★
                    </p>
                  </div>
                </div>

                {/* Tab Bar */}
                <div className="flex border-b border-[#1C1C2E] mt-[24px]">
                  {['Orders', 'Activity', 'Wallet', 'Info'].map(tab => (
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
                <div className="mt-[16px]">
                  {detailTab === 'Orders' && (
                    <div className="flex flex-col">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="py-[12px] border-b border-[#1C1C2E] flex justify-between items-center">
                          <div>
                            <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">#SF284{i} · Sharma Ji Kulfi</p>
                            <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">3 items · ₹80 · UPI</p>
                            <p className="font-dm-sans text-[11px] text-[#00C853] mt-[2px]">completed · {i} days ago</p>
                          </div>
                          <span className="font-space-grotesk font-bold text-[14px] text-[#EFEFFF]">₹80</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === 'Wallet' && (
                    <div>
                      <div className="w-full bg-gradient-to-br from-[#1C1C2E] to-[#0D0D14] rounded-[16px] p-[16px] border border-[#252538] mb-[20px]">
                        <p className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">StreetEats Wallet</p>
                        <p className="font-space-grotesk font-bold text-[32px] text-[#FF6B00]">₹{selectedUser.wallet ?? 0}</p>
                        <div className="flex gap-[10px] mt-[16px]">
                          <button className="flex-1 h-[40px] bg-[#FF6B00] rounded-[10px] font-dm-sans font-bold text-[13px] text-white">
                            Admin Add ₹
                          </button>
                          <button className="flex-1 h-[40px] bg-transparent border-[1.5px] border-[#FF3B30] rounded-[10px] font-dm-sans font-bold text-[13px] text-[#FF3B30]">
                            Admin Deduct ₹
                          </button>
                        </div>
                      </div>
                      <h3 className="font-dm-sans font-bold text-[14px] text-[#EFEFFF] mb-[12px]">Recent Transactions</h3>
                      <div className="flex flex-col">
                        <div className="py-[12px] border-b border-[#1C1C2E] flex justify-between items-center">
                          <div>
                            <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">Added from UPI</p>
                            <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">2 days ago</p>
                          </div>
                          <span className="font-space-grotesk font-bold text-[14px] text-[#00C853]">+ ₹500</span>
                        </div>
                        <div className="py-[12px] border-b border-[#1C1C2E] flex justify-between items-center">
                          <div>
                            <p className="font-dm-sans font-semibold text-[13px] text-[#EFEFFF]">Paid for Order #SF2841</p>
                            <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">3 days ago</p>
                          </div>
                          <span className="font-space-grotesk font-bold text-[14px] text-[#FF3B30]">- ₹150</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'Info' && (
                    <div className="flex flex-col gap-[16px]">
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Device:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">iPhone 14 Pro · iOS 17.2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Location:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">New Delhi, Delhi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Language:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">Hinglish</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Joined:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">{selectedUser.joined}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Last Login:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">{selectedUser.lastActive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">Login Method:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">Google</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dm-sans text-[12px] text-[#6B6B6B]">App Version:</span>
                        <span className="font-dm-sans text-[13px] text-[#EFEFFF]">v1.0.0</span>
                      </div>
                    </div>
                  )}
                  
                  {detailTab === 'Activity' && (
                    <div className="flex flex-col gap-[16px] relative pl-[16px]">
                      <div className="absolute left-[31px] top-[16px] bottom-[16px] w-[2px] bg-[#1C1C2E]" />
                      <div className="flex items-start gap-[12px] relative z-10">
                        <div className="w-[32px] h-[32px] rounded-full bg-[#1C1C2E] flex items-center justify-center shrink-0">
                          <ShoppingBag size={14} className="text-[#FF6B00]" />
                        </div>
                        <div className="pt-[6px]">
                          <p className="font-dm-sans text-[13px] text-[#EFEFFF]">Placed order at Sharma Ji Kulfi</p>
                          <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-[12px] relative z-10">
                        <div className="w-[32px] h-[32px] rounded-full bg-[#1C1F1A] flex items-center justify-center shrink-0">
                          <Smartphone size={14} className="text-[#00C853]" />
                        </div>
                        <div className="pt-[6px]">
                          <p className="font-dm-sans text-[13px] text-[#EFEFFF]">Logged in from unusual device</p>
                          <p className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Delhi, IN · 3 days ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION PILLS GRID */}
              <div className="absolute bottom-0 left-0 w-full px-[20px] pb-[34px] pt-[16px] bg-[#0D0D14] border-t border-[#1C1C2E] z-30">
                <div className="grid grid-cols-2 gap-[10px]">
                  <button 
                    onClick={() => setShowMessageSheet(true)}
                    className="h-[44px] bg-[#13131F] border border-[#252538] rounded-[12px] flex items-center justify-center gap-[8px] active:scale-95 transition-transform"
                  >
                    <span className="text-[14px]">✉️</span>
                    <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Send Message</span>
                  </button>
                  <button className="h-[44px] bg-[#13131F] border border-[#252538] rounded-[12px] flex items-center justify-center gap-[8px] active:scale-95 transition-transform">
                    <span className="text-[14px]">🔄</span>
                    <span className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Reset Password</span>
                  </button>
                  <button 
                    onClick={() => setShowBanSheet(true)}
                    className="h-[44px] bg-[#1F0A0A] border border-[#FF3B30] rounded-[12px] flex items-center justify-center gap-[8px] active:scale-95 transition-transform"
                  >
                    {selectedUser.state === 'banned' ? (
                      <>
                        <span className="text-[14px]">✅</span>
                        <span className="font-dm-sans font-medium text-[13px] text-[#00C853]">Unban User</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[14px]">🚫</span>
                        <span className="font-dm-sans font-medium text-[13px] text-[#FF3B30]">Ban User</span>
                      </>
                    )}
                  </button>
                  <button className="h-[44px] bg-[#1F0A0A] border border-[#FF3B30] rounded-[12px] flex items-center justify-center gap-[8px] active:scale-95 transition-transform">
                    <span className="text-[14px]">🗑</span>
                    <span className="font-dm-sans font-medium text-[13px] text-[#FF3B30]">Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Bottom Sheet */}
        {showAddAdminSheet && (
          <div className="absolute inset-0 z-[60] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddAdminSheet(false)} />
            <div className="w-full h-[75%] bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-full flex justify-center pt-[12px] pb-[8px]">
                <div className="w-[40px] h-[4px] bg-[#252538] rounded-full" />
              </div>
              <div className="px-[20px] pb-[16px] border-b border-[#1C1C2E]">
                <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF]">New Admin Add Karo</h2>
                <div className="flex items-center gap-[6px] mt-[4px]">
                  <AlertTriangle size={14} className="text-[#FF9500]" />
                  <p className="font-dm-sans text-[13px] text-[#FF9500]">Sirf trusted team members ko add karo</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-[20px] pb-[100px] flex flex-col gap-[16px]">
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Full Name *</label>
                  <input type="text" className="w-full h-[48px] bg-[#13131F] border border-[#252538] rounded-[12px] px-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00]" />
                </div>
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Admin Email *</label>
                  <input type="email" className="w-full h-[48px] bg-[#13131F] border border-[#252538] rounded-[12px] px-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00]" />
                </div>
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Permission Level</label>
                  <div className="flex flex-col gap-[10px]">
                    <div className="bg-[#1C1C2E] border-[1.5px] border-[#FF6B00] rounded-[12px] p-[14px] flex items-start gap-[12px]">
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-[#FF6B00] flex items-center justify-center mt-[2px] shrink-0">
                        <div className="w-[10px] h-[10px] rounded-full bg-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">Moderator</p>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">Approve vendors, manage users, view analytics</p>
                      </div>
                    </div>
                    <div className="bg-[#13131F] border border-[#252538] rounded-[12px] p-[14px] flex items-start gap-[12px]">
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-[#6B6B6B] mt-[2px] shrink-0" />
                      <div>
                        <p className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">Super Admin</p>
                        <p className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">Full access, can add admins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-[0] left-[0] w-full p-[20px] pb-[34px] bg-[#0D0D14] border-t border-[#1C1C2E]">
                <button 
                  onClick={() => setShowAddAdminSheet(false)}
                  className="w-full h-[54px] rounded-[16px] bg-gradient-to-r from-[#FF6B00] to-[#FF4500] font-dm-sans font-bold text-[16px] text-white active:scale-[0.98] transition-transform shadow-[0_8px_20px_rgba(255,107,0,0.3)]"
                >
                  Create Admin Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ban User Sheet */}
        {showBanSheet && (
          <div className="absolute inset-0 z-[70] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBanSheet(false)} />
            <div className="w-full bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[34px]">
              <div className="w-full flex justify-center pt-[12px] pb-[16px]"><div className="w-[40px] h-[4px] bg-[#252538] rounded-full" /></div>
              <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF] text-center mb-[20px]">User ko ban karein?</h2>
              
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

        {/* Message Sheet */}
        {showMessageSheet && selectedUser && (
          <div className="absolute inset-0 z-[70] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMessageSheet(false)} />
            <div className="w-full h-[60%] bg-[#0D0D14] rounded-t-[24px] flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-full flex justify-center pt-[12px] pb-[8px]"><div className="w-[40px] h-[4px] bg-[#252538] rounded-full" /></div>
              <div className="px-[20px] pb-[16px]">
                <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF]">📣 Message Bhejo</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto px-[20px] pb-[100px] flex flex-col gap-[16px]">
                <div className="bg-[#13131F] rounded-[10px] p-[10px]">
                  <p className="font-dm-sans text-[13px] text-[#6B6B6B]">To: <span className="text-[#EFEFFF]">{selectedUser.name} ({selectedUser.phone})</span></p>
                </div>
                
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Title</label>
                  <input type="text" className="w-full h-[48px] bg-[#13131F] border border-[#252538] rounded-[12px] px-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00]" maxLength={60} />
                </div>
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Message</label>
                  <textarea className="w-full h-[100px] bg-[#13131F] border border-[#252538] rounded-[12px] p-[16px] font-dm-sans text-[14px] text-[#EFEFFF] outline-none focus:border-[#FF6B00] resize-none" maxLength={200} />
                  <p className="font-dm-sans text-[11px] text-[#6B6B6B] text-right mt-[4px]">0 / 200</p>
                </div>
                <div>
                  <label className="font-dm-sans text-[12px] text-[#6B6B6B] block mb-[6px]">Template</label>
                  <div className="flex flex-wrap gap-[8px]">
                    {['Order update', 'Promo offer', 'Account notice'].map(t => (
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
                  Send Message &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
