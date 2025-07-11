//Imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PostsPage from './pages/PostsPage'; 
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
//CSS
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Todas as rotas aqui.*/}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<PostsPage />} /> 
        <Route path="/posts/new" element={<CreatePostPage />} /> 
        <Route path="/posts/:slug/edit" element={<EditPostPage />} /> 
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;