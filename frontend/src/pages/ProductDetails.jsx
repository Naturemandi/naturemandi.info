import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
      setReviews(res.data.reviews || []);
      setSelectedImage(res.data.images?.[0] || res.data.imageUrl || '/placeholder.png');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load product details');
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await api.get(`/api/products`);
      const filtered = res.data.filter(p => p._id !== id).slice(0, 3);
      setRelated(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) return toast.warn('Please login to add items to cart.');
    setLoading(true);
    try {
      await api.post(
        '/api/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Added to cart!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return toast.warn('Please add rating and comment.');

    try {
     await api.post(
  `/api/reviews/${id}`,
  {
    rating,
    comment,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
      toast.success('Review submitted!');
      setComment('');
      setRating(0);
      fetchProductDetails(); // Refresh reviews
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (value, onClick) => (
    <div className="flex gap-1 cursor-pointer text-yellow-500 text-xl">
      {[1, 2, 3, 4, 5].map((num) => (
        <span key={num} onClick={() => onClick(num)}>
          {value >= num ? '★' : '☆'}
        </span>
      ))}
    </div>
  );

  if (!product) return <div className="p-6 text-center text-gray-600">Loading product...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      {/* Product Display */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2 space-y-4">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-80 object-cover rounded shadow"
          />

          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumb ${index}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    img === selectedImage ? 'border-green-600' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description || 'No description available.'}</p>

          <div className="text-xl font-semibold text-green-700">
            ₹{product.price} / {product.unit || '500g'}
          </div>

          <div className="text-sm text-gray-500">
            Origin: <span className="text-black">{product.origin || 'Jammu & Kashmir'}</span>
          </div>

          <div className="text-sm text-gray-500">
            Stock:{' '}
            <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}>
              {product.countInStock > 0
                ? `${product.countInStock} available`
                : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              disabled={product.countInStock === 0 || loading}
            >
              {product.countInStock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
              disabled={product.countInStock === 0 || loading}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Product Details</h3>
          <p>{product.description}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Delivery Information</h3>
          <p>Pan India delivery in 3–5 business days. Free delivery on orders above ₹100.</p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded shadow">
                <p className="italic text-gray-700">"{r.comment}"</p>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  — {r.name || 'Anonymous'} ({r.rating}⭐)
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Form */}
      {token && (
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded shadow space-y-4">
            <div>
              <label className="block text-sm font-medium">Your Rating:</label>
              {renderStars(rating, setRating)}
            </div>
            <div>
              <label className="block text-sm font-medium">Your Comment:</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Similar Items You Might Like</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
