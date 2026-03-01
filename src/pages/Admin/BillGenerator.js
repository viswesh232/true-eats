import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function BillGenerator() {
  const [orderId, setOrderId] = useState('');
  const [billData, setBillData] = useState(null);

  const fetchOrderForBill = async () => {
    if (!orderId) return;
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setBillData(docSnap.data());
    } else {
      alert("Order ID not found!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'monospace' }}>
      <div className="no-print">
        <h2>📄 True Eats | Bill Generator</h2>
        <input 
          placeholder="Enter Order ID" 
          onChange={(e) => setOrderId(e.target.value)}
          style={{ padding: '10px', width: '250px' }}
        />
        <button onClick={fetchOrderForBill} style={{ padding: '10px', marginLeft: '10px' }}>Generate</button>
      </div>

      {billData && (
        <div id="bill-content" style={billBox}>
          <center>
            <h1>TRUE EATS</h1>
            <p>Quality Food, Delivered Fast</p>
            <hr />
          </center>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Customer:</strong> {billData.customerName}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          <hr />
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th align="left">Item</th>
                <th align="right">Price</th>
              </tr>
            </thead>
            <tbody>
              {billData.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name} x {item.quantity}</td>
                  <td align="right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <h3 align="right">Total: ₹{billData.totalPrice}</h3>
          <button className="no-print" onClick={handlePrint} style={printBtn}>Print Receipt</button>
        </div>
      )}
    </div>
  );
}

const billBox = { border: '1px solid #000', padding: '20px', marginTop: '20px', maxWidth: '400px', backgroundColor: '#fff' };
const printBtn = { marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer' };