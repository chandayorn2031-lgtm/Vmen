import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Database, ArrowRight, Loader2, PackageCheck } from 'lucide-react';
import { CartItem, Order } from '../types';
import { createOrder } from '../firebase/store';
import { User } from 'firebase/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: User | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderSuccess,
}) => {
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 75;
  const shippingFee = isFreeShipping ? 0 : 12;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || !city || !postalCode) {
      setErrorMsg('Please fill in all shipping details');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newOrder: Order = {
        id: orderId,
        userId: currentUser ? currentUser.uid : 'guest',
        customerName: name.trim(),
        customerEmail: email.trim(),
        shippingAddress: `${address}, ${city}, ${postalCode}, ${country}`,
        items: [...items],
        totalAmount,
        status: 'placed',
        createdAt: new Date().toISOString(),
      };

      // Save order to Google Cloud Firestore database
      await createOrder(newOrder);

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      setErrorMsg('Failed to store order in Google Cloud Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E5DFD3] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#F4EFE6] border-b border-[#E8E2D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-sans font-black text-lg text-[#161616] uppercase tracking-wider">
              {completedOrder ? 'Order Confirmed' : 'Checkout & Google Cloud Order Sync'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <PackageCheck className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#B38D64]">
                PAYMENT CONFIRMED
              </span>
              <h2 className="font-display text-4xl text-[#161616] mt-1">
                THANK YOU FOR YOUR DROP ORDER
              </h2>
              <p className="text-xs text-gray-600 mt-2">
                Order ID: <span className="font-mono font-bold text-gray-900">{completedOrder.id}</span>
              </p>
            </div>

            {/* Google Cloud confirmation note */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 max-w-md mx-auto flex items-center gap-3 text-left">
              <Database className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Stored in Google Cloud Firestore</span>
                <span>Your order record has been written to Google Cloud Firestore with real-time tracking.</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E8E2D6] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-gray-500">
                <span>Shipping to:</span>
                <span className="font-semibold text-gray-800">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Address:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[240px]">
                  {completedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Total Charged:</span>
                <span className="font-bold text-[#B38D64] text-sm">
                  ${completedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#161616] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2B2926] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Google Cloud info note */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#EFEAE2] border border-[#DDD5C7] text-xs text-[#524B40]">
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>This checkout directly creates an order record in <strong>Google Cloud Firestore</strong>.</span>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#161616]">
                1. Shipping Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Alexander"
                    className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Street, Apt 4B"
                  className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                    className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#161616]"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Japan</option>
                    <option>France</option>
                    <option>Germany</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Review */}
            <div className="pt-4 border-t border-[#E8E2D6] space-y-3">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#161616]">
                2. Order Review ({items.length} item{items.length > 1 ? 's' : ''})
              </h4>

              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 truncate max-w-[280px]">
                      {item.quantity}x {item.name} ({item.size})
                    </span>
                    <span className="font-bold text-[#161616]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#EFEAE2] rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Worldwide Shipping</span>
                  <span>{isFreeShipping ? 'FREE ($75+ promotion)' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-black text-[#161616] text-sm pt-1 border-t border-[#DDD5C7]">
                  <span>Total Amount</span>
                  <span className="text-[#B38D64]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMsg}
              </p>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#DDD5C7] text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 bg-[#161616] hover:bg-[#2B2926] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Writing to Google Cloud...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order & Save to Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
