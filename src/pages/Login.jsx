import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../provider/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { emailLogin, googleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await emailLogin(email, password);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await googleLogin();
      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-maroon-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-black via-orange-700 to-maroon-900">
            <h1 className="text-3xl font-bold text-white text-center drop-shadow-md">
              Welcome Back
            </h1>
            <p className="text-sm text-orange-200/80 text-center mt-1">
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />

            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white">
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-maroon-800 text-white font-semibold hover:scale-105 transition-transform duration-200">
              {submitting ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 border border-gray-600 rounded-xl flex justify-center items-center gap-3 bg-gray-800 text-white hover:bg-gray-700 transition">
              <FaGoogle /> Login with Google
            </button>

            <div className="text-center text-gray-300 text-sm mt-2">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-orange-400 hover:underline">
                Sign Up
              </Link>
            </div>

            <p
              onClick={() =>
                navigate("/auth/forgot-password", { state: { email } })
              }
              className="text-center text-orange-300 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
