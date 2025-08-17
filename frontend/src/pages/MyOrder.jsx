import React, { useEffect, useState } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';

const ORDERS_PER_PAGE = 5;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFeedback, setShowFeedback] = useState(null); // orderId
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await api.delete(`/orders/${orderId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Order cancelled successfully');
      fetchOrders(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order');
    }
  };

const handleDownloadInvoice = (order) => {
  const doc = new jsPDF();

  // Add Logo (place logo.png inside public folder)
  const img = new Image();
  img.src = "/logo.png"; // must exist in public/
  doc.addImage(img, "PNG", 80, 10, 50, 20); 

  // Company Info
  doc.setFontSize(18);
  doc.setFontSize(11);
  doc.text("Fresh & Organic Products", 105, 28, { align: "center" });

  // Invoice Title
  doc.setFontSize(14);
  doc.text(`Invoice`, 105, 40, { align: "center" });

  // Order Info
  doc.setFontSize(11);
  doc.text(`Order ID: ${order._id}`, 14, 55);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 62);

  // Customer Info
  doc.text(`Customer: ${order.shippingAddress?.name}`, 14, 72);
  doc.text(
    `Address: ${order.shippingAddress?.address}, ${order.shippingAddress?.city} - ${order.shippingAddress?.pincode}`,
    14,
    79
  );

  // Table Header
  let startY = 90;
  doc.setFontSize(12);
  doc.text("Item", 14, startY);
  doc.text("Qty", 120, startY);
  doc.text("Price", 150, startY);
  doc.text("Total", 180, startY);
  doc.line(14, startY + 2, 200, startY + 2);

  // Table Rows
  let y = startY + 10;
  order.items.forEach((item, index) => {
    const productName = item.product?.name || "Deleted Product";
    const qty = item.quantity;
    const price = item.product?.price || 0;
    const total = qty * price;

    doc.setFontSize(11);
    doc.text(productName, 14, y);
    doc.text(String(qty), 125, y, { align: "right" });
    doc.text(`₹${price}`, 155, y, { align: "right" });
    doc.text(`₹${total}`, 185, y, { align: "right" });

    y += 8;
  });

  // Total Amount
  doc.line(14, y + 2, 200, y + 2);
  doc.setFontSize(12);
  doc.text(`Total Amount: ₹${order.totalAmount}`, 170, y + 12, { align: "right" });

  // Footer
  doc.setFontSize(10);
  doc.text(
    "Thank you for shopping with NatureMandi!",
    105,
    285,
    { align: "center" }
  );
  doc.text(
    "For queries, contact support@naturemandi.com",
    105,
    292,
    { align: "center" }
  );

  // Save file
  doc.save(`invoice-${order._id}.pdf`);
};


  const handleSubmitFeedback = async () => {
    if (!rating || !message.trim()) {
      alert('Please provide both rating and message');
      return;
    }

    try {
      await api.post(
        '/feedback',
        { orderId: showFeedback, rating, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Thanks for your feedback!');
      setShowFeedback(null);
      setRating(0);
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  if (loading) return <div className="p-6 text-lg">Loading your orders...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <input
        type="text"
        placeholder="Search by Order ID"
        className="mb-4 w-full sm:w-80 p-2 border rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {paginatedOrders.length === 0 ? (
        <p className="text-gray-600">No matching orders found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <div>
                  <p className="text-sm font-semibold">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <span
                    className={`text-xs px-3 py-1 rounded font-semibold ${
                      order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Confirmed'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm font-bold mt-1">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="border-t pt-2 space-y-1 text-sm">
                {order.items.map((item) => (
                  <div key={item.product?._id || item._id} className="flex justify-between">
                    <span>
                      {item.product?.name || 'Deleted Product'} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.product?.price ? item.product.price * item.quantity : 0}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Shipping to: {order.shippingAddress?.name},{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city} -{' '}
                {order.shippingAddress?.pincode}
              </p>

              <div className="mt-4 flex gap-3 flex-wrap">
                <button
                  onClick={() => alert('Tracking feature coming soon!')}
                  className="px-4 py-1 text-sm rounded border border-blue-500 text-blue-600 hover:bg-blue-100"
                >
                  Track Order
                </button>

                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-1 text-sm rounded border border-red-500 text-red-600 hover:bg-red-100"
                  >
                    Cancel Order
                  </button>
                )}

                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="px-4 py-1 text-sm rounded border border-gray-500 text-gray-700 hover:bg-gray-100"
                >
                  Download Invoice
                </button>

                {order.status === 'Delivered' && (
                  <button
                    onClick={() => setShowFeedback(order._id)}
                    className="px-4 py-1 text-sm rounded border border-green-500 text-green-600 hover:bg-green-100"
                  >
                    Give Feedback
                  </button>
                )}
              </div>

              {showFeedback === order._id && (
                <div className="mt-4 bg-gray-50 border p-3 rounded">
                  <h4 className="text-sm font-semibold mb-2">Rate & Review</h4>
                  <div className="flex gap-1 mb-2 text-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full p-2 border rounded mb-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitFeedback}
                      className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowFeedback(null)}
                      className="px-3 py-1 text-sm rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
