import React, { useState } from 'react';
import axios from 'axios';

export default function EditModal({ item, onClose, onUpdate }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/items/${item._id}`, { title, description, price }, {
        headers: { Authorization: token }
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form onSubmit={handleUpdate} className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4 text-indigo-400">Edit Entry</h3>
        <input 
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
        />
        <input 
          type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
        />
        <input 
          type="number" value={price} onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 mb-4 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold transition">Save</button>
          <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}