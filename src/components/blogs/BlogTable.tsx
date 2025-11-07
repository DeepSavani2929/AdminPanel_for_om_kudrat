// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../../api/axiosInstance";
// import dayjs from "dayjs";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import { Modal } from "../ui/modal";
// import { useNavigate } from "react-router";
// import Pagination from "../ui/pagination/Pagination";

// interface Blog {
//   _id?: string;
//   blogImage: string;
//   blogTitle: string;
//   shortDescription: string;
//   createdAt?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: Blog[];
//   totalBlogs: number;
//   totalPages: number;
//   currentPage: number;
// }

// const BlogTable = (): JSX.Element => {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//     const [totalBlogs, setTotalBlogs] = useState("");
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
//   const [error, setError] = useState({});
//   const naviagte = useNavigate();
//   const [limit, setLimit] = useState(10)



//   useEffect(() => {
//     getAllBlogs();
//   }, [currentPage, sortField, sortOrder, limit]);

//   const getAllBlogs = async (): Promise<void> => {
//     try {
//       const res = await axiosInstance.get<ApiResponse>(
//         `/blog/getAllBlogs?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
//       );

//       if (res.data.success) {
//         setBlogs(res.data.data);
//         setTotalPages(res.data.totalPages);
//         setTotalBlogs(res.data.totalBlogs)
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong";
//       toast.error(errorMessage);
//     }
//   };

//   const handleOnAddBlog = () => {
//     naviagte("/blogs/addBlog");
//   };

//   const handleEditBlog = (blog) => {
//     naviagte(`/blogs/${blog._id}`);
//   };

//   const openDeleteModal = (id: string | undefined) => {
//     if (!id) return;
//     setSelectedBlogId(id);
//     setIsDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setSelectedBlogId(null);
//     setIsDeleteModalOpen(false);
//   };

//   const handleDeleteBlog = async (id: string | undefined): Promise<void> => {
//     console.log(selectedBlogId);
//     if (!selectedBlogId) return;

//     try {
//       const res = await axiosInstance.delete(
//         `/blog/deleteBlog/${selectedBlogId}`
//       );

//       if (res.data.success) {
//         toast.success(res.data.message || "Language deleted successfully.");
//         await getAllBlogs();
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong";
//       toast.error(errorMessage);
//     } finally {
//       closeDeleteModal();
//     }
//   };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

//       <div className="px-6 py-3 flex justify-end items-center">
//         <button
//           className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
//           onClick={handleOnAddBlog}
//         >
//           <Plus />
//           <p>Add New Blog</p>
//         </button>
//       </div>


//       <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
//         <div className="space-y-6">
//           <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//             <div className="max-w-full overflow-x-auto">
//               <Table>
//                 <TableHeader className=" border-b  text-gray-500 text-center text-lg dark:text-gray-400">
//                   <TableRow>
//                     <TableCell className="px-5 py-3 font-semibold ">
//                       Blog Image
//                     </TableCell>

//                     <TableCell className="px-4 py-3 font-semibold ">
//                       Title
//                     </TableCell>

//                     <TableCell className="px-4 py-3 font-semibold ">
//                       Description
//                     </TableCell>

//                     <TableCell className="px-5 py-3 font-semibold ">
//                       createdAt
//                     </TableCell>

//                     <TableCell className="px-5 py-3 font-semibold">
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//                   {blogs.length > 0 ? (
//                     blogs.map((blog) => (
//                       <TableRow key={blog._id} className="text-center">
//                         <TableCell className="flex justify-center">
//                           {blog.blogImage && (
//                             <img
//                               src={`http://localhost:8000/images/${blog.blogImage}`}
//                               className="w-18 h-18 my-2 rounded-md"
//                             />
//                           )}
//                         </TableCell>

//                         <TableCell className="px-5 py-4 sm:px-6 dark:text-gray-400">
//                           {blog.blogTitle}
//                         </TableCell>

//                         <TableCell className="px-5 py-4 sm:px-6 dark:text-gray-400">
//                           {blog.shortDescription}
//                         </TableCell>

//                         <TableCell className="px-4 py-3 dark:text-gray-400">
//                           {blog.createdAt
//                             ? dayjs(blog.createdAt).format("DD/MM/YYYY")
//                             : "-"}
//                         </TableCell>

//                         <TableCell className="px-4 py-3 ">
//                           <div className="flex justify-center">
//                             <div className="flex gap-3">
//                               <button
//                                 onClick={() => handleEditBlog(blog)}
//                                 className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-amber-500 p-2 text-xs text-white shadow-theme-xs hover:bg-amber-600"
//                               >
//                                 <Pencil className="!text-xs" />
//                               </button>

