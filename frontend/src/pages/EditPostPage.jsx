import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

function EditPostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true); // Começa carregando
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { slug } = useParams(); // Pega o slug da URL

  // Tokens de admin novamente 
  const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzA0YjNkY2FmMTVkMDBlYzUyNzhkYiIsImlhdCI6MTc1MjE5MDQ5MSwiZXhwIjoxNzU0NzgyNDkxfQ.1iTqkZTMhO72qDgR-aqEclBO-adSbIqPt_4VHtgwDFM"; // <-- COLOQUE SEU TOKEN DE ADMIN AQUI!
  const tinyMCEApiKey = "sp841dmha93vmkkpx91wp2q5zr20sh03urviuwtwpm2reylw"; 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        };
        const response = await axios.get(`http://localhost:5000/api/posts/${slug}`, config);
        const post = response.data.data;

        setTitle(post.title);
        setCategory(post.category || '');
        setStatus(post.status);
        setThumbnail(post.thumbnail || '');
        // Define o conteúdo do editor TinyMCE depois que ele estiver pronto
        if (editorRef.current) {
          editorRef.current.setContent(post.content);
        } else {
          // Se o editor ainda não está pronto, aguarda e tenta novamente
          // (Isso é uma abordagem simples; em apps maiores, usaria um estado para o editor)
          setTimeout(() => {
            if (editorRef.current) editorRef.current.setContent(post.content);
          }, 100);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar post para edição:', err.response ? err.response.data : err.message);
        setError('Erro ao carregar post para edição. Verifique o console.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, adminToken]); // Dependências: slug e adminToken

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // O loading agora é para o submit, não para o fetch inicial
    setError(null);
    setSuccess(null);

    const content = editorRef.current ? editorRef.current.getContent() : '';

    const postData = {
      title,
      content,
      category,
      status,
      thumbnail
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      };

      const response = await axios.put(`http://localhost:5000/api/posts/${slug}`, postData, config);
      setSuccess('Post atualizado com sucesso!');
      setLoading(false);
      // Redireciona de volta para a lista de posts após 2 segundos
      setTimeout(() => {
        navigate('/posts');
      }, 2000);

    } catch (err) {
      console.error('Erro ao atualizar post:', err.response ? err.response.data : err.message);
      setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Erro ao atualizar post. Tente novamente.');
      setLoading(false);
    }
  };

  if (loading && !title) { 
    return <div className="text-center text-lg mt-8 text-gray-700">Carregando post para edição...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Editar Post: {title}</h1>

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">Sucesso!</p>
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Erro!</p>
            <p>{Array.isArray(error) ? error.join(', ') : error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-1">Categoria</label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-lg font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-1">Conteúdo</label>
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              apiKey={tinyMCEApiKey} // Usando a variável da API Key
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;