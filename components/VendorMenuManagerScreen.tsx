'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  ChevronLeft, Search, Plus, X, ImageIcon, Trash2, Edit2, 
  Eye, EyeOff, Check, ImagePlus, AlertCircle, Utensils,
  Home, ClipboardList, BarChart3, Settings
} from 'lucide-react';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy' | 'Extra';
  description: string;
  photo?: string;
  isBestseller: boolean;
  isAvailable: boolean;
  isVisible: boolean;
  isNew?: boolean;
  totalSold: number;
};

const MOCK_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Malai Kulfi',
    price: 30,
    category: 'Kulfi',
    spiceLevel: 'Mild',
    description: 'Creamy malai kulfi with pista topping',
    photo: 'https://picsum.photos/seed/kulfimalai/200/200',
    isBestseller: true,
    isAvailable: true,
    isVisible: true,
    totalSold: 67,
  },
  {
    id: 'm2',
    name: 'Mango Kulfi',
    price: 40,
    category: 'Kulfi',
    spiceLevel: 'Mild',
    description: 'Fresh mango pulp kulfi',
    photo: 'https://picsum.photos/seed/mango/200/200',
    isBestseller: false,
    isAvailable: true,
    isVisible: true,
    isNew: true,
    totalSold: 12,
  },
  {
    id: 'm3',
    name: 'Spl. Pani Puri',
    price: 50,
    category: 'Chaat',
    spiceLevel: 'Spicy',
    description: '10 pieces with extra teekha pani',
    photo: 'https://picsum.photos/seed/panipuri/200/200',
    isBestseller: true,
    isAvailable: false,
    isVisible: true,
    totalSold: 145,
  },
  {
    id: 'm4',
    name: 'Dahi Puri',
    price: 60,
    category: 'Chaat',
    spiceLevel: 'Medium',
    description: 'Sweet and tangy dahi chaat',
    isBestseller: false,
    isAvailable: true,
    isVisible: false,
    totalSold: 20,
  },
];

const CATEGORIES = ['All', 'Kulfi', 'Chaat', 'Drinks', 'Specials'];
const SORT_OPTIONS = ['Default', 'Bestsellers First', 'Sold Out First', 'Price: Low-High'];

