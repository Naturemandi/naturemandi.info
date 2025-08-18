import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch admin orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    try {
      const res = await api.put(`/api/orders/${orderId}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.msg || 'Marked as delivered');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin: All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${order.isDelivered ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.isDelivered ? 'Delivered' : 'Pending'}
                  </p>
                  <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 mt-2">
                <p><strong>User:</strong> {order.user?.phoneOrEmail || 'Unknown'}</p>
                <p><strong>Payment:</strong> {order.paymentMethod} {order.isPaid ? '(Paid)' : '(Unpaid)'}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              <div className="mt-2">
                {order.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600 mt-2">
                Ship to: {order.shippingAddress.name}, {order.shippingAddress.city}, {order.shippingAddress.state}
              </div>

              {/* ✅ Tracking info (if available) */}
              {order.trackingId && (
                <div className="mt-3 text-sm text-blue-800 bg-blue-50 p-2 rounded">
                  <p><strong>Courier:</strong> {order.courier}</p>
                  <p><strong>Tracking ID:</strong> {order.trackingId}</p>
                  <p><strong>ETA:</strong> {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>
                </div>
              )}

              {/* ✅ Admin Action */}
              {!order.isDelivered && (
                <button
                  onClick={() => handleMarkDelivered(order._id)}
                  className="mt-3 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
