import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface Column<T> {
  label: string;
  key?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pagination?: ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No data found",
  className = "",
  pagination,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6 opacity-40" />
        <p className="text-lg text-gray-500 font-medium">{emptyMessage}</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`
                    px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700
                    first:rounded-tl-2xl last:rounded-tr-2xl
                    ${column.align === 'center' && 'text-center'}
                    ${column.align === 'right' && 'text-right'}
                  `}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="group transition-all duration-200 hover:bg-teal-50/50"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                    px-6 py-5 text-sm text-gray-800
                    ${column.align === 'center' && 'text-center'}
                    ${column.align === 'right' && 'text-right'}
                    transition-colors duration-200
                  `}
                  >
                    <div className="flex items-center justify-start">
                      {column.render
                        ? column.render(row, rowIndex)
                        : column.key
                          ? String(row[column.key] ?? '')
                          : null}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination}

      {/* Optional subtle footer shadow when scrollable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent opacity-70" />
    </div>
  );
}