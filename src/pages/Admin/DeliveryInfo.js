import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DeliveryInfo() {
  const [riders, setRiders] = useState([]);

  const fetchRiders = async () => {
    const q = query(collection(db, "users"), where("role", "==", "Delivery"));
    const snap = await getDocs(q);
    setRiders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchRiders(); }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>🚴 Delivery Partner Directory</h2>
      <div style={gridStyle}>
        {riders.map(rider => (
          <div key={rider.id} style={riderCard}>
            <h3>{rider.firstName} {rider.lastName}</h3>
            <p><strong>Email:</strong> {rider.email}</p>
            <p><strong>Phone:</strong> {rider.phone}</p>
            <p><strong>Login Status:</strong> {rider.isOnline ? "🟢 Online" : "🔴 Offline"}</p>
            <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
              <p><strong>Bank Account:</strong> {rider.bankDetails || "Not Provided"}</p>
              <p><strong>Total Deliveries:</strong> {rider.deliveryCount || 0}</p>
            </div>
            <button style={historyBtn}>View Account History</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const riderCard = { border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const historyBtn = { width: '100%', marginTop: '10px', padding: '8px', cursor: 'pointer' };