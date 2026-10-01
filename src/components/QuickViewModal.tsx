import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, Shield, Truck, Star } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isChaoticHoodie = product.name === 'HOODIE';
  const isVarsity = product.name === 'VARSITY JACKET';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E5DFD3] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white hover:text-black transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image visual */}
          <div className="relative aspect-square md:aspect-auto bg-[#EDE7DD] p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[380px] w-full object-contain filter drop-shadow-lg"
            />

            {/* Custom stylized text graphic overlays */}
            {isChaoticHoodie && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display text-4xl text-white tracking-[0.2em] font-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  CHAOTIC
                </span>
              </div>
            )}

            {isVarsity && (
              <div className="absolute top-1/3 left-1/3 pointer-events-none">
                <span className="font-display text-5xl text-[#FAF8F5] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  R
                </span>
              </div>
            )}

            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#161616] text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-sm uppercase">
                {product.tag}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#8C6D45] tracking-[0.2em] uppercase">
                  {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-bold text-gray-800">{product.rating || 4.9}</span>
                </div>
              </div>

              <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#161616] uppercase tracking-wide">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-sans font-extrabold text-2xl text-[#B38D64]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  <span>Select Size</span>
                  <span className="text-gray-400 underline cursor-pointer">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-[#161616] text-white shadow-xs'
                          : 'bg-[#EFEAE2] text-[#4F4A42] hover:bg-[#DDD5C7]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#161616] hover:bg-[#2B2926] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag ({selectedSize})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-[#DDD5C7] text-gray-600 hover:text-black bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-700" />
                  <span>Free shipping over $75</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-700" />
                  <span>30-Day Free Returns</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
