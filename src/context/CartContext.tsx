/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { toast } from "react-hot-toast";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  discount: number;
  featured: boolean;
  rating: number;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  grandTotal: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load cart items from localStorage on mount (client-only)
  React.useEffect(() => {
    try {
      const storedCart = localStorage.getItem("smartmart-cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart items to localStorage whenever they change
  React.useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("smartmart-cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = React.useCallback((product: IProduct, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.product._id === product._id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`, { id: `stock-${product._id}` });
        return;
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success(`Updated ${product.name} quantity in cart!`, { id: `add-${product._id}` });
    } else {
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`, { id: `stock-${product._id}` });
        return;
      }
      setCartItems((prevItems) => [...prevItems, { product, quantity }]);
      toast.success(`Added ${product.name} to cart!`, { id: `add-${product._id}` });
    }
  }, [cartItems]);

  const removeFromCart = React.useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
    toast.success("Removed item from cart.", { id: `remove-${productId}` });
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const existingItem = cartItems.find((item) => item.product._id === productId);
    if (existingItem) {
      if (quantity > existingItem.product.stock) {
        toast.error(`Only ${existingItem.product.stock} items left in stock`, { id: `stock-${productId}` });
        return;
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [cartItems, removeFromCart]);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce((total, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  // Delivery charge is FREE
  const grandTotal = subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
