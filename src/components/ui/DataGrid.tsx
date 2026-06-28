import React from 'react';
import { Loader2 } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string; // Additional classes for table cell
}

interface DataGridProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
}

export default function DataGrid<T extends { _id?: string, id?: string }>({
    data,
    columns,
    isLoading,
    emptyMessage = "No records found",
    emptyIcon
}: DataGridProps<T>) {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-teal-600 size-10" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16">
                {emptyIcon && <div className="flex justify-center mb-4 text-slate-300 dark:text-slate-600">{emptyIcon}</div>}
                <p className="text-slate-500 dark:text-slate-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`p-4 font-semibold ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {data.map((item, rowIndex) => {
                        const key = item._id || item.id || rowIndex.toString();
                        return (
                            <tr key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`p-4 text-slate-700 dark:text-slate-300 ${col.className || ''}`}>
                                        {col.cell
                                            ? col.cell(item)
                                            : col.accessorKey ? String(item[col.accessorKey]) : null}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
