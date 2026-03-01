import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = () => {
    if (auth.currentUser) {
      navigate('/checkout', { state: { cart, total } });
    } else {
      alert("You must login to place an order!");
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          {cart.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
              {item.name} - ₹{item.price}
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout} style={checkoutBtn}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}

const checkoutBtn = { width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' };