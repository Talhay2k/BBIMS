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
    const [compatibilityType, setCompatibilityType] = useState<'redCells' | 'plasma'>('redCells');
    const [bedCount, setBedCount] = useState<number>(350);
    const [monthlyUnits, setMonthlyUnits] = useState<number>(800);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [activeTabPreview, setActiveTabPreview] = useState<'dashboard' | 'ai' | 'crossmatch' | 'coldchain'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    // Compatibility Rules Data
    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    const getRedCellRecipientTypes = (type: string) => {
        switch (type) {
            case 'O-': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Red Cell Donor
            case 'O+': return ['O+', 'A+', 'B+', 'AB+'];
            case 'A-': return ['A-', 'A+', 'AB-', 'AB+'];
            case 'A+': return ['A+', 'AB+'];
            case 'B-': return ['B-', 'B+', 'AB-', 'AB+'];
            case 'B+': return ['B+', 'AB+'];
            case 'AB-': return ['AB-', 'AB+'];
            case 'AB+': return ['AB+'];
            default: return [];
        }
    };

    const getRedCellDonorTypes = (type: string) => {
        switch (type) {
            case 'O-': return ['O-'];
            case 'O+': return ['O-', 'O+'];
            case 'A-': return ['O-', 'A-'];
            case 'A+': return ['O-', 'O+', 'A-', 'A+'];
            case 'B-': return ['O-', 'B-'];
            case 'B+': return ['O-', 'O+', 'B-', 'B+'];
            case 'AB-': return ['O-', 'A-', 'B-', 'AB-'];
            case 'AB+': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Recipient
            default: return [];
        }
    };

    const getPlasmaRecipientTypes = (type: string) => {
        // Plasma compatibility is inverse of red cell compatibility
        switch (type) {
            case 'AB+': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']; // Universal Plasma Donor
            case 'AB-': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
            case 'A+': case 'A-': return ['O-', 'O+', 'A-', 'A+'];
            case 'B+': case 'B-': return ['O-', 'O+', 'B-', 'B+'];
            case 'O+': case 'O-': return ['O-', 'O+'];
            default: return [];
        }
    };

    // ROI Calculations
    const annualExpiryWasteSaved = Math.round((monthlyUnits * 12) * 0.082); // 8.2% average waste prevented
    const annualCostSavedDollars = Math.round(annualExpiryWasteSaved * 280); // $280 per blood unit avg cost
    const dispatchTimeReductionMinutes = Math.round(42 - 3.5); // reduced from 42m to 3.5m

    const availableUnitsCount = units.filter(u => u.status === 'Available').length;
    const criticalTypes = ['O-', 'AB-', 'B-'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden transition-colors duration-200">
            {/* Top Glow Highlights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-rose-900/10 via-rose-600/5 to-transparent dark:from-rose-900/20 dark:via-rose-600/10 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-rose-500/5 dark:bg-red-950/20 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-2/3 right-0 w-[500px] h-[500px] bg-rose-500/5 dark:bg-rose-950/20 blur-3xl pointer-events-none -z-10" />

            {/* Sticky Header / Navbar */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-950/30 dark:shadow-rose-950/50 border border-rose-400/30 shrink-0">
                            <HeartPulse className="h-6 w-6 text-white animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                                    BloodMatrix
                                </span>
                                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                                    Enterprise v3.0
                                </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">Blood Bank & Logistics Platform</p>
                        </div>
                    </div>

                    {/* Navigation Links (Desktop Only) */}
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <a href="#overview" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">Overview</a>
                        <a href="#features" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">Features</a>
                        <a href="#matrix" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">Compatibility Engine</a>
                        <a href="#ai-intelligence" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">AI & Cold-Chain</a>
                        <a href="#roi-calculator" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">ROI Calculator</a>
                        <a href="#compliance" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap">Compliance</a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Theme Mode Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95"
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
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors items-center gap-1.5 whitespace-nowrap"
                        >
                            <LogIn className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                            <span>Sign In</span>
                        </Link>
                        <Link
                            href="/register"
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors items-center gap-1.5 whitespace-nowrap"
                        >
                            <UserPlus className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                            <span>Sign Up</span>
                        </Link>

                        {/* Mobile & Tablet Hamburger Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Toggle Navigation"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile & Tablet Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 p-5 space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
                        <nav className="flex flex-col gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                <span>Overview</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                <span>Features</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a href="#matrix" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                <span>Compatibility Engine</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a href="#ai-intelligence" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                <span>AI & Cold-Chain</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a href="#roi-calculator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                <span>ROI Calculator</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                            <a href="#compliance" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-500 py-2 flex items-center justify-between">
                                <span>Compliance</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                            </a>
                        </nav>
                        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={toggleTheme}
                                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2"
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
                                <Link href="/login" className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <LogIn className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                                    Sign In
                                </Link>
                                <Link href="/register" className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <UserPlus className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Live Ticker Bar */}
            <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-6 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold uppercase tracking-wider">Live System Status:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">All Cold-Chain Vaults Optimal (2.8°C)</span>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 text-slate-700 dark:text-slate-300">
                        <span>Available Units: <strong className="text-slate-900 dark:text-white">{availableUnitsCount > 0 ? availableUnitsCount : 148}</strong></span>
                        <span>Active Donors: <strong className="text-slate-900 dark:text-white">{donors.length > 0 ? donors.length : 84}</strong></span>
                        <span>Pending Requests: <strong className="text-amber-600 dark:text-amber-400 font-bold">{requests.length > 0 ? requests.length : 3}</strong></span>
                        <span>Critical Types: <strong className="text-rose-600 dark:text-rose-400">{criticalTypes.join(', ')}</strong></span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section id="overview" className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 animate-spin" />
                        <span>AABB & FDA 21 CFR Part 11 Compliant Software</span>
                        <span className="h-1 w-1 rounded-full bg-rose-500 dark:bg-rose-400" />
                        <span className="text-slate-900 dark:text-white font-semibold">Zero Expiry Loss Target</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        Precision Blood Supply Chain &{' '}
                        <span className="bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 dark:from-rose-400 dark:via-red-400 dark:to-amber-300 bg-clip-text text-transparent">
                            AI Inventory Intelligence
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
                        BloodMatrix empowers hospital networks, regional blood centers, and emergency trauma hubs to automate cold-chain tracking, instantly cross-match units, forecast stock shortages, and eliminate life-threatening blood inventory waste.
                    </p>



                    {/* Quick Highlights */}
                    <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                &lt; 3 mins
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cross-Match Verification</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                99.4%
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Expiry Prevention Rate</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Thermometer className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                2°C – 6°C
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cold-Chain Vault Telemetry</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                FDA & AABB
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Regulatory Audit Ready</p>
                        </div>
                    </div>
                </div>

                {/* Hero Showcase Image Frame */}
                <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-rose-500/20 via-slate-200/40 to-slate-300/80 dark:via-slate-800/40 dark:to-slate-900/80 border border-rose-500/30 shadow-2xl shadow-rose-950/20 dark:shadow-rose-950/50">
                    <div className="relative rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950 group">
                        <img
                            src="/images/hero.png"
                            alt="BloodMatrix Dashboard Interface Preview"
                            className="w-full object-cover max-h-[520px] rounded-xl transition-transform duration-700 group-hover:scale-[1.01]"
                            onError={(e) => {
                                // Fallback placeholder in case image URL is blocked
                                (e.target as HTMLElement).style.display = 'none';
                            }}
                        />

                        {/* Floating Live Badge Overlays (Desktop) */}
                        <div className="hidden sm:flex absolute top-6 left-6 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xl items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">Trauma Dispatch Clearing</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Request #REQ-2026-8491 • Approved</p>
                            </div>
                        </div>

                        <div className="hidden sm:flex absolute bottom-6 right-6 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xl items-center gap-3">
                            <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">AI Forecast Engine</p>
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Demand Surge Detected (+35% O- required)</p>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 pointer-events-none" />
                    </div>

                    {/* Inline Mobile Telemetry Badges */}
                    <div className="grid grid-cols-1 sm:hidden gap-2 pt-3">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                Trauma Dispatch Clearing
                            </span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Approved</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                                <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                AI Demand Forecast
                            </span>
                            <span className="text-[11px] text-purple-600 dark:text-purple-300 font-bold">+35% O- Surge</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Blood & Plasma Compatibility Matrix Widget */}
            <section id="matrix" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/80 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                            Interactive Clinical Tool
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                            Blood & Component Compatibility Engine
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            Select any donor blood type below to visually test real-time red cell and plasma recipient compatibility.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        {/* Component Toggle */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <button
                                onClick={() => setCompatibilityType('redCells')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    compatibilityType === 'redCells'
                                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                🩸 Packed Red Blood Cells (PRBC)
                            </button>
                            <button
                                onClick={() => setCompatibilityType('plasma')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    compatibilityType === 'plasma'
                                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                🧪 Fresh Frozen Plasma (FFP) & Platelets
                            </button>
                        </div>

                        {/* Blood Type Picker Grid */}
                        <div className="mb-8">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center uppercase tracking-wider">
                                Select Donor Blood Group
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                                {bloodTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedBloodType(type)}
                                        className={`py-3 rounded-xl font-mono text-sm font-bold transition-all border ${
                                            selectedBloodType === type
                                                ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-500/50 scale-105 shadow-lg shadow-rose-950/20'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-850'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compatibility Results Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                            <div>
                                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    Compatible Recipient Blood Types
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(compatibilityType === 'redCells'
                                        ? getRedCellRecipientTypes(selectedBloodType)
                                        : getPlasmaRecipientTypes(selectedBloodType)
                                    ).map((recipient) => (
                                        <span
                                            key={recipient}
                                            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center gap-1.5"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                            {recipient}
                                        </span>
                                    ))}
                                </div>
                                {selectedBloodType === 'O-' && compatibilityType === 'redCells' && (
                                    <p className="text-xs text-rose-700 dark:text-rose-400 mt-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 font-medium">
                                        🌟 Universal Red Cell Donor: O- negative units can be safely transfused to patients of ANY blood type in emergency trauma settings!
                                    </p>
                                )}
                                {selectedBloodType === 'AB+' && compatibilityType === 'plasma' && (
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-4 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
                                        🌟 Universal Plasma Donor: AB+ plasma carries zero anti-A/anti-B antibodies and is universal for all plasma recipients!
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    Safe Donor Sources For {selectedBloodType} Patients
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {getRedCellDonorTypes(selectedBloodType).map((donor) => (
                                        <span
                                            key={donor}
                                            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-sm flex items-center gap-1.5"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                                            {donor}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                                    Electronic cross-matching algorithms automatically enforce major and minor antibody screening protocols before clearance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        Enterprise Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4">
                        Built for Zero-Failure Medical Operations
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
                        Six specialized intelligence modules seamlessly synchronized across hospital networks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Thermometer className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cold-Chain IoT Vault Sensors</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Continuous 24/7 temperature telemetry (2°C–6°C for PRBC, -30°C for FFP) with automated breach alerts, quarantine locks, and backup freezer triggers.
                        </p>
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            Live Sensor Integration <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Expiry & Demand Forecasting</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Machine learning models analyze historical transfusion velocity and local surgical schedules to predict stock shortages 7 days ahead.
                        </p>
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            98.4% Demand Accuracy <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Electronic Cross-Match Engine</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Instant digital verification of donor-recipient compatibility with automated antibody screening clearance in under 180 seconds.
                        </p>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            Trauma-Clear Dispatch <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Multi-Hospital Logistics Hub</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Synchronize inventory across central blood banks, satellite hospital fridges, and mobile transit units with cold-chain transport logging.
                        </p>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            Multi-Tenant Sync <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 5 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Donor Loyalty & Drive Portal</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Automated SMS callouts trigger when rare blood types (e.g. O- / AB-) drop below safety thresholds, driving mobile blood drive signups.
                        </p>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            Automated Mobilization <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Feature 6 */}
                    <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 shadow-lg shadow-slate-100 dark:shadow-none group">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Audit Compliance & Discard Logs</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Immutable audit trail tracking every unit from vein-to-vein. Generate FDA 21 CFR Part 11 compliant regulatory reports with one click.
                        </p>
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            FDA Regulatory Ready <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Interface Preview Tabs */}
            <section id="ai-intelligence" className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            Experience the Command Center Platform
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            Explore live module views powering modern blood bank operations.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                        <div className="flex gap-4 p-1">
                            {[
                                { id: 'dashboard', label: 'Command Overview', icon: Activity },
                                { id: 'ai', label: 'AI Forecasting Engine', icon: BrainCircuit },
                                { id: 'crossmatch', label: 'Electronic Cross-Match', icon: Zap },
                                { id: 'coldchain', label: 'Cold Chain Vaults', icon: Thermometer },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTabPreview(tab.id as any)}
                                        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition-all ${
                                            activeTabPreview === tab.id
                                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900'
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
                    <div className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        {activeTabPreview === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Main Inventory Matrix & Alert Dashboard</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Live monitoring across 8 blood groups and 4 storage facilities</p>
                                    </div>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 inline-flex items-center gap-1"
                                    >
                                        Get Started →
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">O- Negative (Universal)</span>
                                        <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">14 Units (Low)</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">A+ Positive</span>
                                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">68 Units (Optimal)</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">B+ Positive</span>
                                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">42 Units (Optimal)</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">AB- Negative</span>
                                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">6 Units (Reserve)</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'ai' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI 7-Day Stock Risk Prediction</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Predictive models highlight upcoming surgical demand spikes to ensure zero emergency shortages.
                                </p>
                                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-xs text-purple-900 dark:text-purple-200">
                                    🤖 AI Recommendation: Schedule targeted O- donor drive before Thursday to offset projected trauma surgery demand (+18 units required).
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'crossmatch' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Electronic Cross-Matching & Dispatch</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Automates major/minor cross-match checks, verifying unit expiration dates and cold-chain integrity before releasing dispatch codes.
                                </p>
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                                    <span>Cross-Match Status: <strong>PASSED (100% Compatible)</strong></span>
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px]">Ready for Courier Dispatch</span>
                                </div>
                            </div>
                        )}

                        {activeTabPreview === 'coldchain' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Cold-Chain Telemetry</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Monitors ambient & internal fridge temperatures continuously. Triggers instant acoustic and SMS alarms if temperature strays outside 2.0°C–6.0°C range.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Vault Alpha (PRBC)</div>
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">3.4°C</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Freezer Gamma (FFP)</div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">-31.2°C</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Interactive ROI & Impact Calculator */}
            <section id="roi-calculator" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Quantifiable Impact
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                        Calculate Your Hospital Network's Savings
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                        Adjust your bed count and monthly transfusion volume to estimate annual blood expiry waste reduction and cost savings.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Slider 1 */}
                        <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <span>Hospital Network Beds</span>
                                <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">{bedCount} Beds</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="1500"
                                step="25"
                                value={bedCount}
                                onChange={(e) => setBedCount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                <span>50 Beds</span>
                                <span>1,500 Beds</span>
                            </div>
                        </div>

                        {/* Slider 2 */}
                        <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <span>Monthly Transfusion Volume</span>
                                <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">{monthlyUnits} Units/mo</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="3000"
                                step="50"
                                value={monthlyUnits}
                                onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                <span>100 Units</span>
                                <span>3,000 Units</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Metrics Output */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="text-center p-4">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Blood Expiries Prevented</span>
                            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                                {annualExpiryWasteSaved.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-300">Units/yr</span>
                            </span>
                        </div>
                        <div className="text-center p-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Estimated Annual Savings</span>
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                                ${annualCostSavedDollars.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-center p-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Dispatch Response Time</span>
                            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                                3.5 <span className="text-xs font-normal text-slate-500 dark:text-slate-300">mins (91% faster)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance & Security Badges */}
            <section id="compliance" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-8">
                        Compliant With Global Healthcare & Transfusion Standards
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            <ShieldCheck className="h-5 w-5 text-rose-500" />
                            <span>FDA 21 CFR Part 11</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            <span>AABB Accredited</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            <Lock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            <span>HIPAA & HITECH</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                            <span>ISO 15189 Medical</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            <Database className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            <span>AES-256 IoT Telemetry</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        Flexible Deployment
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                        Tailored Enterprise Plans
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                        Scalable blood bank management for single facility clinics to multi-regional health systems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Tier 1 */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-lg shadow-slate-100 dark:shadow-none">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Hospital</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For single-site clinics and blood storage vaults</p>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white my-6">$499 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/month</span></div>
                            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Up to 1,000 Blood Units/mo</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Electronic Cross-Match Matrix</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Cold-Chain Temperature Alerts</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Donor Management Database</li>
                            </ul>
                        </div>
                        <Link href="/register" className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs transition-colors border border-slate-300 dark:border-transparent text-center block">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Tier 2 - Popular */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-50 via-white to-rose-100/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-950 border-2 border-rose-500/50 flex flex-col justify-between relative shadow-2xl shadow-rose-500/10 dark:shadow-rose-950/50">
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                            Most Popular Network
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Regional Medical Network</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Multi-facility hub & spoke hospital networks</p>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white my-6">$1,299 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/month</span></div>
                            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 mb-8">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-rose-600 dark:text-rose-400" /> Unlimited Blood Units & Storage Vaults</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-rose-600 dark:text-rose-400" /> AI 7-Day Demand Forecasting Engine</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-rose-600 dark:text-rose-400" /> Multi-Facility Logistics Dispatch</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-rose-600 dark:text-rose-400" /> Automated SMS Donor Mobilization</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-rose-600 dark:text-rose-400" /> FDA 21 CFR Part 11 Audit Trail</li>
                            </ul>
                        </div>
                        <Link href="/register" className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/50 transition-colors text-center block">
                            Get Started Now
                        </Link>
                    </div>

                    {/* Tier 3 */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-lg shadow-slate-100 dark:shadow-none">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Health System</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">National blood service organizations & state networks</p>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white my-6">Custom</div>
                            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Custom EMR / HIS API Integration</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Dedicated IoT Hardware Telemetry</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> On-Premise or Private Cloud Deploy</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> 24/7 Priority Clinical SLA Support</li>
                            </ul>
                        </div>
                        <Link href="/register" className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs transition-colors border border-slate-300 dark:border-transparent text-center block">
                            Contact Enterprise Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How does BloodMatrix interface with existing Hospital Information Systems (HIS)?",
                                a: "BloodMatrix provides bi-directional HL7 & FHIR API interfaces. It seamlessly syncs patient blood requisitions, laboratory cross-matching orders, and transfusion verification logs directly with Epic, Cerner, MEDITECH, and custom hospital EMRs."
                            },
                            {
                                q: "Is BloodMatrix compliant with FDA 21 CFR Part 11 & AABB regulatory standards?",
                                a: "Yes. Every inventory action—intake, testing, cross-matching, cold-chain temperature logs, and discard actions—is registered in an immutable audit database with electronic signatures, timestamps, and user ID credentials."
                            },
                            {
                                q: "How does the AI Stock Demand Forecasting engine work?",
                                a: "Our AI engine analyzes historical transfusion patterns, surgical schedules, seasonal donor drive output, and local trauma risk factors to accurately project blood demand 7 days in advance, alerting staff before critical shortages occur."
                            },
                            {
                                q: "What happens if cold-chain vault temperatures breach safe limits (2°C–6°C)?",
                                a: "The system triggers instant visual, audible, and acoustic SMS/Email alarms to on-call blood bank officers, automatically quarantines affected units in the inventory matrix, and logs the temperature incident for quality assurance."
                            },
                        ].map((faq, idx) => (
                            <div key={idx} className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-slate-800 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    {activeFaq === idx ? (
                                        <ChevronUp className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                    )}
                                </button>
                                {activeFaq === idx && (
                                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                        Ready to Modernize Your Blood Bank Operations?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
                        Experience the live command dashboard now. Explore inventory matrices, cross-matching engines, and AI forecasts in real time.
                    </p>
                    <Link
                        href="/register"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/20 hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        Create Hospital Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 py-12 text-xs text-slate-600 dark:text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center">
                            <HeartPulse className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">BloodMatrix</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span>Enterprise Blood Management Platform</span>
                    </div>

                    <div className="flex items-center gap-6 text-[11px]">
                        <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                        <a href="#matrix" className="hover:text-slate-900 dark:hover:text-white transition-colors">Compatibility Matrix</a>
                        <a href="#compliance" className="hover:text-slate-900 dark:hover:text-white transition-colors">FDA & AABB Compliance</a>
                        <a href="#roi-calculator" className="hover:text-slate-900 dark:hover:text-white transition-colors">ROI Calculator</a>
                    </div>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        © 2026 BloodMatrix Inc. All rights reserved. Medical Class II Software standard.
                    </div>
                </div>
            </footer>
        </div>
    );
}
