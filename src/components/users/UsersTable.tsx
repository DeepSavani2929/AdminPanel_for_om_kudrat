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
import Pagination from "../ui/pagination/Pagination";
import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

export default function UsersTable(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalUsers, setTotalUsers] = useState("")
    const [limit, setLimit] = useState(10)
      const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [currentPage, sortField, sortOrder, limit]);

  const getUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/users/getAllUsers?page=${currentPage}&limit=${limit}`
      );

      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.totalUsers)
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

  return (
    <>
      <div
        className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] `}
      >
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                  {isLoading ? (
                <TableSkeleton
                  rows={limit}
                  columns={["Name", "Email", "Created At"]}
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
                        className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                      >
                        Created At
                      </TableCell>
                    </TableRow>
                  </TableHeader>

         
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-center dark:text-gray-400">
                            {user.name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                            {dayjs(user.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500 py-4"
                        >
                          No Users found.
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
              totalCount={totalUsers}
            />
          )}

        </div>
      </div>

    </>
  );
}
