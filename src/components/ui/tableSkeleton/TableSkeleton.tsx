import { Table, TableBody, TableCell, TableHeader, TableRow } from "../table";

interface TableSkeletonProps {
  rows?: number;
  columns?: string[];
}

const TableSkeleton = ({
  rows = 5,
  columns 
}: TableSkeletonProps) => {
  const skeletonRows = Array(rows).fill(0);

  return (
    <div className="animate-pulse">
      <Table>

        <TableHeader className="border-b text-gray-500 text-center text-lg dark:text-gray-400">
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index} className="px-5 py-3 font-semibold">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

    
        <TableBody>
          {skeletonRows.map((_, idx) => (
            <TableRow key={idx} className="text-center">
              {columns.map((_, colIdx) => (
                <TableCell key={colIdx} className="py-3">
                  {colIdx === 0 ? (
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    </div>
                  ) : colIdx === columns.length - 1 ? (
                    <div className="flex justify-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                  ) : (
                    <div
                      className={`h-4 bg-gray-200 rounded mx-auto ${
                        colIdx === 1
                          ? "w-3/4"
                          : colIdx === 2
                          ? "w-5/6"
                          : "w-1/2"
                      }`}
                    ></div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
