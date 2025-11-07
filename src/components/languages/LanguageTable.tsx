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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal";
import Pagination from "../ui/pagination/Pagination";
import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 


interface Language {
  _id?: string;
  name: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Language[];
}

const LanguageTable = (): JSX.Element => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [languageName, setLanguageName] = useState("");
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [totalLanguages, setTotalLanguages] = useState("");
    const [limit, setLimit] = useState(10)
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    getLanguages();
  }, [currentPage, sortField, sortOrder, limit]);

  const getLanguages = async (): Promise<void> => {
        setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/languages/getAllLanguages?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
      );

      if (res.data.success) {
        setLanguages(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalLanguages(res.data.totalLanguages)
        console.log(res.data.data);
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

  const handleOnAddLanguage = () => {
    setEditingLanguage(null);
    setLanguageName("");
    setIsOpen(true);
  };

  const handleEditLanguage = (language: Language) => {
    setEditingLanguage(language);
    setLanguageName(language.name);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setLanguageName("");
    setEditingLanguage(null);
  };

  const validate = (): boolean => {
    let valid = true;
    const newError: { languageName?: string } = {};

    if (!languageName.trim()) {
      newError.languageName = "Language name is required.";
      valid = false;
    } else if (languageName.trim().length < 2) {
      newError.languageName =
        "Category name must be at least 2 characters long.";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    try {
      if (editingLanguage) {
        const res = await axiosInstance.put(
          `/languages/updateLanguage/${editingLanguage._id}`,
          { name: languageName },
          { withCredentials: true }
        );

        if (res.data.success) {
          toast.success(res.data.message || "Language updated successfully.");
          handleCloseModal();
          getLanguages();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axiosInstance.post(
          "/languages/addLanguage",
          { name: languageName },
          { withCredentials: true }
        );

        if (res.data.success) {
          toast.success(res.data.message || "Language added successfully.");
          handleCloseModal();
          getLanguages();
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
    setSelectedLanguageId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedLanguageId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteLanguage = async (
    id: string | undefined
  ): Promise<void> => {
    if (!selectedLanguageId) return;

    try {
      const res = await axiosInstance.delete(
        `/languages/deleteLanguage/${selectedLanguageId}`
      );

      if (res.data.success) {
        toast.success(res.data.message || "Language deleted successfully.");
        await getLanguages();
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
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >

      <div className="px-6 py-3 flex items-center justify-end">
       <button
          className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
          onClick={handleOnAddLanguage}
        >
          <Plus />
          <p>Add New Language</p>
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
                  <TableRow className="text-center">
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-semibold text-gray-500  text-lg dark:text-gray-400"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-4 py-3 font-semibold text-gray-500  text-lg dark:text-gray-400"
                    >
                      Created At
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-semibold text-gray-500  text-xl dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {languages.length > 0 ? (
                    languages.map((language) => (
                      <TableRow key={language._id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-center dark:text-gray-400">
                          {language.name}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center dark:text-gray-400 ">
                          {language.createdAt
                            ? dayjs(language.createdAt).format("DD/MM/YYYY")
                            : "-"}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center ">
                          <div className="flex justify-center">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditLanguage(language)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-amber-500 p-2 text-xs text-white shadow-theme-xs hover:bg-amber-600"
                              >
                                <Pencil className="!text-xs" />
                              </button>

                              <button
                                onClick={() => openDeleteModal(language._id)}
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
                        No languages found.
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
              totalCount={totalLanguages}
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
            {editingLanguage ? "Edit Language" : "Add Language"}
          </h2>

          <div className="space-y-2">
            <div>
              <label
                htmlFor="languageName"
                className="block text-sm text-black font-semibold mb-2 dark:text-gray-400"
              >
                Name
              </label>
              <input
                id="languageName"
                type="text"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                placeholder="Enter language name"
                className="w-full rounded-lg border outline-none border-gray-300 px-4 py-2 text-gray-800 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {error.languageName && (
              <p className="text-red-500 text-sm ">{error.languageName}</p>
            )}

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
                {editingLanguage ? "Update" : "Submit"}
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
        <div className="p-6 sm:p-8 ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-gray-400">
            Delete Category
          </h2>
          <p className="text-gray-600 mb-6 dark:text-gray-400">
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
              onClick={handleDeleteLanguage}
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

export default LanguageTable;
