import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };
  
  const [address, setAddress] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const deliveryFee = 40; // You can pull this from System Settings later

  useEffect(() => {
    // 1. Calculate Total
    const st = cart.reduce((sum, item) => sum + Number(item.price), 0);
    setSubtotal(st);

    // 2. Fetch User's Default Address
    const fetchAddr = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) setAddress(userDoc.data().location);
      }
    };
    fetchAddr();
  }, [cart]);

  const goToPayment = () => {
    navigate('/payment', { state: { cart, total: subtotal + deliveryFee, address } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Checkout Details</h2>
      
      <div style={sectionBox}>
        <h3>1. Delivery Address</h3>
        <textarea 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          style={{ width: '100%', height: '80px', padding: '10px' }}
        />
        <button onClick={() => navigate('/change-location')} style={{ fontSize: '0.8rem' }}>Change Address</button>
      </div>

      <div style={sectionBox}>
        <h3>2. Order Summary</h3>
        {cart.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
        <hr />
        <div style={flexRow}><span>Subtotal:</span><span>₹{subtotal}</span></div>
        <div style={flexRow}><span>Delivery Fee:</span><span>₹{deliveryFee}</span></div>
        <div style={{ ...flexRow, fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span>Total:</span><span>₹{subtotal + deliveryFee}</span>
        </div>
      </div>

      <button onClick={goToPayment} style={confirmBtn}>Proceed to Payment</button>
    </div>
  );
}

const sectionBox = { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#fff' };
const flexRow = { display: 'flex', justifyContent: 'space-between', padding: '5px 0' };
const confirmBtn = { width: '100%', padding: '15px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' };