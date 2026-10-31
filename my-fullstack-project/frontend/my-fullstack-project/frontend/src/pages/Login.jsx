import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-2xl w-96 border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400 text-center">Welcome Back</h2>
        <input 
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
        />
        <input 
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" required
        />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-lg font-semibold shadow-lg">Login</button>
      </form>
    </div>
  );
}