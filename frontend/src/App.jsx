//Imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PostsPage from './pages/PostsPage'; 

//CSS
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<PostsPage />} /> 
        {/* Futuras rotas aqui: /posts/new, /posts/:slug/edit, etc. */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;