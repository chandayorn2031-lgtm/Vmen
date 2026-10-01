import React, { useEffect, useState } from 'react';
import { X, LogOut, CheckCircle, Database, Package, Calendar, Clock, Loader2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutUser, getUserOrders } from '../firebase/store';
import { Order } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      loadOrders(currentUser.uid);
    }
  }, [isOpen, currentUser]);

  const loadOrders = async (userId: string) => {
    try {
      setOrdersLoading(true);
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to load orders from Firestore:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Google Sign-In was cancelled or popup was closed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setOrders([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E5DFD3] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#F4EFE6] border-b border-[#E8E2D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="font-sans font-black text-lg text-[#161616] uppercase tracking-wider">
              {currentUser ? 'My Account & Cloud Orders' : 'Sign In with Google'}
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
        <div className="p-6 sm:p-8 space-y-6">
          {currentUser ? (
            <div className="space-y-6">
              
              {/* Profile Bar */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E8E2D6] shadow-xs">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#161616] text-[#E8DFD3] font-bold flex items-center justify-center text-lg">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-[#161616]">
                      {currentUser.displayName || 'Streetwear Enthusiast'}
                    </h4>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      Google Authenticated & Cloud Synced
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Past orders from Google Cloud Firestore */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#161616] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#B38D64]" />
                    Orders from Google Firestore ({orders.length})
                  </h4>
                  <button
                    onClick={() => loadOrders(currentUser.uid)}
                    className="text-[11px] font-bold text-[#8C6D45] hover:underline"
                  >
                    Refresh
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Querying Google Cloud Firestore...
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-white rounded-xl border border-[#E8E2D6] text-xs space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-gray-800">{ord.id}</span>
                          <span className="bg-[#EFEAE2] text-[#8C6D45] font-black uppercase text-[10px] px-2 py-0.5 rounded">
                            {ord.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-bold text-[#161616]">
                            ${ord.totalAmount.toFixed(2)} ({ord.items.length} items)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-[#F4EFE6] rounded-xl text-center border border-dashed border-[#DDD5C7]">
                    <p className="text-xs text-gray-600 mb-2">No orders placed yet with this account.</p>
                    <p className="text-[11px] text-gray-400">
                      When you check out, your purchases are permanently stored in Google Cloud Firestore.
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#EAE3D6] text-[#161616] flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-[#B38D64]" />
              </div>

              <div>
                <h4 className="font-display text-3xl text-[#161616] uppercase">
                  CONNECT WITH GOOGLE
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mt-2">
                  Sign in with your Google account to sync your cart, wishlist, and order history across devices with Google Cloud Firestore database storage.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200">
                  {errorMsg}
                </div>
              )}

              {/* Google Auth Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all"
              >
                {/* Google SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connecting with Google...' : 'Sign in with Google'}</span>
              </button>

              <div className="p-3 bg-[#EFEAE2] rounded-xl text-[11px] text-[#635B4E] flex items-center justify-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & stored in Google Cloud Firestore Database</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
