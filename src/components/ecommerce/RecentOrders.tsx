import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import TableSortHeader from "../ui/tableSortHeader/TableSortHeader.tsx";
import { useNavigate } from "react-router-dom";


interface CartItem {
  productName: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  cartItems: CartItem[];
}

interface ApiResponse {
  success: boolean;
  data: Order[];
  message: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllOrders();
  }, [currentPage, sortField, sortOrder, limit, minAmount, maxAmount]);

  const getAllOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sort: `${sortField}:${sortOrder}`,
      });

      if (minAmount) query.append("minAmount", minAmount);
      if (maxAmount) query.append("maxAmount", maxAmount);

      const res = await axiosInstance.get<ApiResponse>(
        `/orders/getAllOrders?${query.toString()}`
      );

      if (res.data.success) {
        setOrders(res.data.data);
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
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleDropdown = (orderId: string) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleApplyFilter = () => {
    setFilterOpen(false);
    getAllOrders();
  };

  const handleClearFilter = () => {
    setMinAmount("");
    setMaxAmount("");
    setFilterOpen(false);
    getAllOrders();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3 relative">

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            Filter
          </button>


          {filterOpen && (
            <div className="absolute top-12 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 dark:bg-gray-800 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filter by Amount
              </h4>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  placeholder="Min Amount"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-900 dark:text-gray-300"
                />
                <input
                  type="number"
                  placeholder="Max Amount"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-900 dark:text-gray-300"
                />
                <div className="flex justify-between mt-2">
                  <button
                    onClick={handleClearFilter}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApplyFilter}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={() => navigate("/orders")}
          >
            See all
          </button>
        </div>
      </div>


      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
              >
                Products
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
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
                className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
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
                className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
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
                className="px-5 py-3 font-semibold text-gray-500 text-center text-lg dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow>
           
                    <TableCell className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleDropdown(order._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          View Products
                        </span>
                        <span>
                          {expandedRows.includes(order._id) ? "▲" : "▼"}
                        </span>
                      </button>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center dark:text-gray-400">
                      #{order.orderId}
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

    
                  {expandedRows.includes(order._id) && (
                    <TableRow className="bg-gray-50 dark:bg-gray-900/30">
                      <TableCell colSpan={5} className="p-4">
                        <div className="flex flex-col gap-3">
                          {order.cartItems?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`http://localhost:8000/images/${item.image}`}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded object-cover border"
                                />
                                <span className="font-medium dark:text-gray-300">
                                  {item.productName}
                                </span>
                              </div>
                              <div className="flex gap-6 dark:text-gray-400">
                                <p>Qty: {item.quantity}</p>
                                <p>${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
      </div>
    </div>
  );
}

