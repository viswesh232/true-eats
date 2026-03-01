import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function RevenuePage() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filter, setFilter] = useState('all'); // all, daily, monthly

  const fetchRevenue = async () => {
    const q = query(collection(db, "orders"), where("status", "==", "Completed"));
    const querySnapshot = await getDocs(q);
    const completedOrders = querySnapshot.docs.map(doc => doc.data());
    
    setOrders(completedOrders);
    
    // Calculate Total
    const total = completedOrders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
    setTotalRevenue(total);
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>💰 Revenue Dashboard</h2>
      
      <div style={statsContainer}>
        <div style={statCard}>
          <h3>Total Earnings</h3>
          <p style={{ fontSize: '2rem', color: '#2ecc71' }}>₹{totalRevenue}</p>
        </div>
        <div style={statCard}>
          <h3>Orders Completed</h3>
          <p style={{ fontSize: '2rem', color: '#3498db' }}>{orders.length}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Revenue Filter</h4>
        <button onClick={() => setFilter('daily')} style={btnStyle}>Daily</button>
        <button onClick={() => setFilter('monthly')} style={btnStyle}>Monthly</button>
        <button onClick={() => setFilter('all')} style={btnStyle}>All Time</button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td style={tdStyle}>{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</td>
              <td style={tdStyle}>{order.orderId}</td>
              <td style={tdStyle}>₹{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statsContainer = { display: 'flex', gap: '20px', marginTop: '20px' };
const statCard = { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', flex: 1, textAlign: 'center' };
const btnStyle = { margin: '5px', padding: '10px', cursor: 'pointer' };
const tableStyle = { width: '100%', marginTop: '20px', borderCollapse: 'collapse' };
const thStyle = { padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'left' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #ddd' };