export default function VendorMenuManagerScreen() {
  const router = useRouter();
  
  const [items, setItems] = useState<MenuItem[]>(MOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Default');
  
  // Bulk Mode
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Bottom Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Kulfi');
  const [formSpice, setFormSpice] = useState<'Mild' | 'Medium' | 'Spicy' | 'Extra'>('Mild');
  const [formDesc, setFormDesc] = useState('');
  const [formBestseller, setFormBestseller] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [formAvailable, setFormAvailable] = useState(true);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'All') {
      result = result.filter(i => i.category === activeCategory);
    }

    // Sort
    if (activeSort === 'Bestsellers First') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (activeSort === 'Sold Out First') {
      result.sort((a, b) => (a.isAvailable ? 1 : 0) - (b.isAvailable ? 1 : 0));
    } else if (activeSort === 'Price: Low-High') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [items, searchQuery, activeCategory, activeSort]);

  // Derived Stats
  const totalItems = items.length;
  const soldOutItems = items.filter(i => !i.isAvailable).length;
  const hiddenItems = items.filter(i => !i.isVisible).length;

  const handleToggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const handleToggleVisibility = (id: string) => {
     setItems(prev => prev.map(i => i.id === id ? { ...i, isVisible: !i.isVisible } : i));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const openAddMenu = () => {
    setEditingItem(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Kulfi');
    setFormSpice('Mild');
    setFormDesc('');
    setFormBestseller(false);
    setFormVisible(true);
    setFormAvailable(true);
    setIsSheetOpen(true);
  };

  const openEditMenu = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormSpice(item.spiceLevel);
    setFormDesc(item.description);
    setFormBestseller(item.isBestseller);
    setFormVisible(item.isVisible);
    setFormAvailable(item.isAvailable);
    setIsSheetOpen(true);
  };

  const handleSaveForm = () => {
    if (!formName.trim() || !formPrice) return;
    
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? {
        ...i,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
        spiceLevel: formSpice,
        description: formDesc,
        isBestseller: formBestseller,
        isVisible: formVisible,
        isAvailable: formAvailable,
      } : i));
    } else {
      const newItem: MenuItem = {
        id: `m${Date.now()}`,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
        spiceLevel: formSpice,
        description: formDesc,
        isBestseller: formBestseller,
        isVisible: formVisible,
        isAvailable: formAvailable,
        totalSold: 0,
        isNew: true
      };
      setItems([newItem, ...items]);
    }
    setIsSheetOpen(false);
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItemIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItemIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.size === filteredItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0A0A14] font-sans overflow-hidden text-[#EFEFFF]">
      
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 h-[64px] px-[16px] flex items-center justify-between bg-[#0A0A14] border-b border-[#252538] shrink-0 z-40 pt-safe">
        {isBulkMode ? (
          <>
            <button onClick={() => { setIsBulkMode(false); setSelectedItemIds(new Set()); }} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-[#EFEFFF]" />
            </button>
            <span className="font-baloo font-bold text-[18px] text-[#EFEFFF]">{selectedItemIds.size} selected</span>
            <button onClick={toggleSelectAll} className="font-dm-sans font-medium text-[13px] text-[#FF6B00]">Select All</button>
          </>
        ) : isSearchExpanded ? (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex items-center h-full gap-3">
            <div className="flex-1 h-[40px] bg-[#13131F] border-[1.5px] border-[#FF6B00] rounded-[12px] flex items-center px-[14px]">
              <Search size={16} className="text-[#6B6B6B] mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                placeholder="Search items..."
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
             <span className="font-baloo font-bold text-[18px] text-[#EFEFFF] flex-1 text-center">Menu Manager</span>
             <div className="flex items-center gap-[12px]">
               <button onClick={() => setIsSearchExpanded(true)}>
                 <Search size={22} className="text-[#EFEFFF]" />
               </button>
               <button 
                 onClick={openAddMenu}
                 className="h-[34px] px-[12px] bg-[#FF6B00] rounded-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform"
               >
                 <Plus size={14} className="text-white" strokeWidth={3} />
                 <span className="font-dm-sans font-bold text-[13px] text-white">Add Item</span>
               </button>
             </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] hide-scrollbar relative">
        
        {/* MENU HEALTH BANNER */}
        <div className="mt-[12px] mx-[16px] bg-[#13131F] border border-[#252538] rounded-[14px] p-[12px_16px] flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-dm-sans font-semibold text-[14px] text-[#EFEFFF]">📋 Menu Health</span>
            <span className="font-dm-sans text-[12px] text-[#6B6B6B] mt-[2px]">{totalItems} items · {soldOutItems} sold out · {hiddenItems} hidden</span>
          </div>
          <div className="flex gap-[8px]">
            <span className="font-dm-sans font-medium text-[12px] text-[#00C853]">✅ {totalItems - soldOutItems - hiddenItems}</span>
            {soldOutItems > 0 && <span className="font-dm-sans font-medium text-[12px] text-[#FF3B30]">❌ {soldOutItems}</span>}
            {hiddenItems > 0 && <span className="font-dm-sans font-medium text-[12px] text-[#6B6B6B]">👁 {hiddenItems}</span>}
          </div>
        </div>

        {/* CATEGORY TAB BAR */}
        <div className="mt-[12px] px-[16px] overflow-x-auto no-scrollbar flex gap-[8px] sticky top-0 z-10 bg-[#0A0A14] py-[4px]">
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 h-[32px] px-[14px] rounded-[20px] font-dm-sans text-[13px] transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#FF6B00] font-bold text-white' 
                    : 'bg-[#13131F] border border-[#252538] text-[#6B6B6B] font-regular'
                }`}
              >
                {cat} <span className={activeCategory === cat ? 'text-white' : 'text-[#6B6B6B]'}>({count})</span>
              </button>
            )
          })}
          <button className="shrink-0 h-[32px] px-[14px] rounded-[20px] font-dm-sans font-medium text-[13px] text-[#FF6B00] bg-transparent border-[1.5px] border-dashed border-[#252538]">
            + Add Category
          </button>
        </div>

        {/* SORT + FILTER ROW */}
        <div className="mt-[10px] px-[16px] overflow-x-auto no-scrollbar flex gap-[8px]">
          {SORT_OPTIONS.map(sort => (
            <button
              key={sort}
              onClick={() => setActiveSort(sort)}
              className={`shrink-0 h-[30px] px-[12px] rounded-[20px] font-dm-sans text-[12px] transition-colors border ${
                activeSort === sort 
                  ? 'bg-[#1C1C2E] border-[#FF6B00] font-medium text-[#FF6B00]' 
                  : 'bg-[#13131F] border-[#252538] text-[#6B6B6B] font-regular'
              }`}
            >
              {sort === 'Default' ? '↕ Sort: Default' : sort === 'Bestsellers First' ? '🔥 Bestsellers First' : sort === 'Sold Out First' ? '❌ Sold Out First' : '₹ Price: Low–High'}
            </button>
          ))}
        </div>

        {/* ITEM CARDS */}
        <div className="mt-[12px] px-[16px] flex flex-col gap-[10px] pb-[80px]">
          {filteredItems.length === 0 ? (
            <div className="py-[60px] flex flex-col items-center justify-center">
               <Utensils size={56} className="text-[#252538] mb-[16px]" />
               <span className="font-baloo font-bold text-[22px] text-[#EFEFFF]">Menu abhi khali hai</span>
               <span className="font-dm-sans text-[14px] text-[#6B6B6B] mt-1 mb-[20px]">Apna pehla item add karo!</span>
               <button onClick={openAddMenu} className="w-[200px] h-[48px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-[16px] font-dm-sans font-bold text-[15px] text-white">
                 + Add First Item
               </button>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`flex rounded-[20px] p-[14px] transition-colors overflow-hidden relative ${
                  isBulkMode && selectedItemIds.has(item.id) 
                    ? 'bg-[#1C1C2E] border-[2px] border-[#FF6B00]' 
                    : !item.isVisible
                      ? 'bg-[#0F0F1A] border border-dashed border-[#252538] opacity-75'
                      : !item.isAvailable
                        ? 'bg-[#0F0F1A] border border-[#1C1C2E]'
                        : 'bg-[#13131F] border border-[#252538] shadow-[0_2px_12px_rgba(0,0,0,0.2)]'
                }`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!isBulkMode) {
                    setIsBulkMode(true);
                    setSelectedItemIds(new Set([item.id]));
                  }
                }}
              >
                {/* Checkbox for Bulk Mode */}
                {isBulkMode && (
                  <div className="mr-[12px] pt-[2px]" onClick={() => toggleSelect(item.id)}>
                    <div className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center ${selectedItemIds.has(item.id) ? 'bg-[#FF6B00] border-[#FF6B00]' : 'border-[#252538]'}`}>
                      {selectedItemIds.has(item.id) && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center flex-wrap gap-[6px] mb-[6px]">
                    <span className={`font-dm-sans font-semibold text-[15px] truncate max-w-[150px] ${(!item.isAvailable || !item.isVisible) ? 'text-[#6B6B6B]' : 'text-[#EFEFFF]'}`}>
                      {item.name}
                    </span>
                    {item.isBestseller && (
                      <span className="bg-[#FF6B00] rounded-[4px] px-[6px] py-[2px] font-dm-sans font-bold text-[10px] text-white">🔥 Best</span>
                    )}
                    {item.isNew && (
                      <span className="bg-[#1C1C2E] border border-[#FFD600] rounded-[4px] px-[6px] py-[2px] font-dm-sans font-bold text-[10px] text-[#FFD600]">✨ New</span>
                    )}
                  </div>
                  
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B]">
                    {item.category} · {item.spiceLevel === 'Mild' ? '😊 Mild' : item.spiceLevel === 'Medium' ? '🌶 Medium' : item.spiceLevel === 'Spicy' ? '🌶🌶 Spicy' : '🔥 Extra'}
                  </span>
                  
                  <span className="font-dm-sans text-[12px] text-[#6B6B6B] truncate max-w-[90%] mt-[4px]">
                    {item.description}
                  </span>

                  {!item.isVisible && (
                    <span className="font-dm-sans italic text-[12px] text-[#6B6B6B] mt-[4px]">👁 Hidden from customers</span>
                  )}

                  <div className="flex items-baseline gap-[10px] mt-[8px]">
                     <span className={`font-space-grotesk font-bold text-[18px] ${(!item.isAvailable || !item.isVisible) ? 'text-[#6B6B6B]' : 'text-[#FF6B00]'}`}>₹{item.price}</span>
                     <span className="font-dm-sans text-[11px] text-[#6B6B6B]">Sold: {item.totalSold}</span>
                  </div>

                  {/* Availability Toggle Row */}
                  <div className="flex items-center justify-between mt-[12px] max-w-[140px]">
                    <span className={`font-dm-sans font-medium text-[13px] ${item.isAvailable ? 'text-[#EFEFFF]' : 'text-[#FF3B30]'}`}>
                      {item.isAvailable ? 'Available' : '❌ Sold Out'}
                    </span>
                    <button 
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors ${item.isAvailable ? 'bg-[#00C853]' : 'bg-[#252538]'}`}
                    >
                      <motion.div 
                        layout 
                        className={`w-[20px] h-[20px] rounded-full ${item.isAvailable ? 'bg-white' : 'bg-[#6B6B6B]'}`}
                        initial={false}
                        animate={{ x: item.isAvailable ? 20 : 0 }}
                      />
                    </button>
                  </div>
                </div>

                <div className="w-[90px] shrink-0 ml-[12px] flex flex-col items-center">
                   <div className="w-[90px] h-[90px] rounded-[14px] bg-[#1C1C2E] overflow-hidden relative flex items-center justify-center">
                     {item.photo ? (
                       <Image src={item.photo} alt={item.name} layout="fill" objectFit="cover" className={!item.isAvailable ? 'grayscale opacity-70' : ''} />
                     ) : (
                       <div className="flex flex-col items-center">
                         <ImageIcon size={20} className="text-[#6B6B6B] mb-[2px]" />
                         <span className="font-dm-sans text-[10px] text-[#6B6B6B]">Add photo</span>
                       </div>
                     )}
                     {!item.isAvailable && (
                       <div className="absolute bg-[#FF3B30] text-white font-dm-sans font-bold text-[10px] px-2 py-1 rotate-[-15deg] rounded shadow-md z-10 flex">
                         SOLD OUT
                       </div>
                     )}
                   </div>
                   
                   {!isBulkMode && (
                     <div className="flex w-full gap-[6px] mt-[8px]">
                       <button onClick={() => openEditMenu(item)} className="flex-1 h-[28px] bg-[#1C1C2E] border border-[#252538] rounded-[8px] flex items-center justify-center active:scale-90 transition-transform">
                         <Edit2 size={12} className="text-[#FF6B00]" />
                       </button>
                       <button onClick={() => handleDelete(item.id)} className="flex-1 h-[28px] bg-[#1C1C2E] border border-[#252538] rounded-[8px] flex items-center justify-center active:scale-90 transition-transform">
                         <Trash2 size={12} className="text-[#FF3B30]" />
                       </button>
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* BULK ACTION BAR */}
      <AnimatePresence>
        {isBulkMode && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="absolute bottom-[64px] w-full bg-[#13131F] border-t border-[#252538] pb-safe z-40 flex shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
          >
            {[
              { label: 'Available', icon: <Check size={20} className="text-[#00C853] mb-[4px]"/> },
              { label: 'Sold Out', icon: <X size={20} className="text-[#FF3B30] mb-[4px]"/> },
              { label: 'Hide', icon: <EyeOff size={20} className="text-[#6B6B6B] mb-[4px]"/> },
              { label: 'Delete', icon: <Trash2 size={20} className="text-[#FF3B30] mb-[4px]"/> }
            ].map(action => (
              <button key={action.label} className="flex-1 h-[64px] flex flex-col items-center justify-center active:bg-[#1C1C2E] transition-colors">
                 {action.icon}
                 <span className={`font-dm-sans font-medium text-[12px] ${
                   action.label === 'Available' ? 'text-[#00C853]' : 
                   (action.label === 'Sold Out' || action.label === 'Delete') ? 'text-[#FF3B30]' : 
                   'text-[#6B6B6B]'
                 }`}>{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT BOTTOM SHEET Overlay */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 z-50 overflow-hidden touch-none" 
              onClick={() => setIsSheetOpen(false)} 
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} 
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[85%] bg-[#13131F] rounded-t-[24px] shadow-2xl z-50 flex flex-col pt-[8px]"
            >
               <div className="w-[40px] h-[4px] bg-[#252538] rounded-full mx-auto shrink-0 mb-[16px]"></div>
               
               <div className="px-[16px] flex justify-between items-center shrink-0 mb-[16px]">
                  <h2 className="font-baloo font-bold text-[20px] text-[#EFEFFF]">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                  <button onClick={() => setIsSheetOpen(false)} className="w-[36px] h-[36px] bg-[#1C1C2E] rounded-full flex items-center justify-center active:scale-90 transition-transform">
                    <X size={16} className="text-[#6B6B6B]" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto px-[16px] hide-scrollbar pb-[100px] flex flex-col gap-[16px]">
                 
                 {/* Photo Section */}
                 <div className="w-full h-[160px] bg-[#1C1C2E] border-2 border-dashed border-[#252538] rounded-[16px] flex flex-col items-center justify-center relative overflow-hidden">
                   {editingItem?.photo ? (
                     <>
                       <Image src={editingItem.photo} alt="Preview" layout="fill" objectFit="cover" />
                       <div className="absolute inset-0 bg-black/30"></div>
                       <button className="absolute bottom-[12px] right-[12px] w-[32px] h-[32px] bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg active:scale-95">
                         <Edit2 size={14} className="text-white" />
                       </button>
                     </>
                   ) : (
                     <>
                       <ImagePlus size={36} className="text-[#FF6B00] mb-[8px]" />
                       <span className="font-dm-sans font-medium text-[13px] text-[#6B6B6B]">Item ki photo daalo</span>
                       <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">(Best: 400x400px square)</span>
                     </>
                   )}
                 </div>

                 {/* Focus outline styles added generically via class */}
                 <div className="flex flex-col gap-[4px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Item ka naam *</label>
                   <input 
                     type="text" value={formName} onChange={e => setFormName(e.target.value)} maxLength={60}
                     placeholder="Jaise: Malai Kulfi"
                     className="bg-[#13131F] border border-[#252538] rounded-[14px] p-[14px] font-dm-sans text-[14px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none focus:border-[#FF6B00] focus:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all"
                   />
                 </div>

                 <div className="flex flex-col gap-[4px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Price (₹) *</label>
                   <div className="relative flex items-center bg-[#13131F] border border-[#252538] rounded-[14px] focus-within:border-[#FF6B00] focus-within:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all overflow-hidden">
                     <span className="pl-[14px] font-space-grotesk font-bold text-[18px] text-[#6B6B6B]">₹</span>
                     <input 
                       type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)}
                       placeholder="0"
                       className="w-full bg-transparent p-[12px_14px_12px_8px] font-space-grotesk font-bold text-[18px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none"
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-[4px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Category</label>
                   <div className="flex flex-wrap gap-[8px]">
                     {['Kulfi', 'Chaat', 'Drinks', 'Specials'].map(cat => (
                        <button key={cat} onClick={()=>setFormCategory(cat)} className={`px-[16px] py-[8px] rounded-full font-dm-sans text-[13px] border transition-colors ${formCategory === cat ? 'bg-[#1C1C2E] border-[#FF6B00] text-[#FF6B00] font-medium' : 'bg-[#13131F] border-[#252538] text-[#EFEFFF]'}`}>
                          {cat}
                        </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex flex-col gap-[4px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Teekha kitna? 🌶</label>
                   <div className="flex flex-wrap gap-[8px]">
                     {(['Mild', 'Medium', 'Spicy', 'Extra'] as const).map(spice => (
                        <button key={spice} onClick={()=>setFormSpice(spice)} className={`px-[12px] py-[8px] rounded-[10px] font-dm-sans text-[13px] border transition-colors ${formSpice === spice ? 'bg-[#1C1C2E] border-[#FF6B00] text-white font-medium' : 'bg-[#13131F] border-[#252538] text-[#6B6B6B]'}`}>
                          {spice === 'Mild' ? '😊 Mild' : spice === 'Medium' ? '🌶 Medium' : spice === 'Spicy' ? '🌶🌶 Spicy' : '🔥 Extra'}
                        </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex flex-col gap-[4px]">
                   <label className="font-dm-sans font-medium text-[13px] text-[#EFEFFF]">Short description</label>
                   <textarea 
                     value={formDesc} onChange={e => setFormDesc(e.target.value)} maxLength={120} rows={3}
                     placeholder="Item ke baare mein kuch words..."
                     className="bg-[#13131F] border border-[#252538] rounded-[14px] p-[14px] font-dm-sans text-[13px] text-[#EFEFFF] placeholder-[#6B6B6B] outline-none focus:border-[#FF6B00] focus:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all resize-none"
                   />
                   <span className="text-right font-dm-sans text-[10px] text-[#6B6B6B] mt-[2px]">{formDesc.length}/120</span>
                 </div>

                 <div className="w-full h-[1px] bg-[#252538] my-[4px]"></div>

                 <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">🔥 Bestseller mark karo?</span>
                      <span className="font-dm-sans text-[11px] text-[#6B6B6B] mt-[2px]">Top mein dikhega</span>
                    </div>
                    <button onClick={() => setFormBestseller(!formBestseller)} className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors ${formBestseller ? 'bg-[#FF6B00]' : 'bg-[#252538]'}`}>
                      <motion.div layout className={`w-[20px] h-[20px] rounded-full ${formBestseller ? 'bg-white' : 'bg-[#6B6B6B]'}`} initial={false} animate={{ x: formBestseller ? 20 : 0 }} />
                    </button>
                 </div>

                 <div className="flex justify-between items-center mt-[4px]">
                    <span className="font-dm-sans font-medium text-[14px] text-[#EFEFFF]">Customers ko dikhao?</span>
                    <button onClick={() => setFormVisible(!formVisible)} className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors ${formVisible ? 'bg-[#00C853]' : 'bg-[#252538]'}`}>
                      <motion.div layout className={`w-[20px] h-[20px] rounded-full ${formVisible ? 'bg-white' : 'bg-[#6B6B6B]'}`} initial={false} animate={{ x: formVisible ? 20 : 0 }} />
                    </button>
                 </div>

               </div>

               <div className="absolute bottom-0 left-0 w-full p-[16px] bg-gradient-to-t from-[#13131F] via-[#13131F] to-transparent pt-[30px] pb-[40px]">
                 <button 
                  onClick={handleSaveForm}
                  className="w-full h-[54px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-[16px] font-dm-sans font-bold text-[16px] text-white shadow-[0_4px_16px_rgba(255,107,0,0.3)] active:scale-[0.98] transition-transform"
                 >
                   {editingItem ? 'Save Changes' : 'Add Item to Menu'}
                 </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR (Dark) */}
      <div className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#0A0A14] border-t border-[#252538] flex items-center justify-between px-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-[60]">
        {[
          { id: 'home', icon: Home, label: 'Home', badge: 0, path: '/vendor-dashboard' },
          { id: 'orders', icon: ClipboardList, label: 'Orders', badge: 0, path: '/vendor-orders' },
          { id: 'menu', icon: Utensils, label: 'Menu', badge: 0, path: '/vendor-menu' },
          { id: 'stats', icon: BarChart3, label: 'Stats', badge: 0, path: '/vendor-analytics' },
          { id: 'settings', icon: Settings, label: 'Settings', badge: 0, path: '/vendor-settings' },
        ].map(tab => {
          const isActive = tab.id === 'menu';
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
