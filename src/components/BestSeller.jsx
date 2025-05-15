import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "./../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <section className="mt-16 px-2 sm:px-4 md:px-8">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center sm:text-left">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
      </div>
    </section>
  );
};

export default BestSeller;
