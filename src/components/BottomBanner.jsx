import React from "react";
import { motion } from "framer-motion";
import { assets, features } from "./../assets/assets";

const BottomBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative mt-24 overflow-hidden">
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={assets.bottom_banner_image}
        alt="bottom_banner_image"
        className="w-full hidden md:block"
      />
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={assets.bottom_banner_image_sm}
        alt="bottom_banner_image"
        className="w-full md:hidden"
      />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 px-4 md:px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-primary mb-6"
          >
            Pourquoi sommes-nous les meilleurs ?
          </motion.h1>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 mt-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <motion.img
                src={feature.icon}
                alt={feature.title}
                className="md:w-11 w-9"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomBanner;
