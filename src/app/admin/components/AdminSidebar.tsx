"use client";
import { ChevronLeft, ChevronRight, Layers, Folder, Package, ShoppingBag, Users, Mail, Ticket, Edit, Settings, Activity } from "lucide-react";

interface Props {
    activeView: string;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (v: boolean) => void;
    handleViewChange: (v: string) => void;
}

const NAV = [
    { key: 'dashboard', label: 'Overview', Icon: Layers },
    { key: 'categories', label: 'Categories', Icon: Folder },
    { key: 'products', label: 'Products', Icon: Package },
    { key: 'inventory', label: 'Inventory', Icon: Layers },
    { key: 'orders', label: 'Orders', Icon: ShoppingBag },
    { key: 'users', label: 'User & Staff', Icon: Users },
    { key: 'messages', label: 'Messages', Icon: Mail },
    { key: 'coupons', label: 'Coupons', Icon: Ticket },
    { key: 'blogs', label: 'Blogs', Icon: Edit },
    { key: 'settings', label: 'Site Settings', Icon: Settings },
    { key: 'dynamic_routes', label: 'Dynamic Routes', Icon: Activity },
];

export default function AdminSidebar({ activeView, isSidebarCollapsed, setIsSidebarCollapsed, handleViewChange }: Props) {
    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen pt-24 transition-all duration-300 bg-white border-r border-slate-200 dark:bg-slate-800 dark:border-slate-700 ${isSidebarCollapsed ? 'w-20' : 'w-64'} -translate-x-full md:translate-x-0`}>
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute -right-3 top-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-50 text-slate-500"
            >
                {isSidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
            <div className="h-full px-3 py-4 overflow-y-auto scrollbar-hide">
                <ul className="space-y-2 font-medium">
                    {NAV.map(({ key, label, Icon }) => (
                        <li key={key}>
                            <button
                                onClick={() => handleViewChange(key)}
                                className={`w-full flex items-center p-2 rounded-lg group ${activeView === key ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            >
                                <Icon className="size-5 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                {!isSidebarCollapsed && <span className="ms-3">{label}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
