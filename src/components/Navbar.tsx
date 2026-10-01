import React, { useState } from 'react';
import { Search, User as UserIcon, ShoppingBag, Heart, Menu, X, CheckCircle, LogOut } from 'lucide-react';
import { CategoryType } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const categories: { label: string; value: CategoryType; isSale?: boolean }[] = [
    { label: 'NEW IN', value: 'NEW IN' },
    { label: 'MEN', value: 'MEN' },
    { label: 'WOMEN', value: 'WOMEN' },
    { label: 'ACCESSORIES', value: 'ACCESSORIES' },
    { label: 'SALE', value: 'SALE', isSale: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E4DD] transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#161616] text-[#E8DFD3] text-xs py-1.5 px-4 text-center font-medium tracking-wider uppercase flex items-center justify-center gap-2">
        <span>⚡ SUMMER DROP 01 IS LIVE</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-[#C2A47E]">FREE WORLDWIDE SHIPPING ON ORDERS OVER $75</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo matching the screenshot */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onSelectCategory('ALL')}
              className="group flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="flex items-center">
                <span className="font-display text-3xl sm:text-4xl tracking-tight text-[#161616] group-hover:text-[#B38D64] transition-colors">
                  URBAN FIT
                </span>
                <span className="ml-1 w-2 h-2 rounded-full bg-[#B38D64]"></span>
              </div>
            </button>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`text-sm tracking-widest font-semibold transition-all relative py-2 ${
                    cat.isSale
                      ? 'text-[#B38D64] hover:text-[#97734C]'
                      : isActive
                      ? 'text-[#161616]'
                      : 'text-[#5A5752] hover:text-[#161616]'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#161616] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#222] hover:text-[#B38D64] hover:bg-[#F0ECE1] rounded-full transition-colors"
              title="Search collection"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#222] hover:text-[#B38D64] hover:bg-[#F0ECE1] rounded-full transition-colors relative"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B38D64] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User / Account */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F0ECE1] transition-colors border border-[#DDD7CD]"
                    title={currentUser.displayName || currentUser.email || 'My Account'}
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#161616] text-[#E8DFD3] text-xs font-bold flex items-center justify-center">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E8E4DD] py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {currentUser.displayName || currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF9F6] flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Google Firestore Synced
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="p-2 text-[#222] hover:text-[#B38D64] hover:bg-[#F0ECE1] rounded-full transition-colors"
                  title="Sign In with Google"
                  aria-label="User Account"
                >
                  <UserIcon className="w-5 h-5 stroke-[2]" />
                </button>
              )}
            </div>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="p-2 text-[#222] hover:text-[#B38D64] hover:bg-[#F0ECE1] rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#161616] text-[#E8DFD3] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#222] hover:bg-[#F0ECE1] rounded-md"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drop */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E4DD] space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-base font-semibold tracking-wider ${
                  cat.isSale ? 'text-[#B38D64]' : 'text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
