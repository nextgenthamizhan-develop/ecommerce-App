import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { 
  LayoutDashboard, Package, FolderTree, ShoppingCart, 
  Layers, Plus, Trash2, Edit2, LogOut, ArrowUpRight, 
  Search, CheckCircle2, AlertTriangle, ExternalLink, X, Save, Loader2, Upload
} from 'lucide-react';

// Direct Asset Import (அசல் லோகோ படம்)
import logoImg from '../../assets/logo.png';

export default function AdminDashboard() {
  const shopData = useShop() || {};
  const { 
    products = [], 
    categories = ["All"], 
    orders = [], 
    addProduct = () => {}, 
    updateProduct = () => {}, 
    deleteProduct = () => {}, 
    updateStock = () => {}, 
    addCategory = () => {}, 
    deleteCategory = () => {}, 
    updateOrderStatus = () => {}, 
    updatePaymentStatus = () => {}, 
    deleteOrder = () => {}, 
    adminUser = null, 
    adminLogout = () => {}, 
    formatPrice = (p) => `$${p}`,
    loading = false 
  } = shopData;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [productSearch, setProductSearch] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploadMode, setImageUploadMode] = useState('upload');
  const [formData, setFormData] = useState({
    title: '', 
    category: 'Home thinks', 
    price: '', 
    originalPrice: '',
    stock: '50', 
    image: '', 
    badge: 'Trending', 
    description: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500 mb-3" size={36} />
        <p className="text-xs font-semibold text-slate-400">Loading Management Portal...</p>
      </div>
    );
  }

  const localSession = JSON.parse(localStorage.getItem('admin_session') || 'null');
  const currentAdmin = adminUser || localSession;

  if (!currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-center p-4">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <img 
            src={logoImg} 
            alt="Trending Dart" 
            className="w-14 h-14 object-contain rounded-full bg-white p-1 mx-auto mb-4 shadow-lg shadow-orange-500/20"
          />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-xs text-slate-400 mb-6">Please log in through the admin security portal.</p>
          <Link to="/admin" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold inline-block transition-all">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

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
      category: safeCategories.find(c => c !== "All") || 'Home thinks', 
      price: '', 
      originalPrice: '',
      stock: '50', 
      image: '', 
      badge: 'Trending', 
      description: ''
    });
    setImageUploadMode('upload');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      title: p.title || '', 
      category: p.category || 'Home thinks', 
      price: p.price || '',
      originalPrice: p.originalPrice || '', 
      stock: p.stock ?? '0',
      image: p.image || '', 
      badge: p.badge || '', 
      description: p.description || ''
    });
    setImageUploadMode(p.image && p.image.startsWith('data:') ? 'upload' : 'url');
    setIsModalOpen(true);
  };

  // தானியங்கி பட அமுக்கம் (Firestore 1MB limit error fix)
  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please provide Product Title and Price!");
      return;
    }
    if (!formData.image) {
      alert("Please upload an image or insert an Image URL!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...formData });
        alert("Product updated successfully!");
      } else {
        await addProduct(formData);
        alert("New Product published to store!");
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryAdd = async (e) => {
    e.preventDefault();
    const cat = newCatName.trim();
    if (!cat) return;
    try {
      await addCategory(cat);
      alert(`Category "${cat}" added successfully!`);
      setNewCatName('');
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* SIDEBAR WITH NEW LOGO */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0">
        <div>
          {/* LOGO SECTION */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <img 
              src={logoImg} 
              alt="Trending Dart" 
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md shadow-orange-500/20 shrink-0"
            />
            <div>
              <span className="font-black tracking-wider text-sm block leading-tight text-white">
                TRENDING <span className="text-orange-500">DART</span>
              </span>
              <span className="text-[9px] block text-orange-400 font-mono tracking-widest uppercase font-bold">
                ADMIN PANEL
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard size={17} /> Overview
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Package size={17} /> Products ({safeProducts.length})
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'categories' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FolderTree size={17} /> Categories ({Math.max(0, safeCategories.length - 1)})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingCart size={17} /> Orders ({safeOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inventory' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
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
            className="flex items-center justify-between text-xs text-orange-400 hover:text-orange-300 font-bold px-2 py-1"
          >
            <span>Live Storefront</span>
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
              <h1 className="text-2xl font-black text-slate-900">Trending Dart Analytics</h1>
              <p className="text-xs text-slate-500 mt-1">Live order tracking, customer dispatches, and catalog metrics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
                <h3 className="text-2xl font-black text-orange-600 mt-1">{formatPrice(totalRevenue)}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                  <ArrowUpRight size={13} /> Active earnings
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Orders</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{safeOrders.length}</h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Direct transactions</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Catalog</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{safeProducts.length}</h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Active listings</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock</p>
                <h3 className={`text-2xl font-black mt-1 ${lowStockItems.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {lowStockItems.length} Items
                </h3>
                <span className="text-[11px] text-slate-400 mt-2 block">Quantity ≤ 5 units</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-slate-900">Recent Dispatches</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-orange-600 hover:underline cursor-pointer">
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
                        <td className="p-3 font-bold text-orange-600">{formatPrice(o.totalAmount || o.amount || 0)}</td>
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
                        <td colSpan="4" className="p-6 text-center text-slate-400">No orders logged yet.</td>
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
                <h1 className="text-2xl font-black text-slate-900">Manage Catalog</h1>
                <p className="text-xs text-slate-500 mt-0.5">Upload product photos, set prices, and control stock.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
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
                          <img src={p.image || "/products/soap-holder-main.png"} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <span className="font-bold text-slate-800 line-clamp-1">{p.title}</span>
                            {p.badge && <span className="text-[10px] text-orange-600 font-semibold">{p.badge}</span>}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-600">{p.category}</td>
                        <td className="p-4 font-black text-slate-900">{formatPrice(p.price)}</td>
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
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${p.title}"?`)) deleteProduct(p.id);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {safeProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400">No products available. Click "Add New Product" to create one.</td>
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
              <h1 className="text-2xl font-black text-slate-900">Manage Store Categories</h1>
              <p className="text-xs text-slate-500 mt-0.5">Control category filters displayed across the shop.</p>
            </div>

            <form onSubmit={handleCategoryAdd} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <input
                type="text"
                required
                placeholder="Enter new category (e.g. Home thinks, Bathroom Essentials)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Add Category
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                Active Categories
              </div>
              <div className="divide-y divide-slate-100">
                {safeCategories.map(cat => (
                  <div key={cat} className="p-4 flex items-center justify-between hover:bg-slate-50/50 text-xs font-bold text-slate-700">
                    <span>{cat}</span>
                    {cat !== "All" && (
                      <button
                        onClick={() => deleteCategory(cat)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
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
              <h1 className="text-2xl font-black text-slate-900">Customer Orders & Ledger</h1>
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
                        <td className="p-4 font-mono font-bold text-orange-600 block">{order.orderId || order.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{order.customer?.name}</div>
                          <div className="text-[11px] text-slate-400">{order.customer?.phone} | {order.customer?.city}</div>
                        </td>
                        <td className="p-4 font-black text-slate-900">{formatPrice(order.totalAmount || 0)}</td>
                        <td className="p-4 font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200 inline-block">
                          {order.transactionId || 'PENDING'}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.orderStatus || 'Processing'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 bg-slate-50 border rounded-lg text-xs"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteOrder(order.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {safeOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-slate-400">No orders logged yet.</td>
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
                    <th className="p-4">Status</th>
                    <th className="p-4">Stock Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image || "/products/soap-holder-main.png"} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-800">{p.title}</span>
                      </td>
                      <td className="p-4 text-slate-500">{p.category}</td>
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
                          className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {editingProduct ? 'Edit Product Details' : 'Add New Trending Product'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">Upload photos from device or paste an image link.</p>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Double Soap Holder with Flip Lids & Hanging Loofah Hook"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sale Price ($ USD / Equivalent)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="12.99"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Trending, Best Seller, New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* DUAL IMAGE UPLOAD */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Product Image</span>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('upload')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        imageUploadMode === 'upload' ? 'bg-orange-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        imageUploadMode === 'url' ? 'bg-orange-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      🔗 Image URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'upload' ? (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="text-slate-400 mb-1" size={24} />
                      <span className="font-semibold text-slate-600 text-[11px]">Click to choose file from computer/mobile</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Auto-compressed for Firestore optimization</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. /products/soap-holder-main.png"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {formData.image && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <img src={formData.image} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-300" />
                    <div>
                      <span className="font-bold text-emerald-600 block text-[11px]">Image Attached & Compressed</span>
                      <span className="text-[10px] text-slate-400">Ready to save under 1MB</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Features, materials, installation details..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Product to Store</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}