import React from 'react';
import { BloodUnit, DonorRecord, RequestRecord, DonationDrive } from './types';
import {
    Layers,
    AlertTriangle,
    Truck,
    Users,
    Calendar,
    ShieldCheck,
    HeartPulse,
    Flame,
} from 'lucide-react';

interface StatsProps {
    units: BloodUnit[];
    donors: DonorRecord[];
    requests: RequestRecord[];
    drives: DonationDrive[];
    onSelectFilter?: (type: string) => void;
}

export const StatsSummary: React.FC<StatsProps> = ({
    units,
    donors,
    requests,
    drives,
}) => {
    const safeUnits = Array.isArray(units) ? units : [];
    const safeDonors = Array.isArray(donors) ? donors : [];
    const safeRequests = Array.isArray(requests) ? requests : [];
    const safeDrives = Array.isArray(drives) ? drives : [];

    const totalStock = safeUnits.filter(
        (u) => u.status === 'Available' || u.status === 'Cross-Matched',
    ).length;
    const universalO = safeUnits.filter(
        (u) => u.bloodType === 'O-' && u.status === 'Available',
    ).length;

    const today = new Date();
    const criticalExpiryUnits = safeUnits.filter((u) => {
        if (u.status !== 'Available') return false;
        const exp = new Date(u.expiryDate);
        const days = Math.ceil(
            (exp.getTime() - today.getTime()) / (1000 * 3600 * 24),
        );
        return days <= 3 && days >= 0;
    }).length;

    const warningExpiryUnits = safeUnits.filter((u) => {
        if (u.status !== 'Available') return false;
        const exp = new Date(u.expiryDate);
        const days = Math.ceil(
            (exp.getTime() - today.getTime()) / (1000 * 3600 * 24),
        );
        return days > 3 && days <= 7;
    }).length;

    const pendingRequests = safeRequests.filter(
        (r) => r.status === 'Pending' || r.status === 'Cross-Matched',
    ).length;
    const emergencyStatRequests = safeRequests.filter(
        (r) =>
            r.urgency === 'Emergency (Stat)' &&
            r.status !== 'Completed' &&
            r.status !== 'Dispatched',
    ).length;

    const eligibleDonors = safeDonors.filter(
        (d) => d.eligibilityStatus === 'Eligible',
    ).length;
    const activeDrives = safeDrives.filter(
        (d) => d.status === 'Active' || d.status === 'Scheduled',
    ).length;

    // Component counts
    const prbcCount = safeUnits.filter(
        (u) =>
            u.component === 'Packed Red Blood Cells' &&
            u.status === 'Available',
    ).length;
    const plateletCount = safeUnits.filter(
        (u) => u.component === 'Platelets' && u.status === 'Available',
    ).length;
    const plasmaCount = safeUnits.filter(
        (u) =>
            u.component === 'Fresh Frozen Plasma' && u.status === 'Available',
    ).length;

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Available Blood Stock */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Available Blood Stock
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-emerald-200/60 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            Live Sync
                        </span>
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#222F44] text-slate-500 dark:text-slate-400">
                            <Layers className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {totalStock}
                        </span>
                        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            units
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg border border-red-200/60 dark:border-red-500/20">
                        <Flame className="h-3.5 w-3.5" />
                        <span>O- Universal: {universalO}</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-[#222F44] pt-3.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        PRBC: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{prbcCount}</strong>
                    </span>
                    <span>
                        Platelets: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{plateletCount}</strong>
                    </span>
                    <span>
                        Plasma: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{plasmaCount}</strong>
                    </span>
                </div>
            </div>

            {/* Card 2: Expiry Date Alerts */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Expiry Date Alerts
                    </span>
                    <div className="flex items-center gap-2">
                        {criticalExpiryUnits > 0 ? (
                            <span className="inline-flex items-center rounded-md border border-red-200/80 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                                Action Required
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-md border border-emerald-200/60 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                Normal
                            </span>
                        )}
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                            criticalExpiryUnits > 0 
                                ? 'bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20 text-red-600 dark:text-red-400' 
                                : 'bg-slate-100 dark:bg-[#0B0F17] border-slate-200/60 dark:border-[#222F44] text-slate-500 dark:text-slate-400'
                        }`}>
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {criticalExpiryUnits + warningExpiryUnits}
                        </span>
                        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            near expiry
                        </span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-[#222F44] pt-3.5 text-xs">
                    <span className="text-red-600 dark:text-red-400 font-medium">
                        Critical (&le; 3d): <strong className="font-bold">{criticalExpiryUnits}</strong>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Warning (&le; 7d): <strong className="font-bold">{warningExpiryUnits}</strong>
                    </span>
                </div>
            </div>

            {/* Card 3: Hospital Orders */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Hospital Orders
                    </span>
                    <div className="flex items-center gap-2">
                        {emergencyStatRequests > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                STAT: {emergencyStatRequests}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-md border border-blue-200/60 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                Normal Stream
                            </span>
                        )}
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#222F44] text-slate-500 dark:text-slate-400">
                            <Truck className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {pendingRequests}
                        </span>
                        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            active orders
                        </span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-[#222F44] pt-3.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Completed Today: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">12</strong>
                    </span>
                    <span>
                        Dispatch Ready: <strong className="text-blue-600 dark:text-blue-400 font-semibold">3</strong>
                    </span>
                </div>
            </div>

            {/* Card 4: Donors & Campaigns */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Donors & Campaigns
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-purple-200/60 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                            Network Active
                        </span>
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#222F44] text-slate-500 dark:text-slate-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {donors.length}
                        </span>
                        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            registered
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20">
                        {eligibleDonors} Eligible
                    </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-[#222F44] pt-3.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Active Drives: <strong className="text-purple-600 dark:text-purple-300 font-semibold">{activeDrives}</strong>
                    </span>
                    <span>
                        Target: <strong className="text-slate-800 dark:text-slate-200 font-semibold">210 units</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};
