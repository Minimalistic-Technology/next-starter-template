
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function DynamicRoutesView(props: any) {
  const { stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
  return (
    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Activity className="size-6 text-teal-500" /> System Routing Engine</h1>
                                    <p className="text-sm text-slate-500 mt-1">Manage global system endpoints and application features.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingRoute(null);
                                        setNewRoute({ path: "", name: "", description: "", isActive: true });
                                        setIsAddRouteModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
                                >
                                    <Plus className="size-4" /> Mount Endpoint
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Status</th>
                                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">System Label</th>
                                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Network Pattern</th>
                                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Purpose</th>
                                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {routes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-500">No active system routes parsed. Mount an endpoint to begin.</td>
                                            </tr>
                                        ) : (
                                            routes.map((route) => (
                                                <tr key={route._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${!route.isActive ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() => handleToggleRoute(route)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${route.isActive ? 'bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' : 'bg-red-100/50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'}`}
                                                        >
                                                            <Power className="size-3.5" /> {route.isActive ? 'ONLINE' : 'OFFLINE'}
                                                        </button>
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-900 dark:text-slate-200">{route.name}</td>
                                                    <td className="p-4">
                                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-mono text-sm text-teal-600 dark:text-teal-400">{route.path}</span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{route.description || <span className="italic opacity-50">Core system endpoint</span>}</td>
                                                    <td className="p-4 flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => {
                                                                setEditingRoute(route);
                                                                setNewRoute({ path: route.path, name: route.name, description: route.description, isActive: route.isActive });
                                                                setIsEditRouteModalOpen(true);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition"
                                                        >
                                                            <Edit className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRoute(route._id || "")}
                                                            disabled={route.path === '/admin'}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </>
  );
}
