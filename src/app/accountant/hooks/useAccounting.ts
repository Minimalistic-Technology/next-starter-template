import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useAccounting() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [cashflowChart, setCashflowChart] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [ledger, setLedger] = useState<any[]>([]);
    const [productEconomics, setProductEconomics] = useState<any[]>([]);
    const [userFinancials, setUserFinancials] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await api.get('/accounting/dashboard');
            setStats(res.data.stats);
            setCashflowChart(res.data.cashflowChart);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        }
    }, []);

    const fetchExpenses = useCallback(async () => {
        try {
            const res = await api.get('/accounting/expenses');
            setExpenses(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load expenses');
        }
    }, []);

    const fetchLedger = useCallback(async () => {
        try {
            const res = await api.get('/accounting/ledger');
            setLedger(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load ledger');
        }
    }, []);

    const fetchAnalytics = useCallback(async () => {
        try {
            const [pRes, uRes] = await Promise.all([
                api.get('/accounting/product-economics'),
                api.get('/accounting/user-financials')
            ]);
            setProductEconomics(pRes.data);
            setUserFinancials(uRes.data);
        } catch (err: any) {
            setError('Failed to load advanced analytics');
        }
    }, []);

    const init = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchDashboard(), fetchExpenses(), fetchLedger(), fetchAnalytics()]);
        setLoading(false);
    }, [fetchDashboard, fetchExpenses, fetchLedger, fetchAnalytics]);

    useEffect(() => {
        init();
    }, [init]);

    const addExpense = async (data: any) => {
        const res = await api.post('/accounting/expenses', data);
        await fetchExpenses();
        await fetchDashboard();
        await fetchLedger();
        return res.data;
    };

    const deleteExpense = async (id: string) => {
        await api.delete(`/accounting/expenses/${id}`);
        await fetchExpenses();
        await fetchDashboard();
        await fetchLedger();
    };

    return {
        loading,
        stats,
        cashflowChart,
        expenses,
        ledger,
        productEconomics,
        userFinancials,
        error,
        addExpense,
        deleteExpense,
        refresh: init
    };
}
