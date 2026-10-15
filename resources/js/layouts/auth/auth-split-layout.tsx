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
        <div className="relative w-full min-h-screen lg:grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-200">
            {/* Left Brand & Visual Column (Desktop 5 columns) */}
            <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-5 h-screen sticky top-0 flex-col justify-between p-6 xl:p-8 bg-gradient-to-br from-slate-100/90 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
                {/* Glowing Background Orbs */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-700/10 rounded-full blur-3xl pointer-events-none -z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 dark:opacity-20 pointer-events-none" />

                {/* Top Brand Header */}
                <div className="relative z-10">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2.5 group"
                    >
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/20 dark:shadow-rose-950/60 border border-rose-400/30 group-hover:scale-105 transition-transform">
                            <HeartPulse className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                BloodMatrix
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                                    Enterprise Portal
                                </span>
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Blood Bank, Hospital & Ministry Platform</p>
                        </div>
                    </Link>
                </div>

                {/* Middle Content - Target User Enterprise Features */}
                <div className="relative z-10 space-y-4 my-auto max-w-md">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        <span>AABB & FDA 21 CFR Part 11 Certified</span>
                    </div>

                    <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        Unified Blood Supply & Telemetry Intelligence
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Purpose-built for regional blood centers, hospital emergency wards, and national health authorities.
                    </p>

                    {/* Target User Pillar Snippets */}
                    <div className="space-y-2 text-xs">
                        {/* Pillar 1: Blood Banks */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex items-start gap-2.5 transition-colors">
                            <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                                🩸
                            </div>
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Regional Blood Banks</span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">24/7 cold-chain telemetry, unit intake logs & automated donor callouts.</span>
                            </div>
                        </div>

                        {/* Pillar 2: Hospitals */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex items-start gap-2.5 transition-colors">
                            <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                🏥
                            </div>
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Hospital Trauma Networks</span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">&lt; 3 min electronic cross-matching, emergency STAT dispatch & AI forecasting.</span>
                            </div>
                        </div>

                        {/* Pillar 3: Health Ministries */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex items-start gap-2.5 transition-colors">
                            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                🏛️
                            </div>
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Health Ministries & Audits</span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400">Vein-to-vein immutable audit logs, discard oversight & national safety metrics.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Quote & Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] italic text-slate-600 dark:text-slate-400 leading-relaxed">
                        "BloodMatrix connects our central blood bank directly with 14 satellite hospital ICUs. Emergency dispatch time dropped by 91%."
                    </p>
                    <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-rose-500/10 dark:bg-rose-600/20 border border-rose-500/30 flex items-center justify-center font-bold text-[10px] text-rose-700 dark:text-rose-300">
                            DR
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins, MD</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Director of Clinical Transfusion Services</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Column (Desktop 7 columns, Mobile full width) */}
            <div className="lg:col-span-7 xl:col-span-7 min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* Mobile Top Brand Header & Theme Switcher */}
                <div className="flex items-center justify-between mb-5 sm:mb-7">
                    <Link href={home()} className="flex items-center gap-2 lg:hidden">
                        <div className="h-7 w-7 rounded-xl bg-rose-600 flex items-center justify-center">
                            <HeartPulse className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">BloodMatrix</span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="ml-auto p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
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
                <div className="mx-auto w-full max-w-sm sm:max-w-md flex-1 flex flex-col justify-center gap-3">
                    {/* Header Text */}
                    {(title || description) && (
                        <div className="space-y-0.5 text-left">
                            {title && (
                                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-tight">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Form Children */}
                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    <span>© 2026 BloodMatrix Inc. • FDA 21 CFR Part 11 Compliant</span>
                </div>
            </div>
        </div>
    );
}

