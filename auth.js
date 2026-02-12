import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

export async function checkUserRole(user) {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().role; // "Admin" or "Staff"
  } else {
    return null;
  }
}

// Example login
export async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
    const role = await checkUserRole(userCredential.user);
    return role;
  } catch (err) {
    alert(err.message);
    return null;
  }
}
