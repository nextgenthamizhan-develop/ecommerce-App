import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-cyan-300">
              <Sparkles size={14} />
            </div>
            <span className="text-lg font-black text-white tracking-wider">VEXORA</span>
          </div>
          <p className="mt-2 text-slate-400 leading-relaxed">
            Curated gadgets, computing power, and next-generation lifestyle electronics.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Pages</h5>
          <ul className="space-y-1.5">
            <li><Link to="/" className="hover:text-white">Shop Catalog</Link></li>
            <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">My Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Assurance</h5>
          <ul className="space-y-1.5">
            <li>1-Year Official Warranty</li>
            <li>7-Day Replacement Policy</li>
            <li>Fast Islandwide Express Delivery</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Updates</h5>
          <p className="text-slate-400 mb-2">Get direct email notifications on flash discounts.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs w-full focus:outline-none" />
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500">
        © 2026 VEXORA Technologies. All rights reserved.
      </div>
    </footer>
  );
}