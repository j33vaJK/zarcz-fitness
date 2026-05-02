import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  get totalItems(): number;
  get totalPrice(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter(i => i.quantity > 0),
        }));
      },
      clearCart: () => set({ items: [] }),
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'zarcz-cart-storage',
    }
  )
);
