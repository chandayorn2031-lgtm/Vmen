import React, { useState } from 'react';
import { ShieldCheck, Headphones, RotateCcw, Award, ArrowRight, CheckCircle2, Database, Sparkles } from 'lucide-react';
import { saveSubscriberEmail } from '../firebase/store';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    try {
      setSubscribing(true);
      setErrorMsg('');
      await saveSubscriberEmail(email.trim());
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not subscribe right now. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const guarantees = [
    {
      icon: ShieldCheck,
      title: 'SECURE PAYMENT',
      desc: '100% Protected',
    },
    {
      icon: Headphones,
      title: '24/7 SUPPORT',
      desc: "We're Here To Help",
    },
    {
      icon: RotateCcw,
      title: 'EASY RETURNS',
      desc: '30 Days Return',
    },
    {
      icon: Award,
      title: 'PREMIUM QUALITY',
      desc: 'Best Quality Products',
    },
  ];

  return (
    <footer className="bg-[#EFEAE2] border-t border-[#DFD8CB]">
      
      {/* Guarantees Bar matching bottom of screenshot */}
      <div className="border-b border-[#DFD8CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DDD5C7] py-6 sm:py-8">
            {guarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 px-3 sm:px-6 py-3 sm:py-0">
                  <div className="p-2.5 rounded-full bg-white text-[#161616] shadow-xs shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h5 className="font-sans font-extrabold text-xs sm:text-sm text-[#161616] uppercase tracking-wider">
                      {item.title}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-[#736B5F] font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer & Newsletter with Google Firestore Database Sync */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Brand info & Google Cloud Database Badge */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-4xl text-[#161616] tracking-tight">
                URBAN FIT
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#B38D64]"></span>
            </div>
            <p className="text-sm text-[#6A6459] max-w-sm leading-relaxed">
              Curated architectural streetwear, oversized essentials, and capsule drops.
              Designed for daily movement with heavyweight materials.
            </p>

            {/* Google Cloud Firestore Storage Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/80 border border-[#D5CDBC] text-xs font-semibold text-[#4A453C]">
              <Database className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Database stored in Google Cloud Firestore</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 text-sm">
            <div>
              <h6 className="font-extrabold text-xs uppercase tracking-widest text-[#161616] mb-3">
                COLLECTIONS
              </h6>
              <ul className="space-y-2 text-[#6A6459]">
                <li><a href="#catalog-section" className="hover:text-[#161616]">Summer Essentials</a></li>
                <li><a href="#catalog-section" className="hover:text-[#161616]">Heavy Hoodies</a></li>
                <li><a href="#catalog-section" className="hover:text-[#161616]">Puffer Vests</a></li>
                <li><a href="#catalog-section" className="hover:text-[#161616]">Varsity Bombers</a></li>
                <li><a href="#catalog-section" className="hover:text-[#161616]">Footwear</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-extrabold text-xs uppercase tracking-widest text-[#161616] mb-3">
                SUPPORT
              </h6>
              <ul className="space-y-2 text-[#6A6459]">
                <li><span className="hover:text-[#161616] cursor-pointer">Order Tracking</span></li>
                <li><span className="hover:text-[#161616] cursor-pointer">Size Guide</span></li>
                <li><span className="hover:text-[#161616] cursor-pointer">Shipping & Customs</span></li>
                <li><span className="hover:text-[#161616] cursor-pointer">Return Portal</span></li>
                <li><span className="hover:text-[#161616] cursor-pointer">Google Auth Help</span></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup (Stores to Google Firestore) */}
          <div className="lg:col-span-4 bg-[#E4DDD0] p-6 rounded-2xl border border-[#D3C9B9]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6D45] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              VIP EARLY ACCESS
            </div>
            <h5 className="font-sans font-extrabold text-base text-[#161616] uppercase tracking-wide mb-1">
              GET 15% OFF YOUR FIRST DROP
            </h5>
            <p className="text-xs text-[#6A6459] mb-4">
              Subscribe to unlock private drops, lookbooks, and exclusive discounts saved to our Google database.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You're on the list! Use code URBAN15 at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-white border border-[#D1C6B4] rounded-lg px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#161616]"
                    disabled={subscribing}
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-[#161616] hover:bg-[#2B2926] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
                  >
                    <span>{subscribing ? 'Joining...' : 'Join'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errorMsg && <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>}
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#DFD8CB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8376] gap-4">
          <p>© {new Date().getFullYear()} URBAN FIT. All rights reserved. Google Cloud Database Integrated.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-[#161616]">Privacy Policy</span>
            <span className="cursor-pointer hover:text-[#161616]">Terms of Service</span>
            <span className="cursor-pointer hover:text-[#161616]">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
