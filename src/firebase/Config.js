// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // import { firebaseConfig } from "./firebase.config";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBjNJz32TRy9j5t586RKQOreHWOqrdEYds",
//   authDomain: "school-parent-acc90.firebaseapp.com",
//   projectId: "school-parent-acc90",
//   storageBucket: "school-parent-acc90.firebasestorage.app",
//   messagingSenderId: "832751056045",
//   appId: "1:832751056045:web:66e837dc905190519b4224",
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Export auth and Firestore instances
// export const auth = getAuth(app);

// export const db = getFirestore(app);

// src/firebase/Config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjNJz32TRy9j5t586RKQOreHWOqrdEYds",
  authDomain: "school-parent-acc90.firebaseapp.com",
  projectId: "school-parent-acc90",
  storageBucket: "school-parent-acc90.appspot.com", // Corrected
  messagingSenderId: "832751056045",
  appId: "1:832751056045:web:66e837dc905190519b4224",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
