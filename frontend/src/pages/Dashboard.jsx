function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Bem-vindo ao Painel Administrativo</h1>
        <p className="text-gray-700 text-lg">
          Use o menu de navegação acima para gerenciar seus posts.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Total de Posts</h2>
            <p className="text-4xl font-bold text-blue-600">5</p> {/* Placeholder, será dinâmico */}
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Posts Publicados</h2>
            <p className="text-4xl font-bold text-green-600">3</p> {/* Placeholder, será dinâmico */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;