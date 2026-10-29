import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop, CURRENCIES } from '../context/ShopContext';
import { User, Settings, MapPin, Bell, Shield, Save, CheckCircle2, LogOut, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile, logoutUser, currency, setCurrency } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'settings' | 'security'
  const [toast, setToast] = useState('');

  // Form State initialized with logged-in user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    notifications: user?.notifications ?? true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <User size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign in Required</h2>
        <p className="text-xs text-slate-500 mt-2">Please login to view or modify your account settings.</p>
        <Link
          to="/login"
          className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city
    });
    showNotification('Profile details updated successfully!');
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      notifications: formData.notifications
    });
    showNotification('Settings saved successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('Password changed successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft size={16} /> Back to Store
      </Link>

      <div className="grid md:grid-cols-4 gap-8">
        
        {/* Left Side: User Summary & Navigation Tabs */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-3">{user.name}</h3>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User size={16} />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings size={16} />
              <span>Preferences & Currency</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield size={16} />
              <span>Security</span>
            </button>

            <button
              onClick={() => {
                logoutUser();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all text-left border-t border-slate-100"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="md:col-span-3">
          
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage your shipping details and contact information.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Colombo, Vavuniya, Kandy"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Default Shipping Address</label>
                  <textarea
                    rows={3}
                    placeholder="Street address, apartment or landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Save size={15} /> Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Preferences & Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-900">Application Settings</h2>
                <p className="text-xs text-slate-400 mt-0.5">Customize your regional display and alerts.</p>
              </div>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                
                {/* Default Currency Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Display Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {Object.keys(CURRENCIES).map((currKey) => (
                      <option key={currKey} value={currKey}>
                        {CURRENCIES[currKey].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notification Toggles */}
                <div className="border-t border-slate-100 pt-5">
                  <label className="text-xs font-bold text-slate-700 block mb-3">Alerts & Notifications</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Email Updates & Promotions</p>
                      <p className="text-[11px] text-slate-400">Receive order receipts and flash sale coupon codes</p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Save size={15} /> Save Preferences
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-900">Security Credentials</h2>
                <p className="text-xs text-slate-400 mt-0.5">Update password and secure your shopping session.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Shield size={15} /> Update Password
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}