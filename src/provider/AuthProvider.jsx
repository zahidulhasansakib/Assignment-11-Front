// src/provider/AuthProvider.jsx
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

// Create context - this is fine
export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);


  const emailSignup = async (
    name,
    email,
    password,
    photoURL,
    role = "student",
    phone = "",
  ) => {
    setLoading(true);
    try {
      console.log("📝 Signup attempt:", { name, email, role, phone });

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (name || photoURL) {
        await updateProfile(result.user, {
          displayName: name || "",
          photoURL: photoURL || "",
        });
      }

      const idToken = await result.user.getIdToken();

      // ✅ সব fields পাঠান
      const response = await axios.post(
        "http://localhost:5000/register",
        {
          name: name || result.user.displayName,
          email: result.user.email,
          password: password, // ← গুরুত্বপূর্ণ
          uid: result.user.uid,
          role: role, // ← student/tutor
          phone: phone, // ← phone number
          photoURL: photoURL || "",
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );

      console.log("✅ Register response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setUser({
        ...result.user,
        ...response.data.user,
        role: response.data.user?.role || role,
        status: response.data.user?.status || "active",
      });

      return result.user;
    } catch (err) {
      console.error("❌ Signup error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Email Login ---
  const emailLogin = async (email, password) => {
    setLoading(true);
    try {
      console.log("📝 Login attempt for:", email);

      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      console.log("✅ Firebase login successful");

      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email: result.user.email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Backend response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser({
          ...result.user,
          ...response.data.user,
          role: response.data.user?.role || "student",
          status: response.data.user?.status || "active",
        });
      }

      return result.user;
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login ---
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const idToken = await result.user.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/google-login",
        {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser({
          ...result.user,
          ...response.data.user,
          role: response.data.user?.role || "student",
          status: response.data.user?.status || "active",
        });
      }

      return result.user;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const logOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth State Change ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const res = await axios.get(
            `http://localhost:5000/users/role/${currentUser.email}`,
            { headers: { Authorization: `Bearer ${idToken}` } },
          );

          const { role, status } = res.data;

          if (status === "blocked") {
            await signOut(auth);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            return;
          }

          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            setToken(storedToken);
          }

          const storedUser = localStorage.getItem("user");
          let userData = { ...currentUser, role, status };

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              userData = { ...userData, ...parsedUser };
            } catch (e) {
              console.error("Error parsing stored user:", e);
            }
          }

          setUser(userData);
        } catch (err) {
          console.log("Role fetch failed:", err);
          setUser({ ...currentUser, role: "student", status: "active" });
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value - defined inside component
  const contextValue = {
    user,
    loading,
    token: token || localStorage.getItem("token"),
    emailSignup,
    emailLogin,
    googleLogin,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};;

// Default export only
export default AuthProvider;
