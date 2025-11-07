// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BoxIconLine,
//   GroupIcon,
// } from "../../icons";
// import Badge from "../ui/badge/Badge";

// export default function EcommerceMetrics() {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Customers
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               3,782
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon />
//             11.01%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}

//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Orders
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               5,359
//             </h4>
//           </div>

//           <Badge color="error">
//             <ArrowDownIcon />
//             9.05%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}
//     </div>
//   );
// }


import { useState } from "react";
import {
  BoxIconLine,
  GroupIcon,
  MoreDotIcon,
} from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { DollarSign } from "lucide-react";

export default function EcommerceMetrics({ range, setRange, data, loading }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (r: string) => {
    setRange(r);
    closeDropdown();
  };

  const metrics = [
    {
      title: "Customers",
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      value: data?.users?.tillNow || 0,
    },
    {
      title: "Orders",
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      value: data?.orders?.tillNow || 0,
    },
    {
      title: "Revenue",
      icon: <DollarSign className="text-gray-800 size-6 dark:text-white/90" />,
      value: `$${(data?.revenue?.tillNow || 0).toLocaleString()}`,
    },
  ];

  const options = [
    { label: "Today", value: "today" },
    { label: "Weekly", value: "week" },
    { label: "Monthly", value: "month" },
    { label: "Yearly", value: "year" },
    { label: "Till Now", value: "tillnow" },
  ];

  const selectedLabel =
    options.find((opt) => opt.value === range)?.label || "Monthly";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Overview Metrics
        </h3>

        <div className="flex items-center ">
          {/* Selected Range Label */}
          <span className="text-md font-medium pb-1.5 text-gray-600 dark:text-gray-400">
            {selectedLabel}
          </span>

          {/* Dropdown */}
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>

            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              {options.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  onItemClick={() => handleSelect(opt.value)}
                  className={`flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                    range === opt.value ? "bg-gray-100 dark:bg-white/10 font-semibold" : ""
                  }`}
                >
                  {opt.label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {m.icon}
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {m.title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading ? "..." : m.value}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
