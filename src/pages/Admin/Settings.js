import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const [settings, setSettings] = useState({
    shopOpen: true,
    deliveryFee: 0,
    taxPercentage: 5,
    minimumOrder: 100,
    contactEmail: 'support@trueeats.com'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, "settings", "global"));
      if (docSnap.exists()) setSettings(docSnap.data());
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, "settings", "global"), settings);
      alert("System Settings Updated!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', fontFamily: 'sans-serif' }}>
      <h2>⚙️ System Settings</h2>
      <p>Control the global behavior of the True Eats platform.</p>

      <div style={settingRow}>
        <label>Shop Status:</label>
        <button 
          onClick={() => setSettings({...settings, shopOpen: !settings.shopOpen})}
          style={{ backgroundColor: settings.shopOpen ? '#2ecc71' : '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {settings.shopOpen ? "OPEN" : "CLOSED"}
        </button>
      </div>

      <div style={settingRow}>
        <label>Delivery Fee (₹):</label>
        <input type="number" value={settings.deliveryFee} onChange={e => setSettings({...settings, deliveryFee: e.target.value})} style={inputStyle} />
      </div>

      <div style={settingRow}>
        <label>Tax Percentage (%):</label>
        <input type="number" value={settings.taxPercentage} onChange={e => setSettings({...settings, taxPercentage: e.target.value})} style={inputStyle} />
      </div>

      <div style={settingRow}>
        <label>Min. Order Value (₹):</label>
        <input type="number" value={settings.minimumOrder} onChange={e => setSettings({...settings, minimumOrder: e.target.value})} style={inputStyle} />
      </div>

      <button onClick={saveSettings} style={saveBtn}>Save All Changes</button>
    </div>
  );
}

const settingRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px', textAlign: 'center' };
const saveBtn = { marginTop: '30px', width: '100%', padding: '15px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };