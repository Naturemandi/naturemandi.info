// AdminSupportMessages.jsx
//maked m to M
import React, { useEffect, useState } from 'react';
import api from '../services/api'

const AdminSupportMessages = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/support/admin', { headers: { Authorization: `Bearer ${token}` } });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(  );
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Support Messages</h2>
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg._id} className="border rounded p-4 bg-white shadow">
            <p><strong>{msg.user.name}</strong> ({msg.user.email})</p>
            <p className="mt-2 text-gray-700">{msg.text}</p>
            <p className="text-sm text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSupportMessages;
