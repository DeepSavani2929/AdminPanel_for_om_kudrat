

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  limit: number;
  setLimit: (limit: number) => void;
  totalCount: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  limit,
  setLimit,
  totalCount,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    onPageChange(1);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-3 md:justify-start xl:justify-between items-center mt-7">

      <div className="flex justify-center md:justify-start xl:justify-center items-center gap-2 ps-0 xl:ps-56 w-[80%]">
     
          <>
            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50 dark:text-gray-400"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50 dark:text-gray-400"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </>
  
      </div>


      <div className="text-gray-700 dark:text-white/90 text-md md:text-lg flex whitespace-nowrap items-center">
          {totalCount > 0 ? (
          <>
           <span className="me-1">Showing</span>    <select
          value={limit}
          onChange={handleLimitChange}
          className="border border-gray-300 rounded-md px-2 py-1 ms-1 me-1 mt-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
        >
          {[5, 10, 30, 50, 100].map((num) => (
            <option key={num} value={num} >
              {num}
            </option>
          ))}
        </select> <span className="pe-1 ps-1">of</span>
            <span className="font-bold ps-1 pe-1 ">
                {totalCount}
            </span> entries
          </>
        ) : (
          "No entries to display"
        )}
      </div>
    </div>
  );
};

export default Pagination;
