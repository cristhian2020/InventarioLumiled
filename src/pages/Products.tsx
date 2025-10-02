import React, { useEffect, useState } from "react";
import {
  subscribeProducts,
  registerMovementTransaction,
  deleteProduct,
} from "../service/productService";
import { ProductForm } from "./ProductForm";
import { QuerySnapshot } from "firebase/firestore";

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProducts((snap: QuerySnapshot) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenSaleModal = (product: any) => {
    setSelectedProduct(product);
    setShowSaleModal(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        await deleteProduct(id);
        alert("Producto eliminado ✅");
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      p.proveedor?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(search.toLowerCase());

    const matchesStock = showLowStock
      ? p.cantidad <= (p.stockMinimo ?? 0)
      : true;

    return matchesSearch && matchesStock;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Inventario de Productos LumiLed
      </h1>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-gray-700 whitespace-nowrap">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 "
          />
          Mostrar solo stock bajo
        </label>
      </div>

      {/* Formulario para agregar */}
      <div className="mb-8">
        <ProductForm 
          onSaved={() => console.log("Producto agregado")} 
        />
      </div>

      {/* Tabla o lista de productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Versión desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Precio</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Proveedor</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Categoria</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-900">{p.nombre}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.cantidad <= (p.stockMinimo ?? 0) 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {p.cantidad}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-900">
                    ${p.precio?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">
                    {p.proveedor}
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">
                    {p.categoria}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
                        onClick={() => handleOpenSaleModal(p)}
                      >
                        Vender
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs transition-colors"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs transition-colors"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Versión móvil */}
        <div className="lg:hidden">
          {filteredProducts.map((p) => (
            <div key={p.id} className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  p.cantidad <= (p.stockMinimo ?? 0) 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {p.cantidad} unidades
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>Precio: ${p.precio?.toFixed(2) || '0.00'}</div>
                <div>Proveedor: {p.proveedor}</div>
              </div>
              <div className="mb-3 text-sm text-gray-600">
                <div>Categoria: {p.categoria}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-xs transition-colors"
                  onClick={() => handleOpenSaleModal(p)}
                >
                  Vender
                </button>
                <button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-xs transition-colors"
                  onClick={() => handleEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-xs transition-colors"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {products.length === 0 ? "No hay productos registrados" : "No se encontraron productos"}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <ProductForm
              product={editingProduct}
              onSaved={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
            
          </div>
        </div>
      )}

      {showSaleModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-black" >
              Vender: {selectedProduct.nombre}
            </h2>
             <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a vender (Stock disponible: {selectedProduct.cantidad})
                </label>
            <input
              type="number"
              min={1}
              max={selectedProduct.cantidad}
              defaultValue={1}
              id="ventaCantidad"
              className="w-full border rounded px-3 py-2 mb-4 text-gray-600"
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setShowSaleModal(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick={async () => {
                  const cantidad = parseInt(
                    (document.getElementById("ventaCantidad") as HTMLInputElement).value
                  );
                  if (cantidad > 0 && cantidad <= selectedProduct.cantidad) {
                    try {
                      await registerMovementTransaction(
                        selectedProduct.id,
                        "salida",
                        cantidad,
                        "usuario-demo"
                      );
                      alert(`Venta de ${cantidad} unidades registrada ✅`);
                      setShowSaleModal(false);
                      setSelectedProduct(null);
                    } catch (err: any) {
                      alert("Error: " + err.message);
                    }
                  } else {
                    alert("Cantidad inválida");
                  }
                }}
              >
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};