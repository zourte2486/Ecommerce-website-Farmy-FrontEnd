import React from "react";
import { motion } from "framer-motion";
import { categories } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

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

  // Filter categories to show only the specified ones
  const filteredCategories = categories.filter((category) =>
    [
      "Légumes Bio",
      "Fruits Frais",
      "Boissons Fraîches",
      "Produits Laitiers",
      "Boulangerie & Pains",
      "Céréales & Grains",
    ].includes(category.text)
  );

  return (
    <div className="w-full">
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-medium mb-6"
      >
        Catégories
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 w-full"
      >
        {filteredCategories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center shadow-md hover:shadow-xl transition-all duration-300 w-full"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <motion.img
              src={category.image}
              alt={category.text}
              className="w-24 h-24 object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.p
              className="text-sm font-medium mt-2 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {category.text}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
