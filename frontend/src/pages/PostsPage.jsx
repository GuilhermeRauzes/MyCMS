import { useState, useEffect } from 'react';
import axios from 'axios'; // Para fazer requisições HTTP
import { Link } from 'react-router-dom';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os posts do backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzA0YjNkY2FmMTVkMDBlYzUyNzhkYiIsImlhdCI6MTc1MjE5MDQ5MSwiZXhwIjoxNzU0NzgyNDkxfQ.1iTqkZTMhO72qDgR-aqEclBO-adSbIqPt_4VHtgwDFM"; 

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}` // Usando o token para ver posts rascunho também
          }
        };

        // Fazer a requisição GET no backend
        const response = await axios.get('http://localhost:5000/api/posts', config);
        setPosts(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
        setError('Erro ao carregar posts. Verifique o console para mais detalhes.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar o componente

  if (loading) {
    return <div className="text-center text-lg mt-8 text-gray-700">Carregando posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Meus Posts</h1>
        <Link to="/posts/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
          + Criar Novo Post
        </Link>

        {posts.length === 0 ? (
          <p className="text-gray-700 mt-4">Nenhum post encontrado. Comece a criar um!</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adicionei colunas para melhor visualização */}
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">Status: <span className={`font-medium ${post.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {post.status.toUpperCase()}
                </span></p>
                <p className="text-gray-600 text-sm">Autor: {post.author ? post.author.username : 'Desconhecido'}</p>
                <p className="text-gray-600 text-sm">Criado em: {new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}</p>
                <div className="mt-4 space-x-2">
                  <Link to={`/posts/${post.slug}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded">
                    Editar
                  </Link>
                  <button 
                    onClick={() => alert(`Funcionalidade de deletar para: ${post.title}`)} // Temporário
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostsPage;