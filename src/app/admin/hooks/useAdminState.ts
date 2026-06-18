"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export interface RouteConfig {
    _id?: string;
    name: string;
    path: string;
    description: string;
    isActive: boolean;
}

const EMPTY_PRODUCT = { name: "", price: "", description: "", image: "", imagesInput: "", category: "", stock: "", brand: "", modelName: "", rating: "", lastMonthSales: "", couponCode: "", discountPercentage: "" };
const EMPTY_USER = { firstName: "", lastName: "", email: "", phone: "", password: "", role: "user" };
const EMPTY_COUPON: any = { code: '', discountType: 'percentage', discountValue: 0, expiresAt: '', applicableProducts: [] as string[], isActive: true };
const EMPTY_BLOG: any = { title: '', content: '', author: '', image: '', slug: '', tags: [] as string[] };

export function useAdminState() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeView, setActiveView] = useState<string>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Lists
    const [usersList, setUsersList] = useState<any[]>([]);
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [messagesList, setMessagesList] = useState<any[]>([]);
    const [couponsList, setCouponsList] = useState<any[]>([]);
    const [blogsList, setBlogsList] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [routes, setRoutes] = useState<RouteConfig[]>([]);

    // Modal/Form State
    const [userTabMode, setUserTabMode] = useState<'customers' | 'staff'>('customers');
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [viewingCoupons, setViewingCoupons] = useState<{ productName: string; coupons: any[] } | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState(EMPTY_USER);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
    const [isEditCouponModalOpen, setIsEditCouponModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [newCoupon, setNewCoupon] = useState(EMPTY_COUPON);
    const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
    const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [newBlog, setNewBlog] = useState(EMPTY_BLOG);
    const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
    const [isEditRouteModalOpen, setIsEditRouteModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<RouteConfig | null>(null);
    const [newRoute, setNewRoute] = useState({ path: "", name: "", description: "", isActive: true });

    // Auth
    useEffect(() => {
        api.get('/auth/me').then(r => setUser(r.data.data || r.data)).catch(() => setUser(null)).finally(() => setAuthLoading(false));
    }, []);
    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push("/login");
            else if (user.role !== "admin") router.push("/");
            else api.get('/admin/stats').then(r => setStats(r.data)).catch(console.error).finally(() => setLoadingStats(false));
        }
    }, [user, authLoading, router]);

    // Fetchers
    const fetch = async (url: string, setter: (d: any) => void) => {
        setLoadingData(true);
        try { const { data } = await api.get(url); setter(data); }
        catch (e) { console.error(e); }
        finally { setLoadingData(false); }
    };
    const fetchUsers = () => fetch('/admin/users', setUsersList);
    const fetchOrders = () => fetch('/orders', setOrdersList);
    const fetchMessages = () => fetch('/contact', setMessagesList);
    const fetchBlogs = () => fetch('/blogs', setBlogsList);
    const fetchCategories = () => fetch('/categories', setCategoriesList);
    const fetchSettings = async () => { try { const { data } = await api.get('/settings'); setSiteSettings(data); } catch { } };
    const refreshRoutes = () => fetch('/dynamic-routes', setRoutes);
    const fetchCoupons = async () => {
        setLoadingData(true);
        try {
            const [couponsRes, productsRes] = await Promise.all([api.get('/coupons'), api.get('/products')]);
            setCouponsList(couponsRes.data); setProductsList(productsRes.data);
        } catch { } finally { setLoadingData(false); }
    };
    const fetchProducts = async () => {
        setLoadingData(true);
        try {
            const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/coupons')]);
            const coupons = cRes.data;
            setProductsList(pRes.data.map((p: any) => ({ ...p, couponDetails: coupons.filter((c: any) => c.type === 'product' && c.isActive && c.applicableProducts?.some((ap: any) => ap._id === p._id || ap === p._id)) })));
        } catch { } finally { setLoadingData(false); }
    };

    const handleViewChange = (view: string) => {
        setActiveView(view);
        if (view === 'users') fetchUsers();
        if (view === 'products' || view === 'inventory') { fetchProducts(); fetchCategories(); }
        if (view === 'orders') fetchOrders();
        if (view === 'messages') fetchMessages();
        if (view === 'coupons') fetchCoupons();
        if (view === 'blogs') fetchBlogs();
        if (view === 'categories') fetchCategories();
        if (view === 'settings') fetchSettings();
    };

    useEffect(() => { refreshRoutes(); }, []);

    // Handlers: Products
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try {
            const imgs = newProduct.imagesInput.split(',').map(u => u.trim()).filter(Boolean);
            await api.post('/products', { ...newProduct, image: imgs[0] || "", images: imgs, price: Number(newProduct.price), stock: Number(newProduct.stock), rating: Number(newProduct.rating) || 0, lastMonthSales: Number(newProduct.lastMonthSales) || 0, discountPercentage: Number(newProduct.discountPercentage) || 0 });
            fetchProducts(); setIsAddModalOpen(false); setNewProduct(EMPTY_PRODUCT); alert("Product Added!");
        } catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleEditClick = (p: any) => {
        const imgs = p.images?.length > 0 ? p.images.join(', ') : p.image;
        setEditingProduct({ ...p, price: String(p.price), stock: String(p.stock), imagesInput: imgs || "", category: typeof p.category === 'object' ? p.category._id : p.category, rating: String(p.rating || 0), lastMonthSales: String(p.lastMonthSales || 0), discountPercentage: String(p.discountPercentage || 0) });
        setIsEditModalOpen(true);
    };
    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try {
            const imgs = editingProduct.imagesInput.split(',').map((u: string) => u.trim()).filter(Boolean);
            await api.put(`/products/${editingProduct._id}`, { ...editingProduct, image: imgs[0] || editingProduct.image, images: imgs, price: Number(editingProduct.price), stock: Number(editingProduct.stock), rating: Number(editingProduct.rating), lastMonthSales: Number(editingProduct.lastMonthSales), discountPercentage: Number(editingProduct.discountPercentage) || 0 });
            fetchProducts(); setIsEditModalOpen(false); setEditingProduct(null); alert("Product Updated!");
        } catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleDeleteProduct = async (id: string) => { if (!confirm("Delete?")) return; await api.delete(`/products/${id}`); fetchProducts(); };
    const toggleProductStatus = async (id: string, cur: boolean) => { try { await api.put(`/products/${id}/status`); setProductsList(p => p.map(x => x._id === id ? { ...x, isActive: !cur } : x)); } catch { alert("Failed"); } };

    // Handlers: Users
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try { await api.post('/auth/create-user', newUser); fetchUsers(); setIsAddUserModalOpen(false); setNewUser(EMPTY_USER); alert("User created!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleEditUserClick = (u: any) => { const { password, ...rest } = u; setEditingUser(rest); setIsEditUserModalOpen(true); };
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try { const p = { ...editingUser }; if (!p.password) delete p.password; await api.put(`/auth/users/${editingUser._id}`, p); fetchUsers(); setIsEditUserModalOpen(false); setEditingUser(null); alert("User updated!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleDeleteUser = async (id: string) => { if (!confirm("Delete?")) return; await api.delete(`/admin/users/${id}`); fetchUsers(); };
    const toggleUserStatus = async (id: string, cur: boolean) => { try { await api.put(`/auth/users/${id}/status`); setUsersList(p => p.map(u => u._id === id ? { ...u, isActive: !cur } : u)); } catch { alert("Failed"); } };

    // Handlers: Orders
    const handleEditOrderClick = (o: any) => { setEditingOrder({ ...o, fullName: o.shippingInfo?.fullName || "", address: o.shippingInfo?.address || "", city: o.shippingInfo?.city || "", pincode: o.shippingInfo?.pincode || o.shippingInfo?.zip || "", phone: o.shippingInfo?.phone || "" }); setIsEditOrderModalOpen(true); };
    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try { const res = await api.put(`/orders/${editingOrder._id}`, { status: editingOrder.status, shippingInfo: { fullName: editingOrder.fullName, address: editingOrder.address, city: editingOrder.city, pincode: editingOrder.pincode, phone: editingOrder.phone } }); setOrdersList(p => p.map(o => o._id === editingOrder._id ? res.data : o)); setIsEditOrderModalOpen(false); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleUpdateOrderStatus = async (id: string, status: string) => { try { await api.put(`/orders/${id}/status`, { status }); setOrdersList(p => p.map(o => o._id === id ? { ...o, status } : o)); } catch (e: any) { alert(e.response?.data?.msg || "Failed"); } };
    const handleDeleteOrder = async (id: string) => { if (!confirm("Delete?")) return; try { await api.delete(`/orders/${id}`); setOrdersList(p => p.filter(o => o._id !== id)); } catch (e: any) { alert(e.response?.data?.msg || "Failed"); } };

    // Handlers: Coupons
    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try { const { data } = await api.post('/coupons', newCoupon); setCouponsList(p => [...p, data]); setIsAddCouponModalOpen(false); setNewCoupon(EMPTY_COUPON); alert("Coupon created!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleUpdateCoupon = async (e: React.FormEvent) => {
        e.preventDefault(); if (!editingCoupon) return; setIsSubmitting(true);
        try { const { data } = await api.put(`/coupons/${editingCoupon._id}`, editingCoupon); setCouponsList(p => p.map(c => c._id === editingCoupon._id ? data : c)); setIsEditCouponModalOpen(false); setEditingCoupon(null); alert("Coupon updated!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleDeleteCoupon = async (id: string) => { if (!confirm("Delete?")) return; try { await api.delete(`/coupons/${id}`); setCouponsList(p => p.filter(c => c._id !== id)); } catch { alert("Failed"); } };
    const toggleCouponStatus = async (id: string, cur: boolean) => { try { await api.put(`/coupons/${id}`, { isActive: !cur }); setCouponsList(p => p.map(c => c._id === id ? { ...c, isActive: !cur } : c)); } catch { alert("Failed"); } };

    // Handlers: Blogs
    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try { const { data } = await api.post('/blogs', newBlog); setBlogsList(p => [data, ...p]); setIsAddBlogModalOpen(false); setNewBlog(EMPTY_BLOG); alert("Blog created!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleUpdateBlog = async (e: React.FormEvent) => {
        e.preventDefault(); if (!editingBlog) return; setIsSubmitting(true);
        try { const { data } = await api.put(`/blogs/${editingBlog._id}`, editingBlog); setBlogsList(p => p.map(b => b._id === editingBlog._id ? data : b)); setIsEditBlogModalOpen(false); setEditingBlog(null); alert("Blog updated!"); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); } finally { setIsSubmitting(false); }
    };
    const handleDeleteBlog = async (id: string) => { if (!confirm("Delete?")) return; try { await api.delete(`/blogs/${id}`); setBlogsList(p => p.filter(b => b._id !== id)); alert("Blog deleted!"); } catch { alert("Failed"); } };

    // Handlers: Settings
    const toggleSettingComponent = async (key: string, cur: boolean) => {
        if (!siteSettings) return;
        try { const res = await api.put('/settings', { components: { ...siteSettings.components, [key]: !cur } }); setSiteSettings(res.data); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); }
    };

    // Handlers: Dynamic Routes
    const handleAddRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        try { await api.post('/dynamic-routes', newRoute); setIsAddRouteModalOpen(false); setNewRoute({ path: "", name: "", description: "", isActive: true }); refreshRoutes(); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); }
    };
    const handleEditRoute = async (e: React.FormEvent) => {
        e.preventDefault(); if (!editingRoute) return;
        try { await api.put(`/dynamic-routes/${editingRoute._id}`, newRoute); setIsEditRouteModalOpen(false); refreshRoutes(); }
        catch (e: any) { alert(e.response?.data?.msg || "Failed"); }
    };
    const handleDeleteRoute = async (id: string) => { if (!confirm("Delete?")) return; try { await api.delete(`/dynamic-routes/${id}`); refreshRoutes(); } catch { alert("Failed"); } };
    const handleToggleRoute = async (route: RouteConfig) => { try { await api.put(`/dynamic-routes/${route._id}`, { isActive: !route.isActive }); refreshRoutes(); } catch { alert("Failed"); } };

    return {
        // Auth & Loading
        user, authLoading, loadingStats, loadingData, isSubmitting,
        // Navigation
        activeView, isSidebarCollapsed, setIsSidebarCollapsed, handleViewChange,
        // Lists
        stats, usersList, ordersList, messagesList, couponsList, blogsList, productsList, categoriesList, routes, siteSettings,
        // UI Mode
        userTabMode, setUserTabMode,
        // Product Modal
        isAddModalOpen, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen,
        newProduct, setNewProduct, editingProduct, setEditingProduct,
        viewingCoupons, setViewingCoupons,
        handleAddProduct, handleEditClick, handleUpdateProduct, handleDeleteProduct, toggleProductStatus,
        // User Modal
        isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser,
        isEditUserModalOpen, setIsEditUserModalOpen, editingUser, setEditingUser,
        handleCreateUser, handleEditUserClick, handleUpdateUser, handleDeleteUser, toggleUserStatus,
        // Order Modal
        isEditOrderModalOpen, setIsEditOrderModalOpen, editingOrder, setEditingOrder,
        viewingOrder, setViewingOrder,
        handleEditOrderClick, handleUpdateOrder, handleUpdateOrderStatus, handleDeleteOrder,
        // Coupon Modal
        isAddCouponModalOpen, setIsAddCouponModalOpen, isEditCouponModalOpen, setIsEditCouponModalOpen,
        editingCoupon, setEditingCoupon, newCoupon, setNewCoupon,
        handleCreateCoupon, handleUpdateCoupon, handleDeleteCoupon, toggleCouponStatus,
        // Blog Modal
        isAddBlogModalOpen, setIsAddBlogModalOpen, isEditBlogModalOpen, setIsEditBlogModalOpen,
        editingBlog, setEditingBlog, newBlog, setNewBlog,
        handleCreateBlog, handleUpdateBlog, handleDeleteBlog,
        // Settings
        toggleSettingComponent,
        // Routes Modal
        isAddRouteModalOpen, setIsAddRouteModalOpen, isEditRouteModalOpen, setIsEditRouteModalOpen,
        editingRoute, setEditingRoute, newRoute, setNewRoute,
        handleAddRoute, handleEditRoute, handleDeleteRoute, handleToggleRoute, refreshRoutes,
    };
}
