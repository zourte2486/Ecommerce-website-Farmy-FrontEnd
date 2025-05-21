import React from "react";
import { useAppContext } from "./../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SellerLogin = () => {
  const { isSeller, setisSeller } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Example validation (replace with real logic)
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // For demo purposes, we'll just set the seller as logged in
    // In a real application, you would validate credentials with your backend
    if (email === "seller@example.com" && password === "password") {
      setError("");
      setisSeller(true);
      navigate("/seller");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    !isSeller && (
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-600"
      >
        <div className="flex flex-col gap-6 m-auto items-start p-8 py-12 min-w-80 sm:min-w-96 bg-white rounded-lg shadow-2xl border border-gray-200">
          <p className="text-2xl font-semibold m-auto mb-2">
            <span className="text-primary">Seller</span> Login
          </p>
          {error && (
            <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center text-sm">
              {error}
            </div>
          )}
          <div className="w-full">
            <p className="mb-1 font-medium">Email</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:ring-2 focus:ring-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-1 font-medium">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:ring-2 focus:ring-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-primary text-white rounded font-semibold shadow hover:bg-primary-dull transition active:scale-95"
          >
            Login
          </button>
          <p className="text-xs text-gray-500 text-center w-full">
            Demo credentials: seller@example.com / password
          </p>
        </div>
      </form>
    )
  );
};

export default SellerLogin;
