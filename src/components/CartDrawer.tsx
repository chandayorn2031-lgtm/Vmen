import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-[#E5DFD3]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between bg-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#161616]" />
              <h2 className="font-sans font-black text-lg text-[#161616] uppercase tracking-wider">
                YOUR BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress (Matches promo banner: orders over $75) */}
          <div className="px-5 py-3.5 bg-[#EAE3D6] border-b border-[#D8CEBF] text-xs">
            {amountRemaining > 0 ? (
              <p className="text-[#4E483E] font-medium mb-1.5">
                Add <span className="font-bold text-[#161616]">${amountRemaining.toFixed(2)}</span> more to get <span className="font-bold text-[#8C6D45]">FREE WORLDWIDE SHIPPING</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-bold flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                You qualified for FREE WORLDWIDE SHIPPING!
              </p>
            )}
            <div className="w-full bg-[#D4C9BA] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#161616] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EAE3D6] flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-1">Your bag is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Discover the new Summer Essentials capsule drop.</p>
                <button
                  onClick={onClose}
                  className="bg-[#161616] text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-[#333] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#E8E2D6] shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg bg-[#F8F6F0] p-1.5 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-[#161616]">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-semibold text-gray-500 block">
                          Size: {item.size}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#DDD5C7] rounded-md bg-[#FAF9F6]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-[#EAE3D6] text-gray-600 rounded-l-md"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-[#EAE3D6] text-gray-600 rounded-r-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-[#B38D64]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D6] bg-[#F4EFE6] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5C564C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#161616]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worldwide Shipping</span>
                  <span className="font-bold text-[#161616]">
                    {amountRemaining === 0 ? 'FREE' : '$12.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#161616] pt-2 border-t border-[#DFD7C8]">
                  <span>Total</span>
                  <span className="text-[#B38D64]">
                    ${(subtotal + (amountRemaining === 0 ? 0 : 12)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#161616] hover:bg-[#2B2926] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Orders stored in Google Cloud Firestore with end-to-end encryption.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
