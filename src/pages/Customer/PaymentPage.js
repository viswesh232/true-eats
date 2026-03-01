import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cart, total, address } = state || { cart: [], total: 0, address: '' };

  const loadRazorpay = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Get this from Razorpay Dashboard > Settings
      amount: total * 100, // Razorpay works in Paisa (₹1 = 100 Paisa)
      currency: "INR",
      name: "True Eats",
      description: "Food Order Payment",
      image: "https://your-logo-url.com/logo.png", // Your Restaurant Logo
      handler: async function (response) {
        // THIS RUNS ONLY IF PAYMENT IS SUCCESSFUL
        try {
          const orderData = {
            customerId: auth.currentUser.uid,
            customerName: auth.currentUser.displayName || "User",
            customerEmail: auth.currentUser.email,
            items: cart,
            totalPrice: total,
            address: address,
            paymentId: response.razorpay_payment_id, // Official ID from Razorpay
            status: 'Pending',
            createdAt: new Date(),
            orderId: "ORD" + Math.floor(100000 + Math.random() * 900000)
          };

          await addDoc(collection(db, "orders"), orderData);
          navigate('/order-confirmation');
        } catch (err) {
          alert("Error saving order: " + err.message);
        }
      },
      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
      },
      theme: {
        color: "#e67e22", // Matches your True Eats orange theme
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={containerStyle}>
      <h2>Final Step: Payment</h2>
      <div style={summaryBox}>
        <p>Subtotal: ₹{total}</p>
        <p>Delivery to: {address}</p>
      </div>
      <button onClick={loadRazorpay} style={payBtn}>
        Open Razorpay Gateway (UPI/Card/Netbanking)
      </button>
      
    </div>
  );
}

const containerStyle = { maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '20px' };
const summaryBox = { border: '1px solid #eee', padding: '20px', borderRadius: '10px', marginBottom: '20px' };
const payBtn = { width: '100%', padding: '15px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };