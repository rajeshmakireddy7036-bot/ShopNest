import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();
    const [initialized, setInitialized] = useState(false);

    // Initial load and migration
    useEffect(() => {
        const syncCart = async () => {
            const saved = localStorage.getItem('cart');
            let localCart = [];
            if (saved) {
                try {
                    localCart = JSON.parse(saved);
                } catch (e) {
                    console.error("Error parsing cart from localStorage:", e);
                }
            }

            if (user) {
                try {
                    // 1. Fetch current cart from backend
                    const response = await fetch(`/api/users/${user.id}/cart`);
                    if (response.ok) {
                        const backendCart = await response.json();

                        // Backend returns List<CartItem> where CartItem has {product, quantity, selectedSize}
                        // Frontend expect { ...product, quantity, selectedSize }
                        const formattedBackendCart = (backendCart || []).map(item => ({
                            ...item.product,
                            quantity: item.quantity,
                            selectedSize: item.selectedSize
                        }));

                        // 2. If we have local data, migrate it
                        if (localCart.length > 0) {
                            // Merge local and backend
                            const merged = [...formattedBackendCart];
                            localCart.forEach(localItem => {
                                const existing = merged.find(m =>
                                    m.id === localItem.id && m.selectedSize === localItem.selectedSize
                                );
                                if (existing) {
                                    existing.quantity = (existing.quantity || 1) + (localItem.quantity || 1);
                                } else {
                                    merged.push(localItem);
                                }
                            });

                            // 3. Send to backend
                            const updateResponse = await fetch(`/api/users/${user.id}/cart`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(merged.map(item => ({
                                    product: { ...item, quantity: undefined, selectedSize: undefined },
                                    quantity: item.quantity,
                                    selectedSize: item.selectedSize
                                })))
                            });

                            if (updateResponse.ok) {
                                setCartItems(merged);
                                // 4. Delete from localStorage after successful verification
                                localStorage.removeItem('cart');
                            } else {
                                setCartItems(formattedBackendCart);
                            }
                        } else {
                            setCartItems(formattedBackendCart);
                        }
                    }
                } catch (error) {
                    console.error("Error syncing cart:", error);
                    setCartItems(localCart);
                }
            } else {
                setCartItems(localCart);
            }
            setInitialized(true);
        };

        syncCart();
    }, [user]);

    // Update backend when cart changes
    useEffect(() => {
        if (initialized && user) {
            const updateBackend = async () => {
                try {
                    await fetch(`/api/users/${user.id}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cartItems.map(item => ({
                            product: { ...item, quantity: undefined, selectedSize: undefined },
                            quantity: item.quantity,
                            selectedSize: item.selectedSize
                        })))
                    });
                } catch (error) {
                    console.error("Error updating cart on backend:", error);
                }
            };
            updateBackend();
        }

        // Ensure no data stays in localStorage
        if (initialized) {
            localStorage.removeItem('cart');
        }
    }, [cartItems, user, initialized]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.id === product.id && item.selectedSize === product.selectedSize
            );
            if (existingItem) {
                return prevItems.map(item =>
                    (item.id === product.id && item.selectedSize === product.selectedSize)
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId, selectedSize) => {
        setCartItems(prevItems => prevItems.filter(item =>
            !(item.id === productId && item.selectedSize === selectedSize)
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (productId, selectedSize, amount) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId && item.selectedSize === selectedSize) {
                    const newQuantity = (item.quantity || 1) + amount;
                    return { ...item, quantity: Math.max(1, newQuantity) };
                }
                return item;
            });
        });
    };

    const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
