import { useState, useEffect } from "react";
import axios from "axios"; // Para fazer requisições HTTP
import { Link } from "react-router-dom";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const adminToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzA0YjNkY2FmMTVkMDBlYzUyNzhkYiIsImlhdCI6MTc1MjE5MDQ5MSwiZXhwIjoxNzU0NzgyNDkxfQ.1iTqkZTMhO72qDgR-aqEclBO-adSbIqPt_4VHtgwDFM";
  // Função para buscar os posts do backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`, // Usando o token para ver posts rascunho também
          },
        };

        // Fazer a requisição GET no backend
        const response = await axios.get(
          "http://localhost:5000/api/posts",
          config
        );
        setPosts(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setError(
          "Erro ao carregar posts. Verifique o console para mais detalhes."
        );
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar o componente

  if (loading) {
    return (
      <div className="text-center text-lg mt-8 text-gray-700">
        Carregando posts...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  }

  //Delete post
  const handleDelete = async (slugToDelete, titleToDelete) => {
    if (
      !window.confirm(
        `Tem certeza que deseja deletar o post "${titleToDelete}"?`
      )
    ) {
      return; // Se o usuário cancelar, não faz nada
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Token de autenticação
        },
      };
      await axios.delete(
        `http://localhost:5000/api/posts/${slugToDelete}`,
        config
      );
      setSuccess(`Post "${titleToDelete}" deletado com sucesso!`);
      // Remove o post da lista localmente para atualizar a UI sem recarregar a página inteira
      setPosts(posts.filter((post) => post.slug !== slugToDelete));
      setLoading(false);
      // Opcional: remover mensagem de sucesso após alguns segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(
        "Erro ao deletar post:",
        err.response ? err.response.data : err.message
      );
      setError(`Erro ao deletar post "${titleToDelete}".`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Meus Posts</h1>

        {success && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Sucesso!</p>
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Erro!</p>
            <p>{Array.isArray(error) ? error.join(", ") : error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center text-lg text-gray-700 mb-4">
            Executando operação...
          </div>
        )}

        <Link
          to="/posts/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
        >
          + Criar Novo Post
        </Link>

        {posts.length === 0 ? (
          <p className="text-gray-700 mt-4">
            Nenhum post encontrado. Comece a criar um!
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {/* Adicionei colunas para melhor visualização */}
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      post.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Autor: {post.author ? post.author.username : "Desconhecido"}
                </p>
                <p className="text-gray-600 text-sm">
                  Criado em: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm">
                  Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-4 space-x-2">
                  <Link
                    to={`/posts/${post.slug}/edit`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
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
