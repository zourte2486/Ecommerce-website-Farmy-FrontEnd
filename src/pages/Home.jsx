import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import MainBanner from "./../components/MainBanner";
import Categories from "./../components/Categories";
import BestSeller from "./../components/BestSeller";
import BottomBanner from "./../components/BottomBanner";
import Newsletter from "./../components/Newsletter";
import Footer from "./../components/Footer";

const Home = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <div className="relative bg-gradient-to-b from-emerald-50 via-white to-green-50">
        {/* Enhanced Progress bar */}
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-green-500 origin-left z-50"
        />

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* Content wrapper with enhanced styling */}
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="relative z-10">
              <MainBanner />
            </motion.section>

            {/* Categories Section with enhanced styling */}
            <motion.section
              variants={itemVariants}
              className="mt-12 sm:mt-16 lg:mt-20 relative z-20"
            >
              <div className="backdrop-blur-sm bg-white/40 rounded-3xl p-6 shadow-lg border border-white/20 w-full">
                <Categories />
              </div>
            </motion.section>

            {/* Best Seller Section with enhanced glass effect */}
            <motion.section
              variants={itemVariants}
              className="mt-12 sm:mt-16 lg:mt-20 relative z-30"
              style={{
                opacity: Math.max(0, Math.min(1, 1 - scrollProgress * 2)),
              }}
            >
              <div className="backdrop-blur-md bg-gradient-to-br from-white/60 to-white/30 rounded-3xl p-6 shadow-xl border border-white/30">
                <BestSeller />
              </div>
            </motion.section>

            {/* Bottom Banner with enhanced parallax and glass effect */}
            <motion.section
              variants={itemVariants}
              className="mt-12 sm:mt-16 lg:mt-20 relative z-40 overflow-hidden rounded-3xl"
              style={{
                transform: `translateY(${scrollProgress * -50}px)`,
              }}
            >
              <div className="backdrop-blur-sm bg-gradient-to-br from-white/50 to-transparent rounded-3xl">
                <BottomBanner />
              </div>
            </motion.section>

            {/* Newsletter Section with enhanced glass effect */}
            <motion.section
              variants={itemVariants}
              className="mt-12 sm:mt-16 lg:mt-20 mb-12 relative z-50"
              whileInView={{
                opacity: [0, 1],
                y: [50, 0],
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/40 rounded-3xl shadow-xl border border-white/30 p-8">
                <Newsletter />
              </div>
            </motion.section>
          </div>

          {/* Enhanced floating scroll indicator */}
          <motion.div
            className="fixed bottom-8 right-8 hidden lg:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollProgress > 0.1 ? 1 : 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-4 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-300"
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Floating Elements */}
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-primary/20"
                initial={{ y: "100vh", x: `${33 * (i + 1)}vw` }}
                animate={{
                  y: "-10vh",
                  transition: {
                    duration: 15 + i * 5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Home;
