import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <h2>My Account</h2>
      <div style={infoBox}>
        <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Delivery Location:</strong> {userData.location}</p>
        <button onClick={() => navigate('/account/edit')} style={editBtn}>Edit Details</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Activity</h3>
        <button onClick={() => navigate('/past-orders')} style={actionBtn}>📜 View Past Orders</button>
        <button onClick={() => navigate('/change-location')} style={actionBtn}>📍 Change Delivery Location</button>
      </div>
    </div>
  );
}

const infoBox = { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' };
const editBtn = { background: '#2c3e50', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '5px' };
const actionBtn = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', textAlign: 'left', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px', background: 'white' };