
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function OrdersView(props: any) {
  const { stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
  return (
    <>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Management</h2>
                                <span className="text-sm text-slate-500">{ordersList.length} Total Orders</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                                        <tr>
                                            <th className="p-4">Order ID / Date</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {ordersList.map(order => (
                                            <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                <td className="p-4">
                                                    <div className="font-mono text-xs uppercase text-slate-900 dark:text-white">#{order._id.slice(-8)}</div>
                                                    <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{order.shippingInfo?.fullName || "Guest"}</div>
                                                    <div className="text-xs text-slate-400">{order.user?.email || 'Guest'}</div>
                                                </td>
                                                <td className="p-4 text-slate-900 dark:text-white font-bold">₹{order.totalAmount.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                        className={`text-xs font-bold rounded-lg px-2 py-1 outline-none border-none cursor-pointer
                                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}
                                                    >
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="p-4 text-right flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditOrderClick(order)}
                                                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                                        title="Edit Order"
                                                    >
                                                        <Edit className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setViewingOrder(order)}
                                                        className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Layers className="size-4" />
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
