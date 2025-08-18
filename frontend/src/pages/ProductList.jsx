import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        const data = res.data;

        const grouped = {};

        data.forEach(product => {
          const category = product.category || 'Uncategorized';
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(product);
        });

        setGroupedProducts(grouped);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">All Products</h2>

      {Object.keys(groupedProducts).map((category, idx) => (
        <div key={idx} className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-green-700">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {groupedProducts[category].map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
