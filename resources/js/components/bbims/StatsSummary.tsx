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
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Stock */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                <div className="absolute top-0 right-0 p-4 text-rose-500 opacity-10">
                    <Layers className="h-20 w-20" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Available Blood Stock
                    </span>
                    <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                        Live Sync
                    </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-extrabold text-white">
                            {totalStock}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                            units
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-semibold text-rose-400">
                            <Flame className="h-3.5 w-3.5" />
                            O- Universal: {universalO} units
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span>
                        PRBC:{' '}
                        <strong className="text-slate-200">{prbcCount}</strong>
                    </span>
                    <span>
                        Platelets:{' '}
                        <strong className="text-slate-200">
                            {plateletCount}
                        </strong>
                    </span>
                    <span>
                        Plasma:{' '}
                        <strong className="text-slate-200">
                            {plasmaCount}
                        </strong>
                    </span>
                </div>
            </div>

            {/* Expiry Risk Alerts */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                <div className="absolute top-0 right-0 p-4 text-amber-500 opacity-10">
                    <AlertTriangle className="h-20 w-20" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Expiry Date Alerts
                    </span>
                    {criticalExpiryUnits > 0 ? (
                        <span className="inline-flex animate-pulse items-center rounded-md border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400">
                            Action Required
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            Normal
                        </span>
                    )}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-extrabold text-white">
                            {criticalExpiryUnits + warningExpiryUnits}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                            near expiry
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                    <span className="font-medium text-rose-400">
                        Critical (&le; 3 days):{' '}
                        <strong className="font-bold text-rose-300">
                            {criticalExpiryUnits}
                        </strong>
                    </span>
                    <span className="font-medium text-amber-400">
                        Warning (&le; 7 days):{' '}
                        <strong className="font-bold text-amber-300">
                            {warningExpiryUnits}
                        </strong>
                    </span>
                </div>
            </div>

            {/* Hospital Orders & Dispatch */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                <div className="absolute top-0 right-0 p-4 text-blue-500 opacity-10">
                    <Truck className="h-20 w-20" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Hospital Orders
                    </span>
                    {emergencyStatRequests > 0 ? (
                        <span className="inline-flex animate-bounce items-center rounded-md bg-rose-600 px-2 py-0.5 text-xs font-extrabold text-white">
                            EMERGENCY STAT: {emergencyStatRequests}
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                            Normal Stream
                        </span>
                    )}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-extrabold text-white">
                            {pendingRequests}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                            active orders
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span>
                        Completed Today:{' '}
                        <strong className="text-emerald-400">12</strong>
                    </span>
                    <span>
                        Dispatch Ready:{' '}
                        <strong className="text-blue-400">3</strong>
                    </span>
                </div>
            </div>

            {/* Donors & Campaigns */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                <div className="absolute top-0 right-0 p-4 text-purple-500 opacity-10">
                    <Users className="h-20 w-20" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Donors & Campaigns
                    </span>
                    <span className="inline-flex items-center rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-300">
                        Network Active
                    </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-extrabold text-white">
                            {donors.length}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                            registered
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-semibold text-emerald-400">
                            {eligibleDonors} Eligible
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span>
                        Active Drives:{' '}
                        <strong className="text-purple-300">
                            {activeDrives}
                        </strong>
                    </span>
                    <span>
                        Target:{' '}
                        <strong className="text-slate-200">210 units</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};
