import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useInventory() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [alerts, setAlerts] = useState<any>({ lowStock: [], overCapacity: [], unassignedProducts: [] });
    const [locations, setLocations] = useState<any[]>([]);
    const [transfers, setTransfers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await api.get('/inventory/dashboard');
            setStats(res.data.stats);
            setAlerts(res.data.alerts);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load inventory dashboard');
        }
    }, []);

    const fetchLocations = useCallback(async () => {
        try {
            const res = await api.get('/inventory/locations');
            setLocations(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load stock locations');
        }
    }, []);

    const fetchTransfers = useCallback(async () => {
        try {
            const res = await api.get('/inventory/transfers');
            setTransfers(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load transfers');
        }
    }, [])

    const init = useCallback(async () => {
        setLoading(true);
        setError(null);
        await Promise.all([fetchDashboard(), fetchLocations(), fetchTransfers()]);
        setLoading(false);
    }, [fetchDashboard, fetchLocations, fetchTransfers]);

    useEffect(() => {
        init();
    }, [init]);

    const assignStock = async (data: any) => {
        const res = await api.post('/inventory/locations', data);
        await init();
        return res.data;
    };

    const updateStock = async (id: string, quantity: number) => {
        const res = await api.put(`/inventory/locations/${id}`, { quantity });
        await fetchLocations();
        await fetchDashboard();
        return res.data;
    };

    const removeStock = async (id: string) => {
        await api.delete(`/inventory/locations/${id}`);
        await fetchLocations();
        await fetchDashboard();
    };

    const getAvailability = async (productId: string) => {
        const res = await api.get(`/inventory/availability/${productId}`);
        return res.data;
    }

    const requestTransfer = async (data: any) => {
        const res = await api.post('/inventory/transfers', data);
        await fetchTransfers();
        return res.data;
    }

    const processTransfer = async (id: string, payload: any) => {
        const res = await api.put(`/inventory/transfers/${id}`, payload);
        await init();
        return res.data;
    }

    return {
        loading,
        stats,
        alerts,
        locations,
        transfers,
        error,
        assignStock,
        updateStock,
        removeStock,
        getAvailability,
        requestTransfer,
        processTransfer,
        refresh: init
    };
}
