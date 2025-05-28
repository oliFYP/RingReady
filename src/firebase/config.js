import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZx5Dyb6pphZ3-xBawKZ6DmOwlhQp0BQ8",
  authDomain: "ringready-afa91.firebaseapp.com",
  projectId: "ringready-afa91",
  storageBucket: "ringready-afa91.appspot.com",
  messagingSenderId: "147220826325",
  appId: "1:147220826325:web:a24570b586784eaaa9ba5c",
  measurementId: "G-GHM9VY2QV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
