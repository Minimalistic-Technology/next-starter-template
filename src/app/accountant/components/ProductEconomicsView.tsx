import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { Package, TrendingUp, TrendingDown, Percent, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductEconomicsView() {
    const { productEconomics, loading, error } = useAccounting();

    if (loading) return <div className="text-center p-10 mt-20"><div className="animate-spin size-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div><p>Loading Economic Analysis...</p></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800">{error}</div>;

    const totalSold = productEconomics?.reduce((sum, p) => sum + p.unitsSold, 0) || 0;
    const totalGrossProfit = productEconomics?.reduce((sum, p) => sum + p.grossProfit, 0) || 0;

    // Weighted Average Margin = Total Gross Profit / Total Revenue
    const totalRev = productEconomics?.reduce((sum, p) => sum + p.totalRevenue, 0) || 0;
    const avgMargin = totalRev > 0 ? ((totalGrossProfit / totalRev) * 100).toFixed(2) : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Profitability (COGS)</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze revenue, cost of goods sold, and gross margins for every product.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Products Sold" value={totalSold} icon={<Package size={24} />} bg="bg-blue-50 text-blue-600 dark:bg-blue-500/10" />
                <StatCard title="Total Realized Revenue" value={`$${totalRev.toLocaleString()}`} icon={<TrendingUp size={24} />} bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" />
                <StatCard title="Total Gross Profit" value={`$${totalGrossProfit.toLocaleString()}`} icon={<Box size={24} />} bg="bg-teal-50 text-teal-600 dark:bg-teal-500/10" />
                <StatCard title="Portfolio Avg Margin" value={`${avgMargin}%`} icon={<Percent size={24} />} bg="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Base Cost (COGS)</th>
                                <th className="p-4">Selling Price (MRP)</th>
                                <th className="p-4">Units Sold</th>
                                <th className="p-4 text-emerald-600">Total Revenue</th>
                                <th className="p-4">Gross Profit</th>
                                <th className="p-4">Margin %</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {productEconomics?.map((product) => (
                                <tr key={product.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-medium max-w-[200px] truncate" title={product.name}>{product.name}</td>
                                    <td className="p-4 text-red-500">${product.costPrice.toLocaleString()}</td>
                                    <td className="p-4 text-emerald-600">${product.mrp.toLocaleString()}</td>
                                    <td className="p-4 font-bold">{product.unitsSold}</td>
                                    <td className="p-4 font-bold text-emerald-600">${product.totalRevenue.toLocaleString()}</td>
                                    <td className="p-4 font-bold text-teal-600">${product.grossProfit.toLocaleString()}</td>
                                    <td className="p-4">
                                        <div className={`px-2 py-1 rounded-md inline-block text-xs font-bold ${product.margin > 40 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                                                product.margin > 15 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                                            }`}>
                                            {product.margin}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {productEconomics?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">No product sales data available to calculate economics.</td>
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
