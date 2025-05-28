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
        Chargement...
      </div>
    );
  }

  const productImages = selectedProduct.image || [selectedProduct.image];
  const relatedProducts = products
    .filter(
      (p) =>
        p.category === selectedProduct.category && p._id !== selectedProduct._id
    )
    .slice(0, 6);

  const otherProducts = products
    .filter(
      (p) =>
        p.category !== selectedProduct.category && p._id !== selectedProduct._id
    )
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
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>{" "}
        /
        <Link to="/products" className="hover:text-primary">
          Produits
        </Link>{" "}
        /
        <Link
          to={`/products/${category}`}
          className="hover:text-primary capitalize"
        >
          {category}
        </Link>{" "}
        /<span className="text-primary">{selectedProduct.name}</span>
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
                <img
                  src={img}
                  alt={`${selectedProduct.name} ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                />
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

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <img
                      key={i}
                      className={`w-4 ${i < 4 ? "" : "opacity-50"}`}
                      src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                      alt={i < 4 ? "Étoile pleine" : "Étoile vide"}
                    />
                  ))}
              </div>
              <span className="text-sm text-gray-500">(4.0)</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-2xl font-semibold">
                MAD {selectedProduct.offerPrice || selectedProduct.price}
              </h2>
              {selectedProduct.offerPrice && (
                <span className="text-lg text-gray-500 line-through">
                  MAD {selectedProduct.price}
                </span>
              )}
            </div>
            {selectedProduct.offerPrice && (
              <p className="text-green-600 text-sm mt-1">
                Économisez MAD{" "}
                {(selectedProduct.price - selectedProduct.offerPrice).toFixed(
                  2
                )}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {selectedProduct.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => removeFromCart(selectedProduct._id)}
                className="px-4 py-2 hover:bg-gray-100"
                disabled={!cartItems[selectedProduct._id]}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">
                {cartItems[selectedProduct._id] || 0}
              </span>
              <button
                onClick={() => addToCart(selectedProduct._id)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                addToCart(selectedProduct._id);
                navigate("/cart");
              }}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">Produits Similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* More Products Section */}
      {otherProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">Plus de Produits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {otherProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* See More Button */}
      <div className="mt-8 mb-16 flex justify-center">
        <Link
          to="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          Voir Plus de Produits
          <img
            src={assets.arrow_right_icon_colored}
            alt="Arrow right"
            className="w-5 h-5 invert"
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
