import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 mt-20 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={logoImg} 
                alt="Trending Dart Logo" 
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md shrink-0"
              />
              <div>
                <span className="font-black text-lg tracking-wider block leading-tight text-white">
                  TRENDING <span className="text-orange-500">DART</span>
                </span>
                <span className="text-[9px] font-mono text-orange-400 font-bold uppercase tracking-widest block">
                  Discover What's Trending
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated daily lifestyle solutions, smart bathroom organizers, and trending utility products delivered directly to your doorstep.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-orange-400 transition-colors">Bathroom Essentials</span></li>
              <li><span className="hover:text-orange-400 transition-colors">Home Organizers</span></li>
              <li><span className="hover:text-orange-400 transition-colors">Smart Utility</span></li>
              <li><span className="hover:text-orange-400 transition-colors">Home thinks</span></li>
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Customer Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <a href="tel:8270882715" className="hover:text-white font-mono font-bold">
                  82708 82715
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-orange-400 shrink-0" />
                <a href="mailto:trendingdart@gmail.com" className="hover:text-white">
                  trendingdart@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-rose-400 shrink-0" />
                <span>Verified Direct Dispatch</span>
              </li>
            </ul>
          </div>

          {/* Social Follow */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Follow On Instagram</h4>
            <p className="text-xs text-slate-400 mb-3">Check live unboxing videos, customer reviews & product demos.</p>
            <a
              href="https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@trending_dart</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Trending Dart. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Quality Inspected Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}