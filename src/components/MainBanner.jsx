import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.img
        variants={imageVariants}
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />
      <motion.img
        variants={imageVariants}
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24"
        variants={containerVariants}
      >
        <motion.h1
          variants={textVariants}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15"
        >
          Freshness You Can Trust, Savings You Will Love!
        </motion.h1>

        <motion.div
          variants={buttonVariants}
          className="flex items-center mt-6 font-medium"
        >
          <motion.div whileHover="hover" whileTap={{ scale: 0.95 }}>
            <Link
              to={"/products"}
              className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer shadow-lg hover:shadow-xl"
            >
              Shop now
              <motion.img
                className="md:hidden"
                src={assets.white_arrow_icon}
                alt="arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Link
              to={"/products"}
              className="group flex items-center gap-2 px-9 py-3 cursor-pointer hover:text-primary transition-colors"
            >
              Explore deals
              <motion.img
                className="transition"
                src={assets.black_arrow_icon}
                alt="arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MainBanner;
