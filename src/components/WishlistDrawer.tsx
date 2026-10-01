import React from 'react';
import { X, Heart, ShoppingBag, Trash2, Database } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-[#E5DFD3]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between bg-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-current" />
              <h2 className="font-sans font-black text-lg text-[#161616] uppercase tracking-wider">
                WISHLIST ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-2.5 bg-[#EAE3D6] border-b border-[#D8CEBF] text-xs text-[#524B40] flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Synced in real-time with Google Cloud Firestore</span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EAE3D6] flex items-center justify-center text-gray-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Click the heart icon on any drop to save your favorite fits.</p>
                <button
                  onClick={onClose}
                  className="bg-[#161616] text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-[#333] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlistedProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#E8E2D6] shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg bg-[#F8F6F0] p-1.5 shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onQuickView(item);
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 
                          onClick={() => {
                            onClose();
                            onQuickView(item);
                          }}
                          className="font-sans font-bold text-xs uppercase tracking-wide text-[#161616] hover:text-[#8C6D45] cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <span className="font-bold text-xs text-[#B38D64]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => onAddToCart(item, item.sizes[0] || 'M')}
                        className="w-full py-2 bg-[#161616] hover:bg-[#2B2926] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
