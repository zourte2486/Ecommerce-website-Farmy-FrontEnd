import { useState } from "react";
import { useAppContext } from "./../../context/AppContext";
import { toast } from "react-hot-toast";
import { categories } from "../../assets/assets";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { axios } = useAppContext();

  // Filter categories to show only the specified ones
  const filteredCategories = categories.filter((category) =>
    [
      "Légumes Bio",
      "Fruits Frais",
      "Boissons Fraîches",
      "Produits Laitiers",
      "Boulangerie & Pains",
      "Céréales & Grains",
    ].includes(category.text)
  );

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > 4) {
      toast.error("Vous pouvez télécharger au maximum 4 images");
      return;
    }

    if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Chaque image doit faire moins de 5MB");
      return;
    }

    setFiles([...files, ...selectedFiles]);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleInputChange = (e) => {
    const { name: fieldName, value, checked } = e.target;
    switch (fieldName) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "offerPrice":
        setOfferPrice(value);
        break;
      case "stock":
        setStock(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      // Validate required fields
      if (!name.trim()) {
        toast.error("Veuillez saisir le nom du produit");
        return;
      }
      if (!price || parseFloat(price) <= 0) {
        toast.error("Veuillez saisir un prix valide");
        return;
      }
      if (!category) {
        toast.error("Veuillez sélectionner une catégorie");
        return;
      }
      if (!description.trim()) {
        toast.error("Veuillez saisir la description du produit");
        return;
      }
      if (!files.length) {
        toast.error("Veuillez télécharger au moins une image");
        return;
      }

      // Format description as an array of strings
      const descriptionArray = description
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const productData = {
        name: name.trim(),
        description: descriptionArray,
        price: parseFloat(price),
        category,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        inStock: stock,
      };

      console.log("Envoi des données du produit:", productData); // Debug log

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      files.forEach((file) => {
        formData.append("image", file);
      });

      console.log("Contenu du FormData:", {
        productData: formData.get("productData"),
        nombreImages: files.length,
      }); // Debug log

      const { data } = await axios.post("/api/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Progression du téléchargement:", percentCompleted);
        },
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setOfferPrice("");
        setStock(true);
        setFiles([]);
        setPreviewImages([]);
      } else {
        toast.error(data.message || "Échec de l'ajout du produit");
      }
    } catch (error) {
      console.error("Détails de l'erreur:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 413) {
        toast.error(
          "Fichier trop volumineux. Veuillez télécharger des images plus petites."
        );
      } else if (error.response?.status === 415) {
        toast.error(
          "Type de fichier invalide. Veuillez télécharger uniquement des images."
        );
      } else if (error.response?.status === 401) {
        toast.error("Veuillez vous connecter pour ajouter des produits");
      } else if (error.response?.status === 403) {
        toast.error("Vous n'avez pas la permission d'ajouter des produits");
      } else if (error.response?.status === 404) {
        toast.error(
          "Point d'accès API introuvable. Veuillez vérifier la configuration du serveur."
        );
      } else if (error.response?.status === 500) {
        toast.error("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        toast.error(
          error.message || "Échec de l'ajout du produit. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Ajouter un nouveau produit
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nom du produit
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                placeholder="Entrez le nom du produit"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Prix
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MAD</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="offerPrice"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Prix promotionnel (optionnel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MAD</span>
                </div>
                <input
                  type="number"
                  id="offerPrice"
                  name="offerPrice"
                  value={offerPrice}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {filteredCategories.map((cat, index) => (
                  <option key={index} value={cat.path}>
                    {cat.text}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="stock"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                État du stock
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="stock"
                    name="stock"
                    checked={stock}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-colors duration-200"
                  />
                  <span className="ml-2 text-sm text-gray-600">En stock</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                placeholder="Entrez la description du produit (chaque ligne sera traitée comme un point distinct)"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit (1-4 images)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border-2 border-gray-300">
                      <img
                        src={preview}
                        alt={`Aperçu ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {previewImages.length < 4 && (
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          {previewImages.length === 0
                            ? "Ajouter des images"
                            : "Ajouter plus d'images"}
                        </p>
                      </div>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dull ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Ajout du produit..." : "Ajouter le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
