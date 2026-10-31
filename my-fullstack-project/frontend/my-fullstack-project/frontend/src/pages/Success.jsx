import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl text-center max-w-md">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">Payment Successful!</h2>
        <p className="text-slate-400 mb-6">Aapka SaaS account successfully upgrade ho gaya hai.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold transition shadow-lg">Go to Dashboard</button>
      </div>
    </div>
  );
}