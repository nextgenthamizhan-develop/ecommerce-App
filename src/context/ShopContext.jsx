import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const ShopContext = createContext();

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  INR: { symbol: '₹', rate: 83, label: 'INR (₹)' },
  LKR: { symbol: 'Rs ', rate: 305, label: 'LKR (Rs)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_session') || 'null'));
  const [adminUser, setAdminUser] = useState(() => JSON.parse(localStorage.getItem('admin_session') || 'null'));
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart_items') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist_items') || '[]'));
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'USD');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Database Realtime Listeners
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(items);
    }, (err) => console.error("Products Sync Error:", err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const dynamicCats = snapshot.docs.map(d => d.data().name);
      const combined = ["All", ...new Set(dynamicCats.filter(Boolean))];
      setCategories(combined.length > 1 ? combined : ["All", "Mobiles", "Laptops", "Watches", "Headphones", "Audio", "Accessories"]);
    }, (err) => console.error("Categories Listener Error:", err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(items);
    }, (err) => console.error("Orders Listener Error:", err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const authUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          role: 'customer'
        };

        setUser(authUser);
        localStorage.setItem('user_session', JSON.stringify(authUser));

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const fullUserData = { ...authUser, ...userDoc.data() };
            setUser(fullUserData);
            localStorage.setItem('user_session', JSON.stringify(fullUserData));
            if (fullUserData.role === 'admin') {
              setAdminUser(fullUserData);
              localStorage.setItem('admin_session', JSON.stringify(fullUserData));
            }
          }
        } catch (e) {
          console.warn("User profile fetch skipped:", e);
        }
      } else {
        setUser(null);
        localStorage.removeItem('user_session');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  // 2. User Authentication Methods
  const registerUser = async (nameInput, emailInput, passwordInput) => {
    const cleanName = String(nameInput || '').trim();
    const cleanEmail = String(emailInput || '').trim();
    const cleanPassword = String(passwordInput || '');

    const res = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    const newUserData = {
      uid: res.user.uid,
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'users', res.user.uid), newUserData);
    } catch (e) {
      console.warn("User write skipped:", e);
    }

    setUser(newUserData);
    localStorage.setItem('user_session', JSON.stringify(newUserData));
    return newUserData;
  };

  const loginUser = async (emailInput, passwordInput) => {
    const cleanEmail = String(emailInput || '').trim();
    const cleanPassword = String(passwordInput || '');

    const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    const authData = {
      uid: res.user.uid,
      name: res.user.displayName || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'customer'
    };

    try {
      const snap = await getDoc(doc(db, 'users', res.user.uid));
      if (snap.exists()) {
        const merged = { ...authData, ...snap.data() };
        setUser(merged);
        localStorage.setItem('user_session', JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn("Firestore fetch skipped on login:", e);
    }

    setUser(authData);
    localStorage.setItem('user_session', JSON.stringify(authData));
    return authData;
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('user_session');
  };

  const adminLogin = async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPwd = String(password || '').trim();

    if (cleanEmail === "admin@vexora.com" && cleanPwd === "admin123") {
      const demoAdmin = {
        uid: "master_admin_vexora",
        email: cleanEmail,
        name: "Master Admin",
        role: "admin"
      };
      setAdminUser(demoAdmin);
      localStorage.setItem('admin_session', JSON.stringify(demoAdmin));
      return { success: true };
    }

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPwd);
      let adminData = {
        uid: res.user.uid,
        email: cleanEmail,
        name: res.user.displayName || "Admin",
        role: "admin"
      };

      try {
        const userDoc = await getDoc(doc(db, 'users', res.user.uid));
        if (userDoc.exists()) {
          const dbData = userDoc.data();
          if (dbData.role !== 'admin') {
            await signOut(auth);
            return { success: false, message: "Authorized admin accounts only!" };
          }
          adminData = { ...adminData, ...dbData };
        }
      } catch (dbErr) {
        console.warn("Firestore check skipped:", dbErr);
      }

      setAdminUser(adminData);
      localStorage.setItem('admin_session', JSON.stringify(adminData));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Invalid admin credentials." };
    }
  };

  const adminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setAdminUser(null);
    localStorage.removeItem('admin_session');
  };

  // 3. Product & Stock Operations
  const addProduct = async (productData) => {
    await addDoc(collection(db, 'products'), {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    });
  };

  const updateProduct = async (productData) => {
    const prodRef = doc(db, 'products', productData.id);
    await updateDoc(prodRef, {
      title: productData.title,
      category: productData.category,
      price: Number(productData.price),
      stock: Number(productData.stock),
      image: productData.image,
      badge: productData.badge || '',
      description: productData.description
    });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const updateStock = async (id, newStock) => {
    const prodRef = doc(db, 'products', id);
    await updateDoc(prodRef, { stock: Math.max(0, Number(newStock)) });
  };

  const addCategory = async (catName) => {
    const trimmed = catName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      await addDoc(collection(db, 'categories'), {
        name: trimmed,
        createdAt: new Date().toISOString()
      });
    }
  };

  const deleteCategory = (catName) => {
    if (catName === "All") return;
    setCategories(prev => prev.filter(c => c !== catName));
  };

  // 4. Order & Payment Verification In Database
  const createOrderInDatabase = async ({ 
    customer, 
    items, 
    totalAmount, 
    paymentMethod, 
    paymentStatus, 
    transactionId, 
    gatewayOrderId 
  }) => {
    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalTxnId = transactionId || (paymentMethod === 'COD' ? 'TXN_COD_PENDING' : `TXN_${Date.now()}`);

    const newOrderData = {
      orderId: generatedOrderId,
      gatewayOrderId: gatewayOrderId || 'N/A',
      userId: user?.uid || 'guest',
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city
      },
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: Number(item.price),
        qty: Number(item.qty),
        image: item.image || ''
      })),
      totalAmount: Number(totalAmount),
      amount: Number(totalAmount),
      currency: currency,
      orderStatus: paymentStatus === 'Failed' ? 'Cancelled' : 'Processing',
      status: paymentStatus === 'Failed' ? 'Cancelled' : 'Processing',
      paymentStatus: paymentStatus, // 'Paid' | 'Unpaid' | 'Failed'
      paymentMethod: paymentMethod, // 'RAZORPAY_UPI_GATEWAY' | 'DIRECT_UPI_QR' | 'COD'
      transactionId: finalTxnId,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    // Save order in Firestore
    const docRef = await addDoc(collection(db, 'orders'), newOrderData);

    // Reduce inventory stock only if payment succeeded or COD
    if (paymentStatus !== 'Failed') {
      for (const item of items) {
        if (item.id) {
          try {
            const productRef = doc(db, 'products', item.id);
            const currentProdSnap = await getDoc(productRef);
            if (currentProdSnap.exists()) {
              const currentStock = currentProdSnap.data().stock || 0;
              const updatedStock = Math.max(0, currentStock - item.qty);
              await updateDoc(productRef, { stock: updatedStock });
            }
          } catch (e) {
            console.error("Stock reduction error:", e);
          }
        }
      }
    }

    return { 
      docId: docRef.id, 
      orderId: generatedOrderId, 
      transactionId: finalTxnId,
      paymentStatus: paymentStatus 
    };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { orderStatus: newStatus, status: newStatus });
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { paymentStatus: newPaymentStatus });
  };

  const deleteOrder = async (orderId) => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  };

  // 5. Cart & Currency Utilities
  const formatPrice = (usdAmount) => {
    const activeCurr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = Number(usdAmount || 0) * activeCurr.rate;
    return `${activeCurr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'USD' || currency === 'EUR' ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) => String(item.id) === String(product.id) ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(id)) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      return exists ? prev.filter((item) => String(item.id) !== String(product.id)) : [...prev, product];
    });
  };

  const cartSubtotalUsd = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartTaxUsd = cartSubtotalUsd * 0.05;
  const cartTotalUsd = cartSubtotalUsd + cartTaxUsd;

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCategory,
        deleteCategory,
        createOrderInDatabase,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        user,
        adminUser,
        registerUser,
        loginUser,
        logoutUser,
        adminLogin,
        adminLogout,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartSubtotalUsd,
        cartTaxUsd,
        cartTotalUsd,
        wishlist,
        toggleWishlist,
        currency,
        setCurrency,
        formatPrice,
        CURRENCIES,
        searchQuery,
        setSearchQuery,
        loading
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);