// frontend/src/components/DataTable.tsx
import React from "react";

export interface Column<T> {
  key: keyof T;
  header: string;
  format?: (val: any) => string;
  render?: (row: T) => React.ReactNode;
  /** left- or right-align this column’s contents */
  align?: "left" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];            // make it optional
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data = [],            // default to empty array
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <table className="min-w-full text-xs whitespace-nowrap truncate">
      <thead className="border-b bg-gray-100">
        <tr>
          {columns.map((col) => {
            const align = col.align ?? "left";
            return (
              <th
                key={String(col.key)}
                className={`p-1 font-bold ${
                  align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            );
          })}
          {(onEdit || onDelete) && (
            <th className="p-1 text-left font-bold">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b">
            {columns.map((col) => {
              const align = col.align ?? "left";

              if (col.render) {
                return (
                  <td
                    key={String(col.key)}
                    className={`p-1 ${
                      align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.render(row)}
                  </td>
                );
              }

              const raw = row[col.key];
              const display = col.format
                ? col.format(raw)
                : String(raw ?? "");
              return (
                <td
                  key={String(col.key)}
                  className={`p-1 ${
                    align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {display}
                </td>
              );
            })}

            {(onEdit || onDelete) && (
              <td className="p-1 space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="btn-form"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="btn-form-danger"
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
