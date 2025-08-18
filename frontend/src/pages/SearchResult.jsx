import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Snacks', 'Pickles', 'Rajma', 'Kaladi', 'Dairy']);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products', {
          params: { search, category },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [search, category]);

  const handleCategoryChange = (e) => {
    setSearchParams({ search, category: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>

      <div className="mb-4 flex items-center gap-2">
        <label>Category:</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

  <div className="grid md:grid-cols-3 gap-4">
  {(Array.isArray(products) ? products : []).map((prod) => (
    <div key={prod._id} className="border p-4 rounded shadow-sm bg-white">
      <img src={prod.imageUrl} alt={prod.name} className="h-40 w-full object-cover mb-2 rounded" />
      <h3 className="font-bold">{prod.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{prod.description?.slice(0, 60)}...</p>
      <p className="font-semibold">₹{prod.price}</p>
      <p className="text-xs text-gray-500">Category: {prod.category}</p>
    </div>
  ))}
</div>
    </div>
  );
};

export default SearchResults;
