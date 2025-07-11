import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

// Importe o CSS do Tailwind
import './index.css'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Futuras rotas aqui: /posts, /posts/new, /posts/:slug/edit, etc. */}
        <Route path="/" element={<Dashboard />} /> {/* Redireciona a raiz para o dashboard por enquanto */}
      </Routes>
    </Router>
  );
}

export default App;