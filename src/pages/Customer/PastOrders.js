import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function PastOrders() {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "orders"), 
          where("customerId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        setMyOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchMyOrders();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Order History</h2>
      {myOrders.length === 0 ? <p>No orders yet. Go order some food!</p> : (
        myOrders.map(order => (
          <div key={order.id} style={orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order #{order.orderId}</strong>
              <span style={statusBadge(order.status)}>{order.status}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
            </p>
            <div style={{ marginTop: '10px' }}>
              {order.items.map((item, i) => (
                <li key={i} style={{ fontSize: '0.9rem' }}>{item.name} x {item.quantity || 1}</li>
              ))}
            </div>
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Total Paid: ₹{order.totalPrice}</p>
          </div>
        ))
      )}
    </div>
  );
}

const orderCard = { border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '10px' };
const statusBadge = (status) => ({
  color: status === 'Completed' ? 'green' : 'orange',
  fontWeight: 'bold'
});