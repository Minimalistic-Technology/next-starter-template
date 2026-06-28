"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { Loader2, DollarSign, FileText, ChevronLeft, ChevronRight, Activity, TrendingUp, Receipt, Users } from "lucide-react";
import AccountantDashboardView from "./components/AccountantDashboardView";
import ExpensesView from "./components/ExpensesView";
import LedgerView from "./components/LedgerView";
import UserFinancialsView from "./components/UserFinancialsView";
import ProductEconomicsView from "./components/ProductEconomicsView";

// Force TS re-evaluation
const AccountantDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    type ViewType = 'dashboard' | 'expenses' | 'ledger' | 'customers' | 'products';
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            // Strict role guard: only accountant, admin or super_admin
            if (!user) {
                router.push("/login");
            } else if (!['accountant', 'finance', 'admin', 'super_admin'].includes(user.role)) {
                router.push("/");
            }
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="animate-spin text-teal-600 size-10" />
            </div>
        );
    }

    if (!['accountant', 'finance', 'admin', 'super_admin'].includes(user.role)) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen pt-24 transition-all duration-300 bg-white border-r border-slate-200 dark:bg-slate-800 dark:border-slate-700 ${isSidebarCollapsed ? 'w-20' : 'w-64'} -translate-x-full md:translate-x-0`} aria-label="Sidebar">
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-50 text-slate-500"
                >
                    {isSidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                </button>

                <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-slate-800 scrollbar-hide">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center p-2 rounded-lg group ${activeView === 'dashboard' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                                <Activity className="size-5 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                {!isSidebarCollapsed && <span className="ms-3">Financial Overview</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('expenses')}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${activeView === 'expenses' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 font-semibold' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
                            >
                                <Receipt className="size-5" />
                                {!isSidebarCollapsed && <span>Operating Expenses</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('customers')}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${activeView === 'customers' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 font-semibold' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
                            >
                                <Users className="size-5" />
                                {!isSidebarCollapsed && <span>Customer Financials</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('products')}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${activeView === 'products' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 font-semibold' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
                            >
                                <TrendingUp className="size-5" />
                                {!isSidebarCollapsed && <span>Product Profitability</span>}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveView('ledger')} className={`w-full flex items-center p-2 rounded-lg group ${activeView === 'ledger' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                                <FileText className="size-5 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                {!isSidebarCollapsed && <span className="ms-3">General Ledger</span>}
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 min-h-screen w-full ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="w-full pt-24 px-4 md:px-8 pb-10">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Render active view component */}
                        {activeView === 'dashboard' && <AccountantDashboardView />}
                        {activeView === 'expenses' && <ExpensesView />}
                        {activeView === 'ledger' && <LedgerView />}
                        {activeView === 'customers' && <UserFinancialsView />}
                        {activeView === 'products' && <ProductEconomicsView />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountantDashboard;
