import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./config";

export interface CalculationRecord {
  id?: string;
  expression: string;
  result: string;
  timestamp: any;
}

export const addCalculation = async (userId: string, calc: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
  try {
    await addDoc(collection(db, "users", userId, "history"), {
      ...calc,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding calculation: ", error);
    throw error;
  }
};

export const getHistoryStream = (userId: string, callback: (records: CalculationRecord[]) => void) => {
  const historyCollection = collection(db, "users", userId, "history");
  const q = query(historyCollection, orderBy("timestamp", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const records: CalculationRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as CalculationRecord);
    });
    callback(records);
  }, (error) => {
    console.error("Error fetching history: ", error);
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
