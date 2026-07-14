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

  const addToCart = (product: IProduct, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items left in stock`);
          return prevItems;
        }
        toast.success(`Updated ${product.name} quantity in cart!`);
        return prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQuantity } : item
        );
      }
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`);
        return prevItems;
      }
      toast.success(`Added ${product.name} to cart!`);
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.product._id !== productId);
      toast.success("Removed item from cart.");
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items left in stock`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
