import { collection, addDoc, serverTimestamp, getDocs, writeBatch, query } from "firebase/firestore";
import { db } from "./config";
import { addDocumentNonBlocking } from "@/firebase";

export interface CalculationRecord {
  id?: string;
  expression: string;
  result: string;
  timestamp: any;
}

export const addCalculation = (userId: string, calc: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
  const historyCollection = collection(db, "users", userId, "history");
  addDocumentNonBlocking(historyCollection, {
    ...calc,
    timestamp: serverTimestamp(),
  });
};

export const clearHistory = async (userId: string) => {
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
