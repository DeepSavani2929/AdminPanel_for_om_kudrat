import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import { Modal } from "../ui/modal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Pagination from "../ui/pagination/Pagination";
import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 

interface Category {
  _id?: string;
  name: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}

const CategoriesTable = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [error, setError] = useState<{ categoryName?: string }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const [totalCategories, setTotalCategories] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   const [limit, setLimit] = useState(10)
      const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    getCategories();
  }, [currentPage, sortField, sortOrder,limit]);


  const getCategories = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/categories/getAllCategories?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
      );

      if (res.data.success) {
        setCategories(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCategories(res.data.totalCategories)
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

  const handleOnAddCategory = () => {
    setEditCategory(null);
    setCategoryName("");
    setError({});
    setIsOpen(true);
  };

  const handleOnEditCategory = (category: Category) => {
    setEditCategory(category);
    setCategoryName(category.name);
    setError({});
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCategoryName("");
    setEditCategory(null);
    setError({});
  };

  const validate = (): boolean => {
    let valid = true;
    const newError: { categoryName?: string } = {};

    if (!categoryName.trim()) {
      newError.categoryName = "Category name is required.";
      valid = false;
    } else if (categoryName.trim().length < 2) {
      newError.categoryName =
        "Category name must be at least 2 characters long.";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    try {
      if (editCategory) {
        const res = await axiosInstance.put(
          `/categories/updateCategory/${editCategory._id}`,
          { name: categoryName }
        );

        if (res.data.success) {
          toast.success(res.data.message || "Category updated successfully.");
          handleCloseModal();
          getCategories();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axiosInstance.post("/categories/createCategory", {
          name: categoryName,
        });

        if (res.data.success) {
          toast.success(res.data.message || "Category added successfully.");
          handleCloseModal();
          getCategories();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const openDeleteModal = (id: string | undefined) => {
    if (!id) return;
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!selectedCategoryId) return;

    try {
      const res = await axiosInstance.delete(
        `/categories/deleteCategory/${selectedCategoryId}`
      );

      if (res.data.success) {
        toast.success(res.data.message || "Category deleted successfully.");
        await getCategories();
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      closeDeleteModal();
    }
  };


  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

      <div className="px-6 py-3 flex items-center justify-end">
   
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          onClick={handleOnAddCategory}
        >
          <Plus />
          <p>Add New Category</p>
        </button>
      </div>


      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">

               {isLoading ? (
                <TableSkeleton
                  rows={limit}
                  columns={["Name", "Created At", "Action"]}
                />
              ) : (
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-4 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-semibold text-gray-500 text-center text-xl dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-center dark:text-gray-400">
                          {category.name}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                          {dayjs(category.createdAt).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start ">
                          <div className="flex justify-center">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleOnEditCategory(category)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-amber-500 p-2 text-xs text-white shadow-theme-xs hover:bg-amber-600"
                              >
                                <Pencil className="!text-xs" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(category._id)}
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
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        No Categories found.
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
              totalCount={totalCategories}
            />
          )}
</div>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-xl w-full mx-4"
      >
        <div className="p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-gray-400">
            {editCategory ? "Edit Category" : "Add Category"}
          </h2>

          <div className="space-y-2">
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm text-black font-semibold mb-2 dark:text-gray-400 dark:text-gray-400"
              >
                Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className={`w-full rounded-lg border outline-none px-4 py-2 text-gray-800  focus:outline-none focus:ring-2 dark:text-gray-400 ${
                  error.categoryName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-brand-500"
                }`}
              />
              {error.categoryName && (
                <p className="text-red-500 text-sm mt-1">
                  {error.categoryName}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-gray-400 hover:dark:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                {editCategory ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-md w-full mx-4"
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-gray-400 ">
            Delete Category
          </h2>
          <p className="text-gray-600 mb-6 dark:text-gray-400 ">
            Are you sure you want to delete this category?
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

export default CategoriesTable;
