import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { Package, AlertTriangle, Building2, BatteryWarning, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventoryDashboardView() {
    const { stats, alerts, loading, error } = useInventory();

    if (loading) return <div className="text-center p-10 mt-20"><div className="animate-spin size-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div><p>Loading Inventory Control...</p></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">{error}</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Warehouse Control Center</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Global overview of all fulfillment centers, physical stock, and critical alerts.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Warehouses" value={stats?.totalActiveWarehouses || 0} icon={<Building2 size={24} />} bg="bg-blue-50 text-blue-600 dark:bg-blue-500/10" />
                <StatCard title="Total Units Stored" value={stats?.totalItemsStored?.toLocaleString() || 0} icon={<Package size={24} />} bg="bg-teal-50 text-teal-600 dark:bg-teal-500/10" />
                <StatCard title="Products Tracked" value={stats?.totalProductsTracked || 0} icon={<CheckCircle2 size={24} />} bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" />
                <StatCard title="Critical Alerts" value={stats?.lowStockAlertsCount || 0} icon={<AlertTriangle size={24} />} bg="bg-red-50 text-red-600 dark:bg-red-500/10" />
            </div>

            {/* Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-red-50/50 dark:bg-red-900/10">
                        <BatteryWarning className="text-red-500 size-5" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Critical Low Stock (Racks)</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {alerts?.lowStock?.length > 0 ? alerts.lowStock.map((alert: any) => (
                            <div key={alert._id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900 dark:text-gray-100">{alert.productName}</p>
                                    <p className="text-xs text-slate-500">{alert.warehouseName} • {alert.zoneAisle} • {alert.rack} • {alert.shelfRow}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-red-100 text-red-700 dark:bg-red-500/20 px-2 py-1 flex items-center gap-1 rounded-md text-xs font-bold font-mono">
                                        {alert.quantity} Left
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-4">No low stock alerts in any storage array.</p>
                        )}
                    </div>
                </div>

                {/* Logistics Warnings (Over capacity or Unassigned) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/30 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/10">
                            <AlertTriangle className="text-amber-500 size-5" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Capacity Warnings</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {alerts?.overCapacity?.length > 0 ? alerts.overCapacity.map((alert: any) => (
                                <div key={alert._id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-gray-100">{alert.productName}</p>
                                        <p className="text-xs text-slate-500">{alert.warehouseName} • {alert.zoneAisle} • {alert.rack}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 px-2 py-1 rounded-md text-xs font-bold">
                                            {alert.quantity} / {alert.capacity} (Overflow)
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 text-center py-4">All assigned racks are operating within volume capacity.</p>
                            )}
                        </div>
                    </div>
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
