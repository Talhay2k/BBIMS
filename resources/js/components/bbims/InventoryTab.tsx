import React, { useState } from 'react';
import { BloodUnit, BloodType, ComponentType, UnitStatus } from './types';
import {
    Search,
    Filter,
    Plus,
    ArrowUpDown,
    AlertCircle,
    CheckCircle,
    Clock,
    Trash2,
    Edit3,
    ShieldAlert,
    Sparkles,
    Building2,
    MapPin,
} from 'lucide-react';

interface InventoryTabProps {
    units: BloodUnit[];
    onOpenIntakeModal: () => void;
    onUpdateStatus: (id: string, newStatus: UnitStatus, notes?: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
    units,
    onOpenIntakeModal,
    onUpdateStatus,
}) => {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedComponent, setSelectedComponent] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const bloodTypes: BloodType[] = [
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
    ];
    const components: ComponentType[] = [
        'Packed Red Blood Cells',
        'Whole Blood',
        'Platelets',
        'Fresh Frozen Plasma',
        'Cryoprecipitate',
    ];
    const statuses: UnitStatus[] = [
        'Available',
        'Reserved',
        'Cross-Matched',
        'Quarantined',
        'Dispatched',
        'Expired',
        'Discarded',
    ];

    const filteredUnits = units.filter((unit) => {
        if (selectedType !== 'All' && unit.bloodType !== selectedType)
            return false;
        if (selectedComponent !== 'All' && unit.component !== selectedComponent)
            return false;
        if (selectedStatus !== 'All' && unit.status !== selectedStatus)
            return false;
        if (search) {
            const s = search.toLowerCase();
            return (
                unit.unitNumber.toLowerCase().includes(s) ||
                unit.location.toLowerCase().includes(s) ||
                unit.facilityName.toLowerCase().includes(s) ||
                (unit.notes && unit.notes.toLowerCase().includes(s))
            );
        }
        return true;
    });

    const getStatusBadge = (status: UnitStatus) => {
        switch (status) {
            case 'Available':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Reserved':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Cross-Matched':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Quarantined':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Dispatched':
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'Expired':
                return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            case 'Discarded':
                return 'bg-slate-700 text-slate-400 border-slate-600';
            default:
                return 'bg-slate-800 text-slate-300';
        }
    };

    const getExpiryBadge = (expiryDate: string) => {
        const today = new Date();
        const exp = new Date(expiryDate);
        const days = Math.ceil(
            (exp.getTime() - today.getTime()) / (1000 * 3600 * 24),
        );

        if (days < 0) {
            return (
                <span className="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-400">
                    <ShieldAlert className="h-3 w-3" /> Expired (
                    {Math.abs(days)}d ago)
                </span>
            );
        } else if (days <= 3) {
            return (
                <span className="inline-flex animate-pulse items-center gap-1 rounded border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-400">
                    <AlertCircle className="h-3 w-3" /> {days} days left
                </span>
            );
        } else if (days <= 7) {
            return (
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                    <Clock className="h-3 w-3" /> {days} days left
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> {days} days left
                </span>
            );
        }
    };

    return (
        <div className="space-y-4">
            {/* Control & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                {/* Search */}
                <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search unit barcode ID, location, facility..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pr-4 pl-10 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500/50 focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Blood Type Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Blood Types</option>
                        {bloodTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                    {/* Component Filter */}
                    <select
                        value={selectedComponent}
                        onChange={(e) => setSelectedComponent(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Components</option>
                        {components.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={onOpenIntakeModal}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-900/20 transition hover:bg-rose-500 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Intake Blood Unit
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                                <th className="px-4 py-3.5">Unit Barcode ID</th>
                                <th className="px-4 py-3.5">Blood Group</th>
                                <th className="px-4 py-3.5">Component & Vol</th>
                                <th className="px-4 py-3.5">
                                    Storage Facility & Location
                                </th>
                                <th className="px-4 py-3.5">Collection Date</th>
                                <th className="px-4 py-3.5">
                                    Expiry Date & Risk
                                </th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {filteredUnits.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-slate-500"
                                    >
                                        No blood units match the specified
                                        filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUnits.map((unit) => (
                                    <tr
                                        key={unit.id}
                                        className="transition hover:bg-slate-800/40"
                                    >
                                        <td className="px-4 py-3.5 font-mono font-bold text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                                                {unit.unitNumber}
                                            </div>
                                            {unit.donorCode && (
                                                <span className="block font-sans text-[10px] text-slate-500">
                                                    Donor: {unit.donorCode}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-xs font-black text-rose-400">
                                                {unit.bloodType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-300">
                                            <div className="font-semibold text-slate-200">
                                                {unit.component}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                {unit.volumeMl} mL
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-300">
                                            <div className="flex items-center gap-1 font-medium text-slate-200">
                                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                {unit.facilityName}
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                <MapPin className="h-3 w-3 text-slate-500" />
                                                {unit.location}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                                            {unit.collectionDate}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="mb-0.5 font-mono text-[11px] text-slate-300">
                                                {unit.expiryDate}
                                            </div>
                                            {getExpiryBadge(unit.expiryDate)}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                                                    unit.status,
                                                )}`}
                                            >
                                                {unit.status}
                                            </span>
                                        </td>
                                        <td className="space-x-2 px-4 py-3.5 text-right">
                                            {unit.status === 'Available' && (
                                                <button
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            unit.id,
                                                            'Quarantined',
                                                            'Flagged for re-testing',
                                                        )
                                                    }
                                                    className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 transition hover:bg-amber-500/20"
                                                >
                                                    Quarantine
                                                </button>
                                            )}
                                            {unit.status === 'Available' && (
                                                <button
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            unit.id,
                                                            'Discarded',
                                                            'Manual lab discard',
                                                        )
                                                    }
                                                    className="rounded border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/20"
                                                >
                                                    Discard
                                                </button>
                                            )}
                                            {unit.status === 'Quarantined' && (
                                                <button
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            unit.id,
                                                            'Available',
                                                            'Passed re-inspection',
                                                        )
                                                    }
                                                    className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                                                >
                                                    Release
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
