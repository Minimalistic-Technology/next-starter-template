import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import DataGrid, { Column } from '@/components/ui/DataGrid';
import { ArrowDownLeft, ArrowUpRight, Activity } from 'lucide-react';

export default function LedgerView() {
    const { ledger, loading } = useAccounting();

    const columns: Column<any>[] = [
        {
            header: 'Type',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.type === 'inflow' ? (
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded">
                            <ArrowDownLeft className="size-4" />
                        </div>
                    ) : (
                        <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded">
                            <ArrowUpRight className="size-4" />
                        </div>
                    )}
                    <span className="capitalize font-medium text-sm text-slate-700 dark:text-slate-300">
                        {row.type === 'inflow' ? 'Revenue' : 'Expense'}
                    </span>
                </div>
            )
        },
        { header: 'Reference', accessorKey: 'title', className: 'font-medium' },
        {
            header: 'Category',
            cell: (row) => (
                <span className="text-slate-500 dark:text-slate-400 capitalize">
                    {row.category || 'Order Sale'}
                </span>
            )
        },
        {
            header: 'Status',
            cell: (row) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'Paid' || row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                        row.status === 'Failed' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' :
                            'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Amount',
            className: 'text-right',
            cell: (row) => (
                <span className={`font-bold ${row.type === 'inflow' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {row.type === 'inflow' ? '+' : '-'}₹{row.amount.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Date',
            className: 'text-right',
            cell: (row) => <span className="text-slate-500">{new Date(row.date).toLocaleString()}</span>
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">General Ledger</h1>
            </div>

            <div className="glass-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <DataGrid
                    data={ledger}
                    columns={columns}
                    isLoading={loading}
                    emptyMessage="Ledger is completely empty."
                    emptyIcon={<Activity className="size-10" />}
                />
            </div>
        </div>
    );
}
