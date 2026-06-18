// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, DollarSign, ShoppingBag, Loader2, Trash2, Edit, Plus, X, Tag, Image as ImageIcon, Layers, Ticket, Shield, ChevronLeft, ChevronRight, Mail, Truck, Folder, Settings, Coins, Power, Activity } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function SettingsView(props: any) {
    const { loadingData, stats, usersList, userTabMode, setUserTabMode, siteSettings, toggleSettingComponent, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isSubmitting, newProduct, setNewProduct, editingProduct, setEditingProduct, viewingCoupons, setViewingCoupons, isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser, isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder, viewingOrder, setViewingOrder, isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen, editingCoupon, setEditingCoupon, newCoupon, setNewCoupon, isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen, editingBlog, setEditingBlog, newBlog, setNewBlog, routes, isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen, editingRoute, setEditingRoute, newRoute, setNewRoute, toggleUserStatus, toggleProductStatus, toggleCouponStatus, handleDeleteCoupon, handleCreateCoupon, handleUpdateCoupon, handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleCreateUser, handleEditUserClick, handleUpdateUser, handleUpdateOrderStatus, handleEditOrderClick, handleUpdateOrder, handleDeleteOrder, handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, handleDeleteUser, handleDeleteProduct, handleAddProduct, handleEditClick, handleUpdateProduct } = props;
    return (
        <>
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings & Controls</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global application states, features, and visibility of homepage sections.</p>
                </div>

                {loadingData && !siteSettings ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="animate-spin size-8 text-teal-600" />
                    </div>
                ) : (
                    siteSettings && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Authentication Controls */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authentication & Access</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control registration and login options for the website.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <ToggleSwitch
                                            isOn={siteSettings.components.Signup !== false}
                                            onToggle={() => toggleSettingComponent('Signup', siteSettings.components.Signup !== false)}
                                            label="Allow Public Signups (Registration)"
                                            description="When disabled, new users cannot register an account. Existing accounts can still login."
                                        />
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <ToggleSwitch
                                            isOn={siteSettings.components.Login !== false}
                                            onToggle={() => toggleSettingComponent('Login', siteSettings.components.Login !== false)}
                                            label="Allow Public Logins"
                                            description="When disabled, public login is blocked (admins and staff bypass this restriction to avoid lockout)."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Home Page Sections Control */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Homepage Sections Visibility</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dynamically enable or disable major landing page features.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                    {[
                                        { key: 'Hero', label: 'Hero Banner', desc: 'Main intro banner section at the top of the homepage.' },
                                        { key: 'WhoWeAre', label: 'Who We Are', desc: 'About section describing the company and goals.' },
                                        { key: 'WhatWeOffer', label: 'What We Offer', desc: 'Listing of key services or features provided.' },
                                        { key: 'FeaturedProducts', label: 'Featured Products Slider', desc: 'Showcase highlighted products to homepage visitors.' },
                                        { key: 'ShopSection', label: 'Shop/Products Grid', desc: 'Main product list catalog layout.' },
                                        { key: 'Contact', label: 'Contact Form & Location', desc: 'Contact page form and map details.' },
                                        { key: 'Footer', label: 'Footer Bar', desc: 'Bottom navigation links and copyright information.' }
                                    ].map((section) => (
                                        <div key={section.key} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                            <ToggleSwitch
                                                isOn={siteSettings.components[section.key] !== false}
                                                onToggle={() => toggleSettingComponent(section.key, siteSettings.components[section.key] !== false)}
                                                label={section.label}
                                                description={section.desc}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}
