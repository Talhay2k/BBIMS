import React from 'react';
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
    Building2,
    PlusCircle,
    FilePlus,
    UserPlus,
    Thermometer,
    CheckCircle2,
    X,
} from 'lucide-react';
import { Facility } from './types';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean) => void;
    facilities: Facility[];
    selectedFacilityId: string;
    setSelectedFacilityId: (id: string) => void;
    onOpenIntakeModal: () => void;
    onOpenRequestModal: () => void;
    onOpenDonorModal: () => void;
    expiringAlertsCount: number;
    pendingRequestsCount: number;
}

export const BbimsSidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isCollapsed,
    setIsCollapsed,
    isMobileOpen = false,
    setIsMobileOpen,
    facilities,
    selectedFacilityId,
    setSelectedFacilityId,
    onOpenIntakeModal,
    onOpenRequestModal,
    onOpenDonorModal,
    expiringAlertsCount: _expiringAlertsCount,
    pendingRequestsCount,
}) => {
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

    const sidebarContent = (isMobile: boolean = false) => (
        <div className="flex h-full flex-col justify-between">
            {/* Top Branding & Toggle Button */}
            <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 p-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 shadow-lg shadow-rose-900/40">
                            <Droplet className="h-5 w-5 text-white" />
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <div className="truncate">
                                <h1 className="text-base leading-tight font-black tracking-tight text-white">
                                    BBIMS Portal
                                </h1>
                                <span className="block text-[10px] font-medium text-slate-400">
                                    Blood Bank Operations
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse Toggle Button */}
                    {!isMobile ? (
                        <button
                            onClick={() => setIsCollapsed((prev) => !prev)}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-white"
                            title={
                                isCollapsed
                                    ? 'Expand Sidebar'
                                    : 'Collapse Sidebar'
                            }
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </button>
                    ) : (
                        /* Mobile Close Button */
                        <button
                            onClick={() =>
                                setIsMobileOpen && setIsMobileOpen(false)
                            }
                            className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Facility Selector */}
                {(!isCollapsed || isMobile) && (
                    <div className="mx-3 mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Active Facility
                        </label>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 shrink-0 text-rose-400" />
                            <select
                                value={selectedFacilityId}
                                onChange={(e) =>
                                    setSelectedFacilityId(e.target.value)
                                }
                                className="w-full cursor-pointer truncate bg-transparent text-xs font-semibold text-slate-200 focus:outline-none"
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
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="no-scrollbar max-h-[calc(100vh-280px)] space-y-4 overflow-y-auto p-3">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                            {(!isCollapsed || isMobile) && (
                                <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                    {section.title}
                                </h2>
                            )}
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
                                                isCollapsed && !isMobile
                                                    ? item.label
                                                    : undefined
                                            }
                                            className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                                                isActive
                                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                                                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                                            } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                                            />
                                            {(!isCollapsed || isMobile) && (
                                                <span className="truncate">
                                                    {item.label}
                                                </span>
                                            )}

                                            {item.badge && item.badge > 0 ? (
                                                <span
                                                    className={`py-0.2 rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white ${
                                                        isCollapsed && !isMobile
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
            <div className="space-y-2 border-t border-slate-800/80 p-3">
                {!isCollapsed || isMobile ? (
                    <>
                        <div className="grid grid-cols-3 gap-1.5">
                            <button
                                onClick={() => {
                                    onOpenIntakeModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl bg-rose-600 p-2 text-[10px] font-bold text-white shadow transition hover:bg-rose-500"
                                title="Intake Blood Unit"
                            >
                                <PlusCircle className="mb-0.5 h-4 w-4" />
                                Intake
                            </button>
                            <button
                                onClick={() => {
                                    onOpenRequestModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl border border-rose-500/30 bg-slate-900 p-2 text-[10px] font-bold text-rose-300 transition hover:bg-slate-800"
                                title="New Hospital Request"
                            >
                                <FilePlus className="mb-0.5 h-4 w-4" />
                                Request
                            </button>
                            <button
                                onClick={() => {
                                    onOpenDonorModal();
                                    if (setIsMobileOpen) setIsMobileOpen(false);
                                }}
                                className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-[10px] font-bold text-blue-300 transition hover:bg-slate-800"
                                title="Register New Donor"
                            >
                                <UserPlus className="mb-0.5 h-4 w-4 text-blue-400" />
                                Donor
                            </button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px]">
                            <span className="flex items-center gap-1.5 font-medium text-slate-400">
                                <Thermometer className="h-3.5 w-3.5 text-emerald-400" />
                                Cold Chain
                            </span>
                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> 3.8°C
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <button
                            onClick={onOpenIntakeModal}
                            className="rounded-xl bg-rose-600 p-2.5 text-white shadow transition hover:bg-rose-500"
                            title="Intake Blood Unit"
                        >
                            <PlusCircle className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onOpenRequestModal}
                            className="rounded-xl border border-rose-500/30 bg-slate-900 p-2.5 text-rose-300 transition hover:bg-slate-800"
                            title="New Hospital Request"
                        >
                            <FilePlus className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <aside
                className={`sticky top-0 z-40 hidden h-screen flex-col justify-between border-r border-slate-800/80 bg-[#0b0f19] text-white shadow-2xl transition-all duration-300 lg:flex ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {sidebarContent(false)}
            </aside>

            {/* Mobile Drawer Overlay & Backdrop */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        onClick={() =>
                            setIsMobileOpen && setIsMobileOpen(false)
                        }
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                    />

                    {/* Sliding Drawer */}
                    <aside className="fixed inset-y-0 left-0 z-50 w-72 animate-in border-r border-slate-800 bg-[#0b0f19] text-white shadow-2xl duration-300 slide-in-from-left">
                        {sidebarContent(true)}
                    </aside>
                </div>
            )}
        </>
    );
};
