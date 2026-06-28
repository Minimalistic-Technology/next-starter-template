import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import StatCard from '@/components/ui/StatCard';
import { IndianRupee, TrendingUp, HandCoins, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AccountantDashboardView() {
    const { stats, cashflowChart, loading } = useAccounting();

    if (loading || !stats) {
        return <div className="text-center py-20 text-slate-500">Loading Financial Data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Financial Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue (Orders)"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="size-5" />}
                />
                <StatCard
                    title="Total Expenses"
                    value={`₹${stats.totalExpenses.toLocaleString()}`}
                    icon={<HandCoins className="size-5" />}
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${stats.netProfit.toLocaleString()}`}
                    icon={<IndianRupee className="size-5" />}
                    trend={stats.profitMargin}
                    trendLabel="Profit Margin"
                />
                <StatCard
                    title="Active Invoices"
                    value={stats.activeInvoices}
                    icon={<AlertCircle className="size-5" />}
                    trendLabel="Pending Payments"
                />
            </div>

            {/* Chart Area */}
            <div className="glass-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm mt-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Cashflow Trends</h2>
                <div className="h-80 w-full">
                    {cashflowChart && cashflowChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cashflowChart} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                    formatter={(value: any) => [`₹${value}`, undefined]}
                                />
                                <Legend />
                                <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" name="Expense" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">No sufficient data for charting</div>
                    )}
                </div>
            </div>
        </div>
    );
}
