import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { products as defaultProducts } from '../data/products';
import { 
  Sparkles, ShieldCheck, Truck, RotateCcw, 
  Heart, ShoppingBag, ArrowRight, CheckCircle2 
} from 'lucide-react';

export default function Home() {
  const shopData = useShop() || {};
  const { 
    products = [], 
    addToCart = () => {}, 
    toggleWishlist = () => {}, 
    wishlist = [], 
    formatPrice = (p) => `$${p}`,
    searchQuery = ''
  } = shopData;

  const [selectedCategory, setSelectedCategory] = useState("All");

  const activeProducts = products.length > 0 ? products : defaultProducts;

  const filteredProducts = activeProducts.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Bathroom Essentials", "Home Organizers", "Smart Utility"];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SHOWCASE SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-14 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wide">
              <Sparkles size={14} />
              <span>TRENDING SMART HOME UTILITY 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Keep Your Bathroom <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">Neat, Dry & Organized</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Say goodbye to messy, soggy counters. Discover our premium wall-mounted double soap holders with dust-proof flip lids, ventilation drain trays, and no-drill installation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <span>Shop Collection Now</span>
                <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Heavy-Duty 5KG Wall Grip</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4 backdrop-blur-sm shadow-2xl">
              <img
                src="/products/soap-holder-main.png"
                alt="Double Soap Holder Main Display"
                className="w-full h-42 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-[10px] text-rose-400 font-mono uppercase font-bold tracking-wider">TOP RATED</span>
                <p className="font-bold text-sm text-white line-clamp-1">Wall-Mounted Double Soap Holder</p>
                <p className="text-xs text-slate-400">Holds 2 Soaps • Loofah Hook • Drain Tray</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Zero Damage Installation</h4>
              <p className="text-xs text-slate-500 mt-1">High-adhesion sticker mounts safely without drilling tiles.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Hygienic Drain Trays</h4>
              <p className="text-xs text-slate-500 mt-1">Ventilated bottom channels prevent soggy soap bars.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Direct Fast Dispatch</h4>
              <p className="text-xs text-slate-500 mt-1">Secure packing and quick delivery support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Explore Collection</h2>
            <p className="text-xs text-slate-500 mt-0.5">High quality space-saving bathroom accessories and organizers.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const isWish = wishlist.some((w) => String(w.id) === String(item.id));
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                      {item.badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
                  >
                    <Heart size={16} className={isWish ? "fill-rose-500 text-rose-500" : ""} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(item, 1)}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-slate-900/10 cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}