
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function BlogsView(props: any) {
  const { stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
  return (
    <>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Blogs</h2>
                                <button onClick={() => setIsAddBlogModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors">
                                    <Plus className="size-4" /> Add Blog
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                {loadingData ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="animate-spin text-teal-600 size-10" />
                                    </div>
                                ) : blogsList.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Edit className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 text-lg">No blogs yet</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Create your first blog post to get started</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                                            <tr>
                                                <th className="p-4">Title</th>
                                                <th className="p-4">Author</th>
                                                <th className="p-4">Slug</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {blogsList.map(blog => (
                                                <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                    <td className="p-4">
                                                        <div className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-xs">{blog.title}</div>
                                                        {blog.tags && blog.tags.length > 0 && (
                                                            <div className="flex gap-1 mt-1">
                                                                {blog.tags.slice(0, 2).map((tag, idx) => (
                                                                    <span key={idx} className="text-xs px-2 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-slate-600 dark:text-slate-400">{blog.author}</td>
                                                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-sm">{blog.slug}</td>
                                                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-right flex justify-end items-center gap-2">
                                                        <button
                                                            onClick={() => { setEditingBlog(blog); setIsEditBlogModalOpen(true); }}
                                                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                                            title="Edit Blog"
                                                        >
                                                            <Edit className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBlog(blog._id)}
                                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                            title="Delete Blog"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </>
  );
}
