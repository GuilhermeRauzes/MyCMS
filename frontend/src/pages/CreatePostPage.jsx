import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirecionar após a criação
import { Editor } from '@tinymce/tinymce-react'; // Importa o componente do TinyMCE

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft'); // Padrão: rascunho
  const [thumbnail, setThumbnail] = useState(''); // Para a URL da thumbnail (futuro upload)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editorRef = useRef(null); // Ref para acessar o conteúdo do editor TinyMCE
  const navigate = useNavigate(); // Hook para navegação programática

    //Token de admin novamente. No futuro, isso virá do contexto de autenticação.
  const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzA0YjNkY2FmMTVkMDBlYzUyNzhkYiIsImlhdCI6MTc1MjE5MDQ5MSwiZXhwIjoxNzU0NzgyNDkxfQ.1iTqkZTMhO72qDgR-aqEclBO-adSbIqPt_4VHtgwDFM"; // <-- COLOQUE SEU TOKEN DE ADMIN AQUI!

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const content = editorRef.current ? editorRef.current.getContent() : ''; // Pega o conteúdo do TinyMCE

    const postData = {
      title,
      content,
      category,
      status,
      thumbnail // Será preenchido quando o upload de imagem for implementado
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      };

      const response = await axios.post('http://localhost:5000/api/posts', postData, config);
      setSuccess('Post criado com sucesso!');
      setLoading(false);
      // Opcional: Limpar formulário ou redirecionar
      setTitle('');
      setCategory('');
      setStatus('draft');
      setThumbnail('');
      if (editorRef.current) {
        editorRef.current.setContent(''); // Limpa o editor
      }
      // Redireciona para a lista de posts após 2 segundos
      setTimeout(() => {
        navigate('/posts');
      }, 2000);

    } catch (err) {
      console.error('Erro ao criar post:', err.response ? err.response.data : err.message);
      setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Erro ao criar post. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Criar Novo Post</h1>

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
              apiKey="sp841dmha93vmkkpx91wp2q5zr20sh03urviuwtwpm2reylw" 
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
            {loading ? 'Criando...' : 'Criar Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;