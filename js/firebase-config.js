import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6cMojCiBxFyVJNaCXmit5JJmyzspWIjw",
  authDomain: "monitoreo-mecatronico-2512a.firebaseapp.com",
  projectId: "monitoreo-mecatronico-2512a",
  storageBucket: "monitoreo-mecatronico-2512a.firebasestorage.app",
  messagingSenderId: "1028612557468",
  appId: "1:1028612557468:web:0cd7c127952cec95f23b59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);