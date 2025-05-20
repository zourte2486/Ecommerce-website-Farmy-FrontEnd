import React, { useState } from "react";
import { motion } from "framer-motion";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-24 px-4 md:px-6 lg:px-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary to-primary-dull bg-clip-text text-transparent"
      >
        Never Miss a Deal!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="md:text-lg text-gray-600 pb-8 max-w-2xl"
      >
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </motion.p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12 shadow-lg rounded-md overflow-hidden"
      >
        <input
          className="h-full w-full px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer font-medium"
        >
          Subscribe
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Newsletter;
