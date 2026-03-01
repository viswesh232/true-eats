import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Confirmation() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1 style={{ color: '#2ecc71' }}>🎉 Order Confirmed!</h1>
      <p>Thank you for choosing True Eats. Your food is being prepared.</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Back to Menu
      </button>
      <button onClick={() => navigate('/past-orders')} style={{ marginLeft: '10px', padding: '10px 20px' }}>
        View My Orders
      </button>
    </div>
  );
}