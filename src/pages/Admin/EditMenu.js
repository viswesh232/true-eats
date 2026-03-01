import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function EditMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', description: '' });

  // 1. Fetch Menu
  const fetchMenu = async () => {
    const querySnapshot = await getDocs(collection(db, "menu"));
    setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchMenu(); }, []);

  // 2. Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "menu"), newItem);
      setNewItem({ name: '', price: '', category: '', description: '' });
      fetchMenu();
      alert("Item added to True Eats!");
    } catch (err) { alert(err.message); }
  };

  // 3. Delete Item
  const handleDelete = async (id) => {
    if(window.confirm("Delete this item?")) {
      await deleteDoc(doc(db, "menu", id));
      fetchMenu();
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>🍴 Menu Management</h2>
      
      {/* ADD ITEM FORM */}
      <form onSubmit={handleAddItem} style={formStyle}>
        <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
        <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
        <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required>
          <option value="">Select Category</option>
          <option value="Starters">Starters</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>
        <textarea 
          placeholder="Detailed Description (No limit on length)" 
          value={newItem.description} 
          onChange={e => setNewItem({...newItem, description: e.target.value})} 
          style={{ height: '100px', padding: '10px' }}
        />
        <button type="submit" style={btnStyle}>Add Item to Menu</button>
      </form>

      <hr />

      {/* VIEW MENU */}
      <div style={gridStyle}>
        {menuItems.map(item => (
          <div key={item.id} style={cardStyle}>
            <h4>{item.name} - ₹{item.price}</h4>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{item.description}</p>
            <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', marginBottom: '30px' };
const btnStyle = { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const cardStyle = { padding: '15px', border: '1px solid #ddd', borderRadius: '10px' };