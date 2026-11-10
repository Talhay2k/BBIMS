import React, { useState } from 'react';
import { BloodUnit, BloodType, ComponentType, UnitStatus } from './types';
import {
    Search,
    Plus,
    Building2,
    MapPin,
    AlertCircle,
    Edit3,
    Trash2,
    X,
} from 'lucide-react';

interface InventoryTabProps {
    units: BloodUnit[];
    onOpenIntakeModal: () => void;
    onUpdateStatus: (id: string, newStatus: UnitStatus, notes?: string) => void;
    onEditUnit?: (id: string, data: any) => void;
    onDeleteUnit?: (id: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
    units,
    onOpenIntakeModal,
    onUpdateStatus,
    onEditUnit,
    onDeleteUnit,
}) => {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedComponent, setSelectedComponent] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    // Edit modal state
    const [editingUnit, setEditingUnit] = useState<BloodUnit | null>(null);
    const [editBloodType, setEditBloodType] = useState<BloodType>('O-');
    const [editComponent, setEditComponent] = useState<ComponentType>('Packed Red Blood Cells');
    const [editVolumeMl, setEditVolumeMl] = useState<number>(450);
    const [editLocation, setEditLocation] = useState<string>('');
    const [editExpiryDate, setEditExpiryDate] = useState<string>('');
    const [editStatus, setEditStatus] = useState<UnitStatus>('Available');
    const [editNotes, setEditNotes] = useState<string>('');

    // Delete modal state
    const [deletingUnit, setDeletingUnit] = useState<BloodUnit | null>(null);

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

    const startEditing = (unit: BloodUnit) => {
        setEditingUnit(unit);
        setEditBloodType(unit.bloodType);
        setEditComponent(unit.component);
        setEditVolumeMl(unit.volumeMl);
        setEditLocation(unit.location);
        setEditExpiryDate(unit.expiryDate);
        setEditStatus(unit.status);
        setEditNotes(unit.notes || '');
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUnit) return;
        onEditUnit?.(editingUnit.id, {
            bloodType: editBloodType,
            component: editComponent,
            volumeMl: editVolumeMl,
            location: editLocation,
            expiryDate: editExpiryDate,
            status: editStatus,
            notes: editNotes,
        });
        setEditingUnit(null);
    };

    const handleConfirmDelete = () => {
        if (!deletingUnit) return;
        onDeleteUnit?.(deletingUnit.id);
        setDeletingUnit(null);
    };

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
                (unit.donorCode && unit.donorCode.toLowerCase().includes(s)) ||
                unit.facilityName.toLowerCase().includes(s)
            );
        }
        return true;
    });

    const getStatusBadge = (status: UnitStatus) => {
        switch (status) {
            case 'Available':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
            case 'Reserved':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
            case 'Cross-Matched':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
            case 'Quarantined':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
            case 'Dispatched':
                return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
            case 'Expired':
            case 'Discarded':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
        }
    };

    const getExpiryBadge = (expiryDate: string) => {
        const exp = new Date(expiryDate);
        const days = Math.ceil(
            (exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
        );

        if (days <= 0) {
            return (
                <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-red-500">
                    <AlertCircle className="h-3 w-3" /> Expired
                </span>
            );
        }
        if (days <= 3) {
            return (
                <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-amber-500">
                    <AlertCircle className="h-3 w-3" /> {days}d (CRITICAL)
                </span>
            );
        }
        if (days <= 7) {
            return (
                <span className="font-mono text-[10px] text-amber-400/90">
                    {days} days
                </span>
            );
        }
        return (
            <span className="font-mono text-[10px] text-slate-500">
                {days} days
            </span>
        );
    };

    return (
        <div className="space-y-4">
            {/* Control Bar: Search & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg">
                <div className="relative min-w-[200px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search unit barcode, donor ID, facility..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500/50 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    {/* Blood Group Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <option value="All">All Blood Groups</option>
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
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-900/20 transition hover:bg-red-700 active:scale-95 sm:ml-auto sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Intake Blood Unit
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-md transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold tracking-wider text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
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
                        <tbody className="divide-y divide-slate-200 text-xs dark:divide-slate-800/60">
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
                                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                    >
                                        <td className="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                {unit.unitNumber}
                                            </div>
                                            {unit.donorCode && (
                                                <span className="block font-sans text-[10px] text-slate-500">
                                                    Donor: {unit.donorCode}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-xs font-black text-red-600 dark:text-red-400">
                                                {unit.bloodType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                {unit.component}
                                            </div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {unit.volumeMl} mL
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                                            <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                {unit.facilityName}
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                <MapPin className="h-3 w-3 text-slate-500" />
                                                {unit.location}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                            {unit.collectionDate}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="mb-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
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
                                        <td className="space-x-1.5 px-4 py-3.5 text-right whitespace-nowrap">
                                            {onEditUnit && (
                                                <button
                                                    onClick={() => startEditing(unit)}
                                                    title="Edit Unit"
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 transition"
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                    Edit
                                                </button>
                                            )}
                                            {onDeleteUnit && (
                                                <button
                                                    onClick={() => setDeletingUnit(unit)}
                                                    title="Delete Unit"
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </button>
                                            )}
                                            {unit.status === 'Available' && (
                                                <button
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            unit.id,
                                                            'Quarantined',
                                                            'Flagged for re-testing',
                                                        )
                                                    }
                                                    className="cursor-pointer rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-300 transition hover:bg-amber-500/20"
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
                                                    className="cursor-pointer rounded border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-600 dark:text-red-300 transition hover:bg-red-500/20"
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
                                                    className="cursor-pointer rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300 transition hover:bg-emerald-500/20"
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

            {/* Edit Unit Modal */}
            {editingUnit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Edit3 className="h-5 w-5 text-blue-500" />
                                Edit Unit: {editingUnit.unitNumber}
                            </h3>
                            <button
                                onClick={() => setEditingUnit(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Blood Group
                                    </label>
                                    <select
                                        value={editBloodType}
                                        onChange={(e) => setEditBloodType(e.target.value as BloodType)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        {bloodTypes.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Component
                                    </label>
                                    <select
                                        value={editComponent}
                                        onChange={(e) => setEditComponent(e.target.value as ComponentType)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        {components.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Volume (mL)
                                    </label>
                                    <input
                                        type="number"
                                        value={editVolumeMl}
                                        onChange={(e) => setEditVolumeMl(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editExpiryDate}
                                        onChange={(e) => setEditExpiryDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Storage Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Status
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as UnitStatus)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Notes
                                </label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingUnit(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Unit Confirmation Modal */}
            {deletingUnit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Delete Blood Unit
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Are you sure you want to permanently delete unit <strong className="text-slate-900 dark:text-slate-100">{deletingUnit.unitNumber}</strong> ({deletingUnit.bloodType})?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                            Warning: This removes the record from cold-storage inventory and logs an inspection audit trail.
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingUnit(null)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                            >
                                Delete Unit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
