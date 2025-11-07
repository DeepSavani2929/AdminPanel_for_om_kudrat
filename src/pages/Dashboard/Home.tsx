// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import PageMeta from "../../components/common/PageMeta";

// export default function Home() {
//   return (
//     <>
//       <PageMeta
//         title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <div className="grid grid-cols-12 gap-4 md:gap-6">
//         <div className="col-span-12 space-y-6 ">
//           <EcommerceMetrics />

//           <MonthlySalesChart />
//         </div>

//         {/* <div className="col-span-12 xl:col-span-5">
//           <MonthlyTarget />
//         </div> */}

//         <div className="col-span-12">
//           <StatisticsChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <DemographicCard />
//         </div>

//         <div className="col-span-12 xl:col-span-7">
//           <RecentOrders />
//         </div>
//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";

export default function Home() {
  const [range, setRange] = useState("month"); // default to monthly
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/dashboard/dashboardData?range=${range}`);
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load dashboard data");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Server error";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  return (
    <>
      <PageMeta
        title="Admin Dashboard | Ecommerce Insights"
        description="Ecommerce Dashboard Overview including metrics, charts, and reports"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Overview Metrics Section */}
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics range={range} setRange={setRange} data={data} loading={loading} />

          <MonthlySalesChart data={data?.salesLast12Months || []} />
        </div>

        {/* Additional analytics and components */}
        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-6 ">
          <DemographicCard />

          <MonthlyTarget/>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
