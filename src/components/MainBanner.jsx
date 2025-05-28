import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      rotateZ: 2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const floatingElements = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i,
      size: ["w-24 h-24", "w-32 h-32", "w-16 h-16"][i % 3],
      color: ["bg-primary/5", "bg-green-100/10", "bg-emerald-100/10"][i % 3],
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: i * 0.5,
    }));

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        {/* Pattern Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/50 to-white/80" />
        </div>

        {/* Floating Elements */}
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className={`absolute rounded-full ${el.size} ${el.color} mix-blend-multiply blur-xl`}
            initial={{
              x: el.initialX + "%",
              y: el.initialY + "%",
              scale: 0,
            }}
            animate={{
              x: [
                el.initialX + "%",
                el.initialX + 20 + "%",
                el.initialX + "%",
                el.initialX - 20 + "%",
                el.initialX + "%",
              ],
              y: [
                el.initialY + "%",
                el.initialY - 20 + "%",
                el.initialY + "%",
                el.initialY + 20 + "%",
                el.initialY + "%",
              ],
              scale: 1,
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Content Container with Glass Effect */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 min-h-[calc(100vh-6rem)] items-center py-12 lg:py-20"
        >
          {/* Text Content */}
          <motion.div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6"
            >
              <span className="mr-2">✨</span>
              100% Bio & Frais
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Produits Bio
              <span className="block text-primary mt-2">Livrés chez vous</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Des produits frais et bio livrés directement à votre porte.
              Découvrez notre large sélection de produits locaux et de saison.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 justify-center lg:justify-start items-center"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explorer
                  <img
                    src={assets.arrow_right_icon_colored}
                    alt="arrow"
                    className="w-5 h-5 ml-2 invert brightness-0"
                  />
                </motion.button>
              </Link>

              <motion.div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <img
                      src={assets.delivery_truck_icon}
                      alt="delivery"
                      className="w-5 h-5"
                    />
                  </div>
                  <span>Livraison Gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <img
                      src={assets.leaf_icon}
                      alt="organic"
                      className="w-5 h-5"
                    />
                  </div>
                  <span>100% Bio</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            <motion.div
              variants={imageVariants}
              whileHover="hover"
              className="relative z-10"
            >
              <img
                src={assets.main_banner_bg}
                alt="Fresh Vegetables"
                className="w-full max-w-2xl mx-auto drop-shadow-2xl"
              />
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-1/4 -left-4 w-12 h-12 bg-primary/10 rounded-full"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 -right-4 w-8 h-8 bg-primary/20 rounded-full"
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};

export default MainBanner;
