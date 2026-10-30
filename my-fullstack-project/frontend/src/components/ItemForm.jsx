import React, { useState } from 'react';
import axios from 'axios';

export default function ItemForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/items', { title, description, price }, {
        headers: { Authorization: token }
      });
      setTitle(''); setDescription(''); setPrice('');
      onAdd();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-indigo-400">Add New Entry</h3>
      <input 
        type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
      />
      <input 
        type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
      />
      <input 
        type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)}
        className="w-full p-3 mb-4 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
      />
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-lg font-semibold shadow-lg">Submit Payload</button>
    </form>
  );
}