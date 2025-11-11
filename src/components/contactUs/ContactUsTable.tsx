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

interface Cutomer {
  _id: string;
  customerName: string;
  customerEmail: string;
  question: string
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Customer[];
}

export default function ContactUsTable(): JSX.Element {
  const [customers, setCustomers] = useState<Cutomer[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState("")
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [currentPage,limit]);

  const getUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `/contactUs/getCustomerContactDetails?page=${currentPage}&limit=${limit}`
      );

      if (res.data.success) {
        setCustomers(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCustomers(res.data.totalCustomers)
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
                  columns={["customerName", "customerEmail", "question", "Created At"]}
                />
              ) : (
                <Table>
          
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                      >
                        Customer Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                      >
                       Question
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
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-center dark:text-gray-400">
                            {customer.customerName}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                            {customer.customerEmail}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                           { customer.question }
                          </TableCell>

                        <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                            {dayjs(customer.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500 py-4"
                        >
                          No Customers found.
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
              totalCount={totalCustomers}
            />
          )}

        </div>
      </div>

    </>
  );
}
