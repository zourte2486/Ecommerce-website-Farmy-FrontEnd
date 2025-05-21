import React from "react";
import { useAppContext } from "./../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SellerLogin = () => {
  const { isSeller, setIsSeller } = useAppContext();
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
    if (email === "seller@example.com" && password === "password") {
      setError("");
      setIsSeller(true);
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
            <span className="text-[#4fbf8b]">Seller</span> Login
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
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b] focus:ring-2 focus:ring-[#4fbf8b] transition"
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
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b] focus:ring-2 focus:ring-[#4fbf8b] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-[#4fbf8b] text-white rounded font-semibold shadow hover:bg-[#44ae7c] transition active:scale-95"
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
