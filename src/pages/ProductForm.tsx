import React, { useState } from "react";
import { addProduct, updateProduct } from "../service/productService";
// import BarcodeScanner from "react-qr-barcode-scanner";

type ProductFormProps = {
  product?: any; 
  onSaved?: () => void; 
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSaved }) => {
  const [nombre, setNombre] = useState(product?.nombre ?? "");
  const [cantidad, setCantidad] = useState(product?.cantidad?.toString() ?? "");
  const [precio, setPrecio] = useState(product?.precio?.toString() ?? "");
  const [proveedor, setProveedor] = useState(product?.proveedor ?? "");
  const [categoria, setCategoria] = useState(product?.categoria ?? "");
  const [stockMinimo, setStockMinimo] = useState(product?.stockMinimo?.toString() ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        await updateProduct(product.id, {
          nombre,
          cantidad:Number(cantidad),
          precio:Number(precio),
          proveedor,
          categoria,
          stockMinimo:Number(stockMinimo),
        });
        alert("Producto actualizado ✅");
      } else {
        await addProduct({
          nombre,
          cantidad:Number(cantidad),
          precio:Number(precio),
          proveedor,
          categoria,
          stockMinimo:Number(stockMinimo),
        });
        alert("Producto agregado ✅");
        // Limpiar el formulario después de agregar un producto
        setNombre("");
        setCantidad("");
        setPrecio("");
        setProveedor("");
        setCategoria("");
        setStockMinimo("");
      }

      if (onSaved) onSaved();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
 

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto flex flex-col gap-6 overflow-y-auto max-h-[90vh]"
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
        {product ? "✏️ Editar producto" : "➕ Agregar producto"}
      </h2>

      {/* Grid responsivo para inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-left">Nombre</p>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>

        <div>
          <p className="text-gray-600 text-left">Cantidad</p>
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>

        <div>
          <p className="text-gray-600 text-left">Precio</p>
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>

        <div>
          <p className="text-gray-600 text-left">Proveedor</p>
          <input
            type="text"
            placeholder="Proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>

        <div>
          <p className="text-gray-600 text-left">Categoría</p>
          <input
            type="text"
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>

        <div>
          <p className="text-gray-600 text-left">Stock mínimo</p>
          <input
            type="number"
            placeholder="Stock mínimo"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
        </div>
       
      </div>

      {/* Botones responsivos */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          className="w-full sm:w-auto bg-gray-300 text-gray-700 font-semibold rounded-lg py-2 px-4 hover:bg-gray-400 transition"
          onClick={() => onSaved && onSaved()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : product ? "Actualizar" : "Agregar"}

        </button>
      </div>
    </form>
  );
};
