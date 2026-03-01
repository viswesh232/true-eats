import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Permissions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setLoading(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      alert("Role updated successfully!");
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>🔐 User Permissions Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={tdStyle}>Name</th>
            <th style={tdStyle}>Email</th>
            <th style={tdStyle}>Current Role</th>
            <th style={tdStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{user.firstName} {user.lastName}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}><strong>{user.role}</strong></td>
              <td style={tdStyle}>
                <select 
                  value={user.role} 
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tdStyle = { padding: '12px', textAlign: 'left' };