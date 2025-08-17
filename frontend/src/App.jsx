import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminOrders from './pages/AdminOrder.jsx';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/UserProfile';
import AboutUs from './pages/AboutUs';
import AdminProducts from './pages/AdminProduct';
import Support from './pages/SupportChart';
import SearchResults from './pages/SearchResult';
import MyOrders from './pages/MyOrder';
import AdminDashboard from './pages/AdminDashboard';
import AdminReviews from './pages/AdminReview';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <>
      <ToastContainer />
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/support" element={<Support />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/success" element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          } />
          <Route path="/admin/reviews" element={
  <AdminRoute>
    <AdminReviews />
  </AdminRoute>
} />

<Route path="/admin/orders" element={
  <AdminRoute>
    <AdminOrders />
  </AdminRoute>
} />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
    </>
  );
}
export default App;