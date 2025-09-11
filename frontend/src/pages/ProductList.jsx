import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/products');
        const data = res.data;

        const grouped = {};
        data.forEach((product) => {
          const category = product.category || 'Uncategorized';
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(product);
        });

        setGroupedProducts(grouped);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">All Products</h2>

      {/* Error State */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-10">
          {[...Array(2)].map((_, idx) => (
            <div key={idx}>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-60 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Actual Products
        Object.keys(groupedProducts).map((category, idx) => (
          <div key={idx} className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-green-700">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {groupedProducts[category].map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
