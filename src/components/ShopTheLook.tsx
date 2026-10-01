import React, { useState } from 'react';
import { ArrowRight, Maximize2, ShoppingBag, Eye, X } from 'lucide-react';
import { LOOKBOOK_ITEMS } from '../data/initialProducts';
import { LookbookItem, Product } from '../types';

interface ShopTheLookProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({
  products,
  onQuickView,
  onAddToCart,
}) => {
  const [activeModalLook, setActiveModalLook] = useState<LookbookItem | null>(null);

  const handleOpenLook = (look: LookbookItem) => {
    setActiveModalLook(look);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with horizontal line and VIEW MORE matching screenshot */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="shrink-0">
            <h2 className="font-sans font-black text-xl sm:text-2xl text-[#161616] uppercase tracking-wider">
              SHOP THE LOOK
            </h2>
          </div>
          <div className="flex-1 hidden sm:block h-[1px] bg-[#DDD6CA] mx-4"></div>
          <button 
            onClick={() => handleOpenLook(LOOKBOOK_ITEMS[0])}
            className="group shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#161616] hover:text-[#B38D64] transition-colors"
          >
            <span>VIEW MORE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Lookbook cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {LOOKBOOK_ITEMS.map((look) => (
            <div
              key={look.id}
              onClick={() => handleOpenLook(look)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#ECE7DC] border border-[#DDD6CA] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Lookbook photograph */}
              <img
                src={look.image}
                alt={look.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.96]"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Floating Expand button on top right */}
              <div className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLook(look);
                  }}
                  className="p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                  title="Expand look"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom text info */}
              <div className="absolute inset-x-3 bottom-3 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4B58F] block mb-0.5">
                  {look.tag}
                </span>
                <h4 className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight truncate">
                  {look.title}
                </h4>
                <p className="text-[11px] text-gray-300 truncate mt-0.5">
                  {look.models}
                </p>

                {/* Micro CTA */}
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-semibold text-[#E6DACB]">
                  <span>Shop This Fit</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for viewing items inside the look */}
      {activeModalLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-2xl border border-[#E5DFD3]">
            {/* Close button */}
            <button
              onClick={() => setActiveModalLook(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-[3/4] sm:aspect-auto">
                <img
                  src={activeModalLook.image}
                  alt={activeModalLook.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 p-3 bg-black/60 backdrop-blur-md rounded-xl text-white text-xs">
                  <span className="text-[#D4B58F] font-bold block text-[10px] tracking-widest uppercase">
                    {activeModalLook.tag}
                  </span>
                  <div className="font-bold text-sm">{activeModalLook.title}</div>
                  <div className="text-gray-300 text-xs">{activeModalLook.models}</div>
                </div>
              </div>

              {/* Tagged products in this look */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans font-black text-lg text-[#161616] uppercase tracking-wider mb-1">
                    Featured In This Look
                  </h3>
                  <p className="text-xs text-[#7A746B] mb-4">
                    Instantly add the curated pieces from this drop to your bag.
                  </p>

                  <div className="space-y-3">
                    {products
                      .filter((p) =>
                        activeModalLook.featuredProductNames.some(
                          (name) => p.name.toLowerCase() === name.toLowerCase()
                        )
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#EFEAE2] border border-[#DDD5C7] hover:border-[#B38D64] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-[#161616] uppercase">{item.name}</h4>
                              <span className="text-xs font-bold text-[#B38D64]">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onAddToCart(item, item.sizes[0] || 'M');
                                setActiveModalLook(null);
                              }}
                              className="bg-[#161616] text-white p-2 rounded-lg hover:bg-[#333] transition-colors"
                              title="Add to bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onQuickView(item);
                                setActiveModalLook(null);
                              }}
                              className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5DFD3]">
                  <button
                    onClick={() => setActiveModalLook(null)}
                    className="w-full py-2.5 bg-[#161616] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#2F2D2A] transition-colors"
                  >
                    Done Exploring
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
