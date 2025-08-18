import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [inCart, setInCart] = useState(false);

  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : '/placeholder.png';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await api.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items =
          Array.isArray(res.data?.cart?.items)
            ? res.data.cart.items
            : Array.isArray(res.data?.items)
            ? res.data.items
            : Array.isArray(res.data)
            ? res.data
            : [];

        const alreadyInCart = items.some(
          (item) => item.product?._id === product._id
        );
        setInCart(alreadyInCart);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();
  }, [product._id]);

  const handleAddToCart = async (e, redirect = false) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return toast.error('Login required');

    if (inCart && redirect) {
      return navigate('/cart');
    }

    if (inCart) {
      return toast.error('Product already in cart');
    }

    try {
      const res = await api.post(
        '/api/cart/add',
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.msg || 'Added to cart!');
      setInCart(true);
      if (redirect) navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error adding to cart');
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="border rounded-lg p-4 shadow hover:shadow-md transition block"
    >
      <img
        src={productImage}
        alt={product.name}
        className="w-full h-70 object-cover mb-2 rounded"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-500 text-sm capitalize">{product.category}</p>
      <p className="font-bold text-green-600 mt-1">₹{product.price}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={(e) => handleAddToCart(e)}
          disabled={inCart}
          className={`flex-1 py-1 rounded text-white font-semibold ${
            inCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {inCart ? 'In Cart' : 'Add to Cart'}
        </button>

        <button
          onClick={(e) => handleAddToCart(e, true)}
          className={`flex-1 py-1 rounded text-white font-semibold ${
            inCart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {inCart ? 'Go to Cart' : 'Buy Now'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
