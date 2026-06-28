import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { RefreshCcw, Send, CheckCircle, PackageOpen, XCircle, Search, ArrowRight, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function WarehouseTransfersView() {
    const { transfers, requestTransfer, processTransfer, getAvailability, loading, error } = useInventory();
    const [products, setProducts] = useState<any[]>([]);

    // Modal & Form states
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [availability, setAvailability] = useState<any[]>([]);

    const [reqForm, setReqForm] = useState({ fromWarehouse: "", toWarehouse: "Main Hub", quantity: 1, notes: "" });
    const [recvForm, setRecvForm] = useState({ zoneAisle: "", rack: "", shelfRow: "", capacity: 100 });
    const [receivingTransfer, setReceivingTransfer] = useState<any>(null);

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data.products || res.data)).catch(console.error);
    }, []);

    const handleProductSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pId = e.target.value;
        const p = products.find(prod => prod._id === pId);
        setSelectedProduct(p);
        if (pId) {
            const avail = await getAvailability(pId);
            setAvailability(avail);
            if (avail.length > 0) setReqForm({ ...reqForm, fromWarehouse: avail[0].warehouse });
        } else {
            setAvailability([]);
        }
    }

    const submitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestTransfer({
                product: selectedProduct._id,
                productName: selectedProduct.name,
                fromWarehouse: reqForm.fromWarehouse,
                toWarehouse: reqForm.toWarehouse,
                quantity: reqForm.quantity,
                notes: reqForm.notes
            });
            setIsRequestModalOpen(false);
            alert("Transfer Request Sent successfully!");
        } catch (err: any) { alert(err.response?.data?.message || err.message); }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await processTransfer(id, { status });
        } catch (err: any) { alert(err.response?.data?.message || err.message); }
    }

    const completeReceive = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await processTransfer(receivingTransfer._id, {
                status: 'completed',
                rackAssignment: recvForm
            });
            setIsReceiveModalOpen(false);
            alert("Stock physically transferred and Rack allocated!");
        } catch (err: any) { alert(err.response?.data?.message || err.message); }
    }

    if (loading) return <div className="text-center p-10"><div className="animate-spin size-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div><p>Loading Inter-Warehouse Links...</p></div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inter-Warehouse Logistics</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage stock transfers between fulfillment centers and micro-hubs.</p>
                </div>
                <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition"
                >
                    <Send className="size-4" /> Request Stock Drop
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <th className="p-4">SKU / Item</th>
                                <th className="p-4 text-emerald-600">Route</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Dispatch Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {transfers?.map((tr) => (
                                <tr key={tr._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate" title={tr.productName}>
                                        {tr.productName}
                                        {tr.notes && <p className="text-xs text-slate-500 font-normal mt-1">{tr.notes}</p>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm font-bold bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg w-max">
                                            <span className="text-red-500">{tr.fromWarehouse}</span>
                                            <ArrowRight className="size-4 text-slate-400" />
                                            <span className="text-teal-600">{tr.toWarehouse}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-black">{tr.quantity}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-max ${tr.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                tr.status === 'in_transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                    tr.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                            }`}>
                                            {tr.status === 'completed' && <CheckCircle className="size-3.5" />}
                                            {tr.status === 'in_transit' && <Truck className="size-3.5" />}
                                            {tr.status === 'pending' && <RefreshCcw className="size-3.5 animate-spin-slow" />}
                                            {tr.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-center gap-2">
                                        {tr.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateStatus(tr._id, 'in_transit')} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 rounded-lg text-xs font-bold transition">Ship Transfer</button>
                                                <button onClick={() => updateStatus(tr._id, 'rejected')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 rounded-lg text-xs font-bold transition">Reject</button>
                                            </>
                                        )}
                                        {tr.status === 'in_transit' && (
                                            <button onClick={() => { setReceivingTransfer(tr); setIsReceiveModalOpen(true); }} className="px-3 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-teal-500/20">
                                                <PackageOpen className="size-3.5" /> Receive Stock
                                            </button>
                                        )}
                                        {tr.status === 'completed' && <span className="text-xs text-slate-400 font-medium">Fully Settled</span>}
                                    </td>
                                </tr>
                            ))}
                            {transfers?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No active or historical warehouse transfers.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Drop Modal */}
            <AnimatePresence>
                {isRequestModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-xl shadow-xl shadow-slate-900/20">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Send className="text-indigo-500" /> Request Hub Transfer</h3>
                            <form onSubmit={submitRequest} className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase">1. Select Product</label>
                                <select required onChange={handleProductSelect} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white">
                                    <option value="">Find Item in Catalog...</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>

                                {selectedProduct && (
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Global Network Availability</label>
                                        {availability.length > 0 ? (
                                            <div className="space-y-2">
                                                {availability.map(a => (
                                                    <div key={a.warehouse} className="flex justify-between items-center text-sm font-medium">
                                                        <span className="text-slate-700 dark:text-slate-300">{a.warehouse}</span>
                                                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">{a.availableStock} in stock</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-red-500">Global stock empty. No warehouse can fulfill this.</p>}
                                    </div>
                                )}

                                {availability.length > 0 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Requesting From</label>
                                                <select required value={reqForm.fromWarehouse} onChange={(e) => setReqForm({ ...reqForm, fromWarehouse: e.target.value })} className="w-full p-3 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white">
                                                    {availability.map(a => <option key={a.warehouse} value={a.warehouse}>{a.warehouse} ({a.availableStock})</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Delivering To (My Hub)</label>
                                                <input required type="text" value={reqForm.toWarehouse} onChange={(e) => setReqForm({ ...reqForm, toWarehouse: e.target.value })} placeholder="Receiving Hub Name" className="w-full p-3 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <input required type="number" min="1" placeholder="Quantity Requested" value={reqForm.quantity} onChange={(e) => setReqForm({ ...reqForm, quantity: parseInt(e.target.value) })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                        </div>
                                        <input type="text" placeholder="Urgency Notes (Optional)" value={reqForm.notes} onChange={(e) => setReqForm({ ...reqForm, notes: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                        <div className="flex gap-3 justify-end mt-6">
                                            <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold">Cancel</button>
                                            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">Submit Request</button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Receive Stock to Rack Modal */}
            <AnimatePresence>
                {isReceiveModalOpen && receivingTransfer && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl shadow-slate-900/20">
                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white flex items-center gap-2"><PackageOpen className="text-teal-500" /> Scan / Receive Transfer</h3>
                            <p className="text-sm text-slate-500 mb-5">Assigning <strong>{receivingTransfer.quantity}x {receivingTransfer.productName}</strong> to a physical rack in <strong>{receivingTransfer.toWarehouse}</strong>.</p>
                            <form onSubmit={completeReceive} className="space-y-4">
                                <input required type="text" placeholder="Zone / Aisle (e.g. Aisle 5)" value={recvForm.zoneAisle} onChange={(e) => setRecvForm({ ...recvForm, zoneAisle: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Rack Code" value={recvForm.rack} onChange={(e) => setRecvForm({ ...recvForm, rack: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                    <input required type="text" placeholder="Shelf Level" value={recvForm.shelfRow} onChange={(e) => setRecvForm({ ...recvForm, shelfRow: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Rack Max Capacity</label>
                                    <input required type="number" min="1" value={recvForm.capacity} onChange={(e) => setRecvForm({ ...recvForm, capacity: parseInt(e.target.value) })} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button type="button" onClick={() => setIsReceiveModalOpen(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700">Receive & Allocate</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
