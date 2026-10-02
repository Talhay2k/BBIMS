import React from 'react';
import { Facility, StorageEquipment } from './types';
import {
    Building2,
    Thermometer,
    Warehouse,
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    Activity,
} from 'lucide-react';

interface FacilitiesTabProps {
    facilities: Facility[];
    equipment: StorageEquipment[];
}

export const StorageFacilitiesTab: React.FC<FacilitiesTabProps> = ({
    facilities,
    equipment,
}) => {
    return (
        <div className="space-y-6">
            {/* Facilities Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {facilities.map((fac) => (
                    <div
                        key={fac.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg"
                    >
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-rose-400">
                                    {fac.code}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${
                                        fac.status === 'Operational'
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                            : 'border-amber-500/30 bg-amber-500/20 text-amber-300'
                                    }`}
                                >
                                    {fac.status}
                                </span>
                            </div>
                            <h3 className="mb-1 text-base font-bold text-white">
                                {fac.name}
                            </h3>
                            <p className="mb-3 text-xs font-medium text-slate-400">
                                {fac.city}
                            </p>

                            <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center text-xs">
                                <div>
                                    <span className="block text-[10px] text-slate-500 uppercase">
                                        Stock Units
                                    </span>
                                    <span className="text-sm font-bold text-emerald-400">
                                        {fac.totalUnitsInStock || 0}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-500 uppercase">
                                        Available
                                    </span>
                                    <span className="text-sm font-bold text-blue-400">
                                        {fac.availableUnits || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                            <span>Refrigerators: {fac.refrigeratorsCount}</span>
                            <span>Freezers: {fac.freezersCount}</span>
                            <span>Agitators: {fac.agitatorsCount}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Storage Equipment Telemetry Monitors */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h3 className="flex items-center gap-2 text-base font-bold text-white">
                            <Thermometer className="h-5 w-5 text-emerald-400" />
                            Cold Storage Equipment Telemetry & Temp Alarms
                        </h3>
                        <p className="text-xs text-slate-400">
                            Real-time sensor feeds for temperature compliance
                            zones (2-6°C Refrigerator, -30°C Freezer, 20-24°C
                            Agitator).
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        <Activity className="h-3.5 w-3.5 animate-pulse" />{' '}
                        Telemetry Active
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {equipment.map((eq) => {
                        const isNormal = eq.status === 'Normal';
                        const percentCapacity = Math.round(
                            (eq.occupiedUnits / eq.capacityUnits) * 100,
                        );

                        return (
                            <div
                                key={eq.id}
                                className={`rounded-xl border p-4 shadow-md transition ${
                                    isNormal
                                        ? 'border-slate-800 bg-slate-950/80'
                                        : 'border-amber-500/40 bg-amber-950/20'
                                }`}
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <h4 className="text-xs font-bold text-white">
                                        {eq.name}
                                    </h4>
                                    <span
                                        className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${
                                            isNormal
                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                : 'border-amber-500/30 bg-amber-500/20 text-amber-300'
                                        }`}
                                    >
                                        {eq.status}
                                    </span>
                                </div>

                                <p className="mb-3 text-[11px] text-slate-400">
                                    {eq.type}
                                </p>

                                <div className="mb-3 flex items-baseline justify-between rounded-lg border border-slate-800/80 bg-slate-900/90 p-2.5">
                                    <span className="text-xs font-medium text-slate-400">
                                        Current Sensor Temp:
                                    </span>
                                    <span
                                        className={`font-mono text-lg font-black ${
                                            isNormal
                                                ? 'text-emerald-400'
                                                : 'text-amber-400'
                                        }`}
                                    >
                                        {eq.currentTempC}°C
                                    </span>
                                </div>

                                <div className="space-y-1 text-[11px]">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Capacity Utilization:</span>
                                        <strong className="text-slate-200">
                                            {eq.occupiedUnits} /{' '}
                                            {eq.capacityUnits} units (
                                            {percentCapacity}%)
                                        </strong>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{
                                                width: `${percentCapacity}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
