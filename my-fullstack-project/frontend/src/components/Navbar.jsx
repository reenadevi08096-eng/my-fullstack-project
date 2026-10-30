import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

export default function Navbar() {
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/payments/create-checkout-session', {}, {
        headers: { Authorization: token }
      });
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">FullStack SaaS</h1>
      <div className="flex gap-4">
        <button onClick={handleUpgrade} className="bg-emerald-600 hover:bg-emerald-500 transition px-4 py-2 rounded-lg font-semibold shadow">Upgrade Pro</button>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="bg-rose-600 hover:bg-rose-500 transition px-4 py-2 rounded-lg font-semibold shadow">Logout</button>
      </div>
    </nav>
  );
}