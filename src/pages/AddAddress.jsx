import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const AddAddress = () => {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
  });

  const { addresses = [], setAddresses, navigate } = useAppContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      ...form,
      _id: Date.now().toString(),
    };
    setAddresses([newAddress, ...addresses]);
    // Optionally show a toast here if you use react-hot-toast
    navigate("/cart");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] gap-10 px-4 md:px-0 mt-16">
      {/* Form Section */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Add New Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              className="w-full border border-primary/20 rounded px-4 py-2 outline-primary focus:ring-2 focus:ring-primary/20 bg-primary/5"
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-primary/20 rounded px-4 py-2 outline-primary focus:ring-2 focus:ring-primary/20 bg-primary/5"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full border border-primary/20 rounded px-4 py-2 outline-primary focus:ring-2 focus:ring-primary/20 bg-primary/5"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border border-primary/20 rounded px-4 py-2 outline-primary focus:ring-2 focus:ring-primary/20 bg-primary/5"
              placeholder="Country"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-primary hover:bg-primary-dull text-white font-bold rounded-lg shadow-md text-lg transition"
          >
            Add Address
          </button>
        </form>
      </div>
      {/* Image Section */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img
          src={assets.add_address_iamge}
          alt="Add Address"
          className="max-w-xs w-full drop-shadow-xl rounded-2xl"
        />
      </div>
    </div>
  );
};

export default AddAddress;
