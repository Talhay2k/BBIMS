import React, { useState } from 'react';
import { BloodType, ComponentType, BloodUnit } from './types';
import {
    GitCompare,
    CheckCircle2,
    XCircle,
    ShieldAlert,
    Sparkles,
    Layers,
    Info,
} from 'lucide-react';

interface CompatibilityTabProps {
    inventoryUnits: BloodUnit[];
}

export const CompatibilityEngineTab: React.FC<CompatibilityTabProps> = ({
    inventoryUnits,
}) => {
    const [recipientType, setRecipientType] = useState<BloodType>('O-');
    const [selectedComponent, setSelectedComponent] = useState<ComponentType>(
        'Packed Red Blood Cells',
    );

    const [testDonorType, setTestDonorType] = useState<BloodType>('A+');
    const [testRecipientType, setTestRecipientType] = useState<BloodType>('O-');
    const [testComponent, setTestComponent] = useState<ComponentType>(
        'Packed Red Blood Cells',
    );

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

    // Red Blood Cells Compatibility Matrix
    const rbcMatrix: Record<BloodType, BloodType[]> = {
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['O-', 'A-'],
        'A+': ['O-', 'O+', 'A-', 'A+'],
        'B-': ['O-', 'B-'],
        'B+': ['O-', 'O+', 'B-', 'B+'],
        'AB-': ['O-', 'A-', 'B-', 'AB-'],
        'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    };

    // Plasma Compatibility Matrix
    const plasmaMatrix: Record<BloodType, BloodType[]> = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+'],
    };

    const isPlasma =
        selectedComponent.includes('Plasma') ||
        selectedComponent.includes('Cryo');
    const matrix = isPlasma ? plasmaMatrix : rbcMatrix;
    const compatibleDonorTypes = matrix[recipientType] || [recipientType];

    const matchingAvailableUnits = inventoryUnits.filter(
        (u) =>
            u.status === 'Available' &&
            compatibleDonorTypes.includes(u.bloodType),
    );

    // Test simulator check
    const isTestPlasma =
        testComponent.includes('Plasma') || testComponent.includes('Cryo');
    const testMatrix = isTestPlasma ? plasmaMatrix : rbcMatrix;
    const isTestCompatible = (testMatrix[testRecipientType] || []).includes(
        testDonorType,
    );

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-900 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-purple-500/30 bg-purple-600/20 p-3 text-purple-400">
                        <GitCompare className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Automated Cross-Match & Compatibility Engine
                        </h2>
                        <p className="text-xs text-slate-400">
                            Real-time ABO/Rh antigens compatibility matrix and
                            plasma cross-match validation algorithms.
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Calculator Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Inputs */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                    <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-bold text-white">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        Recipient Compatibility Lookup
                    </h3>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-400">
                            Recipient Blood Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {bloodTypes.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setRecipientType(t)}
                                    className={`rounded-xl border py-2 font-mono text-xs font-black transition ${
                                        recipientType === t
                                            ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-900/40'
                                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-400">
                            Blood Component
                        </label>
                        <select
                            value={selectedComponent}
                            onChange={(e) =>
                                setSelectedComponent(
                                    e.target.value as ComponentType,
                                )
                            }
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-purple-500/50 focus:outline-none"
                        >
                            <option value="Packed Red Blood Cells">
                                Packed Red Blood Cells (PRBC)
                            </option>
                            <option value="Whole Blood">Whole Blood</option>
                            <option value="Platelets">Platelets</option>
                            <option value="Fresh Frozen Plasma">
                                Fresh Frozen Plasma (FFP)
                            </option>
                            <option value="Cryoprecipitate">
                                Cryoprecipitate
                            </option>
                        </select>
                    </div>

                    <div className="space-y-1 rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 text-xs">
                        <div className="flex items-center gap-1 font-medium text-slate-400">
                            <Info className="h-3.5 w-3.5 text-purple-400" />{' '}
                            Rule Summary:
                        </div>
                        <p className="text-slate-300">
                            {isPlasma
                                ? 'For Plasma: AB is Universal Donor. O is Universal Recipient.'
                                : 'For Red Cells: O- is Universal Donor. AB+ is Universal Recipient.'}
                        </p>
                    </div>
                </div>

                {/* Right Compatibility Results */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg lg:col-span-2">
                    <div>
                        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-white">
                                Compatible Donor Groups for Recipient{' '}
                                <span className="font-mono text-base font-extrabold text-purple-400">
                                    {recipientType}
                                </span>
                            </h3>
                            <span className="font-mono text-xs text-slate-400">
                                Available Stock:{' '}
                                <strong className="text-emerald-400">
                                    {matchingAvailableUnits.length} units
                                </strong>
                            </span>
                        </div>

                        {/* Donor Groups Grid */}
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {bloodTypes.map((t) => {
                                const isCompatible =
                                    compatibleDonorTypes.includes(t);
                                const availableCount = inventoryUnits.filter(
                                    (u) =>
                                        u.bloodType === t &&
                                        u.status === 'Available',
                                ).length;

                                return (
                                    <div
                                        key={t}
                                        className={`flex flex-col justify-between rounded-xl border p-3.5 transition ${
                                            isCompatible
                                                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                                                : 'border-slate-800 bg-slate-950/50 text-slate-600 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-lg font-black">
                                                {t}
                                            </span>
                                            {isCompatible ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-slate-600" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-[11px]">
                                            {isCompatible ? (
                                                <span className="font-semibold text-emerald-400">
                                                    COMPATIBLE ({availableCount}{' '}
                                                    in stock)
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">
                                                    Incompatible
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Matching Units List */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
                        <span className="mb-2 block font-bold text-slate-300">
                            Matching Ready Units in Inventory (
                            {matchingAvailableUnits.length}):
                        </span>
                        <div className="no-scrollbar flex max-h-28 flex-wrap gap-2 overflow-y-auto">
                            {matchingAvailableUnits.length === 0 ? (
                                <span className="text-slate-500">
                                    No available matching units in stock
                                    currently.
                                </span>
                            ) : (
                                matchingAvailableUnits.map((u) => (
                                    <span
                                        key={u.id}
                                        className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-slate-200"
                                    >
                                        {u.unitNumber} ({u.bloodType}) •{' '}
                                        {u.facilityName}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Pair Simulator Widget */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    Electronic Cross-Match Pair Validation Simulator
                </h3>

                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs text-slate-400">
                            Recipient Blood Group
                        </label>
                        <select
                            value={testRecipientType}
                            onChange={(e) =>
                                setTestRecipientType(
                                    e.target.value as BloodType,
                                )
                            }
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                        >
                            {bloodTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-slate-400">
                            Donor Unit Group
                        </label>
                        <select
                            value={testDonorType}
                            onChange={(e) =>
                                setTestDonorType(e.target.value as BloodType)
                            }
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                        >
                            {bloodTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-slate-400">
                            Transfusion Component
                        </label>
                        <select
                            value={testComponent}
                            onChange={(e) =>
                                setTestComponent(
                                    e.target.value as ComponentType,
                                )
                            }
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                        >
                            <option value="Packed Red Blood Cells">
                                Packed Red Blood Cells
                            </option>
                            <option value="Fresh Frozen Plasma">
                                Fresh Frozen Plasma
                            </option>
                        </select>
                    </div>
                </div>

                {/* Simulation Output Banner */}
                <div
                    className={`mt-4 flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold ${
                        isTestCompatible
                            ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                            : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
                    }`}
                >
                    {isTestCompatible ? (
                        <>
                            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                            <div>
                                <div className="text-sm font-bold text-emerald-400">
                                    PASSED: Electronic Cross-Match Compatible
                                </div>
                                <div className="text-slate-300">
                                    Donor unit{' '}
                                    <strong className="font-mono">
                                        {testDonorType}
                                    </strong>{' '}
                                    is safe for recipient{' '}
                                    <strong className="font-mono">
                                        {testRecipientType}
                                    </strong>{' '}
                                    ({testComponent}).
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-6 w-6 shrink-0 text-rose-500" />
                            <div>
                                <div className="text-sm font-bold text-rose-400">
                                    FAILED: Transfusion Incompatibility Risk
                                </div>
                                <div className="text-slate-300">
                                    CANNOT give{' '}
                                    <strong className="font-mono">
                                        {testDonorType}
                                    </strong>{' '}
                                    to recipient{' '}
                                    <strong className="font-mono">
                                        {testRecipientType}
                                    </strong>{' '}
                                    for {testComponent}. High risk of acute
                                    intravascular hemolysis!
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
