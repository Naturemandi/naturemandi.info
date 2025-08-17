import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    const res = await api.get('/products');
    // Defensive: always use array
    const productsArray = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data.products)
        ? res.data.products
        : [];
    setProducts(productsArray);
    setFiltered(productsArray);
    const cats = [...new Set(productsArray.map((p) => p.category))];
    setCategories(['All', ...cats]);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = Array.isArray(products) ? products : [];
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    setFiltered(result);
  }, [search, category, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload/product-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    } catch (err) {
      alert('Image upload failed');
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadToBackend(file);
      setForm({ ...form, imageUrl: url });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setForm(product);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      imageUrl: '',
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
 if (!form.name || !form.price || !form.stock || !form.category || !form.imageUrl) {
  alert('Please fill all required fields and upload an image.');
  return;
}
  if (!form.imageUrl) {
    alert('Please upload a product image.');
    return;
  }

  try {
    const productData = {
  name: form.name,
  description: form.description,
  price: Number(form.price),
  category: form.category,
  countInStock: Number(form.stock),
  images: [form.imageUrl],
};

    if (editingProduct) {
      await api.put(`/products/${editingProduct}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post('/products', productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    fetchProducts();
    resetForm();
  } catch (err) {
    alert('Error saving product');
    console.error(err);
  }
};

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin – Manage Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          className="border p-2 rounded w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {['name', 'category', 'price', 'stock'].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border p-2 rounded w-full"
              required
            />
          ))}
        </div>

        {/* Image Upload */}
        <div className="mt-2">
          <label className="block mb-1 font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="h-24 mt-2 rounded shadow-sm"
            />
          )}
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full mt-2"
        />

        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingProduct ? 'Update' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              onClick={resetForm}
              type="button"
              className="bg-gray-400 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className=" grid md:grid-cols-4 gap-4">
        {Array.isArray(filtered) && filtered.length > 0 ? (
          filtered.map((prod) => (
            <div key={prod._id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">{prod.name}</h4>
                <span className="text-sm text-gray-500">₹{prod.price}</span>
              </div>
              <p className="text-sm mb-2">{prod.description}</p>
              <img
                src={prod.images}
                alt={prod.name}
                className="h-32 object-cover mb-2 rounded"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Stock: {prod.countInStock}</span>
                <span>Category: {prod.category}</span>
              </div>
              <div className="flex mt-3 gap-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="bg-yellow-500 text-white px-3 py-1 text-sm rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(prod._id)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;