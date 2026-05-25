import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
// 1. Importamos Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbP0hAPME4jWMBKMalwIvkvtYtzh6QWPA",
  authDomain: "practiq-1c148.firebaseapp.com",
  projectId: "practiq-1c148",
  storageBucket: "practiq-1c148.firebasestorage.app",
  messagingSenderId: "948871542587",
  appId: "1:948871542587:web:602b6c78f46201bc74291e",
  measurementId: "G-Q8Q50FHW6F"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
// 2. Exportamos la base de datos como "db"
export const db = getFirestore(app);