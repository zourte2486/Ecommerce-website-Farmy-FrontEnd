import React from "react";
import { useAppContext } from "./../context/AppContext";
import { useParams } from "react-router";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() ===
      (searchCategory?.path?.toLowerCase() || category)
  );

  return (
    <div className="mt-8 sm:mt-16 px-2 sm:px-4 md:px-8">
      <div className="flex flex-col items-start w-full mb-4 sm:mb-8 px-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-dull">
          {searchCategory
            ? searchCategory.text.toUpperCase()
            : category?.toUpperCase()}
        </h1>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">
            No products found in this category.
          </p>
        ) : (
          filteredProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={product._id || index} product={product} />
            ))
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
