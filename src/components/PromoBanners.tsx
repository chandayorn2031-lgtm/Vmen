import React from 'react';
import { Tag, Globe } from 'lucide-react';

interface PromoBannersProps {
  onClaimPromo?: () => void;
  onExploreFreeShipping?: () => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({
  onClaimPromo,
  onExploreFreeShipping,
}) => {
  return (
    <section className="py-6 sm:py-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Left: Limited Time Offer (Dark Banner matching screenshot) */}
          <div 
            onClick={onClaimPromo}
            className="group relative bg-[#181818] text-white p-6 sm:p-8 rounded-xl flex items-center gap-5 sm:gap-6 border border-[#2D2D2D] hover:border-[#B38D64] transition-all cursor-pointer shadow-md hover:shadow-xl overflow-hidden"
          >
            {/* Background subtle glow effect */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#B38D64]/10 rounded-full blur-2xl group-hover:bg-[#B38D64]/20 transition-all pointer-events-none"></div>

            {/* Circular icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#282828] border border-[#3D3D3D] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#B38D64] transition-all">
              <Tag className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4B58F] transform -rotate-45" />
            </div>

            {/* Text details */}
            <div className="flex-1">
              <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#A8A49C] mb-1">
                LIMITED TIME OFFER
              </div>
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
                <span className="text-white">UP TO </span>
                <span className="text-[#D4B58F]">50% OFF</span>
              </div>
            </div>
          </div>

          {/* Right: Free Shipping Worldwide (Beige / Tan Banner matching screenshot) */}
          <div 
            onClick={onExploreFreeShipping}
            className="group relative bg-[#E6DACB] text-[#181614] p-6 sm:p-8 rounded-xl flex items-center gap-5 sm:gap-6 border border-[#D5C7B5] hover:border-[#A4805A] transition-all cursor-pointer shadow-md hover:shadow-xl overflow-hidden"
          >
            {/* Background subtle light accent */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>

            {/* Circular icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D8C9B8] border border-[#C5B49F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-[#1C1A17]" />
            </div>

            {/* Text details */}
            <div className="flex-1">
              <div className="font-sans font-black text-lg sm:text-xl lg:text-2xl uppercase tracking-wider text-[#181614] leading-tight mb-1">
                FREE SHIPPING WORLDWIDE
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#5C5346]">
                ON ORDERS OVER $75
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
