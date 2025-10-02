
import {
    addDoc,
    collection, deleteDoc, doc, onSnapshot, orderBy, query, 
    runTransaction, 
    serverTimestamp, 
    updateDoc, 
    // type getDoc,
    // type where,
    type DocumentData,
    type QuerySnapshot,
} from "firebase/firestore";

import { db } from "../firebase";


const productosCol = collection(db, "productos");
const movimientosCol = collection(db, "movimientos");

export const subscribeProducts = (cb: (qSnap: QuerySnapshot<DocumentData>) => void) => {
    const q = query(productosCol, orderBy("nombre"));
    return onSnapshot(q, cb);
}

export const addProduct = async (data: any)=>{
   return await  addDoc(productosCol, {...data, fetchaRegistro: serverTimestamp()});
}

export const updateProduct = async (id: string, data: Partial<any>) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

export const deleteProduct = async (id: string) => {
  const ref = doc(db, "productos", id);
  await deleteDoc(ref);
}

export const registerMovementTransaction = async (
  productoId: string,
  tipo: "entrada" | "salida",
  cantidad: number,
  usuarioId: string,
  nota?: string
) => {
  const productRef = doc(db, "productos", productoId);
  return await runTransaction(db, async (transaction) => {
    const prodSnap = await transaction.get(productRef);
    if (!prodSnap.exists()) throw new Error("Producto no existe");

    const currentQty = prodSnap.data().cantidad ?? 0;
    const newQty = tipo === "entrada" ? currentQty + cantidad : currentQty - cantidad;
    if (newQty < 0) throw new Error("Cantidad insuficiente");

    transaction.update(productRef, { cantidad: newQty });

    const movimientoRef = doc(movimientosCol); 
    transaction.set(movimientoRef, {
      productoId,
      tipo,
      cantidad,
      fecha: serverTimestamp(),
      usuarioId,
      nota: nota ?? "",
    });
  });
};