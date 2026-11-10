import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Droplet,
    LayoutDashboard,
    Layers,
    Users,
    Truck,
    GitCompare,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Warehouse,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    FilePlus,
    UserPlus,
    Thermometer,
    CheckCircle2,
    X,
    LogIn,
    Sun,
    Moon,
} from 'lucide-react';
import { Facility } from './types';
import { useAppearance } from '@/hooks/use-appearance';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean) => void;
    facilities?: Facility[];
    selectedFacilityId?: string;
    setSelectedFacilityId?: (id: string) => void;
    onOpenIntakeModal?: () => void;
    onOpenRequestModal?: () => void;
    onOpenDonorModal?: () => void;
    expiringAlertsCount?: number;
    pendingRequestsCount: number;
}

export const BbimsSidebarComponent: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isCollapsed,
    setIsCollapsed,
    isMobileOpen = false,
    setIsMobileOpen,
    onOpenIntakeModal,
    onOpenRequestModal,
    onOpenDonorModal,
    pendingRequestsCount,
}) => {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const navSections = [
        {
            title: 'Core Operations',
            items: [
                {
                    id: 'dashboard',
                    label: 'Overview Dashboard',
                    icon: LayoutDashboard,
                },
                { id: 'inventory', label: 'Blood Inventory', icon: Layers },
                { id: 'donors', label: 'Donor Records', icon: Users },
                {
                    id: 'requests',
                    label: 'Hospital Orders',
                    icon: Truck,
                    badge: pendingRequestsCount,
                },
            ],
        },
        {
            title: 'Clinical & AI Tools',
            items: [
                {
                    id: 'compatibility',
                    label: 'Cross-Match Engine',
                    icon: GitCompare,
                },
                { id: 'ai', label: 'AI Demand Forecast', icon: TrendingUp },
                { id: 'drives', label: 'Donation Drives', icon: Calendar },
            ],
        },
        {
            title: 'Infrastructure & Admin',
            items: [
                {
                    id: 'storage',
                    label: 'Cold Storage Equipment',
                    icon: Warehouse,
                },
                {
                    id: 'compliance',
                    label: 'Audit & Compliance',
                    icon: ShieldCheck,
                },
            ],
        },
    ];

    const handleNavClick = (id: string) => {
        setActiveTab(id);
        if (setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    const sidebarContent = (isMobile: boolean = false) => {
        const collapsedState = isCollapsed && !isMobile;

        return (
            <div className="flex h-full flex-col justify-between overflow-hidden select-none">
                {/* Top Section */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {/* Top Branding & Toggle Button */}
                    <div className="flex min-h-[68px] shrink-0 items-center justify-between border-b border-slate-800/80 p-3.5">
                        {collapsedState ? (
                            /* Collapsed View: Single centered expand button */
                            <button
                                onClick={() => setIsCollapsed(false)}
                                className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-red-400 shadow-md transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
                                title="Expand Sidebar"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            /* Expanded View: Logo + Title + Collapse Button */
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-red-600 to-red-500 shadow-lg shadow-red-900/40">
                                        <Droplet className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out">
                                        <h1 className="text-base leading-tight font-black tracking-tight text-white">
                                            BloodMatrix Portal
                                        </h1>
                                        <span className="block text-[10px] font-medium text-slate-400">
                                            Blood Bank Operations
                                        </span>
                                    </div>
                                </div>

                                {!isMobile ? (
                                    <button
                                        onClick={() => setIsCollapsed(true)}
                                        className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-95"
                                        title="Collapse Sidebar"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setIsMobileOpen &&
                                            setIsMobileOpen(false)
                                        }
                                        className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Menu Container */}
                    <nav className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-3">
                        {navSections.map((section, idx) => (
                            <div key={idx} className="space-y-1">
                                <h2
                                    className={`overflow-hidden px-3 text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-500 uppercase transition-all duration-300 ease-in-out ${
                                        collapsedState
                                            ? 'my-0 max-h-0 py-0 opacity-0'
                                            : 'my-1 max-h-6 opacity-100'
                                    }`}
                                >
                                    {section.title}
                                </h2>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() =>
                                                    handleNavClick(item.id)
                                                }
                                                title={
                                                    collapsedState
                                                        ? item.label
                                                        : undefined
                                                }
                                                className={`group relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/80 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                                                    <Icon
                                                        className={`h-4 w-4 transition-colors ${
                                                            isActive
                                                                ? 'text-white'
                                                                : 'text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200'
                                                        }`}
                                                    />
                                                </div>

                                                <span
                                                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                                                        collapsedState
                                                            ? 'pointer-events-none max-w-0 opacity-0'
                                                            : 'max-w-[160px] opacity-100'
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>

                                                {item.badge &&
                                                item.badge > 0 ? (
                                                    <span
                                                        className={`py-0.2 rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white transition-all duration-300 ${
                                                            collapsedState
                                                                ? 'absolute top-1 right-1'
                                                                : 'ml-auto'
                                                        }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                ) : null}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom Actions Footer */}
                <div className="shrink-0 space-y-2 border-t border-slate-800/80 p-3">
                    {/* Expanded Action Grid */}
                    <div
                        className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                            collapsedState
                                ? 'pointer-events-none max-h-0 opacity-0'
                                : 'max-h-40 opacity-100'
                        }`}
                    >
                        <div className="grid grid-cols-3 gap-1.5">
                            <button
                                onClick={() => {
                                    if (onOpenIntakeModal) onOpenIntakeModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl bg-red-600 p-2 text-[10px] font-bold text-white shadow transition hover:bg-red-700 active:scale-95"
                                title="Intake Blood Unit"
                            >
                                <PlusCircle className="mb-0.5 h-4 w-4" />
                                Intake
                            </button>
                            <button
                                onClick={() => {
                                    if (onOpenRequestModal)
                                        onOpenRequestModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-slate-100 p-2 text-[10px] font-bold text-red-700 transition hover:bg-slate-200 active:scale-95 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-slate-800"
                                title="New Hospital Request"
                            >
                                <FilePlus className="mb-0.5 h-4 w-4" />
                                Request
                            </button>
                            <button
                                onClick={() => {
                                    if (onOpenDonorModal) onOpenDonorModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2 text-[10px] font-bold text-blue-700 transition hover:bg-slate-200 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
                                title="Register New Donor"
                            >
                                <UserPlus className="mb-0.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
                                Donor
                            </button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100/90 px-3 py-2 text-[11px] dark:border-slate-800 dark:bg-slate-900/90">
                            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                                <Thermometer className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                                Cold Chain
                            </span>
                            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> 3.8°C
                            </span>
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-100/90 px-3 py-2 text-[11px] font-semibold text-slate-800 transition hover:bg-slate-200 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            <span className="flex items-center gap-2">
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                                ) : (
                                    <Moon className="h-3.5 w-3.5 text-slate-700" />
                                )}
                                Theme Mode
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                                {resolvedAppearance}
                            </span>
                        </button>

                        {/* Account Sign In / Sign Up */}
                        <div className="flex items-center gap-2 pt-1">
                            <Link
                                href="/login"
                                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <LogIn className="h-3 w-3 text-red-500 dark:text-red-400" />
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <UserPlus className="h-3 w-3 text-red-500 dark:text-red-400" />
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    {/* Collapsed Action Buttons */}
                    <div
                        className={`flex flex-col items-center space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                            collapsedState
                                ? 'max-h-40 opacity-100'
                                : 'pointer-events-none max-h-0 opacity-0'
                        }`}
                    >
                        <button
                            onClick={toggleTheme}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:bg-slate-800 active:scale-95"
                            title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-5 w-5 text-amber-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-slate-300" />
                            )}
                        </button>
                        <button
                            onClick={onOpenIntakeModal}
                            className="rounded-xl bg-red-600 p-2.5 text-white shadow transition hover:bg-red-700 active:scale-95"
                            title="Intake Blood Unit"
                        >
                            <PlusCircle className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onOpenRequestModal}
                            className="rounded-xl border border-red-500/30 bg-slate-900 p-2.5 text-red-300 transition hover:bg-slate-800 active:scale-95"
                            title="New Hospital Request"
                        >
                            <FilePlus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Sticky Sidebar with hardware-accelerated width transitions */}
            <aside
                className={`sticky top-0 z-40 hidden h-screen flex-col justify-between overflow-hidden border-r border-slate-200 bg-white text-slate-900 shadow-xl transition-[width] duration-300 ease-in-out will-change-[width] lg:flex dark:border-slate-800/80 dark:bg-[#0b0f19] dark:text-white dark:shadow-2xl ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {sidebarContent(false)}
            </aside>

            {/* Mobile Drawer Overlay & Backdrop */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        onClick={() =>
                            setIsMobileOpen && setIsMobileOpen(false)
                        }
                        className="fixed inset-0 animate-in bg-black/70 backdrop-blur-sm transition-opacity duration-200 fade-in"
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-72 animate-in overflow-hidden border-r border-slate-200 bg-white text-slate-900 shadow-2xl duration-300 slide-in-from-left dark:border-slate-800 dark:bg-[#0b0f19] dark:text-white">
                        {sidebarContent(true)}
                    </aside>
                </div>
            )}
        </>
    );
};

export const BbimsSidebar = React.memo(BbimsSidebarComponent);
