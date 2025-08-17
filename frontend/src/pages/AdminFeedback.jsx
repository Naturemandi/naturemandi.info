import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react'; // Optional: Icon for delete

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('/api/feedback/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      alert('Error fetching feedback');
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await axios.delete(`/api/feedback/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete feedback');
    }
  };

  const filtered = feedbacks.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin – Customer Feedback</h2>

      <input
        type="text"
        placeholder="Search by name, email or message"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 mb-4 border rounded"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-600">No feedback found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border bg-white shadow-md rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{f.name || 'Anonymous'}</td>
                  <td className="p-3">{f.email || 'N/A'}</td>
                  <td className="p-3">{f.message}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete feedback"
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

export default AdminFeedback;
