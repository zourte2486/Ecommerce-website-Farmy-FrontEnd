import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useAppContext } from "./../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="mt-8 sm:mt-16 px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start w-full mb-6 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-dull">
          Best Sellers
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-0.5 bg-primary rounded-full mt-2"
        />
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <motion.div
              key={product._id || index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
      </motion.div>
    </section>
  );
};

export default BestSeller;
