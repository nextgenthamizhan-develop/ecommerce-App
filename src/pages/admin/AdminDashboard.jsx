import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { 
  LayoutDashboard, Package, FolderTree, ShoppingCart, 
  Layers, Plus, Trash2, Edit2, LogOut, ArrowUpRight, 
  Search, CheckCircle2, AlertTriangle, ExternalLink, X, Save, Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    products = [], 
    categories = ["All"], 
    orders = [], 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock, 
    addCategory, 
    deleteCategory, 
    updateOrderStatus, 
    updatePaymentStatus, 
    deleteOrder, 
    adminUser, 
    adminLogout, 
    formatPrice,
    loading 
  } = useShop();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [productSearch, setProductSearch] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: 'Mobiles', price: '', originalPrice: '',
    stock: '10', image: '', badge: '', description: ''
  });

  // 1. Loading Guard (White Screen தடுப்பு)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={36} />
        <p className="text-xs font-semibold text-slate-400">Loading Admin Dashboard...</p>
      </div>
    );
  }

  // 2. Authentication Check
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-center p-4">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-xs text-slate-400 mb-6">Please log in through the admin security portal.</p>
          <Link to="/admin" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-block">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // Safe Calculations (Null Pointer Exceptions வராமல் தடுக்க)
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeCategories = Array.isArray(categories) ? categories : ["All"];

  const totalRevenue = safeOrders.reduce((sum, ord) => {
    if (!ord || ord.orderStatus === 'Cancelled' || ord.status === 'Cancelled' || ord.paymentStatus === 'Failed') return sum;
    return sum + Number(ord.totalAmount || ord.amount || 0);
  }, 0);
  
  const lowStockItems = safeProducts.filter(p => p && Number(p.stock || 0) <= 5);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '', 
      category: safeCategories[1] || 'Mobiles', 
      price: '', 
      originalPrice: '',
      stock: '10', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 
      badge: 'New', 
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      title: p.title || '', 
      category: p.category || 'Mobiles', 
      price: p.price || '',
      originalPrice: p.originalPrice || '', 
      stock: p.stock ?? '0',
      image: p.image || '', 
      badge: p.badge || '', 
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...formData });
    } else {
      await addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleCategoryAdd = async (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      await addCategory(newCatName);
      setNewCatName('');
    }
  };

  const handleDeleteOrderConfirm = async (orderId, displayId) => {
    if (window.confirm(`Delete order "${displayId || orderId}" permanently?`)) {
      await deleteOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-black text-sm">
              V
            </div>
            <div>
              <span className="font-black tracking-wider text-base">VEXORA</span>
              <span className="text-[9px] block text-cyan-400 font-mono tracking-widest uppercase font-bold">ADMIN PANEL</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard size={17} /> Overview
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Package size={17} /> Products ({safeProducts.length})
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FolderTree size={17} /> Categories ({Math.max(0, safeCategories.length - 1)})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingCart size={17} /> Orders ({safeOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Layers size={17} /> Inventory
              {lowStockItems.length > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  {lowStockItems.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1"
          >
            <span>Live Store</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={() => {
              adminLogout();
              navigate('/admin');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Admin Metrics & Store Health</h1>
              <p className="text-xs text-slate-500 mt-1">Live snapshot of total earnings, customer orders, and stock warnings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
                <h3 className="text-2xl font-black text-indigo-600 mt-1">{formatPrice ? formatPrice(totalRevenue) : `$${totalRevenue}`}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                  <ArrowUpRight size={13} /> Active revenue
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{safeOrders.length}</h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Direct customer settlements</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{safeProducts.length}</h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Catalog items</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Warning</p>
                <h3 className={`text-2xl font-black mt-1 ${lowStockItems.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {lowStockItems.length} Items
                </h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Stock ≤ 5 units</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-indigo-600 hover:underline">
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeOrders.slice(0, 5).map(o => (
                      <tr key={o.id || Math.random()} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-900">{o.orderId || o.id}</td>
                        <td className="p-3">{o.customer?.name || 'Customer'}</td>
                        <td className="p-3 font-bold text-indigo-600">{formatPrice ? formatPrice(o.totalAmount || o.amount || 0) : `$${o.totalAmount || 0}`}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                            o.orderStatus === 'Processing' ? 'bg-indigo-50 text-indigo-600' :
                            o.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {o.orderStatus || o.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {safeOrders.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-slate-400">No orders recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Manage Products</h1>
                <p className="text-xs text-slate-500 mt-0.5">Add, edit pricing, or remove items from the store.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>

            <div className="max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search catalog..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeProducts
                    .filter(p => (p.title || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.category || '').toLowerCase().includes(productSearch.toLowerCase()))
                    .map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-slate-800 line-clamp-1">{p.title}</span>
                            {p.badge && <span className="text-[10px] text-indigo-600 font-semibold">{p.badge}</span>}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-600">{p.category || 'Gear'}</td>
                        <td className="p-4 font-black text-slate-900">{formatPrice ? formatPrice(p.price) : `$${p.price}`}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            Number(p.stock || 0) <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.stock ?? 0} in stock
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${p.title}"?`)) deleteProduct(p.id);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {safeProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400">No products added yet. Click "Add New Product" above.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Category Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Organize categories displayed across the navigation bar and catalog.</p>
            </div>

            <form onSubmit={handleCategoryAdd} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <input
                type="text"
                required
                placeholder="Enter new category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Add Category
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                Active Store Categories
              </div>
              <div className="divide-y divide-slate-100">
                {safeCategories.map(cat => (
                  <div key={cat} className="p-4 flex items-center justify-between hover:bg-slate-50/50 text-xs font-bold text-slate-700">
                    <span>{cat}</span>
                    {cat !== "All" && (
                      <button
                        onClick={() => deleteCategory(cat)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove category"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Customer Orders & Settlements</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage live order delivery stages and transaction records.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Transaction Ref</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <span className="font-mono font-bold text-indigo-600 block">{order.orderId || order.id}</span>
                          <span className="text-[11px] text-slate-400">{order.date || 'Today'}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{order.customer?.name || 'Customer'}</div>
                          <div className="text-[11px] text-slate-400">{order.customer?.phone} | {order.customer?.city}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-slate-900 block">{formatPrice ? formatPrice(order.totalAmount || order.amount || 0) : `$${order.totalAmount || 0}`}</span>
                          <span className="text-[10px] text-indigo-600 font-semibold">{order.paymentMethod || 'COD'}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                            {order.transactionId || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.orderStatus || order.status || 'Processing'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer bg-slate-50"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.paymentStatus || 'Unpaid'}
                            onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                              order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              order.paymentStatus === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteOrderConfirm(order.id, order.orderId)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {safeOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-slate-400">No orders placed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Inventory & Stock Tracking</h1>
              <p className="text-xs text-slate-500 mt-0.5">Quickly adjust available quantities directly from the dashboard.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status Indicator</th>
                    <th className="p-4">Stock Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-800">{p.title}</span>
                      </td>
                      <td className="p-4 text-slate-500">{p.category || 'Gear'}</td>
                      <td className="p-4">
                        {Number(p.stock || 0) === 0 ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <AlertTriangle size={13} /> Out of stock
                          </span>
                        ) : Number(p.stock || 0) <= 5 ? (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <AlertTriangle size={13} /> Low stock
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 size={13} /> Good stock
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          value={p.stock ?? 0}
                          onChange={(e) => updateStock(p.id, e.target.value)}
                          className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                  {safeProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-slate-400">No inventory to track.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODAL (ADD / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {editingProduct ? 'Edit Product Details' : 'Add New Hardware'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">Enter specifications, pricing, and stock amounts.</p>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  >
                    {safeCategories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sale Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Sale, Hot, New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={16} /> Save Product to Store
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}