import { collection, addDoc, serverTimestamp, getDocs, writeBatch, query, Firestore } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase";

export interface CalculationRecord {
  id?: string;
  expression: string;
  result: string;
  timestamp: any;
  userId?: string;
  isScientific?: boolean;
}

export const addCalculation = (userId: string, calc: Omit<CalculationRecord, 'id' | 'timestamp' | 'userId'>, db: Firestore) => {
  const historyCollection = collection(db, "users", userId, "history");
  addDocumentNonBlocking(historyCollection, {
    ...calc,
    userId: userId, // Add userId to the document
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
