import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      // 1. Check if verified
      if (!res.user.emailVerified) {
        alert("Verification Required: Please check your inbox and click the link.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      // 2. Fetch User Role
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        // --- SUCCESS MESSAGE BASED ON ROLE ---
        if (role === 'Admin') {
          alert(`Welcome Back, Admin ${userData.firstName}! Redirecting to Dashboard...`);
          navigate('/admin');
        } else if (role === 'Delivery') {
          alert("Delivery Partner Login Successful! Loading your jobs...");
          navigate('/delivery');
        } else {
          alert(`Login Successful! Enjoy your meal, ${userData.firstName}.`);
          navigate('/'); // Customer goes to Home/Menu Page
        }
      } else {
        alert("Error: No profile found for this account in our database.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>True Eats Login</h2>
      
      <form onSubmit={handleLogin} style={formStyle}>
        <div style={inputWrapper}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={inputStyle} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={inputWrapper}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            style={inputStyle} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>
            {showPassword ? '🔒' : '🔓'}
          </span>
        </div>

        <button type="submit" disabled={loading} style={loading ? {...btnStyle, opacity: 0.7} : btnStyle}>
          {loading ? "Authenticating..." : "Login to True Eats"}
        </button>
      </form>

      <div style={{marginTop: '20px'}}>
        <p 
          onClick={() => {
            if(!email) return alert("Please enter your email first.");
            sendPasswordResetEmail(auth, email).then(() => alert("Reset link sent to your email!"));
          }} 
          style={forgotLink}
        >
          Forgot Password?
        </p>
        
        <div style={divider}><span>OR</span></div>
        
        <button onClick={() => navigate('/signup')} style={signupBtn}>
          Create New Account
        </button>

        <p onClick={() => navigate('/')} style={backLink}>
          ← Browse Menu as Guest
        </p>
      </div>
    </div>
  );
}

// --- PROFESSIONAL MODERN STYLES ---
const containerStyle = { 
  maxWidth: '420px', 
  margin: '100px auto', 
  padding: '40px', 
  backgroundColor: '#fff', 
  borderRadius: '20px', 
  textAlign: 'center', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0' 
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };

const inputWrapper = { position: 'relative', width: '100%' };

const inputStyle = { 
  padding: '12px 15px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0', 
  width: '100%', 
  boxSizing: 'border-box',
  fontSize: '1rem',
  outline: 'none'
};

const btnStyle = { 
  padding: '14px', 
  backgroundColor: '#e67e22', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  fontWeight: '700',
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(230, 126, 34, 0.2)'
};

const signupBtn = { 
  ...btnStyle, 
  backgroundColor: 'transparent', 
  color: '#2c3e50', 
  border: '2px solid #2c3e50',
  boxShadow: 'none',
  width: '100%',
  marginTop: '10px'
};

const eyeStyle = { position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', opacity: 0.6 };
const forgotLink = { cursor: 'pointer', fontSize: '0.9rem', color: '#e67e22', fontWeight: '500', textDecoration: 'underline' };
const divider = { margin: '20px 0', borderBottom: '1px solid #eee', lineHeight: '0.1em', textAlign: 'center' };
const backLink = { cursor: 'pointer', marginTop: '20px', fontSize: '0.9rem', color: '#64748b' };