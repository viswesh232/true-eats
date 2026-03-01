import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* HEADER / NAVBAR */}
      <nav style={navStyle}>
        <div style={logoStyle} onClick={() => navigate('/')}>True Eats</div>
        <div style={navLinks}>
          <span onClick={() => navigate('/')} style={linkStyle}>Home</span>
          <span onClick={() => navigate('/about')} style={linkStyle}>About Us</span>
          <span onClick={() => navigate('/menu')} style={linkStyle}>Our Menu</span>
          {auth.currentUser ? (
            <span onClick={() => navigate('/account')} style={linkStyle}>Account</span>
          ) : (
            <span onClick={() => navigate('/login')} style={linkStyle}>Login</span>
          )}
        </div>
      </nav>

      {/* DYNAMIC CONTENT (Menu Page, About Page, etc.) */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={footerGrid}>
          <div>
            <h3 style={{color: '#e67e22'}}>True Eats Restaurant</h3>
            <p>📍 456 Food Plaza, Near Clock Tower</p>
            <p>Ludhiana, Punjab 141001</p>
          </div>
          <div>
            <h3>Contact Info</h3>
            <p>📞 +91 98765-43210</p>
            <p>✉️ support@trueeats.com</p>
          </div>
          <div>
            <h3>Connect</h3>
            <p>Instagram | Facebook</p>
          </div>
        </div>
        <div style={bottomBar}>© 2026 True Eats | Quality You Can Taste</div>
      </footer>
    </div>
  );
}

// Layout Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#fff', borderBottom: '1px solid #eee', sticky: 'top' };
const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#e67e22', cursor: 'pointer' };
const navLinks = { display: 'flex', gap: '25px' };
const linkStyle = { cursor: 'pointer', fontWeight: '500' };
const footerStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '40px 50px', marginTop: '50px' };
const footerGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' };
const bottomBar = { textAlign: 'center', borderTop: '1px solid #444', marginTop: '30px', paddingTop: '15px', fontSize: '0.8rem' };