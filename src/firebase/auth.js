// // auth.js
// // import { auth, db } from "./firebase";
// import { auth, db } from "./Config.js"; // Adjust the import path as necessary
// // Import necessary Firebase functions
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { addDoc, collection } from "firebase/firestore";

// // Helper function to validate inputs
// const validateSignupInputs = (
//   schoolName,
//   email,
//   phoneNumber,
//   password,
//   description
// ) => {
//   if (!schoolName || !email || !phoneNumber || !password || !description) {
//     throw new Error("All fields are required.");
//   }
//   if (!/^\S+@\S+\.\S+$/.test(email)) {
//     throw new Error("Invalid email format.");
//   }
//   if (password.length < 6) {
//     throw new Error("Password must be at least 6 characters long.");
//   }
//   // Placeholder for phone number validation
//   if (!/^\d{10,15}$/.test(phoneNumber)) {
//     throw new Error("Invalid phone number format.");
//   }
// };

// // Sign up function (with new fields)
// export const signup = async (
//   schoolName,
//   email,
//   phoneNumber,
//   password,
//   description
// ) => {
//   try {
//     // Validate inputs
//     validateSignupInputs(schoolName, email, phoneNumber, password, description);

//     // Create Firebase authentication user
//     const res = await createUserWithEmailAndPassword(auth, email, password);
//     const user = res.user;

//     // Save additional user details to Firestore
//     await addDoc(collection(db, "users"), {
//       uid: user.uid,
//       schoolName,
//       email,
//       phoneNumber,
//       description,
//       authProvider: "local",
//     });

//     console.log("User created with additional fields:", user.uid);
//     // alert("Signup successful! You can now log in.");
//   } catch (error) {
//     console.error("Signup Error:", error);
//     alert(error.message || "An error occurred during signup.");
//   }
// };

// // Login function (with success feedback)
// export const login = async (email, password) => {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//     console.log("Login successful for:", email);
//     // alert("Login successful!");
//   } catch (error) {
//     console.error("Login Error:", error);
//     alert(error.message || "An error occurred during login.");
//   }
// };

// // Logout function (with error handling)
// export const logout = async () => {
//   try {
//     await signOut(auth);
//     console.log("User logged out successfully.");
//     // alert("Logout successful!");
//   } catch (error) {
//     console.error("Logout Error:", error);
//     alert("Failed to log out. Please try again.");
//   }
// };

// src/firebase/auth.js
import { auth, db } from "./Config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

// Validate inputs
const validateSignupInputs = (
  schoolName,
  email,
  phoneNumber,
  password,
  description
) => {
  if (!schoolName || !email || !phoneNumber || !password || !description) {
    throw new Error("All fields are required.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Invalid email format.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  if (!/^\d{10,15}$/.test(phoneNumber)) {
    throw new Error("Invalid phone number format.");
  }
};

// Signup function
export const signup = async (
  schoolName,
  email,
  phoneNumber,
  password,
  description
) => {
  validateSignupInputs(schoolName, email, phoneNumber, password, description);

  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  await addDoc(collection(db, "users"), {
    uid: user.uid,
    schoolName,
    email,
    phoneNumber,
    description,
    authProvider: "local",
  });

  return user;
};

// Login function
export const login = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return await res.user.getIdToken(); // Return token for backend
};

// Logout function
export const logout = async () => {
  await signOut(auth);
};
