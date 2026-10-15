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
        <div className="rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm transition-colors">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200/60 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                        <Flame className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Live Stock Matrix by Blood Group
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Click any blood group to filter the inventory list below
                        </p>
                    </div>
                </div>

                {selectedType !== 'All' && (
                    <button
                        onClick={() => onSelectType('All')}
                        className="rounded-lg bg-slate-100 dark:bg-[#0B0F17] px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border border-slate-200 dark:border-[#222F44] hover:bg-slate-200 dark:hover:bg-[#1E293B] transition cursor-pointer"
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
                    const isCritical = count <= 2;
                    const isWarning = count > 2 && count <= 5;

                    return (
                        <button
                            key={type}
                            onClick={() => onSelectType(isSelected ? 'All' : type)}
                            className={`group relative overflow-hidden rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                                isSelected
                                    ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 shadow-xs ring-1 ring-red-500/30'
                                    : 'border-slate-200 dark:border-[#222F44] bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 hover:border-red-300 dark:hover:border-red-900/60 hover:bg-white dark:hover:bg-[#1E293B] shadow-2xs'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`font-mono text-lg font-black ${
                                        isSelected 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : 'text-slate-900 dark:text-slate-100'
                                    }`}
                                >
                                    {type}
                                </span>
                                {isUniversal && (
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                            isSelected 
                                                ? 'bg-red-200/60 dark:bg-red-500/20 text-red-800 dark:text-red-300' 
                                                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-500/20'
                                        }`}
                                    >
                                        Universal
                                    </span>
                                )}
                            </div>

                            <div className="mt-2.5 flex items-baseline justify-between">
                                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {count}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    units
                                </span>
                            </div>

                            {/* Consistent stock progress bar */}
                            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#222F44]">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        isCritical
                                            ? 'bg-red-500'
                                            : isWarning
                                              ? 'bg-amber-500'
                                              : 'bg-emerald-500'
                                    }`}
                                    style={{
                                        width: `${Math.min(100, Math.max(10, (count / 10) * 100))}%`,
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
