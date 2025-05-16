import React, { useEffect } from "react";
import { useState } from "react";
import { useAppContext } from "./../context/AppContext";
import ProductCard from "./../components/ProductCard";

const AllProducts = () => {
  const { products = [], searchQuery = "" } = useAppContext();
  const [filteredProducts, setfilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setfilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setfilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="mt-8 sm:mt-16 px-2 sm:px-4 md:px-8">
      <div className="flex flex-col items-start w-full mb-4 sm:mb-8 px-2">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-dull uppercase">
          All products
        </p>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-2"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
