import { Link } from 'react-router-dom'; // Para navegação interna

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          MyCMS Admin
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/posts" className="hover:text-gray-300">
            Posts
          </Link>
          <Link to="/posts/new" className="hover:text-gray-300">
            Criar Post
          </Link>
          {/* No futuro: botão de logout */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;