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
      "Organic veggies",
      "Fresh Fruits",
      "Cold Drinks",
      "Dairy Products",
      "Bakery & Breads",
      "Grains & Cereals",
    ].includes(category.text)
  );

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "stock":
        setStock(checked);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Check if adding new files would exceed the limit
    if (files.length + newFiles.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    // Validate each file
    const validFiles = newFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);

      // Create previews for new files
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      // Validate required fields
      if (!name.trim()) {
        toast.error("Please enter product name");
        return;
      }
      if (!price || parseFloat(price) <= 0) {
        toast.error("Please enter a valid price");
        return;
      }
      if (!category) {
        toast.error("Please select a category");
        return;
      }
      if (!description.trim()) {
        toast.error("Please enter product description");
        return;
      }
      if (!files.length) {
        toast.error("Please upload at least one image");
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

      console.log("Submitting product data:", productData); // Debug log

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      files.forEach((file) => {
        formData.append("image", file);
      });

      console.log("FormData contents:", {
        productData: formData.get("productData"),
        imageCount: files.length,
      }); // Debug log

      const { data } = await axios.post("/api/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload progress:", percentCompleted);
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
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 413) {
        toast.error("File size too large. Please upload smaller images.");
      } else if (error.response?.status === 415) {
        toast.error("Invalid file type. Please upload image files only.");
      } else if (error.response?.status === 401) {
        toast.error("Please login to add products");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to add products");
      } else if (error.response?.status === 404) {
        toast.error(
          "API endpoint not found. Please check the server configuration."
        );
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          error.message || "Failed to add product. Please try again."
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
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-medium">
                    MAD
                  </span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="pl-16 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="offerPrice"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Offer Price (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-medium">
                    MAD
                  </span>
                </div>
                <input
                  type="number"
                  id="offerPrice"
                  name="offerPrice"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-16 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                required
              >
                <option value="">Select a category</option>
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
                Stock Status
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
                  <span className="ml-2 text-sm text-gray-600">In Stock</span>
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
                placeholder="Enter product description (each line will be treated as a separate bullet point)"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (1-4 images)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border-2 border-gray-300">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
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
                          className="w-8 h-8 mb-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or JPEG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        multiple
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
              {isLoading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
