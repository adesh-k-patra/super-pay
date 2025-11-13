import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: string;
  type: 'product' | 'vendor';
  category: 'hotel-food' | 'supermart' | 'medicine' | 'electronics' | 'beauty' | 'pet' | 'home';
  name: string;
  price?: number;
  image?: string;
  rating?: number;
  vendorName?: string;
  addedAt: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => boolean;
  isInWishlist: (id: string) => boolean;
  getItemsByCategory: (category: string) => WishlistItem[];
  clearWishlist: () => void;
  getCount: () => number;
  getCountByCategory: (category: string) => number;
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
  lastAddedCategory: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'delivery-now-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [lastAddedCategory, setLastAddedCategory] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    const exists = items.find(i => i.id === item.id);
    if (!exists) {
      setItems(prev => [...prev, { ...item, addedAt: Date.now() }]);
      setLastAddedCategory(item.category);
      setShowNotification(true);
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    const exists = items.find(i => i.id === item.id);
    if (exists) {
      removeItem(item.id);
      return false;
    } else {
      addItem(item);
      return true;
    }
  };

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  const getItemsByCategory = (category: string) => {
    if (category === 'all') {
      return items;
    }
    return items.filter(item => item.category === category);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const getCount = () => {
    return items.length;
  };

  const getCountByCategory = (category: string) => {
    if (category === 'all') {
      return items.length;
    }
    return items.filter(item => item.category === category).length;
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        getItemsByCategory,
        clearWishlist,
        getCount,
        getCountByCategory,
        showNotification,
        setShowNotification,
        lastAddedCategory
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
