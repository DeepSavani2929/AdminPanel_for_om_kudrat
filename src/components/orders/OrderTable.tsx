  import React, { useEffect, useState } from "react";
  import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  import { toast } from "react-toastify";
  import axiosInstance from "../../api/axiosInstance";
  import dayjs from "dayjs";
  import Pagination from "../ui/pagination/Pagination.tsx";
  import TableSortHeader from "../ui/tableSortHeader/TableSortHeader.tsx";
  import TableSkeleton from "../ui/tableSkeleton/TableSkeleton.tsx"; 
  

  interface OrderItem {
    productName: string;
    image: string;
    quantity: number;
    price: number;
  }

  interface Order {
    _id: string;
    paymentIntentId: string;
    name: string;
    email: string;
    totalAmount: number;
    status: string;
    userId: string;
    createdAt: string;
    items: OrderItem[];
  }

  interface ApiResponse {
    success: boolean;
    message: string;
    data: Order[];
    totalOrders: number;
    currentPage: number;
    totalPages: number;
  }

  const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10)
    const [isLoading, setIsLoading] = useState(false); 



    useEffect(() => {
      getAllOrders();
    }, [currentPage, sortField, sortOrder,limit]);

    const getAllOrders = async (): Promise<void> => {
        setIsLoading(true);
      try {
        setLoading(true);
        const res = await axiosInstance.get<ApiResponse>(
          `/orders/getAllOrders?page=${currentPage}&limit=${limit}&sort=${sortField}:${sortOrder}`
        );

        if (res.data.success) {
          setOrders(res.data.data);
          console.log(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotalOrders(res.data.totalOrders);
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

    console.log(isLoading)

    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    };

    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className=" flex justify-between items-center">
          {/* <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            Total Orders ({orders.length})
          </h3> */}
          {/* {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          )} */}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              {isLoading ? (
                <TableSkeleton
                  rows={limit}
                  columns={["Product Details", "User Name", "Email", "Language", "Price", "Quantity", "Amount", "Date","Status",  ]}
                />
              ) : (
              <Table>
                <TableHeader className="border-b  border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 ps-16 py-3 font-semibold text-gray-500 text-start text-lg dark:text-gray-400"
                    >
                      Product Details
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold  text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      <TableSortHeader
                        label="User Name"
                        field="name"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Email
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 flex justify-center font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      <TableSortHeader
                        label="Order ID"
                        field="_id"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Price
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Quantity
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      <TableSortHeader
                        label="Amount"
                        field="totalAmount"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      <TableSortHeader
                        label="Date"
                        field="createdAt"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5  py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex flex-col gap-4">
                            {order.cartItems?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 pb-2 w-full justify-start"
                              >
                                <img
                                  src={`http://localhost:8000/images/${item.image}`}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded object-cover border"
                                />
                                <div className="text-left dark:text-gray-400">
                                  <p>{item.productName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center dark:text-gray-400">
                          {order.name}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center dark:text-gray-400">
                          {order.email}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center dark:text-gray-400">
                          #{order.orderId}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex flex-col gap-11 pt-1">
                            {order.cartItems?.map((item, idx) => (
                              <p key={idx} className="dark:text-gray-400">${Number(item.price).toFixed(2)}</p>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex flex-col gap-11 pt-1">
                            {order.cartItems?.map((item, idx) => (
                              <p key={idx} className="dark:text-gray-400">{item.quantity}</p>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center dark:text-gray-400">
                          ${order.totalAmount?.toFixed(2)}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center dark:text-gray-400">
                          {dayjs(order.createdAt).format("DD/MM/YYYY")}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-center">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "paid"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-gray-500 py-4"
                      >
                        No Orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              )}
            </div>
          </div>

           { !isLoading && ( <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              limit={limit}              
              setLimit={setLimit} 
              totalCount = {totalOrders}
            />
           )}
  </div>
      </div>
    );
  };

  export default OrderTable;
