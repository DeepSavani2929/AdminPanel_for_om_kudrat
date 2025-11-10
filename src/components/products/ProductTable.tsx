import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { Modal } from "../ui/modal";
import { Pencil, Plus, Trash2, ChevronDown } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown.tsx";
import { DropdownItem } from "../ui/dropdown/DropdownItem.tsx";
import Pagination from "../ui/pagination/Pagination.tsx";
import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 

interface Product {
  _id?: string;
  productName: string;
  image?: string;
  price: number;
  discountedPrice: number;
  categoryId: string;
  categoryName?: string;
  languageId: string;
  languageName?: string;
  isBestSeller?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface Category {
  _id?: string;
  name: string;
}

interface Language {
  _id?: string;
  name: string;
}

const ProductTable = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [product, setProduct] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   const [limit, setLimit] = useState(10)
    const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    getAllProducts();
    getCategories();
    getLanguages();
  }, [currentPage, sortField, sortOrder, limit]);

  const getAllProducts = async (): Promise<void> => {
     setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/products/getAllProductsForDashboard?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
      );

      if (res.data.success) {
        setProducts(res.data.data);
        console.log(res.data.data)
        setTotalPages(res.data.totalPages);
        setTotalProducts(res.data.totalProducts)
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
       finally {
      setIsLoading(false);
    }

  };

  const getCategories = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get("/categories/getAllCategories");
      if (res.data.success) {
        setCategories(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const getLanguages = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get("/languages/getAllLanguages");
      if (res.data.success) {
        setLanguages(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked, files } = e.target as any;

    if (type === "checkbox") {
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file" && files && files[0]) {
      const file = files[0];
      setProduct((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOnAddProduct = () => {
    setEditProduct(null);
    setProduct({});
    setImagePreview(null);
    setCategoryDropdownOpen(false)
    setLanguageDropdownOpen(false)
    setIsOpen(true);
  };

  const handleOnEditProduct = (product: Product) => {
    setEditProduct(product);
    setProduct({ ...product });
    setImagePreview(
      product.image ? `http://localhost:8000/images/${product.image}` : null
    );
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setProduct({});
    setEditProduct(null);
    setImagePreview(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!product.productName?.trim()) {
      newErrors.productName = "Product name is required.";
    }

    if (!product.price) {
      newErrors.price = "Price enter a price";
    } else if (Number(product.price) < 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!product.productSlug) {
      newErrors.productSlug = "Please enter slug for the product!";
    }

    if (!product.discountedPrice && !(Number(product.discountedPrice) < 0)) {
      newErrors.discountedPrice = "Please enter a discounted price.";
    }

    if (!product.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (!product.languageId) {
      newErrors.languageId = "Please select a language.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      if (editProduct && !product.image) {
        formData.append("oldImage", editProduct.image || "");
      }

      let res;
      if (editProduct) {
        res = await axiosInstance.put(
          `/products/updateProduct/${editProduct._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        res = await axiosInstance.post("/products/createProduct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(
          res.data.message ||
            (editProduct
              ? "Product updated successfully."
              : "Product added successfully.")
        );
        handleCloseModal();
        getAllProducts();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const openDeleteModal = (id: string | undefined) => {
    if (!id) return;
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProductId(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!selectedProductId) return;
    try {
      const res = await axiosInstance.delete(
        `/products/deleteProduct/${selectedProductId}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Product deleted successfully.");
        await getAllProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-3 flex items-center justify-end"> 
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          onClick={handleOnAddProduct}
        >
          <Plus />
          <p>Add New Product</p>
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              {isLoading ? (
                <TableSkeleton
                  rows={limit}
                  columns={["Image", "Name", "Category", "Language", "Price", "Discounted Price", "Action" ]}
                />
              ) : (
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow className="  text-gray-500 text-center text-lg dark:text-gray-400">
                    <TableCell className="px-5 py-3 font-semibold">
                      Image
                    </TableCell>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell className="font-semibold">Category</TableCell>
                    <TableCell className="font-semibold">Language</TableCell>
                    <TableCell className="font-semibold">Price</TableCell>
                    <TableCell className="font-semibold">
                      Discounted Price
                    </TableCell>
                    <TableCell className="font-semibold">Action</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product._id} className="text-center">
                        <TableCell className="flex justify-center">
                          {product.image && (
                            <img
                              src={`http://localhost:8000/images/${product.image}`}
                              className="w-18 h-18 my-2 rounded-md"
                            />
                          )}
                        </TableCell>
                        <TableCell className="dark:text-gray-400">{product.productName}</TableCell>
                        <TableCell className="dark:text-gray-400">{product.categoryName}</TableCell>
                        <TableCell className="dark:text-gray-400">{product.languageName}</TableCell>
                        <TableCell className="dark:text-gray-400">${product.price}</TableCell>
                        <TableCell className="dark:text-gray-400">$ {product.discountedPrice}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleOnEditProduct(product)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-amber-500 p-2 text-xs text-white shadow-theme-xs hover:bg-amber-600"
                              >
                                <Pencil className="!text-xs" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(product._id)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-red-500 p-2 text-xs text-white shadow-theme-xs hover:bg-red-600"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        No Products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              )}
            </div>
          </div>
        </div>

                 {!isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              limit={limit}
              setLimit={setLimit}
              totalCount={totalProducts}
            />
                 )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-xl w-full mx-4"
      >
        <div className="p-6 sm:p-8 lg:p-12 space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-gray-400">
            {editProduct ? "Edit Product" : "Add Product"}
          </h2>

          <div>
            <label className="block text-sm text-black font-semibold mb-2 dark:text-gray-400">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={product.productName || ""}
              onChange={handleOnChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:text-gray-400 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
            )}
          </div>

            <div>
            <label className="block text-sm text-black font-semibold mb-2 dark:text-gray-400">
              Product Slug
            </label>
            <input
              type="text"
              name="productSlug"
              value={product.productSlug || ""}
              onChange={handleOnChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:text-gray-400 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productSlug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-black font-semibold dark:text-gray-400 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price || ""}
              onChange={handleOnChange}
              placeholder="Enter price"
              className="w-full rounded-lg border dark:text-gray-400 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-black dark:text-gray-400 font-semibold mb-2">
              Discounted Price
            </label>
            <input
              type="number"
              name="discountedPrice"
              value={product.discountedPrice || ""}
              onChange={handleOnChange}
              placeholder="Enter discounted price"
              className="w-full rounded-lg border dark:text-gray-400 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            {errors.discountedPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountedPrice}
              </p>
            )}
          </div>

          <div className="flex gap-3 w-full">
            <div className="relative w-[50%]">
              <label className="block text-sm text-black font-semibold mb-2 dark:text-gray-400">
                Category
              </label>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="dropdown-toggle w-full flex justify-between items-center rounded-lg border dark:text-gray-400 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500"
              >
                {product.categoryName ||
                  categories.find(
                    (category) => category._id === product.categoryId
                  )?.name ||
                  "Select Category"}
                <ChevronDown size={16} />
              </button>
              <Dropdown
                isOpen={categoryDropdownOpen}
                onClose={() => setCategoryDropdownOpen(false)}
                className="w-full"
              >
                {categories.map((cat) => (
                  <DropdownItem
                  className="dark:text-gray-400"
                    key={cat._id}
                    onClick={() => {
                      setProduct((prev) => ({
                        ...prev,
                        categoryId: cat._id || "",
                        categoryName: cat.name,
                      }));
                      setCategoryDropdownOpen(false);
                      setErrors((prev) => ({ ...prev, categoryId: "" }));
                    }}
                  >
                    {cat.name}
                  </DropdownItem>
                ))}
              </Dropdown>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div className="relative w-[50%]">
              <label className="block text-sm text-black font-semibold mb-2 dark:text-gray-400">
                Language
              </label>
              <button
                type="button"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="dropdown-toggle w-full flex justify-between items-center rounded-lg border dark:text-gray-400 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500"
              >
                {product.languageName ||
                  languages.find(
                    (language) => language._id === product.languageId
                  )?.name ||
                  "Select Language"}
                <ChevronDown size={16} />
              </button>
              <Dropdown
                isOpen={languageDropdownOpen}
                onClose={() => setLanguageDropdownOpen(false)}
                className="w-full"
              >
                {languages.map((lang) => (
                  <DropdownItem className="dark:text-gray-400"
                    key={lang._id}
                    onClick={() => {
                      setProduct((prev) => ({
                        ...prev,
                        languageId: lang._id || "",
                        languageName: lang.name,
                      }));
                      setLanguageDropdownOpen(false);
                      setErrors((prev) => ({ ...prev, languageId: "" }));
                    }}
                  >
                    {lang.name}
                  </DropdownItem>
                ))}
              </Dropdown>
              {errors.languageId && (
                <p className="text-red-500 text-sm mt-1">{errors.languageId}</p>
              )}
            </div>
          </div>


         <div className = "flex gap-21">
           <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={product.isBestSeller || false}
              onChange={handleOnChange}

            />
            <label className="text-md text-black font-semibold dark:text-gray-400">
              Best Selling Product
            </label>
          </div>

           <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isDealOfTheWeek"
              checked={product.isDealOfTheWeek || false}
              onChange={handleOnChange}

            />
            <label className="text-md text-black font-semibold dark:text-gray-400">
              Deal Of The Week
            </label>
          </div>

          </div>
         

          <div>
            <label className="block text-sm text-black font-semibold mb-2 dark:text-gray-400">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleOnChange}
              className="w-full rounded-lg border border-gray-300 dark:text-gray-400 px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
            />

            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:dark:text-gray-800  dark:text-gray-400"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
            >
              {editProduct ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-md w-full mx-4"
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-gray-400">
            Delete Product
          </h2>
          <p className="text-gray-600 mb-6 dark:text-gray-400">
            Are you sure you want to delete this product?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-gray-400 hover:dark:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductTable;
