import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Star, Heart, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, wishlist, toggleWishlist, formatPrice } = useShop();
  const [qty, setQty] = useState(1);

  // Firestore Document ID அல்லது Numeric ID இரண்டிற்கும் பொருந்தும் வகையில்:
  const product = products.find((item) => String(item.id) === String(id));
  const inWishlist = product ? wishlist.some((item) => String(item.id) === String(product.id)) : false;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">The item may have been removed from the live inventory.</p>
        <Link to="/" className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-8">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Product Image */}
        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="uppercase tracking-wider">{product.category}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span>{product.rating || 5.0}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount || 1} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl font-black text-slate-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {product.stock > 0 ? `${product.stock} Units in Stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty((prev) => Math.min(product.stock || 99, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border border-slate-200 transition-all ${
                  inWishlist ? 'bg-rose-500 text-white border-rose-500' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><Truck size={14} className="text-indigo-600" /> Fast Delivery</div>
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-600" /> Official Warranty</div>
              <div className="flex items-center gap-1.5"><RefreshCw size={14} className="text-indigo-600" /> 7-Day Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}