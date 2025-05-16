import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();

  if (!product) return null;

  return (
    <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scroll(0,0)}} className="border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl px-2 sm:px-4 md:px-6 py-3 sm:py-4 bg-white w-full flex flex-col justify-between cursor-pointer group min-h-[340px]">
      <div className="flex-1 flex flex-col items-center justify-center mb-2">
        <img
          className="group-hover:scale-110 transition-transform duration-300 w-24 sm:w-28 md:w-36 rounded-lg object-contain"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="text-gray-500/80 text-sm flex-1 flex flex-col justify-between">
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
        <p className="text-gray-800 font-semibold text-base sm:text-lg truncate w-full mb-1">
          {product.name}
        </p>
        <div className="flex items-center gap-1 mb-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="w-3.5 sm:w-4"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="Star"
              />
            ))}
          <span className="text-xs text-gray-400">(4)</span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <p className="md:text-xl text-base font-bold text-primary">
            {currency}${product.offerPrice}
            <span className="text-gray-400 md:text-sm text-xs line-through ml-2 font-normal">
              {currency}${product.price}
            </span>
          </p>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-primary"
          >
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary w-[64px] sm:w-[80px] h-[34px] rounded-lg cursor-pointer hover:bg-primary/20 transition-colors font-semibold text-primary px-2 text-xs sm:text-sm"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-16 sm:w-20 h-[34px] bg-primary/25 rounded-lg select-none">
                <button
                  onClick={() => {
                    removeFromCart(product._id);
                  }}
                  className="cursor-pointer text-md px-2 h-full font-bold hover:text-red-500 transition-colors"
                >
                  -
                </button>
                <span className="w-5 text-center font-semibold">{cartItems[product._id]}</span>
                <button
                  onClick={() => {
                    addToCart(product._id);
                  }}
                  className="cursor-pointer text-md px-2 h-full font-bold hover:text-green-600 transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
