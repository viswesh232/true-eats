import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminMainPage() {
  const navigate = useNavigate();

  const adminOptions = [
    { title: "Live Orders", icon: "📦", path: "/admin/orders" },
    { title: "Revenue Stats", icon: "💰", path: "/admin/revenue" },
    { title: "Edit Menu", icon: "🍴", path: "/admin/edit-menu" },
    { title: "Bill Generator", icon: "📄", path: "/admin/bills" },
    { title: "Search Customers", icon: "🔍", path: "/admin/search" },
    { title: "Delivery Information", icon: "🚴", path: "/admin/delivery-info" },
    { title: "Permission Change", icon: "🔐", path: "/admin/permissions" },
    { title: "System Settings", icon: "⚙️", path: "/admin/settings" }
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>True Eats Admin Dashboard</h1>
        <button 
          onClick={() => { window.location.href = '/'; }} 
          style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
        >
          Logout
        </button>
      </div>
      
      <div style={gridStyle}>
        {adminOptions.map((option) => (
          <div 
            key={option.title} 
            style={cardStyle}
            onClick={() => navigate(option.path)}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{option.icon}</div>
            <h3 style={{ margin: '0', color: '#2c3e50' }}>{option.title}</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Click to manage</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  border: '1px solid #eee'
};