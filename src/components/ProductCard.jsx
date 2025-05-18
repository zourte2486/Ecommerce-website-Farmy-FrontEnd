import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();

  if (!product) return null;

  const productCount = cartItems[product._id] || 0;

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scroll(0, 0);
      }}
      className="relative bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 w-full flex flex-col items-center p-0 overflow-hidden min-h-[390px] group cursor-pointer"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      {/* Top Badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <span className="backdrop-blur-md bg-primary/20 text-primary text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-md border border-primary/20">
          {product.category}
        </span>
        {product.offerPrice < product.price && (
          <span className="backdrop-blur-md bg-red-100/80 text-red-500 text-[11px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md border border-red-200">
            -
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            %
          </span>
        )}
      </div>

      {/* Floating Image */}
      <div className="flex justify-center items-center w-full pt-8 pb-2">
        <div className="bg-gradient-to-br from-primary/10 to-gray-100 rounded-2xl shadow-inner p-5 flex items-center justify-center">
          <img
            className="w-32 sm:w-36 md:w-44 h-32 sm:h-36 md:h-44 object-contain rounded-xl drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full flex flex-col items-center px-4 mt-2">
        <h2 className="text-gray-900 font-extrabold text-lg sm:text-xl text-center truncate w-full mb-1 leading-tight">
          {product.name}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 mb-2 mt-1 shadow-sm">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className={`w-4 sm:w-5 ${i < 4 ? "" : "opacity-50"}`}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt={i < 4 ? "Filled star" : "Empty star"}
              />
            ))}
          <span className="text-xs text-gray-400 ml-1">(4)</span>
        </div>
      </div>

      {/* Price & Cart Section */}
      <div className="w-full flex flex-col items-center px-4 mt-1 mb-4 flex-1 justify-end">
        <div className="flex flex-col items-center mb-3">
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {currency}MAD{product.offerPrice}
          </span>
          {product.offerPrice < product.price && (
            <span className="text-gray-400 text-sm sm:text-base line-through font-normal mt-1">
              {currency}MAD{product.price}
            </span>
          )}
        </div>

        {/* Cart Actions */}
        {/* Cart Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full flex justify-center"
        >
          {productCount === 0 ? (
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-green-500 shadow-lg w-[120px] h-[42px] rounded-full cursor-pointer hover:from-green-500 hover:to-primary transition-all font-bold text-white text-base px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => addToCart(product._id)}
              role="button"
              aria-label="Add to cart"
            >
              Add
              <PiShoppingCartSimpleBold color="white" />
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-3 py-2 shadow-md">
              <button
                onClick={() => {
                  removeFromCart(product._id);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-primary font-bold text-xl hover:bg-red-100 hover:text-red-500 transition-colors focus:outline-none"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-lg text-primary">
                {productCount}
              </span>
              <button
                onClick={() => addToCart(product._id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-primary font-bold text-xl hover:bg-green-100 hover:text-green-600 transition-colors focus:outline-none"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