//                               <button
//                                 onClick={() => openDeleteModal(blog._id)}
//                                 className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-red-500 p-2 text-xs text-white shadow-theme-xs hover:bg-red-600"
//                               >
//                                 <Trash2 />
//                               </button>
//                             </div>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={5}
//                         className="text-center text-gray-500 py-4"
//                       >
//                         No Blogs found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//              <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={(page) => setCurrentPage(page)}
//               limit={limit}              
//               setLimit={setLimit} 
//               totalCount = {totalBlogs}
//             />
//         </div>
//       </div>

//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={closeDeleteModal}
//         className="max-w-md w-full mx-4"
//       >
//         <div className="p-6 sm:p-8 ">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//             Delete Category
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Are you sure you want to delete this category?
//           </p>
//           <div className="flex justify-end gap-4">
//             <button
//               onClick={closeDeleteModal}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteBlog}
//               className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default BlogTable;





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
import { useNavigate } from "react-router";
import Pagination from "../ui/pagination/Pagination";
import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 


interface Blog {
  _id?: string;
  blogImage: string;
  blogTitle: string;
  shortDescription: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Blog[];
  totalBlogs: number;
  totalPages: number;
  currentPage: number;
}

const BlogTable = (): JSX.Element => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getAllBlogs();
  }, [currentPage, sortField, sortOrder, limit]);

  const getAllBlogs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/blog/getAllBlogs?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
      );

      if (res.data.success) {
        setBlogs(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalBlogs(res.data.totalBlogs);
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
      setIsLoading(false);
    }
  };

  const handleOnAddBlog = () => navigate("/blogs/addBlog");

  const handleEditBlog = (blog: Blog) => navigate(`/blogs/${blog._id}`);

  const openDeleteModal = (id: string | undefined) => {
    if (!id) return;
    setSelectedBlogId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBlogId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBlog = async (): Promise<void> => {
    if (!selectedBlogId) return;
    try {
      const res = await axiosInstance.delete(
        `/blog/deleteBlog/${selectedBlogId}`
      );

      if (res.data.success) {
        toast.success(res.data.message || "Blog deleted successfully.");
        await getAllBlogs();
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
      {/* Top Add Button */}
      <div className="px-6 py-3 flex justify-end items-center">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
          onClick={handleOnAddBlog}
        >
          <Plus />
          <p>Add New Blog</p>
        </button>
      </div>

      {/* Table Section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              {isLoading ? (
                <TableSkeleton
                  rows={limit}
                  columns={["Blog Image", "Title", "Description", "Created At", "Action"]}
                />
              ) : (
                <Table>
                  <TableHeader className="border-b text-gray-500 text-center text-lg dark:text-gray-400">
                    <TableRow>
                      <TableCell className="px-5 py-3 font-semibold">
                        Blog Image
                      </TableCell>
                      <TableCell className="px-4 py-3 font-semibold">
                        Title
                      </TableCell>
                      <TableCell className="px-4 py-3 font-semibold">
                        Description
                      </TableCell>
                      <TableCell className="px-5 py-3 font-semibold">
                        Created At
                      </TableCell>
                      <TableCell className="px-5 py-3 font-semibold">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {blogs.length > 0 ? (
                      blogs.map((blog) => (
                        <TableRow key={blog._id} className="text-center">
                          <TableCell className="flex justify-center">
                            {blog.blogImage && (
                              <img
                                src={`http://localhost:8000/images/${blog.blogImage}`}
                                className="w-18 h-18 my-2 rounded-md object-cover"
                              />
                            )}
                          </TableCell>

                          <TableCell className="px-5 py-4 sm:px-6 dark:text-gray-400">
                            {blog.blogTitle}
                          </TableCell>

                          <TableCell className="px-5 py-4 sm:px-6 dark:text-gray-400">
                            {blog.shortDescription}
                          </TableCell>

                          <TableCell className="px-4 py-3 dark:text-gray-400">
                            {blog.createdAt
                              ? dayjs(blog.createdAt).format("DD/MM/YYYY")
                              : "-"}
                          </TableCell>

                          <TableCell className="px-4 py-3 ">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-amber-500 p-2 text-xs text-white shadow-theme-xs hover:bg-amber-600"
                              >
                                <Pencil className="!text-xs" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(blog._id)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-red-500 p-2 text-xs text-white shadow-theme-xs hover:bg-red-600"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-500 py-4"
                        >
                          No Blogs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {!isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              limit={limit}
              setLimit={setLimit}
              totalCount={totalBlogs}
            />
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-md w-full mx-4"
      >
        <div className="p-6 sm:p-8 ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Delete Blog
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this blog?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBlog}
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

export default BlogTable;
