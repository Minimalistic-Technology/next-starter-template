import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number; // Positive for profit, negative for loss
    trendLabel?: string;
}

export default function StatCard({ title, value, icon, trend, trendLabel }: StatCardProps) {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm relative overflow-hidden"
        >
            {/* Subtle glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                    {icon}
                </div>
            </div>

            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{value}</h2>
            </div>

            {(trend !== undefined || trendLabel) && (
                <div className="flex items-center gap-1.5 mt-2">
                    {trend !== undefined && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${isPositive ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                            }`}>
                            {isPositive ? '+' : ''}{trend}%
                        </span>
                    )}
                    {trendLabel && <span className="text-xs text-slate-500 dark:text-slate-400">{trendLabel}</span>}
                </div>
            )}
        </motion.div>
    );
}
