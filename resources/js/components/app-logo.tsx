import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-md shadow-rose-500/20 border border-rose-400/30 shrink-0">
                <HeartPulse className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm tracking-tight">
                    BloodMatrix
                    <span className="text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Enterprise
                    </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Blood Bank & Hospital System
                </span>
            </div>
        </div>
    );
}

