import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Network, Plus, MapPin, Building2, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HubManagerView({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
    const [hubs, setHubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "", code: "", address: "", city: "", pincodes: "", contactPhone: "", contactEmail: ""
    });

    const fetchHubs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/hubs');
            setHubs(res.data);
        } catch (err: any) { showToast(err.response?.data?.message || 'Failed to fetch hubs', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchHubs(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/hubs', formData);
            showToast("Physical Fulfillment Hub successfully mapped!", "success");
            setIsMenuOpen(false);
            setFormData({ name: "", code: "", address: "", city: "", pincodes: "", contactPhone: "", contactEmail: "" });
            fetchHubs();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to map hub', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("WARNING: Destroying a literal physical hub entry? Are you sure?")) return;
        try {
            await api.delete(`/hubs/${id}`);
            showToast("Hub offline.", "success");
            fetchHubs();
        } catch (err: any) { showToast(err.response?.data?.message || 'Failed', 'error'); }
    };

    if (loading) return <div className="text-center p-10"><div className="animate-spin size-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Network className="text-indigo-500" /> Fulfillment Hub Network</h2>
                    <p className="text-slate-500 mt-1">Manage physical dark stores, assigning their operating radius (pincodes) and staff.</p>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                    <Plus className="size-4" /> Establish New Hub
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hubs.map(hub => (
                    <motion.div key={hub._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative hover:border-indigo-200 dark:hover:border-indigo-900/50 transition group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => handleDelete(hub._id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="size-4" /></button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{hub.name}</h3>
                                <p className="text-xs text-indigo-600 font-mono font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md inline-block mt-0.5">{hub.code}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <p className="flex items-start gap-2"><MapPin className="size-4 shrink-0 text-slate-400 mt-0.5" /> {hub.address}, {hub.city}</p>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Serviceable Pincodes ({hub.pincodes.length})</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {hub.pincodes.slice(0, 6).map((pin: string) => <span key={pin} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-medium">{pin}</span>)}
                                    {hub.pincodes.length > 6 && <span className="text-xs font-bold text-slate-400">+{hub.pincodes.length - 6} more</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Initialize Facility Array</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">Hub Name</label><input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Gurugram Ultra-Hub" className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" /></div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">System Code</label><input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. GGM-01" className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-mono" /></div>
                                </div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Physical Address</label><input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full building address" className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">City</label><input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City name" className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" /></div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label><input type="text" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} placeholder="Manager Phone" className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white" /></div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Serviceable Pincodes (Comma separated)</label>
                                    <textarea required value={formData.pincodes} onChange={e => setFormData({ ...formData, pincodes: e.target.value })} placeholder="110001, 110002, 110005" rows={2} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white resize-none" />
                                    <p className="text-xs text-slate-400 mt-1">If a customer's location matches one of these pincodes, they will be shown inventory strictly from this Hub.</p>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsMenuOpen(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition">Save & Deploy Hub</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
