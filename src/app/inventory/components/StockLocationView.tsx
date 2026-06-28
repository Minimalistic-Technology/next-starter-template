import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Layers, Plus, MapPin, Search, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function StockLocationView() {
    const { locations, loading, assignStock, updateStock, removeStock, error } = useInventory();
    const [products, setProducts] = useState<any[]>([]);

    // Modal states
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Forms
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        product: "", productName: "", warehouseName: "Main Hub",
        zoneAisle: "", rack: "", shelfRow: "", quantity: 0, capacity: 100
    });
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data.products || res.data)).catch(console.error);
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await assignStock(formData);
            setIsAssignModalOpen(false);
        } catch (err: any) { alert(err.response?.data?.message || err.message); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStock(editData._id, editData.quantity);
            setIsEditModalOpen(false);
        } catch (err: any) { alert(err.response?.data?.message || err.message); }
    };

    if (loading) return <div className="text-center p-10 mt-20"><div className="animate-spin size-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div><p>Loading Storage Matrix...</p></div>;

    const filteredLocations = locations?.filter(loc =>
        loc.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.warehouseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.rack?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Storage Tracking Matrix</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Blinkit/Amazon style Micro-location tracking. Manage exact physical placement of units.</p>
                </div>
                <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition"
                >
                    <Plus className="size-4" /> Move Stock to Rack
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                    type="text"
                    placeholder="Search by Product, Warehouse, or Rack..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white outline-none"
                />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <th className="p-4">Facility</th>
                                <th className="p-4">SKU / Item</th>
                                <th className="p-4">Coordinates (Aisle/Rack/Row)</th>
                                <th className="p-4">In Shelf</th>
                                <th className="p-4 text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {filteredLocations?.map((loc) => (
                                <tr key={loc._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-medium flex items-center gap-2">
                                        <MapPin className="text-slate-400 size-4" /> {loc.warehouseName}
                                    </td>
                                    <td className="p-4 font-bold text-slate-900 dark:text-white">{loc.productName}</td>
                                    <td className="p-4 text-sm font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 inline-block rounded-md mt-2">
                                        [{loc.zoneAisle}] - [{loc.rack}] - [{loc.shelfRow}]
                                    </td>
                                    <td className="p-4">
                                        <span className={`font-bold ${loc.quantity <= 5 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {loc.quantity} <span className="text-xs font-normal text-slate-400">/ {loc.capacity} limit</span>
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-center gap-2">
                                        <button onClick={() => { setEditData(loc); setIsEditModalOpen(true); }} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition">
                                            <Edit2 className="size-4" />
                                        </button>
                                        <button onClick={() => removeStock(loc._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLocations?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No physical storage records found matching '{searchQuery}'</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals below */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-xl shadow-slate-900/20">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Allocate Physical Storage</h3>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <select required onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white">
                                    <option value="">Select Item to Store...</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Warehouse (e.g. Mumbai Hub)" value={formData.warehouseName} onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                    <input required type="text" placeholder="Zone / Aisle (e.g. Aisle 5)" value={formData.zoneAisle} onChange={(e) => setFormData({ ...formData, zoneAisle: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Rack Code (e.g. R-12)" value={formData.rack} onChange={(e) => setFormData({ ...formData, rack: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                    <input required type="text" placeholder="Shelf/Row (e.g. Row 2)" value={formData.shelfRow} onChange={(e) => setFormData({ ...formData, shelfRow: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="number" placeholder="Actual Quantity" min="0" onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                    <input required type="number" placeholder="Rack Capacity Limit" min="1" onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Dock Items</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditModalOpen && editData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-xl shadow-slate-900/20">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Update Rack Quantity</h3>
                            <p className="text-slate-500 text-sm mb-4">Tracking <strong className="text-slate-800 dark:text-slate-300">{editData.productName}</strong> in <strong>{editData.rack}</strong></p>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Set New Physical Count</label>
                                <input required type="number" min="0" value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                <div className="flex gap-3 justify-end mt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Count</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
