import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"

export const MovementsPage = () => {
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "movimientos"), orderBy("fecha", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setMovements(items)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Función para formatear la fecha de manera más legible
  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return null
    
    const date = timestamp.toDate()
    return {
      full: date.toLocaleString(),
      short: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando movimientos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Historial de Movimientos
      </h1>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Movimientos</div>
          <div className="text-2xl font-bold text-gray-800">{movements.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Entradas</div>
          <div className="text-2xl font-bold text-green-600">
            {movements.filter(m => m.tipo === "entrada").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Salidas</div>
          <div className="text-2xl font-bold text-red-600">
            {movements.filter(m => m.tipo === "salida").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Último movimiento</div>
          <div className="text-sm font-medium text-gray-800">
            {movements.length > 0 ? formatDate(movements[0].fecha)?.short || "Fecha inválida" : "N/A"}
          </div>
        </div>
      </div>

      {/* Versión Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Tipo</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Usuario</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Fecha</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((m) => {
                const date = formatDate(m.fecha)
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">{m.productoNombre || m.productoId}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        m.tipo === "salida" 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {m.tipo === "salida" ? "Venta" : "Entrada"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {m.cantidad}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">
                      {m.usuarioId || "Sistema"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {date ? (
                        <>
                          <div className="text-sm text-gray-900">{date.short}</div>
                          <div className="text-xs text-gray-500">{date.time}</div>
                        </>
                      ) : (
                        <div className="text-sm text-red-500">Fecha inválida</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600 max-w-xs truncate">
                      {m.nota || "-"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Versión Mobile */}
      <div className="lg:hidden space-y-4">
        {movements.map((m) => {
          const date = formatDate(m.fecha)
          return (
            <div key={m.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {m.productoNombre || m.productoId}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      m.tipo === "salida" 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {m.tipo === "salida" ? "Venta" : "Entrada"}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {m.cantidad} unidades
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="block text-xs text-gray-500">Usuario</span>
                  <span className="font-medium">{m.usuarioId || "Sistema"}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Fecha</span>
                  <span className="font-medium">
                    {date ? date.short : "Fecha inválida"}
                    {date && <span className="text-gray-400"> - {date.time}</span>}
                  </span>
                </div>
              </div>

              {m.nota && (
                <div className="border-t pt-3">
                  <span className="block text-xs text-gray-500 mb-1">Nota</span>
                  <p className="text-sm text-gray-700">{m.nota}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {movements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay movimientos registrados
          </h3>
          <p className="text-gray-500">
            Los movimientos de entrada y salida aparecerán aquí
          </p>
        </div>
      )}
    </div>
  )
}