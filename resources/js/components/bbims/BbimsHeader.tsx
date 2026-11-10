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
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 text-slate-900 shadow-md backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#0b0f19]/95 dark:text-white dark:shadow-2xl">
            {/* Top Bar */}
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggler */}
                    {onToggleMobileSidebar && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            title="Toggle Navigation Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-red-600 to-red-500 shadow-lg shadow-red-900/40">
                        <Droplet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                BloodMatrix
                            </h1>
                            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold text-red-600 dark:text-red-400">
                                Live System
                            </span>
                        </div>
                        <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                            Multi-Facility Inventory • Telemetry • AI Expiry
                            Risk
                        </p>
                    </div>
                </div>

                {/* Facility Selector & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Telemetry Status Pill */}
                    <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/90 px-3 py-1.5 text-xs text-slate-700 lg:flex dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
                        <Thermometer className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>Vault 3.8°C</span>
                        <span className="text-slate-400 dark:text-slate-600">
                            •
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Normal
                        </span>
                    </div>

                    {/* Facility Switcher */}
                    <div className="flex max-w-[130px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/90 px-2.5 py-1.5 sm:max-w-[200px] md:max-w-none dark:border-slate-800 dark:bg-slate-900/90">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-red-500 dark:text-red-400" />
                        <select
                            value={selectedFacilityId}
                            onChange={(e) =>
                                setSelectedFacilityId(e.target.value)
                            }
                            className="cursor-pointer truncate bg-transparent pr-1 text-xs font-semibold text-slate-800 focus:outline-none dark:text-slate-200"
                        >
                            <option
                                value="All"
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-200"
                            >
                                All Facilities (Global)
                            </option>
                            {facilities.map((fac) => (
                                <option
                                    key={fac.id}
                                    value={fac.id}
                                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-200"
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
                        className="relative rounded-xl border border-slate-200 bg-slate-100/90 p-2 text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800"
                        title="Alerts"
                    >
                        <Bell className="h-4 w-4" />
                        {totalAlerts > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow">
                                {totalAlerts}
                            </span>
                        )}
                    </button>

                    {/* Theme Mode Switcher */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-xl border border-slate-200 bg-slate-100/90 p-2 text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800"
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
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 sm:px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <LogIn className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                            <span className="hidden sm:inline">Sign In</span>
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 sm:px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <UserPlus className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                            <span className="hidden sm:inline">Sign Up</span>
                        </Link>
                        {onSwitchToLanding && (
                            <button
                                onClick={onSwitchToLanding}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 sm:px-3 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
                                title="Return to Product Landing Page"
                            >
                                <span>🌐</span>
                                <span className="hidden md:inline">Landing Page</span>
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={onOpenIntakeModal}
                        className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-900/30 transition hover:bg-red-700 active:scale-95 sm:px-3.5"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Intake Unit</span>
                        <span className="sm:hidden">Intake</span>
                    </button>
                    <button
                        onClick={onOpenRequestModal}
                        className="hidden items-center gap-1 rounded-xl border border-red-500/30 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-red-300 transition hover:bg-slate-800 active:scale-95 sm:inline-flex"
                    >
                        <Plus className="h-4 w-4" />
                        New Request
                    </button>
                    <button
                        onClick={onOpenDonorModal}
                        className="hidden items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-800 active:scale-95 md:inline-flex"
                    >
                        <Plus className="h-4 w-4 text-blue-400" />
                        New Donor
                    </button>
                </div>
            </div>
        </header>
    );
};
