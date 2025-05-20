import React from "react";
import { motion } from "framer-motion";
import MainBanner from "./../components/MainBanner";
import Categories from "./../components/Categories";
import BestSeller from "./../components/BestSeller";
import BottomBanner from "./../components/BottomBanner";
import Newsletter from "./../components/Newsletter";
import Footer from "./../components/Footer";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <MainBanner />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Categories />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BestSeller />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BottomBanner />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Newsletter />
      </motion.div>
    </motion.div>
  );
};

export default Home;
