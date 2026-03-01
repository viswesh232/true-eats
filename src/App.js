import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages (Make sure these paths are exactly correct!)
import MenuPage from './pages/Customer/MenuPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/Admin/MainPage';
import DeliveryDashboard from './pages/Delivery/MainPage';
import Permissions from './pages/Admin/Permissions';
import EditMenu from './pages/Admin/EditMenu';
import RevenuePage from './pages/Admin/Revenue';
import SearchCustomers from './pages/Admin/SearchCustomers';
import BillGenerator from './pages/Admin/BillGenerator';
import DeliveryInfo from './pages/Admin/DeliveryInfo';
import OrdersPage from './pages/Admin/OrdersPage';
import Settings from './pages/Admin/Settings';
import CartPage from './pages/Customer/CartPage';
import PaymentPage from './pages/Customer/PaymentPage';
import Confirmation from './pages/Customer/Confirmation';
import Account from './pages/Customer/Account';
import PastOrders from './pages/Customer/PastOrders';
import ChangeLocation from './pages/Customer/ChangeLocation';
import DeliveryHistory from './pages/Delivery/DeliveryHistory';
import Checkout from './pages/Customer/Checkout';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path='/' element={<MenuPage/>}/>
        
        <Route path="/admin/edit-menu" element={<EditMenu />} />
        <Route path="/admin/permissions" element={<Permissions />} />
        <Route path="/admin/revenue" element={<RevenuePage />} />
        <Route path="/admin/search" element={<SearchCustomers />} />
        <Route path="/admin/bills" element={<BillGenerator />} />
        <Route path="/admin/delivery-info" element={<DeliveryInfo />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/settings" element={<Settings/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<Confirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/past-orders" element={<PastOrders />} />
        <Route path="/change-location" element={<ChangeLocation />} />
        <Route path="/delivery/history" element={<DeliveryHistory />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Public Route */}
        <Route path="/" element={<MenuPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Role-Based Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;