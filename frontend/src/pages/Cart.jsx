import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (token) {
          const res = await api.get('/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(res.data.items || []);
        } else {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(localCart);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [token]);

const handleRemove = async (productId) => {
  console.log('Removing productId:', productId);
  try {
    if (token) {
      await api.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    const updatedCart = cartItems.filter((item) => {
      const id = item.product?._id || item.product;
      return id !== productId;
    });
    setCartItems(updatedCart);
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to remove item');
  }
};

const updateQuantity = async (productId, newQty) => {
  if (newQty < 1) return;
  try {
    const updatedCart = cartItems.map((item) => {
      const id = item.product?._id || item.product;
      if (id === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);

    if (token) {
      await api.put(
        `/cart/update/${productId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to update quantity');
  }
};

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product?.price || item.price;
      const qty = item.quantity;
      return acc + price * qty;
    }, 0);
  };

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading cart...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item, idx) => {
  const product = item.product || item;
  const productId = product._id || product;
              const imageUrl = Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : product.image || '/placeholder.jpg';

              return (
                <div
                  key={item._id || `${product._id}-${idx}`}
                  className="flex items-center justify-between p-4 border rounded-lg shadow bg-white hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
             <button
  onClick={() => updateQuantity(item.product?._id || item.product, item.quantity - 1)}
  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
>
  <FaMinus size={12} />
</button>
<span className="px-3 text-sm font-medium">{item.quantity}</span>
<button
  onClick={() => updateQuantity(item.product?._id || item.product, item.quantity + 1)}
  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
>
  <FaPlus size={12} />
</button>
                      </div>
                      <p className="text-sm font-bold text-green-700 mt-1">₹{product.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-medium">
                      ₹{(product.price * item.quantity).toFixed(2)}
                    </p>
<button
  onClick={() => handleRemove(item.product?._id || item.product)}
  className="text-red-500 hover:text-red-700"
>
  <FaTrashAlt />
</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-20">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base text-gray-800">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
