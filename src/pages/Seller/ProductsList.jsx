import React, { useState, useEffect } from "react";
import { useAppContext } from "./../../context/AppContext";
import { toast } from "react-hot-toast";

const ProductsList = () => {
  const { products, setProducts, axios, fetchProducts } = useAppContext();
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
        toast.error("Échec du chargement des produits");
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
        toast.error(data.message || "Échec de la mise à jour du stock");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Échec de la mise à jour du stock"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(productId);
              }}
              className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
      }
    );
  };

  const confirmDelete = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete("/api/product/delete", {
        data: { id: productId },
      });

      if (data.success) {
        // Instead of fetching all products again, remove the deleted product from state
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Échec de la suppression du produit");
      }

      if (data.success) {
        toast.success(data.message);
        await fetchProducts();
      } else {
        toast.error(data.message || "Échec de la suppression du produit");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Échec de la suppression du produit"
      );
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
        toast.error(data.message || "Échec de la mise à jour du produit");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Échec de la mise à jour du produit"
      );
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
        <h2 className="text-2xl font-semibold text-gray-800">
          Liste des produits
        </h2>
        <div className="w-16 h-0.5 bg-gray-200 rounded-full mt-2"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Prix promotion
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                État du stock
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
                  Aucun produit trouvé
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
                                Nom
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
                                Catégorie
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
                                Prix
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
                                Prix promotion
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
                                État du stock
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
                                      ? "En stock"
                                      : "Rupture de stock"}
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
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200"
                            >
                              Enregistrer les modifications
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
                              {product.inStock
                                ? "En stock"
                                : "Rupture de stock"}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-200"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Supprimer
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
