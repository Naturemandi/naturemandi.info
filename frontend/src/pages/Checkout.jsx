import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
 const [shipping, setShipping] = useState({
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: ''
});
  const [editMode, setEditMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, profileRes] = await Promise.all([
          api.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setCart(cartRes.data.items || []);
       if (profileRes.data.addresses) {
  // If backend uses 'pin', map it to 'pincode'
  const addr = profileRes.data.addresses[0];
  setShipping({
    ...shipping,
    name: addr.name || '',
    phone: addr.phone || '',
    address: addr.address || '',
    city: addr.city || '',
    state: addr.state || '',
    pincode: addr.pincode || addr.pin || ''
  });
} 
      } catch (err) {
        alert('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountedAmount = (subtotal * discount) / 100;
  const total = subtotal - discountedAmount;

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post('/api/coupons/apply', { code: couponCode }, { headers: { Authorization: `Bearer ${token}` } });
      setDiscount(res.data.discount);
      setCouponMessage(res.data.msg);
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err.response?.data?.msg || 'Invalid or expired coupon');
    }
  };

const placeOrder = async (isOnlinePayment = false) => {
  if (!Object.values(shipping).every(Boolean)) {
    return alert('Please fill all address fields');
  }
  if (cart.length === 0) return alert('Your cart is empty');

  if (paymentMethod === 'Online' && isOnlinePayment) return handlePayment();

  try {
    const res = await api.post(
      '/api/orders/place',
      { shippingAddress: shipping, couponCode, paymentMethod },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate('/success', { state: { orderId: res.data.order._id } }); // Use res.data.order._id
  } catch (err) {
    alert(err.response?.data?.msg || 'Order failed');
  }
};

  const handlePayment = async () => {
    try {
      const { data: order } = await api.post('/api/payment/create-order', { amount: total }, { headers: { Authorization: `Bearer ${token}` } });

      const options = {
        key: import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'NatureMandi',
        description: 'Purchase from NatureMandi',
        order_id: order.id,
        handler: async (response) => {
          const res = await api.post('/api/payment/verify', response, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data.success) {
            await api.post('/api/orders/place', { shippingAddress: shipping, couponCode, paymentMethod: 'Online' }, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/success', { state: { orderId: orderRes.data._id } });
          } else {
            alert('Payment verification failed');
          }
        },
        theme: { color: '#0f9d58' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment initiation failed');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Address */}
        <div>
          {/* Address */}
<div>
  <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
  {shipping.address ? (
    !editMode ? (
      <div className="bg-gray-100 p-4 rounded">
        <p>{shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
        <p>{shipping.name} - {shipping.phone}</p>
        <button onClick={() => setEditMode(true)} className="mt-2 text-blue-600 text-sm">Edit Address</button>
      </div>
    ) : (
      <div className="space-y-3">
        {['name', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
          <input
            key={field}
            name={field}
            value={shipping[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <div className="flex gap-3">
          <button onClick={() => setEditMode(false)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    )
  ) : (
    !editMode ? (
      <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Add Address</button>
    ) : (
      <div className="space-y-3">
        {['name', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
          <input
            key={field}
            name={field}
            value={shipping[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <div className="flex gap-3">
          <button onClick={() => setEditMode(false)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    )
  )}
</div>

          {/* Payment */}
          <h2 className="text-xl font-semibold mt-8 mb-2">Payment Method</h2>
          <div className="flex gap-4">
            {['COD', 'Online'].map((method) => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`border p-3 rounded cursor-pointer ${paymentMethod === method ? 'border-green-600' : 'border-gray-300'}`}
              >
                {method === 'COD' ? 'Cash on Delivery' : 'Pay Now (Razorpay)'}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="border p-4 rounded space-y-2">
            {cart.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount ({discount}%)</span><span>-₹{discountedAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon */}
          <div className="mt-4">
            <label className="text-sm">Coupon</label>
            <div className="flex gap-2">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="border px-3 py-2 rounded w-full" />
              <button onClick={handleApplyCoupon} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
            </div>
            {couponMessage && (
              <p className={`text-sm mt-1 ${discount ? 'text-green-600' : 'text-red-600'}`}>{couponMessage}</p>
            )}
          </div>

          <button
            onClick={() => placeOrder(paymentMethod === 'Online')}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
          >
            {paymentMethod === 'Online' ? 'Pay Now' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
