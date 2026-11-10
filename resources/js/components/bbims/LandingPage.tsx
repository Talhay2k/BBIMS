import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Droplet,
    Activity,
    ShieldCheck,
    Zap,
    Thermometer,
    BrainCircuit,
    Truck,
    Building2,
    Users,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Clock,
    TrendingUp,
    BarChart3,
    Database,
    Lock,
    Award,
    ChevronDown,
    ChevronUp,
    Calculator,
    Play,
    HeartPulse,
    FileText,
    AlertTriangle,
    Layers,
    Globe,
    LogIn,
    UserPlus,
    Menu,
    X,
    Check,
    Sun,
    Moon,
} from 'lucide-react';
import { BloodUnit, DonorRecord, RequestRecord } from './types';
import { useAppearance } from '@/hooks/use-appearance';

interface LandingPageProps {
    onLaunchApp: () => void;
    units: BloodUnit[];
    donors: DonorRecord[];
    requests: RequestRecord[];
}

export function LandingPage({
    onLaunchApp,
    units = [],
    donors = [],
    requests = [],
}: LandingPageProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [selectedBloodType, setSelectedBloodType] = useState<string>('O-');
    const [compatibilityType, setCompatibilityType] = useState<
        'redCells' | 'plasma'
    >('redCells');
    const [bedCount, setBedCount] = useState<number>(350);
    const [monthlyUnits, setMonthlyUnits] = useState<number>(800);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [activeTabPreview, setActiveTabPreview] = useState<
        'dashboard' | 'ai' | 'crossmatch' | 'coldchain'
    >('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    // Compatibility Rules Data
    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    const getRedCellRecipientTypes = (type: string) => {
        switch (type) {
            case 'O-':
                return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Red Cell Donor
            case 'O+':
                return ['O+', 'A+', 'B+', 'AB+'];
            case 'A-':
                return ['A-', 'A+', 'AB-', 'AB+'];
            case 'A+':
                return ['A+', 'AB+'];
            case 'B-':
                return ['B-', 'B+', 'AB-', 'AB+'];
            case 'B+':
                return ['B+', 'AB+'];
            case 'AB-':
                return ['AB-', 'AB+'];
            case 'AB+':
                return ['AB+'];
            default:
                return [];
        }
    };

    const getRedCellDonorTypes = (type: string) => {
        switch (type) {
            case 'O-':
                return ['O-'];
            case 'O+':
                return ['O-', 'O+'];
            case 'A-':
                return ['O-', 'A-'];
            case 'A+':
                return ['O-', 'O+', 'A-', 'A+'];
            case 'B-':
                return ['O-', 'B-'];
            case 'B+':
                return ['O-', 'O+', 'B-', 'B+'];
            case 'AB-':
                return ['O-', 'A-', 'B-', 'AB-'];
            case 'AB+':
                return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Recipient
            default:
                return [];
        }
    };

    const getPlasmaRecipientTypes = (type: string) => {
        // Plasma compatibility is inverse of red cell compatibility
        switch (type) {
            case 'AB+':
                return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Plasma Donor
            case 'AB-':
                return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
            case 'A+':
            case 'A-':
                return ['O-', 'O+', 'A-', 'A+'];
            case 'B+':
            case 'B-':
                return ['O-', 'O+', 'B-', 'B+'];
            case 'O+':
            case 'O-':
                return ['O-', 'O+'];
            default:
                return [];
        }
    };

    // ROI Calculations
    const annualExpiryWasteSaved = Math.round(monthlyUnits * 12 * 0.082); // 8.2% average waste prevented
    const annualCostSavedDollars = Math.round(annualExpiryWasteSaved * 280); // $280 per blood unit avg cost
    const dispatchTimeReductionMinutes = Math.round(42 - 3.5); // reduced from 42m to 3.5m

    const availableUnitsCount = units.filter(
        (u) => u.status === 'Available',
    ).length;
    const criticalTypes = ['O-', 'AB-', 'B-'];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-200 selection:bg-red-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
            {/* Top Glow Highlights */}
            <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 bg-gradient-to-b from-red-900/10 via-red-600/5 to-transparent blur-3xl dark:from-red-900/20 dark:via-red-600/10" />
            <div className="pointer-events-none absolute top-1/3 left-0 -z-10 h-[500px] w-[500px] bg-red-500/5 blur-3xl dark:bg-red-950/20" />
            <div className="pointer-events-none absolute top-2/3 right-0 -z-10 h-[500px] w-[500px] bg-red-500/5 blur-3xl dark:bg-red-950/20" />

            {/* Sticky Header / Navbar */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-950/90">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-950/30 dark:shadow-red-950/50">
                            <HeartPulse className="h-6 w-6 animate-pulse text-white" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold tracking-tight whitespace-nowrap text-slate-900 dark:text-white">
                                    BloodMatrix
                                </span>
                                <span className="hidden rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold tracking-wider whitespace-nowrap text-red-600 uppercase sm:inline-block dark:text-red-400">
                                    Enterprise v3.0
                                </span>
                            </div>
                            <p className="text-[10px] whitespace-nowrap text-slate-500 sm:text-[11px] dark:text-slate-400">
                                Blood Bank & Logistics Platform
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links (Desktop Only) */}
                    <nav className="hidden items-center gap-4 text-xs font-medium text-slate-600 lg:flex xl:gap-7 dark:text-slate-300">
                        <a
                            href="#overview"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            Overview
                        </a>
                        <a
                            href="#features"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            Features
                        </a>
                        <a
                            href="#matrix"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            Compatibility Engine
                        </a>
                        <a
                            href="#ai-intelligence"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            AI & Cold-Chain
                        </a>
                        <a
                            href="#roi-calculator"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            ROI Calculator
                        </a>
                        <a
                            href="#compliance"
                            className="whitespace-nowrap transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                            Compliance
                        </a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Theme Mode Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-colors hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                            title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-700" />
                            )}
                        </button>
                        <Link
                            href="/login"
                            className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-200 sm:inline-flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                        >
                            <LogIn className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                            <span>Sign In</span>
                        </Link>
                        <Link
                            href="/register"
                            className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-200 sm:inline-flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                        >
                            <UserPlus className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                            <span>Sign Up</span>
                        </Link>

                        {/* Mobile & Tablet Hamburger Toggle */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-colors hover:text-slate-900 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                            aria-label="Toggle Navigation"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile & Tablet Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="animate-in space-y-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur-xl duration-200 fade-in slide-in-from-top-3 lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
                        <nav className="flex flex-col gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <a
                                href="#overview"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between border-b border-slate-100 py-2 hover:text-red-500 dark:border-slate-900"
                            >
                                <span>Overview</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a
                                href="#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between border-b border-slate-100 py-2 hover:text-red-500 dark:border-slate-900"
                            >
                                <span>Features</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a
                                href="#matrix"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between border-b border-slate-100 py-2 hover:text-red-500 dark:border-slate-900"
                            >
                                <span>Compatibility Engine</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a
                                href="#ai-intelligence"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between border-b border-slate-100 py-2 hover:text-red-500 dark:border-slate-900"
                            >
                                <span>AI & Cold-Chain</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a
                                href="#roi-calculator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between border-b border-slate-100 py-2 hover:text-red-500 dark:border-slate-900"
                            >
                                <span>ROI Calculator</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a
                                href="#compliance"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2 hover:text-red-500"
                            >
                                <span>Compliance</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                        </nav>
                        <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                            <button
                                onClick={toggleTheme}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <>
                                        <Sun className="h-4 w-4 text-amber-400" />
                                        <span>Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-4 w-4 text-slate-700" />
                                        <span>Dark Mode</span>
                                    </>
                                )}
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <LogIn className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <UserPlus className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Live Ticker Bar */}
            <div className="border-b border-slate-200 bg-slate-100/90 px-4 py-2 text-xs dark:border-slate-800 dark:bg-slate-900/90">
                <div className="no-scrollbar mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                        <span className="font-semibold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                            Live System Status:
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                            All Cold-Chain Vaults Optimal (2.8°C)
                        </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-6 text-slate-700 dark:text-slate-300">
                        <span>
                            Available Units:{' '}
                            <strong className="text-slate-900 dark:text-white">
                                {availableUnitsCount > 0
                                    ? availableUnitsCount
                                    : 148}
                            </strong>
                        </span>
                        <span>
                            Active Donors:{' '}
                            <strong className="text-slate-900 dark:text-white">
                                {donors.length > 0 ? donors.length : 84}
                            </strong>
                        </span>
                        <span>
                            Pending Requests:{' '}
                            <strong className="font-bold text-amber-600 dark:text-amber-400">
                                {requests.length > 0 ? requests.length : 3}
                            </strong>
                        </span>
                        <span>
                            Critical Types:{' '}
                            <strong className="text-red-600 dark:text-red-400">
                                {criticalTypes.join(', ')}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section
                id="overview"
                className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-4xl space-y-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-medium text-red-700 backdrop-blur-md dark:text-red-300">
                        <Sparkles className="h-3.5 w-3.5 animate-spin text-red-500 dark:text-red-400" />
                        <span>
                            AABB & FDA 21 CFR Part 11 Compliant Software
                        </span>
                        <span className="h-1 w-1 rounded-full bg-red-500 dark:bg-red-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                            Zero Expiry Loss Target
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                        Precision Blood Supply Chain &{' '}
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-400 dark:via-red-400 dark:to-amber-300">
                            AI Inventory Intelligence
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto max-w-3xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg dark:text-slate-300">
                        BloodMatrix empowers hospital networks, regional blood
                        centers, and emergency trauma hubs to automate
                        cold-chain tracking, instantly cross-match units,
                        forecast stock shortages, and eliminate life-threatening
                        blood inventory waste.
                    </p>

                    {/* Quick Highlights */}
                    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 pt-8 text-left md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none">
                            <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                                <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                &lt; 3 mins
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Cross-Match Verification
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none">
                            <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                99.4%
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                AI Expiry Prevention Rate
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none">
                            <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                                <Thermometer className="h-5 w-5 text-red-600 dark:text-red-400" />
                                2°C – 6°C
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Cold-Chain Vault Telemetry
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none">
                            <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                FDA & AABB
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Regulatory Audit Ready
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero Showcase Image Frame */}
                <div className="relative mx-auto mt-14 max-w-5xl rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-500/20 via-slate-200/40 to-slate-300/80 p-2 shadow-2xl shadow-red-950/20 dark:via-slate-800/40 dark:to-slate-900/80 dark:shadow-red-950/50">
                    <div className="group relative overflow-hidden rounded-xl bg-slate-900 dark:bg-slate-950">
                        <img
                            src="/images/hero.png"
                            alt="BloodMatrix Dashboard Interface Preview"
                            className="max-h-[520px] w-full rounded-xl object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                            onError={(e) => {
                                // Fallback placeholder in case image URL is blocked
                                (e.target as HTMLElement).style.display =
                                    'none';
                            }}
                        />

                        {/* Floating Live Badge Overlays (Desktop) */}
                        <div className="absolute top-6 left-6 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3.5 shadow-xl backdrop-blur-md sm:flex dark:border-slate-800 dark:bg-slate-950/90">
                            <div className="h-3 w-3 animate-ping rounded-full bg-emerald-500" />
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Trauma Dispatch Clearing
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Request #REQ-2026-8491 • Approved
                                </p>
                            </div>
                        </div>

                        <div className="absolute right-6 bottom-6 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3.5 shadow-xl backdrop-blur-md sm:flex dark:border-slate-800 dark:bg-slate-950/90">
                            <BrainCircuit className="h-5 w-5 animate-pulse text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    AI Forecast Engine
                                </p>
                                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                    Demand Surge Detected (+35% O- required)
                                </p>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />
                    </div>

                    {/* Inline Mobile Telemetry Badges */}
                    <div className="grid grid-cols-1 gap-2 pt-3 sm:hidden">
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                            <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                                Trauma Dispatch Clearing
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                Approved
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                            <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                AI Demand Forecast
                            </span>
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300">
                                +35% O- Surge
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Blood & Plasma Compatibility Matrix Widget */}
            <section
                id="matrix"
                className="relative border-y border-slate-200 bg-slate-100/60 py-20 dark:border-slate-800/80 dark:bg-slate-900/50"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-red-600 uppercase dark:text-red-400">
                            Interactive Clinical Tool
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                            Blood & Component Compatibility Engine
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Select any donor blood type below to visually test
                            real-time red cell and plasma recipient
                            compatibility.
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
                        {/* Component Toggle */}
                        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                            <button
                                onClick={() => setCompatibilityType('redCells')}
                                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                                    compatibilityType === 'redCells'
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                                        : 'border border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                🩸 Packed Red Blood Cells (PRBC)
                            </button>
                            <button
                                onClick={() => setCompatibilityType('plasma')}
                                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                                    compatibilityType === 'plasma'
                                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                                        : 'border border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                🧪 Fresh Frozen Plasma (FFP) & Platelets
                            </button>
                        </div>

                        {/* Blood Type Picker Grid */}
                        <div className="mb-8">
                            <label className="mb-3 block text-center text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Select Donor Blood Group
                            </label>
                            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
                                {bloodTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() =>
                                            setSelectedBloodType(type)
                                        }
                                        className={`rounded-xl border py-3 font-mono text-sm font-bold transition-all ${
                                            selectedBloodType === type
                                                ? 'scale-105 border-red-400 bg-red-500 text-white shadow-lg ring-2 shadow-red-950/20 ring-red-500/50'
                                                : 'dark:hover:bg-slate-850 border-slate-200 bg-slate-50 text-slate-800 hover:border-red-400 hover:bg-red-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compatibility Results Card */}
                        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/90">
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    Compatible Recipient Blood Types
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(compatibilityType === 'redCells'
                                        ? getRedCellRecipientTypes(
                                              selectedBloodType,
                                          )
                                        : getPlasmaRecipientTypes(
                                              selectedBloodType,
                                          )
                                    ).map((recipient) => (
                                        <span
                                            key={recipient}
                                            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 font-mono text-sm font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                            {recipient}
                                        </span>
                                    ))}
                                </div>
                                {selectedBloodType === 'O-' &&
                                    compatibilityType === 'redCells' && (
                                        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-xs font-medium text-red-700 dark:text-red-400">
                                            🌟 Universal Red Cell Donor: O-
                                            negative units can be safely
                                            transfused to patients of ANY blood
                                            type in emergency trauma settings!
                                        </p>
                                    )}
                                {selectedBloodType === 'AB+' &&
                                    compatibilityType === 'plasma' && (
                                        <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                                            🌟 Universal Plasma Donor: AB+
                                            plasma carries zero anti-A/anti-B
                                            antibodies and is universal for all
                                            plasma recipients!
                                        </p>
                                    )}
                            </div>

                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    Safe Donor Sources For {selectedBloodType}{' '}
                                    Patients
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {getRedCellDonorTypes(
                                        selectedBloodType,
                                    ).map((donor) => (
                                        <span
                                            key={donor}
                                            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-mono text-sm font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                                            {donor}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Electronic cross-matching algorithms
                                    automatically enforce major and minor
                                    antibody screening protocols before
                                    clearance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section
                id="features"
                className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
            >
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-red-600 uppercase dark:text-red-400">
                        Enterprise Architecture
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Built for Zero-Failure Medical Operations
                    </h2>
                    <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                        Six specialized intelligence modules seamlessly
                        synchronized across hospital networks.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-red-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
                            <Thermometer className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            Cold-Chain IoT Vault Sensors
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Continuous 24/7 temperature telemetry (2°C–6°C for
                            PRBC, -30°C for FFP) with automated breach alerts,
                            quarantine locks, and backup freezer triggers.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
                            Live Sensor Integration{' '}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 2 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-purple-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-600 transition-transform group-hover:scale-110 dark:text-purple-400">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            AI Expiry & Demand Forecasting
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Machine learning models analyze historical
                            transfusion velocity and local surgical schedules to
                            predict stock shortages 7 days ahead.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                            98.4% Demand Accuracy{' '}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 3 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-amber-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110 dark:text-amber-400">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            Electronic Cross-Match Engine
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Instant digital verification of donor-recipient
                            compatibility with automated antibody screening
                            clearance in under 180 seconds.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            Trauma-Clear Dispatch{' '}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 4 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-blue-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-110 dark:text-blue-400">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            Multi-Hospital Logistics Hub
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Synchronize inventory across central blood banks,
                            satellite hospital fridges, and mobile transit units
                            with cold-chain transport logging.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                            Multi-Tenant Sync <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 5 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            Donor Loyalty & Drive Portal
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Automated SMS callouts trigger when rare blood types
                            (e.g. O- / AB-) drop below safety thresholds,
                            driving mobile blood drive signups.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Automated Mobilization{' '}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 6 */}
                    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-100 transition-all hover:-translate-y-1 hover:border-red-500/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                            Audit Compliance & Discard Logs
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Immutable audit trail tracking every unit from
                            vein-to-vein. Generate FDA 21 CFR Part 11 compliant
                            regulatory reports with one click.
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
                            FDA Regulatory Ready{' '}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Interface Preview Tabs */}
            <section
                id="ai-intelligence"
                className="border-t border-slate-200 bg-slate-100/50 py-20 dark:border-slate-800/80 dark:bg-slate-900/30"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            Experience the Command Center Platform
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Explore live module views powering modern blood bank
                            operations.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="no-scrollbar mb-8 flex justify-center overflow-x-auto border-b border-slate-200 dark:border-slate-800">
                        <div className="flex gap-4 p-1">
                            {[
                                {
                                    id: 'dashboard',
                                    label: 'Command Overview',
                                    icon: Activity,
                                },
                                {
                                    id: 'ai',
                                    label: 'AI Forecasting Engine',
                                    icon: BrainCircuit,
                                },
                                {
                                    id: 'crossmatch',
                                    label: 'Electronic Cross-Match',
                                    icon: Zap,
                                },
                                {
                                    id: 'coldchain',
                                    label: 'Cold Chain Vaults',
                                    icon: Thermometer,
                                },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTabPreview(tab.id as any)
                                        }
                                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 sm:px-5 sm:py-3 text-xs font-bold transition-all ${
                                            activeTabPreview === tab.id
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                                                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview Cards */}
                    <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
                        {activeTabPreview === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Main Inventory Matrix & Alert
                                            Dashboard
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Live monitoring across 8 blood
                                            groups and 4 storage facilities
                                        </p>
                                    </div>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                    >
                                        Get Started →
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            O- Negative (Universal)
                                        </span>
                                        <div className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">
                                            14 Units (Low)
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            A+ Positive
                                        </span>
                                        <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                            68 Units (Optimal)
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            B+ Positive
                                        </span>
                                        <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                            42 Units (Optimal)
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            AB- Negative
                                        </span>
                                        <div className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                                            6 Units (Reserve)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'ai' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    AI 7-Day Stock Risk Prediction
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Predictive models highlight upcoming
                                    surgical demand spikes to ensure zero
                                    emergency shortages.
                                </p>
                                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-xs text-purple-900 dark:border-purple-500/30 dark:bg-purple-950/30 dark:text-purple-200">
                                    🤖 AI Recommendation: Schedule targeted O-
                                    donor drive before Thursday to offset
                                    projected trauma surgery demand (+18 units
                                    required).
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'crossmatch' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Electronic Cross-Matching & Dispatch
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Automates major/minor cross-match checks,
                                    verifying unit expiration dates and
                                    cold-chain integrity before releasing
                                    dispatch codes.
                                </p>
                                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200">
                                    <span>
                                        Cross-Match Status:{' '}
                                        <strong>
                                            PASSED (100% Compatible)
                                        </strong>
                                    </span>
                                    <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-slate-950">
                                        Ready for Courier Dispatch
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'coldchain' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Real-Time Cold-Chain Telemetry
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Monitors ambient & internal fridge
                                    temperatures continuously. Triggers instant
                                    acoustic and SMS alarms if temperature
                                    strays outside 2.0°C–6.0°C range.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            Vault Alpha (PRBC)
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            3.4°C
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            Freezer Gamma (FFP)
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            -31.2°C
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Interactive ROI & Impact Calculator */}
            <section
                id="roi-calculator"
                className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
            >
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                        Quantifiable Impact
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Calculate Your Hospital Network's Savings
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Adjust your bed count and monthly transfusion volume to
                        estimate annual blood expiry waste reduction and cost
                        savings.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-6 md:p-8 shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Slider 1 */}
                        <div>
                            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Hospital Network Beds</span>
                                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                    {bedCount} Beds
                                </span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="1500"
                                step="25"
                                value={bedCount}
                                onChange={(e) =>
                                    setBedCount(Number(e.target.value))
                                }
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600 dark:bg-slate-800"
                            />
                            <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                                <span>50 Beds</span>
                                <span>1,500 Beds</span>
                            </div>
                        </div>

                        {/* Slider 2 */}
                        <div>
                            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Monthly Transfusion Volume</span>
                                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                    {monthlyUnits} Units/mo
                                </span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="3000"
                                step="50"
                                value={monthlyUnits}
                                onChange={(e) =>
                                    setMonthlyUnits(Number(e.target.value))
                                }
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600 dark:bg-slate-800"
                            />
                            <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                                <span>100 Units</span>
                                <span>3,000 Units</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Metrics Output */}
                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-950">
                        <div className="p-4 text-center">
                            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                                Blood Expiries Prevented
                            </span>
                            <span className="mt-1 block text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                {annualExpiryWasteSaved.toLocaleString()}{' '}
                                <span className="text-xs font-normal text-slate-500 dark:text-slate-300">
                                    Units/yr
                                </span>
                            </span>
                        </div>
                        <div className="border-t border-slate-200 p-4 text-center sm:border-t-0 sm:border-l dark:border-slate-800">
                            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                                Estimated Annual Savings
                            </span>
                            <span className="mt-1 block text-3xl font-extrabold text-slate-900 dark:text-white">
                                ${annualCostSavedDollars.toLocaleString()}
                            </span>
                        </div>
                        <div className="border-t border-slate-200 p-4 text-center sm:border-t-0 sm:border-l dark:border-slate-800">
                            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                                Dispatch Response Time
                            </span>
                            <span className="mt-1 block text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                                3.5{' '}
                                <span className="text-xs font-normal text-slate-500 dark:text-slate-300">
                                    mins (91% faster)
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance & Security Badges */}
            <section
                id="compliance"
                className="border-y border-slate-200 bg-slate-100/60 py-20 dark:border-slate-800/80 dark:bg-slate-900/40"
            >
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h3 className="mb-8 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                        Compliant With Global Healthcare & Transfusion Standards
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 transition-opacity hover:opacity-100 sm:gap-12">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <ShieldCheck className="h-5 w-5 text-red-500" />
                            <span>FDA 21 CFR Part 11</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            <span>AABB Accredited</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Lock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            <span>HIPAA & HITECH</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                            <span>ISO 15189 Medical</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Database className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            <span>AES-256 IoT Telemetry</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-red-600 uppercase dark:text-red-400">
                        Flexible Deployment
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Tailored Enterprise Plans
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Scalable blood bank management for single facility
                        clinics to multi-regional health systems.
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Tier 1 */}
                    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Community Hospital
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                For single-site clinics and blood storage vaults
                            </p>
                            <div className="my-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                                $499{' '}
                                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                    /month
                                </span>
                            </div>
                            <ul className="mb-8 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Up to 1,000 Blood Units/mo
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Electronic Cross-Match Matrix
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Cold-Chain Temperature Alerts
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Donor Management Database
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/register"
                            className="block w-full rounded-xl border border-slate-300 bg-slate-100 py-3 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:border-transparent dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Tier 2 - Popular */}
                    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-red-500/50 bg-gradient-to-b from-red-50 via-white to-red-100/50 p-8 shadow-2xl shadow-red-500/10 dark:from-red-950/40 dark:via-slate-900 dark:to-slate-950 dark:shadow-red-950/50">
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
                            Most Popular Network
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Regional Medical Network
                            </h3>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                Multi-facility hub & spoke hospital networks
                            </p>
                            <div className="my-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                                $1,299{' '}
                                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                    /month
                                </span>
                            </div>
                            <ul className="mb-8 space-y-3 text-xs text-slate-700 dark:text-slate-200">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />{' '}
                                    Unlimited Blood Units & Storage Vaults
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />{' '}
                                    AI 7-Day Demand Forecasting Engine
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />{' '}
                                    Multi-Facility Logistics Dispatch
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />{' '}
                                    Automated SMS Donor Mobilization
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />{' '}
                                    FDA 21 CFR Part 11 Audit Trail
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/register"
                            className="block w-full rounded-xl bg-red-600 py-3 text-center text-xs font-bold text-white shadow-lg shadow-red-900/50 transition-colors hover:bg-red-700"
                        >
                            Get Started Now
                        </Link>
                    </div>

                    {/* Tier 3 */}
                    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Enterprise Health System
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                National blood service organizations & state
                                networks
                            </p>
                            <div className="my-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                                Custom
                            </div>
                            <ul className="mb-8 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Custom EMR / HIS API Integration
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    Dedicated IoT Hardware Telemetry
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    On-Premise or Private Cloud Deploy
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
                                    24/7 Priority Clinical SLA Support
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/register"
                            className="block w-full rounded-xl border border-slate-300 bg-slate-100 py-3 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:border-transparent dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            Contact Enterprise Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="border-t border-slate-200 bg-slate-100/50 py-20 dark:border-slate-800/80 dark:bg-slate-900/50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'How does BloodMatrix interface with existing Hospital Information Systems (HIS)?',
                                a: 'BloodMatrix provides bi-directional HL7 & FHIR API interfaces. It seamlessly syncs patient blood requisitions, laboratory cross-matching orders, and transfusion verification logs directly with Epic, Cerner, MEDITECH, and custom hospital EMRs.',
                            },
                            {
                                q: 'Is BloodMatrix compliant with FDA 21 CFR Part 11 & AABB regulatory standards?',
                                a: 'Yes. Every inventory action—intake, testing, cross-matching, cold-chain temperature logs, and discard actions—is registered in an immutable audit database with electronic signatures, timestamps, and user ID credentials.',
                            },
                            {
                                q: 'How does the AI Stock Demand Forecasting engine work?',
                                a: 'Our AI engine analyzes historical transfusion patterns, surgical schedules, seasonal donor drive output, and local trauma risk factors to accurately project blood demand 7 days in advance, alerting staff before critical shortages occur.',
                            },
                            {
                                q: 'What happens if cold-chain vault temperatures breach safe limits (2°C–6°C)?',
                                a: 'The system triggers instant visual, audible, and acoustic SMS/Email alarms to on-call blood bank officers, automatically quarantines affected units in the inventory matrix, and logs the temperature incident for quality assurance.',
                            },
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
                            >
                                <button
                                    onClick={() =>
                                        setActiveFaq(
                                            activeFaq === idx ? null : idx,
                                        )
                                    }
                                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-slate-800 transition-colors hover:text-red-600 dark:text-white dark:hover:text-red-400"
                                >
                                    <span>{faq.q}</span>
                                    {activeFaq === idx ? (
                                        <ChevronUp className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                                    )}
                                </button>
                                {activeFaq === idx && (
                                    <div className="border-t border-slate-100 px-5 pt-3 pb-5 text-xs leading-relaxed text-slate-600 dark:border-slate-900 dark:text-slate-300">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="relative overflow-hidden py-20">
                <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Ready to Modernize Your Blood Bank Operations?
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-300">
                        Experience the live command dashboard now. Explore
                        inventory matrices, cross-matching engines, and AI
                        forecasts in real time.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-red-950/20 transition-all hover:scale-105"
                    >
                        <UserPlus className="h-4 w-4" />
                        Create Hospital Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-slate-100 py-12 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-400">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                            <HeartPulse className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                            BloodMatrix
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">
                            |
                        </span>
                        <span>Enterprise Blood Management Platform</span>
                    </div>

                    <div className="flex items-center gap-6 text-[11px]">
                        <Link
                            href="/login"
                            className="transition-colors hover:text-slate-900 dark:hover:text-white"
                        >
                            Sign In
                        </Link>
                        <a
                            href="#matrix"
                            className="transition-colors hover:text-slate-900 dark:hover:text-white"
                        >
                            Compatibility Matrix
                        </a>
                        <a
                            href="#compliance"
                            className="transition-colors hover:text-slate-900 dark:hover:text-white"
                        >
                            FDA & AABB Compliance
                        </a>
                        <a
                            href="#roi-calculator"
                            className="transition-colors hover:text-slate-900 dark:hover:text-white"
                        >
                            ROI Calculator
                        </a>
                    </div>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        © 2026 BloodMatrix Inc. All rights reserved. Medical
                        Class II Software standard.
                    </div>
                </div>
            </footer>
        </div>
    );
}
