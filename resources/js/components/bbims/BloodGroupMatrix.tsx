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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:p-6 dark:border-[#222F44] dark:bg-[#161D2A]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200/60 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        <Flame className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Live Stock Matrix by Blood Group
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Click any blood group to filter the inventory list
                            below
                        </p>
                    </div>
                </div>

                {selectedType !== 'All' && (
                    <button
                        onClick={() => onSelectType('All')}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-slate-200 dark:border-[#222F44] dark:bg-[#0B0F17] dark:text-red-400 dark:hover:bg-[#1E293B]"
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
                    const isEmpty = count === 0;
                    const isCritical = count > 0 && count <= 2;
                    const isWarning = count > 2 && count <= 5;

                    return (
                        <button
                            key={type}
                            onClick={() =>
                                onSelectType(isSelected ? 'All' : type)
                            }
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 text-left transition-all ${
                                isSelected
                                    ? 'border-red-500 bg-red-50 text-red-700 shadow-xs ring-1 ring-red-500/30 dark:bg-red-500/10 dark:text-red-400'
                                    : isEmpty
                                      ? 'border-slate-200/70 bg-slate-50/60 text-slate-600 shadow-2xs hover:border-slate-300 hover:bg-slate-100/70 dark:border-[#222F44]/50 dark:bg-[#0B0F17]/50 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-[#131926]'
                                      : 'border-slate-200 bg-white text-slate-800 shadow-xs hover:border-red-300 hover:bg-white dark:border-[#222F44] dark:bg-[#0B0F17] dark:text-slate-200 dark:hover:border-red-900/60 dark:hover:bg-[#1E293B]'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`font-mono text-lg ${
                                        isSelected
                                            ? 'font-black text-red-600 dark:text-red-400'
                                            : isEmpty
                                              ? 'font-bold text-slate-500 dark:text-slate-400'
                                              : 'font-black text-slate-900 dark:text-slate-100'
                                    }`}
                                >
                                    {type}
                                </span>
                                {isUniversal && (
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                            isSelected
                                                ? 'bg-red-200/60 text-red-800 dark:bg-red-500/20 dark:text-red-300'
                                                : isEmpty
                                                  ? 'border border-slate-200/80 bg-slate-100/80 text-slate-400 dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-500'
                                                  : 'border border-red-200/60 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'
                                        }`}
                                    >
                                        Universal
                                    </span>
                                )}
                            </div>

                            <div className="mt-2.5 flex items-baseline justify-between">
                                <span
                                    className={`text-2xl tracking-tight ${
                                        isSelected
                                            ? 'font-bold text-red-600 dark:text-red-400'
                                            : isEmpty
                                              ? 'font-medium text-slate-400 dark:text-slate-500'
                                              : 'font-extrabold text-slate-900 dark:text-slate-100'
                                    }`}
                                >
                                    {count}
                                </span>
                                <span
                                    className={`text-[11px] ${
                                        isSelected
                                            ? 'font-semibold text-red-500/80 dark:text-red-400/80'
                                            : isEmpty
                                              ? 'font-normal text-slate-400/70 dark:text-slate-500/70'
                                              : 'font-semibold text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    units
                                </span>
                            </div>

                            {/* Mini progress bar / bottom indicator */}
                            <div
                                className={`mt-2.5 h-1.5 w-full overflow-hidden rounded-full transition-all ${
                                    isEmpty
                                        ? 'bg-slate-100 opacity-35 dark:bg-slate-800/50'
                                        : 'bg-slate-200 dark:bg-[#222F44]'
                                }`}
                            >
                                {isEmpty ? (
                                    <div className="h-full w-full bg-slate-300/40 opacity-30 dark:bg-slate-700/40" />
                                ) : (
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            isCritical
                                                ? 'bg-red-500'
                                                : isWarning
                                                  ? 'bg-amber-500'
                                                  : 'bg-emerald-500'
                                        }`}
                                        style={{
                                            width: `${Math.min(100, Math.max(16, (count / 10) * 100))}%`,
                                        }}
                                    />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
