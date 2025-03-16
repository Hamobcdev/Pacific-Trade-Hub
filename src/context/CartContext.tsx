// src/context/CartContext.tsx
import { createContext, useContext, useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const CartContext = createContext<{
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
} | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });

  const addToCart = (item: CartItem) => {
    const existingItem = cart.items.find((i) => i.id === item.id);
    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      newItems = [...cart.items, item];
    }
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setCart({ items: newItems, total });
  };

  const removeFromCart = (id: number) => {
    const newItems = cart.items.filter((i) => i.id !== id);
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setCart({ items: newItems, total });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity >= 0) {
      const newItems = cart.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      setCart({ items: newItems, total });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};