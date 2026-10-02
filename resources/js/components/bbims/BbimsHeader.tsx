import React from 'react';
import {
    Droplet,
    Thermometer,
    Building2,
    Plus,
    Bell,
    CheckCircle2,
    LayoutDashboard,
    Layers,
    Users,
    Truck,
    GitCompare,
    TrendingUp,
    ShieldCheck,
    Menu,
} from 'lucide-react';
import { Facility } from './types';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    facilities: Facility[];
    selectedFacilityId: string;
    setSelectedFacilityId: (id: string) => void;
    onOpenIntakeModal: () => void;
    onOpenRequestModal: () => void;
    onOpenDonorModal: () => void;
    expiringAlertsCount: number;
    pendingRequestsCount: number;
    onToggleMobileSidebar?: () => void;
}

export const BbimsHeader: React.FC<HeaderProps> = ({
    activeTab,
    setActiveTab,
    facilities,
    selectedFacilityId,
    setSelectedFacilityId,
    onOpenIntakeModal,
    onOpenRequestModal,
    onOpenDonorModal,
    expiringAlertsCount,
    pendingRequestsCount,
    onToggleMobileSidebar,
}) => {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'inventory', label: 'Blood Inventory', icon: Layers },
        { id: 'donors', label: 'Donor Records', icon: Users },
        {
            id: 'requests',
            label: 'Hospital Orders',
            icon: Truck,
            badge: pendingRequestsCount,
        },
        { id: 'compatibility', label: 'Cross-Match Engine', icon: GitCompare },
        { id: 'ai', label: 'AI Demand Forecast', icon: TrendingUp },
        { id: 'compliance', label: 'Storage & Compliance', icon: ShieldCheck },
    ];

    const totalAlerts = expiringAlertsCount + pendingRequestsCount;

    return (
        <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0b0f19]/95 text-white shadow-2xl backdrop-blur-md">
            {/* Top Bar */}
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggler */}
                    {onToggleMobileSidebar && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
                            title="Toggle Navigation Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 shadow-lg shadow-rose-900/40">
                        <Droplet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black tracking-tight text-white">
                                Blood Bank Management
                            </h1>
                            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-400">
                                Live System
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Multi-Facility Inventory • Telemetry • AI Expiry
                            Risk
                        </p>
                    </div>
                </div>

                {/* Facility Selector & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Telemetry Status Pill */}
                    <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 lg:flex">
                        <Thermometer className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Vault 3.8°C</span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Normal
                        </span>
                    </div>

                    {/* Facility Switcher */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5">
                        <Building2 className="h-3.5 w-3.5 text-rose-400" />
                        <select
                            value={selectedFacilityId}
                            onChange={(e) =>
                                setSelectedFacilityId(e.target.value)
                            }
                            className="cursor-pointer truncate bg-transparent pr-1 text-xs font-semibold text-slate-200 focus:outline-none"
                        >
                            <option
                                value="All"
                                className="bg-slate-900 text-slate-200"
                            >
                                All Facilities (Global)
                            </option>
                            {facilities.map((fac) => (
                                <option
                                    key={fac.id}
                                    value={fac.id}
                                    className="bg-slate-900 text-slate-200"
                                >
                                    {fac.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notification Bell */}
                    <button
                        onClick={() =>
                            setActiveTab(
                                pendingRequestsCount > 0
                                    ? 'requests'
                                    : 'inventory',
                            )
                        }
                        className="relative rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-slate-300 transition hover:bg-slate-800"
                        title="Alerts"
                    >
                        <Bell className="h-4 w-4" />
                        {totalAlerts > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow">
                                {totalAlerts}
                            </span>
                        )}
                    </button>

                    {/* Action Buttons */}
                    <button
                        onClick={onOpenIntakeModal}
                        className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Intake Unit
                    </button>
                    <button
                        onClick={onOpenRequestModal}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-rose-300 transition hover:bg-slate-800 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        New Request
                    </button>
                    <button
                        onClick={onOpenDonorModal}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-800 active:scale-95"
                    >
                        <Plus className="h-4 w-4 text-blue-400" />
                        New Donor
                    </button>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="no-scrollbar overflow-x-auto border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl min-w-max items-center space-x-1 py-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                                }`}
                            >
                                <Icon
                                    className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                                />
                                <span>{item.label}</span>
                                {item.badge && item.badge > 0 ? (
                                    <span className="py-0.2 ml-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};
