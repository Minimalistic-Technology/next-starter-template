// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function InventoryView(props: any) {
    const { loadingData, stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inventory Management</h2>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                            <div className="size-2 rounded-full bg-red-500"></div> Low Stock (&lt; 10)
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">SKU/Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-center">Current Stock</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Quick Restock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {productsList.map((p: any) => (
                                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{p.name}</div>
                                        <div className="text-xs text-slate-400 font-mono uppercase">{p._id.slice(-8)}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">
                                        {(typeof p.category === 'object' && p.category !== null) ? (p.category as any).name : p.category}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${p.stock < 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {p.stock === 0 ? (
                                            <span className="text-xs font-bold text-red-500 flex items-center justify-center gap-1"><X className="size-3" /> Out of Stock</span>
                                        ) : p.stock < 10 ? (
                                            <span className="text-xs font-bold text-orange-500 flex items-center justify-center gap-1"><Shield className="size-3" /> Reorder Soon</span>
                                        ) : (
                                            <span className="text-xs font-bold text-teal-500 flex items-center justify-center gap-1"><Shield className="size-3" /> Healthy</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={async () => {
                                                    const amount = prompt("How many units to add?");
                                                    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                                                        try {
                                                            await handleUpdateProduct(p._id, { stock: p.stock + Number(amount) });
                                                        } catch (e: any) { alert(e.response?.data?.msg || "Failed to restock"); }
                                                    }
                                                }}
                                                className="px-3 py-1 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors"
                                            >
                                                <Plus className="size-3 inline mr-1" /> Add
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const amount = prompt("How many units to remove?");
                                                    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                                                        if (Number(amount) > p.stock) {
                                                            alert("Cannot remove more than current stock");
                                                            return;
                                                        }
                                                        try {
                                                            await handleUpdateProduct(p._id, { stock: Math.max(0, p.stock - Number(amount)) });
                                                        } catch (e: any) { alert(e.response?.data?.msg || "Failed to remove stock"); }
                                                    }
                                                }}
                                                className="px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="size-3 inline mr-1" /> Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
