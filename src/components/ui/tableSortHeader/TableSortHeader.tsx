import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableSortHeaderProps {
  label: string;
  field: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const TableSortHeader: React.FC<TableSortHeaderProps> = ({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
}) => {
  const isActive = sortField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center justify-center gap-1 w-full"
    >
      {label}
      {isActive ? (
        sortOrder === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      ) : (
        <ChevronUp className="w-4 h-4 opacity-20" />
      )}
    </button>
  );
};

export default TableSortHeader;
    