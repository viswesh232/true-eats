import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <div style={{ padding: '30px' }}>
      <h2>📦 All Customer Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={orderRow}>
          <span><strong>#{order.id.slice(0, 5)}</strong></span>
          <span>{order.customerName}</span>
          <span>₹{order.totalPrice}</span>
          <span style={{ color: order.status === 'Pending' ? 'orange' : 'green' }}>{order.status}</span>
          <button onClick={() => alert("Details: " + order.items.map(i => i.name))}>View Details</button>
        </div>
      ))}
    </div>
    
  );
}

const orderRow = { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', alignItems: 'center' };