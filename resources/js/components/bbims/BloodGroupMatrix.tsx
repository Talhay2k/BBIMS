import React from 'react';
import { BloodUnit, BloodType } from './types';
import { Flame } from 'lucide-react';

interface BloodMatrixProps {
    units: BloodUnit[];
    selectedType: string;
    onSelectType: (type: string) => void;
}

export const BloodGroupMatrix: React.FC<BloodMatrixProps> = ({
    units,
    selectedType,
    onSelectType,
}) => {
    const bloodTypes: BloodType[] = [
        'O-',
        'O+',
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
    ];

    const getStockCount = (type: BloodType) => {
        return (units || []).filter(
            (u) =>
                u.bloodType === type &&
                (u.status === 'Available' || u.status === 'Cross-Matched'),
        ).length;
    };

    return (
        <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400">
                        <Flame className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            Live Stock Matrix by Blood Group
                        </h3>
                        <p className="text-[11px] text-slate-400">
                            Click any blood group to quickly filter the
                            inventory list below
                        </p>
                    </div>
                </div>

                {selectedType !== 'All' && (
                    <button
                        onClick={() => onSelectType('All')}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-rose-400 transition hover:bg-slate-700"
                    >
                        Reset Filter (Showing {selectedType})
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {bloodTypes.map((type) => {
                    const count = getStockCount(type);
                    const isSelected = selectedType === type;
                    const isUniversal = type === 'O-';
                    const isLow = count <= 2;

                    return (
                        <button
                            key={type}
                            onClick={() =>
                                onSelectType(isSelected ? 'All' : type)
                            }
                            className={`group relative overflow-hidden rounded-xl border p-3.5 text-left transition-all ${
                                isSelected
                                    ? 'scale-[1.02] border-rose-400 bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                                    : 'border-slate-800/80 bg-slate-950/60 text-slate-200 hover:border-rose-500/40 hover:bg-slate-900/90'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`font-mono text-lg font-black ${isSelected ? 'text-white' : 'text-rose-400'}`}
                                >
                                    {type}
                                </span>
                                {isUniversal && (
                                    <span
                                        className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'}`}
                                    >
                                        Universal
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 flex items-baseline justify-between">
                                <span
                                    className={`text-2xl font-extrabold ${isSelected ? 'text-white' : 'text-white'}`}
                                >
                                    {count}
                                </span>
                                <span
                                    className={`text-[10px] font-medium ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}
                                >
                                    units
                                </span>
                            </div>

                            {/* Stock status indicator bar */}
                            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/60">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        isLow
                                            ? 'bg-amber-400'
                                            : isSelected
                                              ? 'bg-white'
                                              : 'bg-rose-500'
                                    }`}
                                    style={{
                                        width: `${Math.min(100, (count / 10) * 100)}%`,
                                    }}
                                ></div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
