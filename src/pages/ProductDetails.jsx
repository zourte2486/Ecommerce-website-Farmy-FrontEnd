import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const { category, id } = useParams();
  const {
    products = [],
    currency,
    addToCart,
    removeFromCart,
    cartItems,
  } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const product = products.find((p) => p._id === id);
    setSelectedProduct(product);
  }, [id, products]);

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const productImages = [selectedProduct.image, selectedProduct.image];
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    .slice(0, 4);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="mt-4 sm:mt-8 px-2 sm:px-4 md:px-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> /
        <Link to="/products" className="hover:text-primary">Products</Link> /
        <Link to={`/products/${category}`} className="hover:text-primary capitalize">{category}</Link> /
        <span className="text-primary">{selectedProduct.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <motion.div className="flex gap-4">
          <div className="hidden sm:flex flex-col gap-2">
            {productImages.map((img, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg border-2 cursor-pointer ${
                  selectedImage === idx ? "border-primary" : "border-gray-200"
                }`}
              >
                <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} className="w-full h-full object-contain p-1" />
              </motion.div>
            ))}
          </div>
          <motion.div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <img
              src={productImages[selectedImage]}
              alt={selectedProduct.name}
              className="w-full h-[300px] sm:h-[400px] object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>

        {/* Info */}
        <motion.div className="space-y-6">
          <div>
            <p className="text-sm text-primary uppercase">{selectedProduct.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">{selectedProduct.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            {Array(5).fill("").map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="rating"
                className="w-5"
              />
            ))}
            <span className="ml-2 text-gray-500 text-sm">(4)</span>
          </div>

          <div>
            <p className="line-through text-gray-400 text-lg">
              ${selectedProduct.price}
            </p>
            <p className="text-2xl font-bold text-primary">
              ${selectedProduct.offerPrice}
              <span className="ml-2 text-sm text-gray-500">(incl. taxes)</span>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">About Product</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Fresh and juicy</li>
              <li>• Rich in antioxidants</li>
              <li>• Perfect for snacking and salads</li>
            </ul>
          </div>

          {/* Cart Controls */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex bg-gray-100 rounded-lg px-4 py-2 items-center justify-between w-32">
              <button
                onClick={() => cartItems[selectedProduct._id] > 0 && removeFromCart(selectedProduct._id)}
                className="text-xl font-bold text-primary hover:text-red-500"
              >
                -
              </button>
              <span className="text-lg font-medium">
                {cartItems[selectedProduct._id] || 0}
              </span>
              <button
                onClick={() => addToCart(selectedProduct._id)}
                className="text-xl font-bold text-primary hover:text-green-500"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => addToCart(selectedProduct._id)}
              className="flex-1 bg-primary hover:bg-primary-dull text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Add to Cart 
            </button>
            <button
              onClick={() => {
                addToCart(selectedProduct._id);
                navigate("/cart");
              }}
              className="flex-1 bg-primary hover:bg-primary-dull text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Buy Now
            </button>
          </div>

          <p className={`flex items-center gap-2 ${selectedProduct.inStock ? "text-green-600" : "text-red-500"}`}>
            <span className={`w-2 h-2 rounded-full ${selectedProduct.inStock ? "bg-green-600" : "bg-red-500"}`} />
            {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-primary-dull mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((product, idx) => (
              <motion.div key={product._id} variants={fadeIn} custom={idx}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-16">
        <button
          onClick={() => navigate("/products")}
          className="px-12 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
