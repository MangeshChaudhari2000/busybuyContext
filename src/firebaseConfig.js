// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTqRgd4jbEX4uzhvJf29hoQDqlii2v6pQ",
  authDomain: "bussybuy2.firebaseapp.com",
  projectId: "bussybuy2",
  storageBucket: "bussybuy2.appspot.com",
  messagingSenderId: "930879432659",
  appId: "1:930879432659:web:94b0891302e42d0c1e7126"
};
const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, provider }