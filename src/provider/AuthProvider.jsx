import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/Firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Email Signup ---
  const emailSignup = async (name, email, password, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (name || photoURL) {
        await updateProfile(result.user, {
          displayName: name || "",
          photoURL: photoURL || "",
        });
      }
      setUser(result.user);
      return result.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Email Login ---
  const emailLogin = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login ---
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth State Change + Fetch role ---
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        // token পাঠিয়ে backend থেকে user role/status fetch
        const token = await currentUser.getIdToken();
        const res = await axios.get(
          `http://localhost:5000/users/role/${currentUser.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // setUser with role & status
        const { role, status } = res.data;

        // যদি blocked হয়, logOut + redirect
        if (status === "blocked") {
          await signOut(auth);
          setUser(null);
          return;
        }

        setUser({ ...currentUser, role, status });
      } catch (err) {
        console.log("Role fetch failed:", err);
        setUser({ ...currentUser, role: "donor", status: "active" });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);


  return (
    <AuthContext.Provider
      value={{ user, loading, emailSignup, emailLogin, googleLogin, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
