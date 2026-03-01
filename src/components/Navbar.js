import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <h2 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>True Eats</h2>
      <div>
        <button onClick={() => navigate('/')} style={btnStyle}>Home/Menu</button>
        {auth.currentUser ? (
          <>
            <button onClick={() => navigate('/account')} style={btnStyle}>Account</button>
            <button onClick={() => { auth.signOut(); navigate('/login'); }} style={btnStyle}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={btnStyle}>Login</button>
        )}
      </div>
    </nav>
  );
}

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#2c3e50', color: 'white' };
const btnStyle = { background: 'none', border: 'none', color: 'white', marginLeft: '15px', cursor: 'pointer', fontWeight: 'bold' };