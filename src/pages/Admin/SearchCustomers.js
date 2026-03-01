import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SearchCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"), 
      where("email", "==", searchTerm),
      where("role", "==", "Customer")
    );
    const querySnapshot = await getDocs(q);
    setResults(querySnapshot.docs.map(doc => doc.data()));
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>🔍 Search Customers</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Enter Customer Email" 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px' }}>Search</button>
      </div>

      {results.map((user, index) => (
        <div key={index} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Address: {user.location}</p>
          <button style={{ background: '#2c3e50', color: 'white' }}>View Order History</button>
        </div>
      ))}
    </div>
  );
}