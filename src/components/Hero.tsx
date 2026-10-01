import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative bg-[#ECE7DE] overflow-hidden border-b border-[#E0D9CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[640px] items-stretch">
          
          {/* Left Column: Typography & CTAs matching screenshot */}
          <div className="lg:col-span-6 flex flex-col justify-center py-12 sm:py-16 lg:py-20 z-10 pr-0 lg:pr-8">
            
            {/* Top eyebrow: NEW COLLECTION */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#877867] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase pb-1 border-b-2 border-[#C2A47E]">
                NEW COLLECTION
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#C2A47E]" />
            </div>

            {/* Giant Title: SUMMER ESSENTIALS */}
            <h1 className="font-display leading-[0.88] tracking-tight uppercase select-none">
              <span className="block text-6xl sm:text-8xl md:text-9xl text-[#161616]">
                SUMMER
              </span>
              <span className="block text-6xl sm:text-8xl md:text-9xl text-[#B38D64]">
                ESSENTIALS
              </span>
            </h1>

            {/* Sub-headline: — DROP NOW LIVE — */}
            <div className="flex items-center gap-3 my-6 sm:my-8 text-[#5E5950] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase">
              <span className="h-[1px] w-8 sm:w-12 bg-[#8C8375]"></span>
              <span>DROP NOW LIVE</span>
              <span className="h-[1px] w-8 sm:w-12 bg-[#8C8375]"></span>
            </div>

            {/* CTA Button: SHOP NOW -> */}
            <div className="flex items-center gap-4">
              <button
                onClick={onShopNow}
                className="group inline-flex items-center gap-3 bg-[#161616] hover:bg-[#2A2927] text-white px-8 py-3.5 sm:py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:translate-x-0.5 active:translate-y-0.5"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Stats preview */}
            <div className="mt-10 sm:mt-12 flex items-center gap-6 text-xs text-[#6F695F]">
              <div>
                <span className="block font-display text-2xl text-[#161616]">450 GSM</span>
                <span className="tracking-wider uppercase">Heavyweight Fabric</span>
              </div>
              <div className="h-8 w-[1px] bg-[#D4CCC0]"></div>
              <div>
                <span className="block font-display text-2xl text-[#161616]">LIMITED</span>
                <span className="tracking-wider uppercase">First Edition Drop</span>
              </div>
              <div className="h-8 w-[1px] bg-[#D4CCC0]"></div>
              <div>
                <span className="block font-display text-2xl text-[#161616]">GOOGLE CLOUD</span>
                <span className="tracking-wider uppercase">Firestore Synced</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Streetwear Models */}
          <div className="lg:col-span-6 relative flex items-end justify-center overflow-hidden min-h-[380px] lg:min-h-full">
            
            {/* Background architectural concrete element */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#ECE7DE] via-transparent to-transparent z-10 lg:hidden"></div>

            {/* Visual photoshoot mockup with custom composite styling */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Primary hero photo featuring the streetwear models */}
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-full max-h-[640px] rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                  alt="Summer Essentials Streetwear Models"
                  className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.03]"
                />
                
                {/* Secondary artistic mood layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ECE7DE] via-transparent to-black/20 mix-blend-multiply pointer-events-none"></div>
              </div>

              {/* Floating circular badge: UP TO 50% OFF (Matching screenshot top right) */}
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#D4B58F] border-[3px] border-[#BE9B6F] shadow-xl flex flex-col items-center justify-center text-[#181614] transform hover:rotate-6 transition-transform cursor-pointer select-none">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#57442F]">
                    UP TO
                  </span>
                  <span className="font-display text-3xl sm:text-4xl leading-none font-black text-[#161616]">
                    50%
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#57442F]">
                    OFF
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
