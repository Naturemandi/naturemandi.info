import React, { useEffect, useState } from 'react';
import { Link ,useLocation} from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../services/api';

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const location  = useLocation()
  const orderId = location.state?.orderId;
  const downloadInvoice = async (orderId) => {
    const invoiceElement = document.getElementById(`invoice-${orderId}`);
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Fit to width
    pdf.save(`Invoice_${orderId}.pdf`);
  };

  useEffect(() => {
    if (!orderId) return;
    const token = localStorage.getItem('token');
    api.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null));
  }, [orderId]);
console.log("res data::",order)
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-8">
        <h2 className="text-2xl font-bold text-red-600">⚠️ No Order Found</h2>
        <p className="mt-2 text-gray-600">Please try again or check your orders page.</p>
        <Link to="/" className="mt-4 text-blue-600 underline">Go to Home</Link>
      </div>
    );
  }
 
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-8">
      <h2 className="text-3xl font-bold text-green-600 mb-3">🎉 Order Placed Successfully!</h2>
      <p className="text-gray-700 mb-6">
        Thank you for shopping with <span className="font-semibold">NatureMandi</span>. Your order is being processed.
      </p>

      {/* Invoice Box */}
<div id={`invoice-${order._id}`} className="bg-white border shadow-md rounded-md p-6 w-full max-w-xl text-left mb-6">
  <h3 className="text-lg font-semibold mb-2 text-gray-800">🧾 Invoice</h3>
  <p><strong>Order ID:</strong> {order._id}</p>
  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
  <p><strong>Name:</strong> {order.shippingAddress?.name || 'N/A'}</p>
  <p><strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}</p>
  <p>
    <strong>Address:</strong> 
    {order.shippingAddress
      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
      : 'N/A'}
  </p>
  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
  <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid ✅' : 'Pending ❌'}</p>

        <hr className="my-4" />
        <h4 className="font-semibold mb-2">🛒 Items:</h4>
<ul className="space-y-1 text-sm">
  {(order.items || []).map((item, idx) => (
    <li key={idx}>
      {item.product.name} - Qty: {item.quantity}
    </li>
  ))}
</ul>
        <hr className="my-4" />
       <p className="text-right font-bold text-lg">
  Total: ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : '0.00'}
</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/orders" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">View My Orders</Link>
        <button
          onClick={() => downloadInvoice(order._id)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Download Invoice
        </button>
        <Link to="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">Go to Home</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
