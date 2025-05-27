import React, { useState, useEffect } from "react";
import { useAppContext } from "./../../context/AppContext";
import { toast } from "react-hot-toast";

const ProductsList = () => {
  const { products, axios, fetchProducts } = useAppContext();
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "",
    inStock: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const handleStockToggle = async (productId, currentStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/product/stock", {
        id: productId,
        inStock: !currentStatus,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchProducts();
      } else {
        toast.error(data.message || "Failed to update stock status");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update stock status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.delete("/api/product/delete", {
        data: { id: productId },
      });

      if (data.success) {
        toast.success(data.message);
        await fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      offerPrice: product.offerPrice || "",
      category: product.category,
      inStock: product.inStock,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/api/product/update", {
        id: editingProduct,
        productData: {
          ...editForm,
          price: parseFloat(editForm.price),
          offerPrice: editForm.offerPrice
            ? parseFloat(editForm.offerPrice)
            : null,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setEditingProduct(null);
        await fetchProducts();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      price: "",
      offerPrice: "",
      category: "",
      inStock: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-start w-full mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Products List</h2>
        <div className="w-16 h-0.5 bg-gray-200 rounded-full mt-2"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Offer Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Stock Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {editingProduct === product._id ? (
                    <>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                              </label>
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    price: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Offer Price
                              </label>
                              <input
                                type="number"
                                value={editForm.offerPrice}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    offerPrice: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Status
                              </label>
                              <div className="flex items-center mt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editForm.inStock}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        inStock: e.target.checked,
                                      })
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  <span className="ml-3 text-sm text-gray-600">
                                    {editForm.inStock
                                      ? "In Stock"
                                      : "Out of Stock"}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-6">
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={
                                product.image && product.image.length > 0
                                  ? product.image[0]
                                  : "/placeholder-image.jpg"
                              }
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          MAD {product.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.offerPrice
                            ? `MAD ${product.offerPrice}`
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.inStock}
                              onChange={() =>
                                handleStockToggle(product._id, product.inStock)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm text-gray-600">
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;
