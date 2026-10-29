import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, XCircle, ArrowLeft, Loader2, 
  CreditCard, Banknote, QrCode, ShieldCheck, AlertCircle, X, Sparkles, Smartphone
} from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotalUsd, clearCart, formatPrice, user, createOrderInDatabase, currency } = useShop();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [showSimulatedGateway, setShowSimulatedGateway] = useState(false);

  // Billing form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    paymentMethod: 'ONLINE_GATEWAY' // 'ONLINE_GATEWAY' | 'UPI_MANUAL' | 'COD'
  });

  // Modal Card / UPI state
  const [simulatedPaymentType, setSimulatedPaymentType] = useState('CARD'); // 'CARD' | 'UPI'
  const [testCard, setTestCard] = useState({ number: '4111 2222 3333 4444', exp: '12/28', cvv: '123' });
  const [testUpiId, setTestUpiId] = useState('user@okaxis');

  if (cart.length === 0 && !orderResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
        <Link to="/" className="text-indigo-600 underline font-semibold mt-2 inline-block">Return to Storefront</Link>
      </div>
    );
  }

  // 1. Process Successful Order to Database
  const finalizeOrder = async (txnId, methodTitle) => {
    setLoading(true);
    try {
      const dbResponse = await createOrderInDatabase({
        customer: formData,
        items: cart,
        totalAmount: cartTotalUsd,
        paymentMethod: methodTitle,
        paymentStatus: 'Paid',
        transactionId: txnId,
        gatewayOrderId: `GATEWAY_${Date.now()}`
      });

      setOrderResult({
        status: 'success',
        orderId: dbResponse.orderId,
        transactionId: dbResponse.transactionId,
        total: cartTotalUsd,
        method: methodTitle
      });

      clearCart();
      setShowSimulatedGateway(false);
    } catch (err) {
      alert("Order Database Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Main Checkout Submit
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (formData.paymentMethod === 'ONLINE_GATEWAY') {
      // Launch Interactive Online Gateway (Cards & UPI Apps)
      setShowSimulatedGateway(true);
    } else if (formData.paymentMethod === 'UPI_MANUAL') {
      const upiTxnId = `UPI_${Date.now().toString().slice(-8)}`;
      finalizeOrder(upiTxnId, 'Direct UPI Transfer (VPA)');
    } else {
      // Cash On Delivery
      setLoading(true);
      createOrderInDatabase({
        customer: formData,
        items: cart,
        totalAmount: cartTotalUsd,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'Unpaid',
        transactionId: 'COD_ON_DELIVERY'
      }).then((dbResponse) => {
        setOrderResult({
          status: 'success',
          orderId: dbResponse.orderId,
          transactionId: 'COD_PENDING',
          total: cartTotalUsd,
          method: 'Cash on Delivery (COD)'
        });
        clearCart();
      }).catch((err) => {
        alert("COD Error: " + err.message);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  // 3. Payment Success Receipt Screen
  if (orderResult && orderResult.status === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Payment & Order Verified!</h2>
        <p className="text-xs text-slate-500 mt-1">
          Your order has been recorded into the live database ledger.
        </p>

        <div className="my-6 p-5 bg-white border border-slate-200/80 rounded-2xl text-left space-y-2.5 text-xs shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Order Reference:</span>
            <span className="font-mono font-bold text-indigo-600">{orderResult.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono font-bold text-slate-700">{orderResult.transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Settlement Method:</span>
            <span className="font-semibold text-slate-800">{orderResult.method}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-100 pt-2 font-bold text-sm">
            <span>Amount Paid:</span>
            <span className="text-slate-900">{formatPrice(orderResult.total)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Billing & Payment</h1>
        <p className="text-xs text-slate-400 mb-6">Choose your preferred settlement method and delivery address.</p>

        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          
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
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone Number</label>
              <input
                type="tel"
                required
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
                required
                placeholder="Colombo / Vavuniya / Jaffna"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address</label>
            <input
              type="text"
              required
              placeholder="Apartment/Street Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-3">
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Payment Method</label>
            <div className="grid sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'ONLINE_GATEWAY' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  formData.paymentMethod === 'ONLINE_GATEWAY' 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-bold text-xs text-slate-900">Online Gateway</span>
                  <CreditCard size={18} className="text-indigo-600" />
                </div>
                <span className="text-[10px] text-slate-400">Cards, GPay, PhonePe, UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'UPI_MANUAL' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  formData.paymentMethod === 'UPI_MANUAL' 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-bold text-xs text-slate-900">Direct UPI / QR</span>
                  <QrCode size={18} className="text-emerald-600" />
                </div>
                <span className="text-[10px] text-slate-400">Pay using UPI VPA address</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  formData.paymentMethod === 'COD' 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-bold text-xs text-slate-900">Cash on Delivery</span>
                  <Banknote size={18} className="text-slate-600" />
                </div>
                <span className="text-[10px] text-slate-400">Pay upon delivery</span>
              </button>
            </div>
          </div>

          {formData.paymentMethod === 'UPI_MANUAL' && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs space-y-2 text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Direct UPI Payment Details</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Send the equivalent amount to UPI ID: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">vexora.store@icici</strong>
              </p>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Total Payable Amount</span>
              <span className="text-[10px] text-slate-400">Includes 5% sales tax</span>
            </div>
            <span className="text-2xl font-black text-indigo-600">{formatPrice(cartTotalUsd)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Proceed to Pay {formatPrice(cartTotalUsd)}</span>
            )}
          </button>
        </form>
      </div>

      {/* 4. REAL-TIME INTERACTIVE PAYMENT GATEWAY MODAL */}
      {showSimulatedGateway && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            
            <button
              onClick={() => setShowSimulatedGateway(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Gateway Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={20} className="text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">VEXORA SECURE GATEWAY</h3>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">256-BIT ENCRYPTION</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center mb-5 text-xs">
              <span className="text-slate-400">Total Billed:</span>
              <span className="font-black text-lg text-indigo-400">{formatPrice(cartTotalUsd)}</span>
            </div>

            {/* Tabs (Card vs UPI) */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSimulatedPaymentType('CARD')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  simulatedPaymentType === 'CARD' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <CreditCard size={14} /> Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setSimulatedPaymentType('UPI')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  simulatedPaymentType === 'UPI' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Smartphone size={14} /> Instant UPI Apps
              </button>
            </div>

            {/* Tab 1: Cards */}
            {simulatedPaymentType === 'CARD' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={testCard.number}
                    onChange={(e) => setTestCard({ ...testCard, number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Expires</label>
                    <input
                      type="text"
                      value={testCard.exp}
                      onChange={(e) => setTestCard({ ...testCard, exp: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={testCard.cvv}
                      onChange={(e) => setTestCard({ ...testCard, cvv: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 2: UPI Apps */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={testUpiId}
                    onChange={(e) => setTestUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 text-[10px]">
                  <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">GPay</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">PhonePe</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">Paytm</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  const txnId = `TXN_${simulatedPaymentType}_${Date.now()}`;
                  finalizeOrder(txnId, `Online Gateway (${simulatedPaymentType})`);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Authorize & Pay Now"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSimulatedGateway(false);
                  setOrderResult({
                    status: 'failed',
                    reason: 'Payment transaction was declined or dismissed by user.'
                  });
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Simulate Payment Failure
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}