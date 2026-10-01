import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Custom visual overlay rendering for the iconic screenshot graphic details:
  // e.g. "CHAOTIC" text on the hoodie, "R" letter on the varsity jacket
  const isChaoticHoodie = product.name === 'HOODIE';
  const isVarsity = product.name === 'VARSITY JACKET';

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#F6F4EE] rounded-xl overflow-hidden border border-[#E5DFD3] hover:border-[#C2A47E] transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.tag && (
          <span className="bg-[#161616] text-white text-[11px] font-black tracking-widest px-2.5 py-1 rounded-sm uppercase shadow-xs">
            {product.tag}
          </span>
        )}
      </div>

      {/* Wishlist toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 shadow-sm'
            : 'bg-white/80 text-gray-500 hover:text-rose-600 hover:bg-white'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image container */}
      <div className="relative aspect-square w-full bg-[#EDEDE9] overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Specialized aesthetic graphic overlays to mirror the image exactly */}
        {isChaoticHoodie && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
            <span className="font-display text-2xl sm:text-3xl text-white tracking-[0.2em] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter blur-[0.3px]">
              CHAOTIC
            </span>
          </div>
        )}

        {isVarsity && (
          <div className="absolute top-1/3 left-1/3 transform -translate-x-2 -translate-y-1 pointer-events-none">
            <span className="font-display text-4xl text-[#FAF8F5] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              R
            </span>
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/90 hover:bg-white text-[#161616] text-xs font-bold py-2 px-3 rounded-md shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information matching the screenshot */}
      <div className="p-4 sm:p-5 flex flex-col items-center text-center flex-1 justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-sans font-bold text-sm sm:text-base tracking-wider text-[#161616] uppercase">
            {product.name}
          </h3>

          {/* Price with signature warm camel/bronze color */}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-sans font-extrabold text-sm sm:text-base text-[#B38D64]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#8A847A] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quick size selection and Add to Bag */}
        <div className="mt-3 w-full pt-3 border-t border-[#EAE4D8]/80 flex flex-col gap-2">
          {product.sizes.length > 1 && (
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                    selectedSize === s
                      ? 'bg-[#161616] text-white'
                      : 'bg-[#ECE7DC] text-[#4E4A43] hover:bg-[#DDD5C6]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAdd}
            className={`w-full py-2 px-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#161616] hover:bg-[#2B2926] text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added ({selectedSize})
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
