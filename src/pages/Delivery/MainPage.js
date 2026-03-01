import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function DeliveryMain() {
  const [isActive, setIsActive] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);

  // Toggle Active Status
  const toggleStatus = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: newStatus
    });
  };

  // Listen for "Pending" orders that need a driver
  useEffect(() => {
    if (isActive) {
      const q = query(collection(db, "orders"), where("status", "==", "Pending"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAvailableOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else {
      setAvailableOrders([]);
    }
  }, [isActive]);

  const handleAccept = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: 'Out for Delivery',
      riderId: auth.currentUser.uid
    });
    alert("Order Accepted! Please head to the restaurant.");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={statusHeader(isActive)}>
        <h2>Delivery Portal</h2>
        <button onClick={toggleStatus} style={statusBtn}>
          {isActive ? "🔴 Go Offline" : "🟢 Go Online"}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>{isActive ? "🔔 New Order Requests" : "💤 Go Online to see orders"}</h3>
        {availableOrders.map(order => (
          <div key={order.id} style={orderNotice}>
            <p><strong>Order ID:</strong> #{order.orderId}</p>
            <p><strong>Customer Location:</strong> {order.customerLocation || "Contact Customer"}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleAccept(order.id)} style={acceptBtn}>Accept</button>
              <button onClick={() => alert("Order Rejected")} style={rejectBtn}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusHeader = (active) => ({
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: active ? '#d4edda' : '#f8d7da',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});
const statusBtn = { padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: 'none', fontWeight: 'bold' };
const orderNotice = { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#fff' };
const acceptBtn = { background: '#2ecc71', color: '#fff', border: 'none', padding: '10px', flex: 1, borderRadius: '5px', cursor: 'pointer' };
const rejectBtn = { background: '#e74c3c', color: '#fff', border: 'none', padding: '10px', flex: 1, borderRadius: '5px', cursor: 'pointer' };