import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { Users, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserFinancialsView() {
    const { userFinancials, loading, error } = useAccounting();

    if (loading) return <div className="text-center p-10 mt-20"><div className="animate-spin size-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div><p>Loading Customer Ledger...</p></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800">{error}</div>;

    const totalDues = userFinancials?.reduce((sum, u) => sum + u.pendingDues, 0) || 0;
    const totalCredit = userFinancials?.reduce((sum, u) => sum + u.creditBalance, 0) || 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Financial Records</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track account balances, total spend, and outstanding invoices per customer.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Customers" value={userFinancials?.length || 0} icon={<Users size={24} />} bg="bg-blue-50 text-blue-600 dark:bg-blue-500/10" />
                <StatCard title="Total Market Dues" value={`$${totalDues.toLocaleString()}`} icon={<Clock size={24} />} bg="bg-amber-50 text-amber-600 dark:bg-amber-500/10" />
                <StatCard title="Total Credit Extended" value={`$${totalCredit.toLocaleString()}`} icon={<DollarSign size={24} />} bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <th className="p-4">Customer Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Orders</th>
                                <th className="p-4 text-emerald-600">Lifetime Spend</th>
                                <th className="p-4 text-amber-600">Pending Dues</th>
                                <th className="p-4 text-blue-600">Available Credit</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {userFinancials?.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-sm text-slate-500">{user.email}</td>
                                    <td className="p-4">{user.orderCount}</td>
                                    <td className="p-4 font-bold text-emerald-600">${user.totalSpent.toLocaleString()}</td>
                                    <td className="p-4">
                                        {user.pendingDues > 0 ? (
                                            <span className="flex items-center gap-1 font-semibold text-amber-600">
                                                <AlertCircle size={14} /> ${user.pendingDues.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">$0.00</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-blue-600">${user.creditBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                            {userFinancials?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No active customer records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, icon, bg }: { title: string, value: string | number, icon: React.ReactNode, bg: string }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition">
            <div className={`p-4 rounded-xl ${bg}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}
