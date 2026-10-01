import React from 'react';
import { Flame, Star, Package, Truck } from 'lucide-react';

interface HighlightsBarProps {
  onFilterBadge?: (filter: string) => void;
}

export const HighlightsBar: React.FC<HighlightsBarProps> = ({ onFilterBadge }) => {
  const items = [
    {
      icon: Flame,
      title: 'TRENDING NOW',
      subtitle: 'Hot Right Now',
      color: 'text-[#B87042]',
      filterKey: 'trending',
    },
    {
      icon: Star,
      title: 'BEST SELLERS',
      subtitle: 'Top Picks',
      color: 'text-[#161616]',
      filterKey: 'bestseller',
    },
    {
      icon: Package,
      title: 'NEW ARRIVALS',
      subtitle: 'New Styles Added',
      color: 'text-[#161616]',
      filterKey: 'new',
    },
    {
      icon: Truck,
      title: 'FAST DELIVERY',
      subtitle: 'Across The World',
      color: 'text-[#161616]',
      filterKey: 'delivery',
    },
  ];

  return (
    <div className="bg-[#EFEAE2] border-b border-[#DFD8CB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DDD5C7] py-4 sm:py-6">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => onFilterBadge && onFilterBadge(item.filterKey)}
                className="flex items-center gap-3.5 px-3 sm:px-6 py-2.5 sm:py-0 cursor-pointer group hover:bg-[#E7E0D5]/50 transition-colors rounded-sm"
              >
                <div className={`p-2 rounded-full bg-white/70 shadow-xs group-hover:scale-110 transition-transform ${item.color}`}>
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold tracking-wider text-[#161616] uppercase font-sans">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#736B5F] font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
