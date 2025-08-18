import React, { useState } from 'react';
import { FaPaperPlane, FaHeadset } from 'react-icons/fa';
import api from '../services/api';

const quickActions = [
  { id: 1, label: 'Order Not Delivered' },
  { id: 2, label: 'Cancel Order' },
  { id: 3, label: 'Talk to Agent' },
];

const initialMessages = [
  { sender: 'user', text: 'Hello! welcome to NatureMandi support.' },
];

const SupportChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

const handleSend = async () => {
  if (!input.trim()) return;
  const newMessage = { sender: 'user', text: input.trim() };
  setMessages([...messages, newMessage]);

  try {
    const token = localStorage.getItem('token');
    await api.post(
      '/api/support',
      { text: input.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Failed to send message to backend', error);
  }

  setInput('');
};


  const handleQuickAction = (label) => {
    const actionMessage = { sender: 'user', text: label };
    setMessages([...messages, actionMessage]);

    // TODO: Send to backend (for admin to view)
    console.log('Quick Action:', actionMessage);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      {/* Agent Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
            <FaHeadset className="text-xl" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Support Assistant</h2>
            <p className="text-sm text-gray-400">Available 24/7 to assist you</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Common Queries</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.label)}
              className="bg-gray-100 px-4 py-2 rounded-lg border hover:bg-gray-200 transition"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="border rounded-lg p-4 bg-white max-h-[400px] overflow-y-auto space-y-3 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl text-sm max-w-[75%] break-words whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'bg-blue-100 ml-auto text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
