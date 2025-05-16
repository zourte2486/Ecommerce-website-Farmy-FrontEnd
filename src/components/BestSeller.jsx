import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "./../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <section className="mt-8 sm:mt-16 px-2 sm:px-4 md:px-8">
      <div className="flex flex-col items-start w-full mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-dull">
          Best Sellers
        </h2>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-2"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
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
