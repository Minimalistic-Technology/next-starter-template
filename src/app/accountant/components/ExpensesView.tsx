import React, { useState } from 'react';
import { useAccounting } from '../hooks/useAccounting';
import DataGrid, { Column } from '@/components/ui/DataGrid';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

export default function ExpensesView() {
    const { expenses, loading, addExpense, deleteExpense } = useAccounting();
    const [isAdding, setIsAdding] = useState(false);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'software' });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await addExpense({
            title: newExpense.title,
            amount: Number(newExpense.amount),
            category: newExpense.category,
            date: new Date()
        });
        setIsAdding(false);
        setNewExpense({ title: '', amount: '', category: 'software' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this expense permanently?")) {
            await deleteExpense(id);
        }
    };

    const columns: Column<any>[] = [
        { header: 'Title', accessorKey: 'title', className: 'font-medium' },
        {
            header: 'Category',
            cell: (row) => (
                <span className="px-2 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded uppercase">
                    {row.category}
                </span>
            )
        },
        {
            header: 'Amount',
            cell: (row) => <span className="font-bold text-rose-600 dark:text-rose-400">₹{row.amount.toLocaleString()}</span>
        },
        {
            header: 'Date',
            cell: (row) => new Date(row.date).toLocaleDateString()
        },
        {
            header: 'Logged By',
            cell: (row) => row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : 'System'
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors float-right"
                >
                    <Trash2 className="size-4" />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors"
                >
                    <Plus className="size-4" /> Log Expense
                </button>
            </div>

            {isAdding && (
                <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Add New Expense</h3>
                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                            <input required type="text" value={newExpense.title} onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white" placeholder="e.g. AWS Hosting" />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                            <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white" placeholder="0" />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white">
                                <option value="software">Software / SaaS</option>
                                <option value="marketing">Marketing</option>
                                <option value="salary">Salary</option>
                                <option value="logistics">Logistics</option>
                                <option value="office">Office / Misc</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-white transition">Cancel</button>
                            <button type="submit" className="px-4 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <DataGrid
                    data={expenses}
                    columns={columns}
                    isLoading={loading}
                    emptyMessage="No expenses have been recorded yet."
                    emptyIcon={<ShieldAlert className="size-10" />}
                />
            </div>
        </div>
    );
}
