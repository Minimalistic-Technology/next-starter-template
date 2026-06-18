// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function UsersView(props: any) {
    const { loadingData, stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white shrink-0">Account Management</h2>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                            <button
                                onClick={() => setUserTabMode('customers')}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${userTabMode === 'customers'
                                    ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Users className="size-4" /> Customers
                            </button>
                            <button
                                onClick={() => setUserTabMode('staff')}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${userTabMode === 'staff'
                                    ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Shield className="size-4" /> Staff Members
                            </button>
                        </div>
                    </div>
                    <button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors shrink-0">
                        <Plus className="size-4" /> Add {userTabMode === 'customers' ? 'User' : 'Staff'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                {userTabMode === 'customers' && <th className="p-4">Credit</th>}
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {usersList
                                .filter(u => userTabMode === 'customers' ? u.role === 'user' : u.role !== 'user')
                                .map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">{u.firstName ? `${u.firstName} ${u.lastName || ''}` : (u.name || u.email.split('@')[0])}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {userTabMode === 'customers' && (
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    <Coins className="size-3.5 text-amber-500" />
                                                    {u.creditBalance || 0}
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-4 text-right flex justify-end items-center gap-2">
                                            <ToggleSwitch isOn={u.isActive} onToggle={() => toggleUserStatus(u._id, u.isActive)} />
                                            <button onClick={() => handleEditUserClick(u)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                                                <Edit className="size-4" />
                                            </button>
                                            <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
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
