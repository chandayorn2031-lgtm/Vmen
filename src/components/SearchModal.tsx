import React, { useState } from 'react';
import { X, Search as SearchIcon, ArrowRight, Tag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const popularSearches = ['Hoodie', 'Sneakers', 'Varsity Jacket', 'Puffer Vest', 'Summer'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E5DFD3] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D6] flex items-center gap-3 bg-white">
          <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Summer Essentials (e.g. sneakers, hoodie, vest)..."
            className="flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-bold text-gray-400 hover:text-black uppercase mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        {!searchTerm && (
          <div className="p-5 border-b border-[#EAE4D8] bg-[#F5F1E9]">
            <span className="text-[11px] font-bold text-[#7E776C] uppercase tracking-wider block mb-2">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-3 py-1 bg-white hover:bg-[#161616] hover:text-white rounded-full text-xs font-semibold text-gray-700 border border-[#DDD5C7] transition-all flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5 space-y-3">
          {searchTerm && results.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              No matching pieces found for "{searchTerm}".
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#E8E2D6] hover:border-[#C2A47E] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-contain bg-[#FAF9F6] p-1 rounded-lg border border-gray-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#161616] uppercase group-hover:text-[#8C6D45] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-sans font-bold text-sm text-[#B38D64]">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="p-1.5 rounded-full bg-[#FAF9F6] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
