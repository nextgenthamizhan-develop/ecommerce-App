import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, cartSubtotalUsd, cartTaxUsd, cartTotalUsd, formatPrice } = useShop();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-1">Looks like you haven't added any products yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-500 transition-all"
        >
          Explore Catalog <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 items-center shadow-sm">
              <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
              
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-bold text-sm text-slate-800 hover:text-indigo-600 truncate block">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                <p className="text-sm font-black text-indigo-600 mt-1">{formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-600">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-600">
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 h-fit space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base">Order Summary</h3>
          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(cartSubtotalUsd)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-slate-900">{formatPrice(cartTaxUsd)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(cartTotalUsd)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all block text-center"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}