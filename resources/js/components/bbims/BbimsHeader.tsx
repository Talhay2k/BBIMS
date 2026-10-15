import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Droplet,
    Thermometer,
    Building2,
    Plus,
    Bell,
    CheckCircle2,
    Menu,
    LogIn,
    UserPlus,
    Sun,
    Moon,
} from 'lucide-react';
import { Facility } from './types';
import { useAppearance } from '@/hooks/use-appearance';

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
    onSwitchToLanding?: () => void;
}

export const BbimsHeader: React.FC<HeaderProps> = ({
    activeTab: _activeTab,
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
    onSwitchToLanding,
}) => {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const totalAlerts = expiringAlertsCount + pendingRequestsCount;

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f19]/95 text-slate-900 dark:text-white shadow-md dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
            {/* Top Bar */}
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggler */}
                    {onToggleMobileSidebar && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden"
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
                            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                BloodMatrix
                            </h1>
                            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                                Live System
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Multi-Facility Inventory • Telemetry • AI Expiry
                            Risk
                        </p>
                    </div>
                </div>

                {/* Facility Selector & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Telemetry Status Pill */}
                    <div className="hidden items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 lg:flex">
                        <Thermometer className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>Vault 3.8°C</span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Normal
                        </span>
                    </div>

                    {/* Facility Switcher */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 px-3 py-1.5">
                        <Building2 className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                        <select
                            value={selectedFacilityId}
                            onChange={(e) =>
                                setSelectedFacilityId(e.target.value)
                            }
                            className="cursor-pointer truncate bg-transparent pr-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                            <option
                                value="All"
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                            >
                                All Facilities (Global)
                            </option>
                            {facilities.map((fac) => (
                                <option
                                    key={fac.id}
                                    value={fac.id}
                                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
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
                        className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                        title="Alerts"
                    >
                        <Bell className="h-4 w-4" />
                        {totalAlerts > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow">
                                {totalAlerts}
                            </span>
                        )}
                    </button>

                    {/* Theme Mode Switcher */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95"
                        title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-slate-700" />
                        )}
                    </button>

                    {/* Auth Nav & Landing Page Switcher */}
                    <div className="flex items-center gap-1.5">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        >
                            <LogIn className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        >
                            <UserPlus className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                            Sign Up
                        </Link>
                        {onSwitchToLanding && (
                            <button
                                onClick={onSwitchToLanding}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                title="Return to Product Landing Page"
                            >
                                🌐 Landing Page
                            </button>
                        )}
                    </div>

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
        </header>
    );
};
