import React from 'react';
import { ProductCard } from './ProductCard';
import { Product, CategoryType } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  // Filter products based on activeCategory
  const filteredProducts = products.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'SALE') return !!item.originalPrice || item.tag?.includes('OFF');
    return item.category === activeCategory;
  });

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E5DFD3] gap-4">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#B38D64]">
              SUMMER ESSENTIALS DROP
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#161616] tracking-tight uppercase">
              {activeCategory === 'ALL' ? 'FEATURED DROP' : activeCategory}
            </h2>
          </div>

          {/* Quick category switch pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['ALL', 'NEW IN', 'MEN', 'WOMEN', 'ACCESSORIES', 'SALE'] as CategoryType[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#161616] text-[#FAF9F6] shadow-xs'
                    : 'bg-[#EFEAE2] text-[#635E55] hover:bg-[#E2DDD3] hover:text-[#161616]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid exactly matching screenshot */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F4F1EA] rounded-xl border border-dashed border-[#DCD5C9]">
            <SlidersHorizontal className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg mb-1">No items found in this drop</h3>
            <p className="text-sm text-gray-500 mb-4">Try choosing another category or viewing all items.</p>
            <button
              onClick={() => onSelectCategory('ALL')}
              className="bg-[#161616] text-white text-xs font-bold px-4 py-2 rounded-md tracking-wider uppercase"
            >
              View Full Collection
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
