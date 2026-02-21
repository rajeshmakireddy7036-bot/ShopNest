import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useAuth();
    const [initialized, setInitialized] = useState(false);

    // Initial load and migration
    useEffect(() => {
        const syncWishlist = async () => {
            const saved = localStorage.getItem('wishlist');
            let localWishlist = [];
            if (saved) {
                try {
                    localWishlist = JSON.parse(saved);
                } catch (e) {
                    console.error("Error parsing wishlist from localStorage:", e);
                }
            }

            if (user) {
                try {
                    // 1. Fetch current wishlist from backend
                    const response = await fetch(`/api/users/${user.id}/wishlist`);
                    if (response.ok) {
                        const backendWishlist = await response.json();

                        // 2. If we have local data, migrate it
                        if (localWishlist.length > 0) {
                            // Merge local and backend (avoid duplicates)
                            const merged = [...backendWishlist];
                            localWishlist.forEach(item => {
                                if (!merged.find(m => m.id === item.id)) {
                                    merged.push(item);
                                }
                            });

                            // 3. Send to backend
                            const updateResponse = await fetch(`/api/users/${user.id}/wishlist`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(merged)
                            });

                            if (updateResponse.ok) {
                                setWishlist(merged);
                                // 4. Delete from localStorage after successful verification
                                localStorage.removeItem('wishlist');
                            } else {
                                setWishlist(backendWishlist);
                            }
                        } else {
                            setWishlist(backendWishlist);
                        }
                    }
                } catch (error) {
                    console.error("Error syncing wishlist:", error);
                    setWishlist(localWishlist); // Fallback to local if backend fails during init
                }
            } else {
                // If not logged in, we only use memory state
                // But we still read from local storage once for guest session migration if needed
                // actually the prompt says "No... product... may be stored in localStorage"
                // so we should probably clear it if we are not logged in too
                setWishlist(localWishlist);
                if (localWishlist.length > 0) {
                    // For guest users, we might keep it in memory only.
                    // But if we want to follow the rule strictly, we clear it.
                    // localStorage.removeItem('wishlist'); // Clear it to comply with rules
                }
            }
            setInitialized(true);
        };

        syncWishlist();
    }, [user]);

    // Update backend when wishlist changes
    useEffect(() => {
        if (initialized && user) {
            const updateBackend = async () => {
                try {
                    await fetch(`/api/users/${user.id}/wishlist`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(wishlist)
                    });
                } catch (error) {
                    console.error("Error updating wishlist on backend:", error);
                }
            };
            updateBackend();
        }

        // Ensure no data stays in localStorage
        if (initialized) {
            localStorage.removeItem('wishlist');
        }
    }, [wishlist, user, initialized]);

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            setWishlist(prev => [...prev, product]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (wishlist.find(item => item.id === product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return !!wishlist.find(item => item.id === productId);
    };

    const wishlistCount = wishlist.length;

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            wishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
