import React, { useState } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ChangeLocation() {
  const [newLocation, setNewLocation] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      location: newLocation
    });
    alert("Location updated!");
    navigate('/account');
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Update Delivery Address</h2>
      <input 
        placeholder="Enter new address" 
        style={{ padding: '12px', width: '80%', marginBottom: '20px' }}
        onChange={(e) => setNewLocation(e.target.value)}
      />
      <button onClick={handleUpdate} style={{ padding: '10px 20px', background: '#e67e22', color: 'white', border: 'none' }}>
        Save New Location
      </button>
    </div>
  );
}