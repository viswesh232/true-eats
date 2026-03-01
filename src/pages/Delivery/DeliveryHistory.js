import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DeliveryHistory() {
  const [history, setHistory] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(collection(db, "orders"), where("riderId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data());
      setHistory(data);
      
      // Assume delivery boy gets a fixed ₹40 per delivery for calculation
      setEarnings(data.length * 40);
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>💰 Earnings & History</h2>
      <div style={eaningCard}>
        <h3>Total Earnings: ₹{earnings}</h3>
        <p>Deliveries Completed: {history.length}</p>
      </div>

      <h4>Recent Order IDs</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((order, i) => (
          <li key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            🆔 Order ID: {order.orderId} — <span style={{color: 'green'}}>{order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const eaningCard = { padding: '20px', background: '#2c3e50', color: 'white', borderRadius: '10px', textAlign: 'center' };