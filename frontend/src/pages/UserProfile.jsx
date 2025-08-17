import React, { useEffect, useState } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
import { PencilIcon, MapPinIcon, EnvelopeIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ORDERS_PER_PAGE = 5;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editInfo, setEditInfo] = useState({ name: '', email: '' });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [editAddress, setEditAddress] = useState({ label: '', address: '', city: '', state: '', pin: '', altPhone: '' });

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

const fetchUserData = async () => {
  try {
    const res = await api.get('/auth/me', headers);
    setUser(res.data);
    setEditInfo({ name: res.data.name || '', email: res.data.email || '' });
    setAddresses(res.data.addresses || []);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
};

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my', headers);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

const saveProfile = async () => {
  try {
    await api.put('/auth/me', editInfo, headers);
    alert('Profile updated!');
    setShowProfileModal(false);
    fetchUserData();
  } catch (err) {
    console.error('Error updating profile:', err);
  }
};

const saveAddress = async () => {
  const updated = [...addresses];
  if (editAddressIndex !== null) {
    updated[editAddressIndex] = editAddress;
  } else {
    updated.push(editAddress);
  }
  try {
    await api.put('/auth/addresses', { addresses: updated }, headers);
    alert('Addresses updated!');
    setShowAddressModal(false);
    setEditAddress({ label: '', address: '', city: '', state: '', pin: '', altPhone: '' });
    setEditAddressIndex(null);
    fetchUserData();
  } catch (err) {
    console.error('Error saving address:', err);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/cancel/${orderId}`, {}, headers);
      alert('Order cancelled.');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.text(`Invoice - Order #${order._id}`, 10, 10);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 20);
    order.items.forEach((item, i) => {
      doc.text(`${item.name} × ${item.quantity}`, 10, 30 + i * 10);
    });
    doc.text(`Status: ${order.status}`, 10, 30 + order.items.length * 10);
    doc.save(`Invoice_${order._id}.pdf`);
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  useEffect(() => {
    fetchUserData();
    fetchOrders();
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || user?.phoneOrEmail}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          <button onClick={() => setShowProfileModal(true)} className="text-blue-600">
            <PencilIcon className="w-5 h-5 inline-block mr-1" /> Edit
          </button>
        </div>
        <div className="space-y-2">
          <p><UserIcon className="w-4 h-4 inline mr-2" /> <strong>Name:</strong> {user?.name || 'Not set'}</p>
          <p><EnvelopeIcon className="w-4 h-4 inline mr-2" /> <strong>Email:</strong> {user?.email || 'Not set'}</p>
          <p><PhoneIcon className="w-4 h-4 inline mr-2" /> <strong>Login:</strong> {user?.phoneOrEmail}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <button onClick={() => { setEditAddressIndex(null); setShowAddressModal(true); }} className="text-blue-600">
            + Add Address
          </button>
        </div>
        {addresses.length === 0 ? <p>No addresses saved.</p> : addresses.map((addr, i) => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{addr.label}</p>
              <button onClick={() => { setEditAddressIndex(i); setEditAddress(addr); setShowAddressModal(true); }} className="text-sm text-blue-600">Edit</button>
            </div>
            <p><MapPinIcon className="w-4 h-4 inline mr-2" />{addr.address}, {addr.city}, {addr.state} - {addr.pin}</p>
            <p><PhoneIcon className="w-4 h-4 inline mr-2" /> Alt Phone: {addr.altPhone}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 mb-4 w-full rounded"
        />
        {paginatedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order._id} className="border p-4 rounded mb-4 shadow-sm">
              <p className="font-semibold">Order #{order._id}</p>
              <p className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <ul className="list-disc pl-5 my-2">
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} × {item.quantity}</li>
                ))}
              </ul>
              <p className="text-green-600 font-semibold">Status: {order.status}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {order.status === 'Processing' && (
                  <button onClick={() => cancelOrder(order._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Cancel Order</button>
                )}
                <button onClick={() => window.alert('Tracking not implemented')} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Track Order</button>
                <button onClick={() => downloadInvoice(order)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Download Invoice</button>
              </div>
            </div>
          ))
        )}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {showProfileModal && (
        <div className="fixed inset-0  bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <input
              type="text"
              value={editInfo.name}
              onChange={(e) => setEditInfo({ ...editInfo, name: e.target.value })}
              placeholder="Your Name"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="email"
              value={editInfo.email}
              onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })}
              placeholder="Email"
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={saveProfile} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editAddressIndex !== null ? 'Edit Address' : 'Add Address'}</h3>
            {['label', 'address', 'city', 'state', 'pin', 'altPhone'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={editAddress[field]}
                onChange={(e) => setEditAddress({ ...editAddress, [field]: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddressModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={saveAddress} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
