// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyC3enABYatrFts0CEEMsavQ-OmWGSetbWQ",
  authDomain: "busybuycontext.firebaseapp.com",
  projectId: "busybuycontext",
  storageBucket: "busybuycontext.firebasestorage.app",
  messagingSenderId: "926292468783",
  appId: "1:926292468783:web:c7cb00381ea8e91de392da"
};
const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, provider }
