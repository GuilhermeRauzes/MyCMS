import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para redirecionar após a criação
import { Editor } from "@tinymce/tinymce-react"; // Importa o componente do TinyMCE

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft"); // Padrão: rascunho
  const [thumbnail, setThumbnail] = useState(""); // Para a URL da thumbnail (a do upload)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null); //Armazena o objeto File

  const editorRef = useRef(null); // Ref para acessar o conteúdo do editor TinyMCE
  const navigate = useNavigate(); // Hook para navegação programática

  // Token de admin. No futuro, isso virá do contexto de autenticação.
  const adminToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzA0YjNkY2FmMTVkMDBlYzUyNzhkYiIsImlhdCI6MTc1MjE5MDQ5MSwiZXhwIjoxNzU0NzgyNDkxfQ.1iTqkZTMhO72qDgR-aqEclBO-adSbIqPt_4VHtgwDFM"; // <-- COLOQUE SEU TOKEN DE ADMIN AQUI!

  const tinyMCEApiKey = "sp841dmha93vmkkpx91wp2q5zr20sh03urviuwtwpm2reylw";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const content = editorRef.current ? editorRef.current.getContent() : ""; // Pega o conteúdo do TinyMCE
    let uploadedThumbnailPath = ""; // Variável para armazenar o caminho da imagem do upload

    // --- Lógica de Upload da Imagem ---
    if (thumbnailFile) {
      // Só tenta fazer upload se um arquivo foi selecionado
      const formData = new FormData();
      formData.append("image", thumbnailFile); // 'image' deve corresponder ao nome do campo no Multer

      try {
        const uploadConfig = {
          headers: {
            // Não defina 'Content-Type' aqui; o navegador fará isso para FormData
            Authorization: `Bearer ${adminToken}`, // Opcional, se sua rota /api/upload exigir autenticação
          },
        };
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          uploadConfig
        );
        uploadedThumbnailPath = uploadResponse.data.filePath; // Pega o caminho retornado pelo backend
        // setSuccess('Imagem enviada com sucesso!'); // Feedback provisório, pode ser combinado com o sucesso do post
      } catch (uploadError) {
        console.error(
          "Erro ao enviar imagem:",
          uploadError.response ? uploadError.response.data : uploadError.message
        );
        setError("Erro ao enviar imagem. O post não será criado.");
        setLoading(false);
        return; // Interrompe a função se o upload da imagem falhar
      }
    }
    // --- Fim da Lógica de Upload ---

    const postData = {
      title,
      content,
      category,
      status,
      thumbnail: uploadedThumbnailPath, // <-- AGORA USA O CAMINHO DA IMAGEM UPLOADED
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        postData,
        config
      );
      setSuccess("Post criado com sucesso!");
      setLoading(false);
      // Limpar formulário e redirecionar
      setTitle("");
      setCategory("");
      setStatus("draft");
      setThumbnail(""); // Limpa a thumbnail (que agora é a URL do upload)
      setThumbnailFile(null); // <-- LIMPA TAMBÉM O ARQUIVO SELECIONADO
      if (editorRef.current) {
        editorRef.current.setContent(""); // Limpa o editor
      }
      // Redireciona para a lista de posts após 2 segundos
      setTimeout(() => {
        navigate("/posts");
      }, 2000);
    } catch (err) {
      console.error(
        "Erro ao criar post:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Erro ao criar post. Tente novamente."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Criar Novo Post
        </h1>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Título
            </label>
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
            <label
              htmlFor="category"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* NOVO CAMPO DE UPLOAD DE IMAGEM */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Imagem de Destaque (Thumbnail)
            </label>
            <input
              type="file"
              id="thumbnail"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              accept="image/*" // Aceita apenas arquivos de imagem
              onChange={(e) => setThumbnailFile(e.target.files[0])} // Pega o primeiro arquivo selecionado
            />
          </div>
          {/* FIM DO NOVO CAMPO */}

          <div>
            <label
              htmlFor="status"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Status
            </label>
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
            <label
              htmlFor="content"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Conteúdo
            </label>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              apiKey={tinyMCEApiKey} // Usando a variável da API Key
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  // <-- Cada plugin deve ser uma string separada
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image"
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | " + // <-- Use concatenação ou template literals
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
