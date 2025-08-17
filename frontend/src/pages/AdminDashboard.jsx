import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaBox, FaRupeeSign, FaUsers, FaStar, FaFileCsv } from 'react-icons/fa';
import AdminSupportMessage from '../components/AdminSupportMessage';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, ordersRes, feedbacksRes] = await Promise.all([
          api.get('/admin/metrics', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/reviews/admin/all', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setMetrics(metricsRes.data);
        setOrders(ordersRes.data);
        setPendingOrders(ordersRes?.data.filter(o => o.status !== 'Delivered'));
        setFeedbacks(feedbacksRes?.data.slice(0, 3));
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data');
      }
    };

    fetchData();
  }, [token]);

  const handleExportOrdersCSV = async () => {
    try {
      const res = await api.get('/admin/orders/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-800">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Monitor and manage all operations of your platform.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View All Orders
          </button>
          <button
            onClick={handleExportOrdersCSV}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
          >
            <FaFileCsv /> Export Orders CSV
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Summary Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard icon={<FaBox />} label="Total Orders" value={metrics?.totalOrders || 0} />
          <MetricCard icon={<FaRupeeSign />} label="Revenue" value={`₹${metrics?.totalRevenue || 0}`} />
          <MetricCard icon={<FaUsers />} label="Active Users" value={metrics?.totalUsers || 0} />
        </div>
      </section>

      {/* Pending Orders */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">No pending orders.</p>
        ) : (
          <div className="grid gap-4">
            {pendingOrders.map(order => (
              <div key={order._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm">Customer: {order.user?.name || 'Guest'}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <a
                    href={`/admin/orders/invoice/${order._id}`}
                    className="text-green-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Invoice
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Feedback */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recent Customer Feedback</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {feedbacks?.map(fb => (
            <div key={fb._id} className="bg-gray-50 p-4 rounded shadow border">
              <p className="font-medium text-sm mb-1">
                <FaStar className="inline text-yellow-500" /> {fb.rating}/5 by {fb.user?.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-700">{fb.comment}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/admin/reviews')}
            className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700"
          >
            View All Feedback
          </button>
        </div>
      </section>

      <div>
        <AdminSupportMessage />
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-6 bg-white rounded-lg border shadow hover:shadow-md">
    <div className="text-green-600 text-2xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
