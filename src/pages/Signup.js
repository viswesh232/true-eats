import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [formData, setFormData] = useState({
        fname: '', lname: '', email: '', password: '', confirmPassword: '',
        phone: '', altContact: '', address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Auto Location Logic
    const getMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setFormData({ ...formData, address: `${latitude}, ${longitude}` });
            });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

        try {
            const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await sendEmailVerification(res.user);
            
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                firstName: formData.fname,
                lastName: formData.lname,
                email: formData.email,
                phone: formData.phone,
                altContact: formData.altContact || "",
                location: formData.address || "",
                role: 'Customer', // Everyone starts here
                deliveryVerified: false,
                createdAt: new Date()
            });

            alert("Verification email sent! Check your inbox before logging in.");
            navigate('/login');
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={containerStyle}>
            <h2>True Eats - Signup</h2>
            <form onSubmit={handleSignup} style={formStyle}>
                <div style={{display:'flex', gap:'10px'}}>
                    <input placeholder="First Name *" style={inputStyle} onChange={e => setFormData({...formData, fname: e.target.value})} required />
                    <input placeholder="Last Name *" style={inputStyle} onChange={e => setFormData({...formData, lname: e.target.value})} required />
                </div>
                <input type="email" placeholder="Email *" style={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})} required />
                
                <div style={{position:'relative'}}>
                    <input type={showPassword ? "text" : "password"} placeholder="Password *" style={inputStyle} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>{showPassword ? '👁️‍🗨️' : '👁️'}</span>
                </div>

                <input type="password" placeholder="Confirm Password *" style={inputStyle} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                <input placeholder="Phone Number *" style={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                <input placeholder="Alt Email/Phone (Optional)" style={inputStyle} onChange={e => setFormData({...formData, altContact: e.target.value})} />
                
                <div style={{display:'flex', gap:'5px'}}>
                    <input placeholder="Location (Manual/Auto)" value={formData.address} style={inputStyle} onChange={e => setFormData({...formData, address: e.target.value})} />
                    <button type="button" onClick={getMyLocation} style={{cursor:'pointer'}}>📍</button>
                </div>

                <button type="submit" style={btnStyle}>Create Account & Verify</button>
            </form>
            <p onClick={() => navigate('/login')} style={{cursor:'pointer', color:'#e67e22'}}>Already have an account? Login</p>
        </div>
    );
}

// Reuse these styles in both files
const containerStyle = { maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '15px', textAlign: 'center' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '90%' };
const btnStyle = { padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const eyeStyle = { position: 'absolute', right: '15px', top: '10px', cursor: 'pointer' };