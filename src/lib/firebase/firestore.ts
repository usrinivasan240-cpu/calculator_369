import { collection, addDoc, serverTimestamp, getDocs, writeBatch, query, Firestore } from "firebase/firestore";
import { db as defaultDb } from "./config";
import { addDocumentNonBlocking } from "@/firebase";

export interface CalculationRecord {
  id?: string;
  expression: string;
  result: string;
  timestamp: any;
}

export const addCalculation = (userId: string, calc: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
  // Note: This function uses the default 'db' instance. 
  // It might be better to pass the firestore instance from the component
  // to ensure consistency, especially in tests or complex setups.
  const historyCollection = collection(defaultDb, "users", userId, "history");
  addDocumentNonBlocking(historyCollection, {
    ...calc,
    timestamp: serverTimestamp(),
  });
};

export const clearHistory = async (userId: string, db: Firestore) => {
  const historyCollection = collection(db, "users", userId, "history");
  const q = query(historyCollection);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return;
  }
  
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
};
