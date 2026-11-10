import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-gradient-to-tr from-red-600 to-red-500 shadow-md shadow-red-500/20">
                <HeartPulse className="h-4 w-4 animate-pulse text-white" />
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    BloodMatrix
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
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
