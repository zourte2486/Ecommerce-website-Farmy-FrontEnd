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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const formControlVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.8,
    },
  },
  float: {
    y: [-20, 0, -20],
    rotate: [-2, 2, -2],
    transition: {
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
      },
      rotate: {
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut",
      },
    },
  },
};

const AddAddress = () => {
  const {
    axios,
    addresses = [],
    setAddresses,
    navigate,
    user,
    fetchAddresses,
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
      toast.error("Veuillez vous connecter pour ajouter une adresse");
      navigate("/login");
      return;
    }

    try {
      const fullName = `${address.firstname} ${address.lastname}`.trim();

      const addressData = {
        ...address,
        name: fullName,
        userId: user._id,
        pincode: address.pincode || address.zipcode,
      };

      Object.keys(addressData).forEach((key) => {
        if (addressData[key] === undefined || addressData[key] === null) {
          delete addressData[key];
        }
      });

      const { data } = await axios.post("/api/address/add", {
        address: addressData,
      });

      if (data.success) {
        toast.success("Adresse ajoutée avec succès");
        await fetchAddresses();
        navigate("/cart");
      } else {
        toast.error(data.message || "Échec de l'ajout de l'adresse");
      }
    } catch (error) {
      console.error("Address submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Échec de l'ajout de l'adresse. Veuillez réessayer."
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] gap-10 px-4 md:px-0 mt-16"
    >
      {/* Form Section */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative z-10"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold text-primary-dull mb-6"
        >
          Ajouter une nouvelle adresse
        </motion.h2>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={formControlVariants}
            whileHover="hover"
            className="grid grid-cols-2 gap-4"
          >
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Prénom"
              name="firstname"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Nom"
              name="lastname"
              address={address}
            />
          </motion.div>
          <motion.div variants={formControlVariants} whileHover="hover">
            <InputField
              handleChange={handleChange}
              type="email"
              placeholder="Email"
              name="email"
              address={address}
            />
          </motion.div>
          <motion.div variants={formControlVariants} whileHover="hover">
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Adresse"
              name="street"
              address={address}
            />
          </motion.div>
          <motion.div
            variants={formControlVariants}
            whileHover="hover"
            className="grid grid-cols-2 gap-4"
          >
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Ville"
              name="city"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="État/Province"
              name="state"
              address={address}
            />
          </motion.div>
          <motion.div
            variants={formControlVariants}
            whileHover="hover"
            className="grid grid-cols-2 gap-4"
          >
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Code Postal"
              name="zipcode"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              placeholder="Pays"
              name="country"
              address={address}
            />
          </motion.div>
          <motion.div variants={formControlVariants} whileHover="hover">
            <InputField
              handleChange={handleChange}
              type="tel"
              placeholder="Numéro de téléphone"
              name="phone"
              address={address}
            />
          </motion.div>
          <motion.button
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dull transition-colors shadow-lg"
          >
            Ajouter l'adresse
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Image Section (desktop only) */}
      <div className="hidden md:flex flex-1 items-center justify-center relative max-w-xl">
        {/* Blur background with your colors */}
        <motion.div
          className="absolute inset-0 rounded-3xl filter blur-3xl opacity-40"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-primary-dull))",
          }}
          aria-hidden="true"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        ></motion.div>
        <motion.img
          src={assets.add_address_iamge}
          alt="Add Address Illustration"
          className="relative max-w-md w-full rounded-3xl drop-shadow-2xl"
          variants={imageVariants}
          initial="hidden"
          animate={["visible", "float"]}
        />
      </div>
    </motion.div>
  );
};

export default AddAddress;
