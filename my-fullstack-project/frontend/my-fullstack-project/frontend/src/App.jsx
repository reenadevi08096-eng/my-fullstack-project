import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

// Navbar Component
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1e1e1e', color: '#fff' }}>
      <h2>TaskMatrix Dashboard</h2>
      <div>
        {token ? (
          <>
            <Link to="/dashboard" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Register Component
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration Successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: 'green', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Register</button>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login Successful!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Login</button>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

// Dashboard & CRUD Component
function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch Items (Read)
  const fetchItems = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create Item
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Item with Optimistic UI
  const handleDelete = async (id) => {
    setItems(items.filter(item => item._id !== id));
    try {
      await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  // Update Item
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/items/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      });
      if (res.ok) {
        setEditingItem(null);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stripe Checkout
  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Project Management Dashboard</h1>
      
      {/* Create Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 16px', background: 'green', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Task</button>
      </form>

      {/* Stripe Button */}
      <button onClick={handleCheckout} style={{ marginBottom: '20px', padding: '10px 20px', background: '#635bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
        Upgrade / Checkout with Stripe
      </button>

      {/* Task List */}
      <h3>Task List</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => { setEditingItem(item); setEditTitle(item.title); setEditDescription(item.description); }} style={{ marginRight: '10px', padding: '4px 8px' }}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={{ background: 'red', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleUpdate} style={{ background: '#fff', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
            <h3>Edit Task</h3>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required style={{ padding: '8px' }} />
            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required style={{ padding: '8px' }} />
            <button type="submit" style={{ padding: '8px', background: 'blue', color: '#fff', border: 'none', cursor: 'pointer' }}>Update</button>
            <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '8px', cursor: 'pointer' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Success Component
function Success() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'green' }}>Payment Successful!</h1>
      <p>Thank you for your transaction.</p>
      <Link to="/dashboard">Go back to Dashboard</Link>
    </div>
  );
}

// Main App Router
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;