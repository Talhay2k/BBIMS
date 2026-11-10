import React, { useState } from 'react';
import { RequestRecord, BloodUnit, BloodType, ComponentType } from './types';
import {
    Search,
    Truck,
    ShieldCheck,
    GitCompare,
    Edit3,
    Trash2,
    X,
} from 'lucide-react';

interface RequestsTabProps {
    requests: RequestRecord[];
    units: BloodUnit[];
    onOpenCreateRequestModal: () => void;
    onCrossMatchUnits: (requestId: string, unitIds: string[]) => void;
    onDispatchOrder: (
        requestId: string,
        courierCode?: string,
        tempC?: number,
    ) => void;
    onEditRequest?: (id: string, data: any) => void;
    onDeleteRequest?: (id: string) => void;
}

export const RequestsDispatchTab: React.FC<RequestsTabProps> = ({
    requests,
    units,
    onOpenCreateRequestModal,
    onCrossMatchUnits,
    onDispatchOrder,
    onEditRequest,
    onDeleteRequest,
}) => {
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedUrgency, setSelectedUrgency] = useState('All');

    // Cross Match Modal State
    const [crossMatchReq, setCrossMatchReq] = useState<RequestRecord | null>(
        null,
    );
    const [selectedUnitId, setSelectedUnitId] = useState<string>('');

    // Dispatch Modal State
    const [dispatchReq, setDispatchReq] = useState<RequestRecord | null>(null);
    const [courierCode, setCourierCode] = useState('COURIER-EXPRESS-9921');
    const [dispatchTemp, setDispatchTemp] = useState(4.2);

    // Edit Modal State
    const [editingReq, setEditingReq] = useState<RequestRecord | null>(null);
    const [editHospital, setEditHospital] = useState('');
    const [editPatientName, setEditPatientName] = useState('');
    const [editPatientAge, setEditPatientAge] = useState(40);
    const [editPatientGender, setEditPatientGender] = useState('Male');
    const [editBloodType, setEditBloodType] = useState<BloodType>('O-');
    const [editComponent, setEditComponent] = useState<string>('Packed Red Blood Cells');
    const [editUnitsRequested, setEditUnitsRequested] = useState(1);
    const [editUrgency, setEditUrgency] = useState<any>('Emergency (Stat)');
    const [editStatus, setEditStatus] = useState<any>('Pending');
    const [editNotes, setEditNotes] = useState('');

    // Delete Modal State
    const [deletingReq, setDeletingReq] = useState<RequestRecord | null>(null);

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

    const startEditingReq = (req: RequestRecord) => {
        setEditingReq(req);
        setEditHospital(req.hospitalName);
        setEditPatientName(req.patientName);
        setEditPatientAge(req.patientAge);
        setEditPatientGender(req.patientGender);
        setEditBloodType(req.requiredBloodType);
        setEditComponent(req.component);
        setEditUnitsRequested(req.unitsRequested);
        setEditUrgency(req.urgency);
        setEditStatus(req.status);
        setEditNotes(req.notes || '');
    };

    const handleSaveReqEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReq) return;
        onEditRequest?.(editingReq.id, {
            hospitalName: editHospital,
            patientName: editPatientName,
            patientAge: editPatientAge,
            patientGender: editPatientGender,
            requiredBloodType: editBloodType,
            component: editComponent,
            unitsRequested: editUnitsRequested,
            urgency: editUrgency,
            status: editStatus,
            notes: editNotes,
        });
        setEditingReq(null);
    };

    const handleConfirmDeleteReq = () => {
        if (!deletingReq) return;
        onDeleteRequest?.(deletingReq.id);
        setDeletingReq(null);
    };

    const filteredRequests = requests.filter((r) => {
        if (selectedStatus !== 'All' && r.status !== selectedStatus)
            return false;
        if (selectedUrgency !== 'All' && r.urgency !== selectedUrgency)
            return false;
        if (search) {
            const s = search.toLowerCase();
            return (
                r.requestCode.toLowerCase().includes(s) ||
                r.hospitalName.toLowerCase().includes(s) ||
                r.patientName.toLowerCase().includes(s)
            );
        }
        return true;
    });

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case 'Emergency (Stat)':
                return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse';
            case 'Urgent':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
            default:
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
            case 'Cross-Matched':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
            case 'Dispatched':
                return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
            case 'Completed':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
        }
    };

    const handleCrossMatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!crossMatchReq || !selectedUnitId) return;
        onCrossMatchUnits(crossMatchReq.id, [selectedUnitId]);
        setCrossMatchReq(null);
        setSelectedUnitId('');
    };

    const handleDispatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dispatchReq) return;
        onDispatchOrder(dispatchReq.id, courierCode, Number(dispatchTemp));
        setDispatchReq(null);
    };

    return (
        <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg">
                <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search hospital, request ID, patient name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500/50 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    <select
                        value={selectedUrgency}
                        onChange={(e) => setSelectedUrgency(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <option value="All">All Urgency Levels</option>
                        <option value="Emergency (Stat)">Emergency (Stat)</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Routine">Routine</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending Cross-Match</option>
                        <option value="Cross-Matched">Cross-Matched (Ready)</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <button
                        onClick={onOpenCreateRequestModal}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-900/20 transition hover:bg-red-700 active:scale-95 sm:ml-auto sm:w-auto"
                    >
                        <Truck className="h-4 w-4" />
                        New STAT Order
                    </button>
                </div>
            </div>

            {/* Orders Cards Grid */}
            {filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-500">
                        <Truck className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        No Hospital Requisitions Found
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                        {search || selectedUrgency !== 'All' || selectedStatus !== 'All'
                            ? 'No hospital orders match your filter criteria. Try resetting your filter.'
                            : 'No active hospital orders or requisitions. Create a new STAT order to get started.'}
                    </p>
                    <button
                        onClick={onOpenCreateRequestModal}
                        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-900/20 transition hover:bg-red-700 active:scale-95"
                    >
                        <Truck className="h-4 w-4" />
                        New STAT Order
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRequests.map((req) => {
                        const assignedUnits = units.filter((u) =>
                        (req.unitsAssigned || []).includes(u.id),
                    );

                    return (
                        <div
                            key={req.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg"
                        >
                            <div>
                                {/* Card Header */}
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <span className="font-mono text-[11px] font-bold text-slate-500">
                                            {req.requestCode}
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {req.hospitalName}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getUrgencyBadge(
                                                req.urgency,
                                            )}`}
                                        >
                                            {req.urgency}
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                                                req.status,
                                            )}`}
                                        >
                                            {req.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Patient & Group Info */}
                                <div className="mb-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                        <span>Patient Name:</span>
                                        <strong className="text-slate-900 dark:text-white">
                                            {req.patientName} ({req.patientAge}y, {req.patientGender})
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                        <span>Required Group & Component:</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono font-black text-red-600 dark:text-red-400">
                                                {req.requiredBloodType}
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {req.component}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                        <span>Units Requested:</span>
                                        <strong className="text-slate-900 dark:text-slate-100">
                                            {req.unitsRequested} unit(s)
                                        </strong>
                                    </div>
                                </div>

                                {/* Assigned Units info */}
                                {assignedUnits.length > 0 && (
                                    <div className="mb-3 rounded-xl border border-purple-200 bg-purple-50 p-2.5 text-xs dark:border-purple-800/40 dark:bg-purple-950/30">
                                        <span className="mb-1 block font-bold text-purple-700 dark:text-purple-300">
                                            Cross-Matched Units Assigned:
                                        </span>
                                        {assignedUnits.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center justify-between font-mono text-[11px] text-slate-700 dark:text-slate-300"
                                            >
                                                <span>
                                                    {u.unitNumber} ({u.bloodType})
                                                </span>
                                                <span className="font-sans font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Passed Compatibility Check
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions & Dispatch details */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-800/80">
                                <span className="font-mono text-[11px] text-slate-500">
                                    Req: {req.requestDate}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {onEditRequest && (
                                        <button
                                            onClick={() => startEditingReq(req)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 transition"
                                            title="Edit Request"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                    )}
                                    {onDeleteRequest && (
                                        <button
                                            onClick={() => setDeletingReq(req)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
                                            title="Cancel / Delete Request"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {req.status === 'Pending' && (
                                        <button
                                            onClick={() => setCrossMatchReq(req)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                                        >
                                            <GitCompare className="h-3.5 w-3.5" />
                                            Cross-Match
                                        </button>
                                    )}

                                    {req.status === 'Cross-Matched' && (
                                        <button
                                            onClick={() => setDispatchReq(req)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
                                        >
                                            <Truck className="h-3.5 w-3.5" />
                                            Dispatch
                                        </button>
                                    )}

                                    {req.status === 'Dispatched' && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                                            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            Dispatched ({req.dispatchTemperatureC}°C)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* Cross-Match Modal */}
            {crossMatchReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <GitCompare className="h-5 w-5 text-purple-500" />
                                Cross-Match Verification: {crossMatchReq.requestCode}
                            </h3>
                            <button
                                onClick={() => setCrossMatchReq(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs dark:border-purple-800/40 dark:bg-purple-950/40">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="font-semibold text-purple-800 dark:text-purple-300">
                                    Patient: {crossMatchReq.patientName} ({crossMatchReq.requiredBloodType})
                                </span>
                                <span className="font-mono text-purple-700 dark:text-purple-400">
                                    {crossMatchReq.component}
                                </span>
                            </div>
                            <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80">
                                Select compatible inventory unit to electronically assign.
                            </p>
                        </div>

                        <form onSubmit={handleCrossMatchSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Select Available Blood Unit
                                </label>
                                <select
                                    value={selectedUnitId}
                                    onChange={(e) => setSelectedUnitId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    required
                                >
                                    <option value="">-- Choose Unit --</option>
                                    {units
                                        .filter(
                                            (u) =>
                                                u.status === 'Available' &&
                                                (u.bloodType === crossMatchReq.requiredBloodType ||
                                                    u.bloodType === 'O-'),
                                        )
                                        .map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.unitNumber} | {u.bloodType} | {u.component} | {u.volumeMl}mL ({u.facilityName})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setCrossMatchReq(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                                >
                                    Confirm Electronic Match
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dispatch Modal */}
            {dispatchReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Truck className="h-5 w-5 text-cyan-500" />
                                Initiate Cold Transport: {dispatchReq.requestCode}
                            </h3>
                            <button
                                onClick={() => setDispatchReq(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Courier / Vehicle Tracking Code
                                </label>
                                <input
                                    type="text"
                                    value={courierCode}
                                    onChange={(e) => setCourierCode(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Verified Transport Container Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={dispatchTemp}
                                    onChange={(e) => setDispatchTemp(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setDispatchReq(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700"
                                >
                                    Confirm Dispatch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Request Modal */}
            {editingReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Edit3 className="h-5 w-5 text-blue-500" />
                                Edit Request: {editingReq.requestCode}
                            </h3>
                            <button
                                onClick={() => setEditingReq(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveReqEdit} className="space-y-3 text-xs">
                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Hospital Facility
                                </label>
                                <input
                                    type="text"
                                    value={editHospital}
                                    onChange={(e) => setEditHospital(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editPatientName}
                                        onChange={(e) => setEditPatientName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={editPatientAge}
                                        onChange={(e) => setEditPatientAge(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Required Blood Group
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
                                        onChange={(e) => setEditComponent(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        {components.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Units Requested
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editUnitsRequested}
                                        onChange={(e) => setEditUnitsRequested(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Urgency
                                    </label>
                                    <select
                                        value={editUrgency}
                                        onChange={(e) => setEditUrgency(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        <option value="Emergency (Stat)">Emergency (Stat)</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Routine">Routine</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Status
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Cross-Matched">Cross-Matched</option>
                                        <option value="Dispatched">Dispatched</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Notes & Instructions
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
                                    onClick={() => setEditingReq(null)}
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

            {/* Delete Request Confirmation Modal */}
            {deletingReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Cancel & Delete Request
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Are you sure you want to cancel and remove request <strong className="text-slate-900 dark:text-slate-100">{deletingReq.requestCode}</strong> for {deletingReq.patientName}?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                            Warning: This removes the order from active transfusion queues and logs a dispatch cancellation record.
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingReq(null)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteReq}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
