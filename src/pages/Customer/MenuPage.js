import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Monitor User Login Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Menu from Firebase
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  // 3. Cart Logic (Plus/Minus)
  const updateQuantity = (item, change) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + change;
        if (newQty <= 0) return prevCart.filter(i => i.id !== item.id);
        return prevCart.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
      }
      if (change > 0) return [...prevCart, { ...item, quantity: 1 }];
      return prevCart;
    });
  };

  const getItemQty = (id) => cart.find(i => i.id === id)?.quantity || 0;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // 4. Checkout Logic (Redirect to Login if Guest)
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to your True Eats account to place an order!");
      navigate('/login');
    } else {
      navigate('/cart', { state: { cart } });
    }
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', color: '#333', backgroundColor: '#fff' }}>
      
      {/* --- HEADER --- */}
      <nav style={navStyle}>
        <h1 style={logoStyle} onClick={() => navigate('/')}>True Eats</h1>
        <div style={navLinks}>
          <span style={linkStyle} onClick={() => navigate('/')}>Home</span>
          <span style={linkStyle} onClick={() => navigate('/about')}>About Us</span>
          
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
               <span style={linkStyle} onClick={() => navigate('/account')}>My Profile</span>
               <button onClick={() => signOut(auth)} style={logoutBtn}>Logout</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} style={loginHeaderBtn}>Customer Login</button>
          )}

          <button onClick={handleCheckout} style={cartBtnStyle}>
            🛒 Cart ({totalItems})
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (With the photo you liked) --- */}
      <header style={heroStyle}>
        <div style={heroOverlay}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Deliciousness Delivered</h1>
          <p style={{ fontSize: '1.4rem', fontWeight: '300' }}>The way food was meant to be</p>
        </div>
      </header>

      {/* --- MENU SECTION --- */}
      <div style={{ padding: '60px 10%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', color: '#2c3e50' }}>Our Menu</h2>
        
        <div style={menuGrid}>
          {menuItems.map(item => (
            <div key={item.id} style={cardStyle}>
              <div style={{ padding: '25px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{item.name}</h3>
                <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '1.3rem', margin: '10px 0' }}>₹{item.price}</p>
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', minHeight: '60px' }}>{item.description}</p>
                
                <div style={qtyControls}>
                  <button onClick={() => updateQuantity(item, -1)} style={qtyBtn}>-</button>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{getItemQty(item.id)}</span>
                  <button onClick={() => updateQuantity(item, 1)} style={qtyBtn}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer style={footerStyle}>
        <div style={footerGrid}>
          <div style={footerSection}>
            <h3 style={{ color: '#e67e22', marginBottom: '20px' }}>True Eats Restaurant</h3>
            <p>📍 hyderabad<br/>Hyderabad</p>
            <p>📞 +91 98765-43210</p>
          </div>
          <div style={footerSection}>
            <h3>Account & Support</h3>
            <p style={footerLink} onClick={() => navigate('/login')}>Customer Login</p>
            <p style={footerLink} onClick={() => navigate('/signup')}>Create Account</p>
            <p style={footerLink} onClick={() => navigate('/about')}>Our Story</p>
          </div>
          <div style={footerSection}>
            <h3>Follow Us</h3>
            <p>Facebook | Instagram | Twitter</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '1px solid #34495e', paddingTop: '20px', fontSize: '0.85rem', opacity: 0.6 }}>
          © 2026 True Eats Restaurant. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

// --- STYLES ---
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 10%', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, alignItems: 'center' };
const logoStyle = { color: '#e67e22', fontSize: '1.8rem', fontWeight: 'bold', margin: 0, cursor: 'pointer' };
const navLinks = { display: 'flex', gap: '25px', alignItems: 'center' };
const linkStyle = { cursor: 'pointer', fontWeight: '500', color: '#2c3e50' };
const loginHeaderBtn = { background: 'none', border: '2px solid #e67e22', color: '#e67e22', padding: '8px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' };
const logoutBtn = { background: '#f2f2f2', border: 'none', padding: '8px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: '500' };

// HERO SECTION WITH THE IMAGE YOU LIKED
const heroStyle = { 
  height: '60vh',
  backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80")', 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  position: 'relative' 
};
const heroOverlay = { 
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', 
  justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' 
};

const menuGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '35px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' };
const qtyControls = { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', justifyContent: 'center' };
const qtyBtn = { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e67e22', background: 'white', color: '#e67e22', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.4rem' };
const cartBtnStyle = { padding: '12px 25px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)' };

const footerStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '60px 10%', marginTop: '60px' };
const footerGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' };
const footerSection = { display: 'flex', flexDirection: 'column', gap: '10px' };
const footerLink = { cursor: 'pointer', textDecoration: 'none', opacity: 0.8, fontSize: '0.95rem' };