import React, { useState } from 'react';
import { RequestRecord, BloodUnit } from './types';
import {
    Search,
    Plus,
    Truck,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ShieldCheck,
    GitCompare,
    Thermometer,
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
}

export const RequestsDispatchTab: React.FC<RequestsTabProps> = ({
    requests,
    units,
    onOpenCreateRequestModal,
    onCrossMatchUnits,
    onDispatchOrder,
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
                return 'bg-rose-600 text-white font-extrabold shadow-sm animate-pulse';
            case 'Urgent':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold';
            default:
                return 'bg-slate-800 text-slate-300 font-medium';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Cross-Matched':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Approved':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Dispatched':
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'Completed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default:
                return 'bg-slate-800 text-slate-400';
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
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search hospital, request ID, patient name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pr-4 pl-10 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500/50 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedUrgency}
                        onChange={(e) => setSelectedUrgency(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Urgency Levels</option>
                        <option value="Emergency (Stat)">
                            Emergency (Stat)
                        </option>
                        <option value="Urgent">Urgent</option>
                        <option value="Routine">Routine</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Cross-Matched">Cross-Matched</option>
                        <option value="Dispatched">Dispatched</option>
                    </select>

                    <button
                        onClick={onOpenCreateRequestModal}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-900/20 transition hover:bg-rose-500 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        New Hospital Request
                    </button>
                </div>
            </div>

            {/* Requests Cards List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredRequests.map((req) => {
                    const assignedUnits = units.filter((u) =>
                        req.unitsAssigned.includes(u.id),
                    );
                    return (
                        <div
                            key={req.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg"
                        >
                            <div>
                                {/* Header */}
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-rose-400">
                                                {req.requestCode}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] tracking-wider uppercase ${getUrgencyBadge(
                                                    req.urgency,
                                                )}`}
                                            >
                                                {req.urgency}
                                            </span>
                                        </div>
                                        <h3 className="mt-1 text-base font-bold text-white">
                                            {req.hospitalName}
                                        </h3>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                                            req.status,
                                        )}`}
                                    >
                                        {req.status}
                                    </span>
                                </div>

                                {/* Patient & Required Info */}
                                <div className="mb-3 space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs">
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>Patient Name:</span>
                                        <strong className="text-white">
                                            {req.patientName} ({req.patientAge}
                                            y, {req.patientGender})
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>Required Group & Component:</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono font-black text-rose-400">
                                                {req.requiredBloodType}
                                            </span>
                                            <span className="font-semibold text-slate-200">
                                                {req.component}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>Units Requested:</span>
                                        <strong className="text-slate-100">
                                            {req.unitsRequested} unit(s)
                                        </strong>
                                    </div>
                                </div>

                                {/* Assigned Units info */}
                                {assignedUnits.length > 0 && (
                                    <div className="mb-3 rounded-xl border border-purple-800/40 bg-purple-950/30 p-2.5 text-xs">
                                        <span className="mb-1 block font-bold text-purple-300">
                                            Cross-Matched Units Assigned:
                                        </span>
                                        {assignedUnits.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center justify-between font-mono text-[11px] text-slate-300"
                                            >
                                                <span>
                                                    {u.unitNumber} (
                                                    {u.bloodType})
                                                </span>
                                                <span className="font-sans font-semibold text-emerald-400">
                                                    Passed Compatibility Check
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions & Dispatch details */}
                            <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                                <span className="font-mono text-[11px] text-slate-500">
                                    Req: {req.requestDate}
                                </span>

                                <div className="space-x-2">
                                    {req.status === 'Pending' && (
                                        <button
                                            onClick={() =>
                                                setCrossMatchReq(req)
                                            }
                                            className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                                        >
                                            <GitCompare className="h-3.5 w-3.5" />
                                            Cross-Match Units
                                        </button>
                                    )}

                                    {req.status === 'Cross-Matched' && (
                                        <button
                                            onClick={() => setDispatchReq(req)}
                                            className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
                                        >
                                            <Truck className="h-3.5 w-3.5" />
                                            Dispatch Cold Transport
                                        </button>
                                    )}

                                    {req.status === 'Dispatched' && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-cyan-400">
                                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                            Dispatched (
                                            {req.dispatchTemperatureC}°C)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cross-Match Modal */}
            {crossMatchReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <GitCompare className="h-5 w-5 text-purple-400" />
                                Electronic Cross-Match Unit Assignment
                            </h3>
                            <button
                                onClick={() => setCrossMatchReq(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                            <p className="font-bold text-slate-200">
                                {crossMatchReq.hospitalName}
                            </p>
                            <p className="text-slate-400">
                                Patient: {crossMatchReq.patientName} • Required
                                Type: {crossMatchReq.requiredBloodType} (
                                {crossMatchReq.component})
                            </p>
                        </div>

                        <form
                            onSubmit={handleCrossMatchSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Select Available Inventory Unit to
                                    Cross-Match:
                                </label>
                                <select
                                    value={selectedUnitId}
                                    onChange={(e) =>
                                        setSelectedUnitId(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                >
                                    <option value="">-- Choose Unit --</option>
                                    {units
                                        .filter((u) => u.status === 'Available')
                                        .map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.unitNumber} - Type{' '}
                                                {u.bloodType} ({u.component}) at{' '}
                                                {u.facilityName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setCrossMatchReq(null)}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedUnitId}
                                    className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                                >
                                    Verify Compatibility & Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cold Chain Dispatch Modal */}
            {dispatchReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <Truck className="h-5 w-5 text-cyan-400" />
                                Initiate Cold-Chain Dispatch
                            </h3>
                            <button
                                onClick={() => setDispatchReq(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <form
                            onSubmit={handleDispatchSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Courier Tracking Code
                                </label>
                                <input
                                    type="text"
                                    value={courierCode}
                                    onChange={(e) =>
                                        setCourierCode(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Verified Transport Container Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={dispatchTemp}
                                    onChange={(e) =>
                                        setDispatchTemp(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setDispatchReq(null)}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500"
                                >
                                    Confirm Dispatch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
