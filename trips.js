import { db } from './firebase-config.js';
import { collection, addDoc, query, getDocs } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

export async function addTrip(tripData) {
  try {
    await addDoc(collection(db, "trips"), tripData);
  } catch (err) {
    console.error(err);
  }
}

export async function getAllTrips() {
  const q = query(collection(db, "trips"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
