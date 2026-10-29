import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { SlidersHorizontal, Truck, ShieldCheck, RefreshCw, CreditCard, ArrowRight, Search, Loader2 } from 'lucide-react';

export default function Home() {
  // Context-ல் உள்ள realtime products மற்றும் categories-ஐ மட்டுமே பயன்படுத்துகிறது
  const { products, categories, searchQuery, loading } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Filter & Sort Logic based on Realtime DB
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* HERO BANNER SECTION */}
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-cyan-300 border border-indigo-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              VEXORA Store 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Next-Gen Tech For <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Everyday Innovators.
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
              Official flagship devices, high-performance computing, audio gear, and premium accessories backed by a 1-year replacement warranty.
            </p>
            <div className="pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
              >
                Shop Catalog Now <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="relative w-80 h-80 rounded-3xl overflow-hidden border-4 border-slate-800/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Featured Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-xs font-semibold text-cyan-300 uppercase">Staff Recommendation</p>
                  <p className="text-base font-bold text-white">Sony WH-1000XM5 ANC</p>
                  <p className="text-xs text-slate-300 mt-0.5">Top-rated Noise Cancelling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFIT HIGHLIGHTS */}
      <div className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Truck className="text-indigo-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900">Fast Islandwide Delivery</p>
              <p className="text-[11px] text-slate-400">Doorstep courier tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-indigo-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900">1-Year Warranty</p>
              <p className="text-[11px] text-slate-400">100% genuine hardware</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="text-indigo-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900">7-Day Replacement</p>
              <p className="text-[11px] text-slate-400">Hassle-free return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="text-indigo-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900">COD / Online Card</p>
              <p className="text-[11px] text-slate-400">Encrypted payment gateway</p>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE CATALOG */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Filters & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-400"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading / Realtime Products Rendering */}
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" size={32} />
            <p className="text-xs text-slate-400 font-semibold">Connecting to live cloud store...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Search className="mx-auto text-slate-300 mb-3" size={44} />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-slate-500 text-xs mt-1">Try resetting keywords or changing the selected category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Reset Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}