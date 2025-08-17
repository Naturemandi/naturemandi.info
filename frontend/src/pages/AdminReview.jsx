import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, Download } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      alert('Failed to fetch reviews');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/admin/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReviews(); // Refresh after deletion
    } catch (err) {
      alert('Failed to delete review');
      console.error(err);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await api.get('/reviews/admin/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_reviews.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('CSV export failed');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter((r) =>
    r.productName.toLowerCase().includes(search.toLowerCase()) ||
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Admin – Product Reviews</h2>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by product or reviewer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 mb-4 border rounded"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Product</th>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rev) => (
                <tr key={rev._id} className="border-t text-sm hover:bg-gray-50">
                  <td className="p-3 font-medium">{rev.productName}</td>
                  <td className="p-3">{rev.name}</td>
                  <td className="p-3">⭐ {rev.rating}</td>
                  <td className="p-3">{rev.comment}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteReview(rev._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
