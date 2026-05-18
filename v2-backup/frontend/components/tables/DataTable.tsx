interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  emptyMessage = "لا توجد نتائج.",
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_50px_-40px_rgba(6,26,51,0.4)]">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50/90">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-slate-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/80">
                {columns.map((col, index) => (
                  <td key={index} className="px-4 py-4 align-top text-right text-slate-700">
                    {typeof col.accessor === "function" ? col.accessor(row) : String(row[col.accessor] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
