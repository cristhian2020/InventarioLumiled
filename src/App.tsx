import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { ProductsPage } from "./pages/Products";
import { MovementsPage } from "./pages/MovementsPage";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
        {/* Overlay para móvil cuando el sidebar está abierto */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:flex-shrink-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <h2 className="text-xl font-bold">📦 Inventario LUMILED</h2>
            <button
              className="lg:hidden text-gray-300 hover:text-white p-1"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1 px-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">🛒</span>
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/movimientos"
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">📑</span>
                  Movimientos
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-0 lg:min-h-screen">
          {/* Navbar superior solo en móvil */}
          <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 py-3 z-30">
            <button 
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Inventario</h1>
            <div className="w-8"></div> {/* Espacio para centrar */}
          </header>

          {/* Área de contenido principal */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="h-full">
              <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/movimientos" element={<MovementsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;