"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { useAdminState } from "./hooks/useAdminState";
import AdminSidebar from "./components/AdminSidebar";
import CategoriesView from "./components/CategoriesView";
import DashboardView from "./components/DashboardView";
import UsersView from "./components/UsersView";
import ProductsView from "./components/ProductsView";
import InventoryView from "./components/InventoryView";
import OrdersView from "./components/OrdersView";
import MessagesView from "./components/MessagesView";
import BlogsView from "./components/BlogsView";
import CouponsView from "./components/CouponsView";
import SettingsView from "./components/SettingsView";
import DynamicRoutesView from "./components/DynamicRoutesView";

export default function AdminDashboard() {
    const state = useAdminState();
    const {
        user, authLoading, loadingStats,
        activeView, isSidebarCollapsed, setIsSidebarCollapsed, handleViewChange,
    } = state;

    if (authLoading || !user || loadingStats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="animate-spin text-teal-600 size-10" />
            </div>
        );
    }

    if (user.role !== "admin") return null;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar
                activeView={activeView}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                handleViewChange={handleViewChange}
            />

            <main className={`flex-1 p-8 pt-24 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Welcome back, {user.firstName || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Admin'}.
                        </p>
                    </div>

                    {activeView === 'dashboard' && <DashboardView {...state} />}
                    {activeView === 'users' && <UsersView {...state} />}
                    {activeView === 'products' && <ProductsView {...state} />}
                    {activeView === 'inventory' && <InventoryView {...state} />}
                    {activeView === 'orders' && <OrdersView {...state} />}
                    {activeView === 'messages' && <MessagesView {...state} />}
                    {activeView === 'blogs' && <BlogsView {...state} />}
                    {activeView === 'categories' && <CategoriesView />}
                    {activeView === 'coupons' && <CouponsView {...state} />}
                    {activeView === 'settings' && <SettingsView {...state} />}
                    {activeView === 'dynamic_routes' && <DynamicRoutesView {...state} />}
                </div>
            </main>
        </div>
    );
}
