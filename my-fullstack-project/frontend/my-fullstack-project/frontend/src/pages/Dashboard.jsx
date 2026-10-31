import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import EditModal from '../components/EditModal';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const token = localStorage.getItem('token');

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: token }
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    // Optimistic UI update
    setItems(items.filter(item => item._id !== id));
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: token }
      });
    } catch (err) {
      fetchItems(); // revert on failure
    }
  };

  const chartData = items.map(item => ({ name: item.title, price: item.price }));

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ItemForm onAdd={fetchItems} />
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Analytics Overview</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                  <Bar dataKey="price" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <ItemList items={items} onDelete={handleDelete} onEdit={setEditingItem} />
        {editingItem && <EditModal item={editingItem} onClose={() => setEditingItem(null)} onUpdate={fetchItems} />}
      </div>
    </div>
  );
}