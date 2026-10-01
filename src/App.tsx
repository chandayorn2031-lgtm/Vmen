/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testConnection } from './firebase/config';
import {
  getOrSeedProducts,
  getUserWishlist,
  toggleWishlistInDb,
  logoutUser
} from './firebase/store';
import { CategoryType, Product, CartItem, Order } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HighlightsBar } from './components/HighlightsBar';
import { ProductSection } from './components/ProductSection';
import { PromoBanners } from './components/PromoBanners';
import { ShopTheLook } from './components/ShopTheLook';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('urbanfit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('urbanfit_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('urbanfit_cart', JSON.stringify(cart));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('urbanfit_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error(err);
    }
  }, [wishlist]);

  // Check connection to Firestore and seed/fetch products
  useEffect(() => {
    const initApp = async () => {
      try {
        await testConnection();
        const loadedProducts = await getOrSeedProducts();
        setProducts(loadedProducts);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    initApp();
  }, []);

  // Listen for Google Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync wishlist from Google Firestore
        const cloudWishlist = await getUserWishlist(user.uid);
        if (cloudWishlist.length > 0) {
          setWishlist(Array.from(new Set([...wishlist, ...cloudWishlist])));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Add to cart handler
  const handleAddToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  // Toggle wishlist
  const handleToggleWishlist = async (productId: string) => {
    const isSaved = wishlist.includes(productId);
    const next = isSaved ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
    setWishlist(next);

    if (currentUser) {
      await toggleWishlistInDb(currentUser.uid, productId, !isSaved);
    }
  };

  // Order success handler
  const handleOrderSuccess = (order: Order) => {
    setCart([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161616] flex flex-col font-sans selection:bg-[#B38D64] selection:text-white">
      
      {/* 1. Header / Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => logoutUser()}
      />

      <main className="flex-1">
        {/* 2. Hero Section (SUMMER ESSENTIALS, Drop Now Live, Visual models, 50% OFF badge) */}
        <Hero onShopNow={scrollToCatalog} />

        {/* 3. Highlights / Value Propositions (Trending Now, Best Sellers, New Arrivals, Fast Delivery) */}
        <HighlightsBar
          onFilterBadge={(badge) => {
            if (badge === 'trending' || badge === 'bestseller') {
              setActiveCategory('ALL');
            } else if (badge === 'new') {
              setActiveCategory('NEW IN');
            }
            scrollToCatalog();
          }}
        />

        {/* 4. Product Section (SNEAKERS $49.99, HOODIE $59.99, PUFFER VEST $69.99, VARSITY JACKET $79.99) */}
        <ProductSection
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* 5. Split Promotional Banners (LIMITED TIME OFFER - UP TO 50% OFF | FREE SHIPPING WORLDWIDE) */}
        <PromoBanners
          onClaimPromo={() => {
            setActiveCategory('SALE');
            scrollToCatalog();
          }}
          onExploreFreeShipping={() => {
            setIsCartOpen(true);
          }}
        />

        {/* 6. Shop The Look Section (SHOP THE LOOK — VIEW MORE →, 4 lookbook photography cards) */}
        <ShopTheLook
          products={products}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* 7. Footer (Trust Guarantees, Google Cloud Firestore status, Newsletter) */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

    </div>
  );
}
