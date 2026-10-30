import React from 'react';

export default function ItemList({ items, onDelete, onEdit }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-indigo-400">Data Records</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg mb-1">{item.title}</h4>
              <p className="text-slate-400 text-sm mb-3">{item.description}</p>
              <span className="text-emerald-400 font-semibold">₹{item.price}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => onEdit(item)} className="flex-1 bg-amber-600 hover:bg-amber-500 py-1.5 rounded font-medium text-sm transition">Edit</button>
              <button onClick={() => onDelete(item._id)} className="flex-1 bg-rose-600 hover:bg-rose-500 py-1.5 rounded font-medium text-sm transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}