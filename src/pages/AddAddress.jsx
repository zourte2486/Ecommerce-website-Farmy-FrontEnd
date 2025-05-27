import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    type={type}
    placeholder={placeholder}
    name={name}
    value={address[name]}
    onChange={handleChange}
    required
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  />
);

const AddAddress = () => {
  const {
    axios,
    addresses = [],
    setAddresses,
    navigate,
    user,
  } = useAppContext();

  const [address, setAddress] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("Please login to add an address");
      navigate("/login");
      return;
    }

    try {
      // Combine firstname and lastname for the name field
      const fullName = `${address.firstname} ${address.lastname}`.trim();

      const addressData = {
        ...address,
        name: fullName,
        userId: user._id,
        pincode: address.pincode || address.zipcode, // Use pincode if available, fallback to zipcode
      };

      // Remove any undefined or null values
      Object.keys(addressData).forEach((key) => {
        if (addressData[key] === undefined || addressData[key] === null) {
          delete addressData[key];
        }
      });

      const { data } = await axios.post("/api/address/add", {
        address: addressData,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Address submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add address. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] gap-10 px-4 md:px-0 mt-16">
      {/* Form Section */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-primary-dull mb-6">
          Add New Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="First Name"
              name="firstname"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Last Name"
              name="lastname"
              address={address}
            />
          </div>
          <InputField
            handleChange={handleChange}
            type="email"
            placeholder="Email"
            name="email"
            address={address}
          />
          <InputField
            handleChange={handleChange}
            type="text"
            placeholder="Street Address"
            name="street"
            address={address}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="City"
              name="city"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="State"
              name="state"
              address={address}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="ZIP Code"
              name="zipcode"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Country"
              name="country"
              address={address}
            />
          </div>
          <InputField
            handleChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            name="phone"
            address={address}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dull transition-colors"
          >
            Add Address
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex flex-1 items-center justify-center relative max-w-xl">
        {/* Blur background with your colors */}
        <div
          className="absolute inset-0 rounded-3xl filter blur-3xl opacity-40"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-primary-dull))",
          }}
          aria-hidden="true"
        ></div>

        <motion.img
          src={assets.add_address_iamge}
          alt="Add Address Illustration"
          className="relative max-w-md w-full rounded-3xl drop-shadow-2xl"
          initial={{ y: 0 }}
          animate={{
            y: [0, -20, 0], // bounce animation
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>
    </div>
  );
};

export default AddAddress;
