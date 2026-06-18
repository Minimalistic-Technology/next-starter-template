
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function DashboardView(props: any) {
  const { stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
  return (
    <>
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    title="Total Users"
                                    value={stats?.users || 0}
                                    icon={<Users className="size-6 text-blue-600" />}
                                    bg="bg-blue-50 dark:bg-blue-900/20"
                                />
                                <StatCard
                                    title="Total Products"
                                    value={stats?.products || 0}
                                    icon={<Package className="size-6 text-teal-600" />}
                                    bg="bg-teal-50 dark:bg-teal-900/20"
                                />
                                <StatCard
                                    title="Total Orders"
                                    value={stats?.orders || 0}
                                    icon={<ShoppingBag className="size-6 text-purple-600" />}
                                    bg="bg-purple-50 dark:bg-purple-900/20"
                                />
                                <StatCard
                                    title="Total Revenue"
                                    value={`₹${(stats?.revenue || 0).toLocaleString()}`}
                                    icon={<DollarSign className="size-6 text-green-600" />}
                                    bg="bg-green-50 dark:bg-green-900/20"
                                />
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
                                    <div className="space-y-4">
                                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                            stats.recentActivity.map((order) => (
                                                <div key={order._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <div className="size-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                                                        <ShoppingBag className="size-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-900 dark:text-white">Order placed by {order.shippingInfo?.fullName || "Guest"}</p>
                                                        <p className="text-sm text-slate-500">
                                                            ₹{order.totalAmount.toFixed(2)} - {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500">No recent activity.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => handleViewChange('products')} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group">
                                            <Package className="size-6 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium text-slate-900 dark:text-white block">Manage Products</span>
                                        </button>
                                        <button onClick={() => handleViewChange('users')} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group">
                                            <Users className="size-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium text-slate-900 dark:text-white block">Manage Users</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    </>
  );
}
