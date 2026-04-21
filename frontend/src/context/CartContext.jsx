import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produit, quantite = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.produit.id === produit.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.produit.id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prevCart, { produit, quantite }];
    });
  };

  const removeFromCart = (produitId) => {
    setCart((prevCart) => prevCart.filter((item) => item.produit.id !== produitId));
  };

  const updateQuantity = (produitId, quantite) => {
    if (quantite <= 0) {
      removeFromCart(produitId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.produit.id === produitId ? { ...item, quantite } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.produit.prix * item.quantite, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantite, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}