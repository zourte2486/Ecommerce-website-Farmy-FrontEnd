import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const productImages = [selectedProduct.image, selectedProduct.image];

  // Get related products from the same category
  const relatedProducts = products
    .filter(
      (p) =>
        p.category === selectedProduct.category && p._id !== selectedProduct._id
    )
    .slice(0, 4);

  return (
    <div className="mt-4 sm:mt-8 px-2 sm:px-4 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <Link
          to={`/products/${category}`}
          className="hover:text-primary capitalize"
        >
          {selectedProduct.category}
        </Link>
        <span>/</span>
        <span className="text-primary">{selectedProduct.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images Section */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="hidden sm:flex flex-col gap-2">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={
                  "w-20 h-20 border-2 rounded-lg cursor-pointer " +
                  (selectedImage === idx ? "border-primary" : "border-gray-200")
                }
              >
                <img
                  src={img}
                  alt={`${selectedProduct.name} ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <img
              src={productImages[selectedImage]}
              alt={selectedProduct.name}
              className="w-full h-[300px] sm:h-[400px] object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary uppercase tracking-wide">
              {selectedProduct.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              {selectedProduct.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    className="w-4 sm:w-5"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="rating"
                  />
                ))}
              <span className="text-sm text-gray-500 ml-2">(4)</span>
            </div>
          </div>

          <div>
            <p className="text-lg text-gray-500 line-through">
              MRP: ${selectedProduct.price}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              MRP: ${selectedProduct.offerPrice}
              <span className="text-sm text-gray-500 ml-2">
                (inclusive of all taxes)
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">About Product</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Fresh and juicy</li>
              <li>• Rich in antioxidants</li>
              <li>• Perfect for snacking and fruit salads</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
              <button
                onClick={() => {
                  if (cartItems[selectedProduct._id] > 0) {
                    removeFromCart(selectedProduct._id);
                  }
                }}
                className="text-primary hover:text-red-500 text-xl font-bold w-8 h-8"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center">
                {cartItems[selectedProduct._id] || 0}
              </span>
              <button
                onClick={() => addToCart(selectedProduct._id)}
                className="text-primary hover:text-green-500 text-xl font-bold w-8 h-8"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                addToCart(selectedProduct._id);
                navigate("/cart");
              }}
              className="flex-1 bg-primary hover:bg-primary-dull text-white py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Add ${selectedProduct.offerPrice}
            </button>
          </div>

          {selectedProduct.inStock ? (
            <p className="text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              In Stock
            </p>
          ) : (
            <p className="text-red-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Out of Stock
            </p>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dull mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          navigate("/products");
        }}
        className="mx-auto or-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
      >
        See more
      </button>
    </div>
  );
};

export default ProductDetails;
