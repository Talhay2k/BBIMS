import React from 'react';
import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';
import {
    HeartPulse,
    Thermometer,
    ShieldCheck,
    CheckCircle2,
    Sun,
    Moon,
} from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-50 font-sans text-slate-900 transition-colors duration-200 selection:bg-red-500 selection:text-white lg:grid lg:grid-cols-12 dark:bg-slate-950 dark:text-slate-100">
            {/* Left Brand & Visual Column (Desktop 5 columns) */}
            <div className="relative sticky top-0 hidden h-screen flex-col justify-between overflow-hidden border-r border-slate-200 bg-gradient-to-br from-slate-100/90 via-white to-slate-100/70 p-6 text-slate-900 transition-colors lg:col-span-5 lg:flex xl:col-span-5 xl:p-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
                {/* Glowing Background Orbs */}
                <div className="pointer-events-none absolute top-0 left-0 -z-0 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />
                <div className="pointer-events-none absolute right-0 bottom-0 -z-0 h-80 w-80 rounded-full bg-red-700/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-30 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] dark:opacity-20" />

                {/* Top Brand Header */}
                <div className="relative z-10">
                    <Link
                        href={home()}
                        className="group inline-flex items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/30 bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-500/20 transition-transform group-hover:scale-105 dark:shadow-red-950/60">
                            <HeartPulse className="h-5 w-5 animate-pulse text-white" />
                        </div>
                        <div>
                            <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                BloodMatrix
                                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-red-700 uppercase dark:text-red-400">
                                    Enterprise Portal
                                </span>
                            </span>
                            <p className="-mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                Blood Bank, Hospital & Ministry Platform
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Middle Content - Target User Enterprise Features */}
                <div className="relative z-10 my-auto max-w-md space-y-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300">
                        <ShieldCheck className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                        <span>AABB & FDA 21 CFR Part 11 Certified</span>
                    </div>

                    <h2 className="text-2xl leading-tight font-extrabold text-slate-900 xl:text-3xl dark:text-white">
                        Unified Blood Supply & Telemetry Intelligence
                    </h2>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        Purpose-built for regional blood centers, hospital
                        emergency wards, and national health authorities.
                    </p>

                    {/* Target User Pillar Snippets */}
                    <div className="space-y-2 text-xs">
                        {/* Pillar 1: Blood Banks */}
                        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                                🩸
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-900 dark:text-white">
                                    Regional Blood Banks
                                </span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">
                                    24/7 cold-chain telemetry, unit intake logs
                                    & automated donor callouts.
                                </span>
                            </div>
                        </div>

                        {/* Pillar 2: Hospitals */}
                        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                🏥
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-900 dark:text-white">
                                    Hospital Trauma Networks
                                </span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">
                                    &lt; 3 min electronic cross-matching,
                                    emergency STAT dispatch & AI forecasting.
                                </span>
                            </div>
                        </div>

                        {/* Pillar 3: Health Ministries */}
                        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                🏛️
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-900 dark:text-white">
                                    Health Ministries & Audits
                                </span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">
                                    Vein-to-vein immutable audit logs, discard
                                    oversight & national safety metrics.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Quote & Footer */}
                <div className="relative z-10 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-[11px] leading-relaxed text-slate-600 italic dark:text-slate-400">
                        "BloodMatrix connects our central blood bank directly
                        with 14 satellite hospital ICUs. Emergency dispatch time
                        dropped by 91%."
                    </p>
                    <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-[10px] font-bold text-red-700 dark:bg-red-600/20 dark:text-red-300">
                            DR
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                Dr. Sarah Jenkins, MD
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Director of Clinical Transfusion Services
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Column (Desktop 7 columns, Mobile full width) */}
            <div className="relative flex min-h-screen flex-col overflow-y-auto bg-slate-50 p-4 text-slate-900 transition-colors sm:p-6 lg:col-span-7 lg:p-8 xl:col-span-7 dark:bg-slate-950 dark:text-slate-100">
                {/* Mobile Top Brand Header & Theme Switcher */}
                <div className="mb-5 flex items-center justify-between sm:mb-7">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 lg:hidden"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-600">
                            <HeartPulse className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                            BloodMatrix
                        </span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="ml-auto rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                            <Moon className="h-3.5 w-3.5 text-slate-700" />
                        )}
                    </button>
                </div>

                {/* Form Wrapper */}
                <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-3 sm:max-w-md">
                    {/* Header Text */}
                    {(title || description) && (
                        <div className="space-y-0.5 text-left">
                            {title && (
                                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-[11px] leading-tight text-slate-600 sm:text-xs dark:text-slate-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Form Children */}
                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-2 text-center text-[10px] text-slate-500 sm:text-[11px] dark:text-slate-400">
                    <span>
                        © 2026 BloodMatrix Inc. • FDA 21 CFR Part 11 Compliant
                    </span>
                </div>
            </div>
        </div>
    );
}
