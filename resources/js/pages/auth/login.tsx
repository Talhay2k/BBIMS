import React, { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Building2,
    Hospital,
    Landmark,
    Activity,
} from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

type UserCategory = 'blood_bank' | 'hospital' | 'ministry';

export default function Login({ status, canResetPassword }: Props) {
    const [portalCategory, setPortalCategory] = useState<UserCategory>('hospital');

    const portals = {
        blood_bank: {
            title: 'Blood Bank Vault',
            badge: 'Vault Command',
            icon: Building2,
            placeholder: 'vault.manager@centralbloodbank.org',
            helper: 'Cold-Chain Telemetry, Donor Drives & Inventory',
            color: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
            activePill: 'border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 ring-1 ring-rose-500/30',
        },
        hospital: {
            title: 'Hospital STAT Hub',
            badge: 'Emergency Ward',
            icon: Hospital,
            placeholder: 'trauma.chief@stjudehospital.org',
            helper: 'STAT Transfusion Requests & Sub-3 min Cross-Matching',
            color: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
            activePill: 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-500/30',
        },
        ministry: {
            title: 'Ministry Oversight',
            badge: 'National Audit',
            icon: Landmark,
            placeholder: 'compliance@health.gov.om',
            helper: 'Vein-to-Vein Immutable Audit & Regional Reserves',
            color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
            activePill: 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30',
        },
    };

    const currentPortal = portals[portalCategory];
    const PortalIcon = currentPortal.icon;

    return (
        <div className="space-y-2.5">
            <Head title="Sign In - BloodMatrix Enterprise" />

            <PasskeyVerify />

            {/* Form Mode Toggle */}
            <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1 border border-slate-300 dark:border-slate-800 text-xs font-semibold">
                <button
                    type="button"
                    className="flex-1 py-1 text-center rounded-lg bg-rose-600 text-white font-bold shadow-md"
                >
                    Sign In
                </button>
                <Link
                    href={register()}
                    className="flex-1 py-1 text-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    Create Account
                </Link>
            </div>

            {/* Target User Portal Switcher - Pill Buttons */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Activity className="h-3 w-3 text-rose-500" />
                        Select Portal Context
                    </Label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Target User Access</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(portals) as UserCategory[]).map((key) => {
                        const item = portals[key];
                        const Icon = item.icon;
                        const isSelected = portalCategory === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setPortalCategory(key)}
                                className={`h-8 px-2 rounded-full border text-left transition-all flex items-center justify-center gap-1.5 ${
                                    isSelected
                                        ? item.activePill + ' font-bold shadow-sm'
                                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-[10px] truncate">{item.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Login Form */}
            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-2.5"
            >
                {({ processing, errors }) => (
                    <div className="space-y-2.5">
                        {/* Email Address */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-rose-500" />
                                Work Email Address
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={currentPortal.placeholder}
                                    className="h-8.5 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Lock className="h-3 w-3 text-rose-500" />
                                    Security Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-[10px] text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Enter security password"
                                className="h-8.5 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2 pt-0.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                            />
                            <Label htmlFor="remember" className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                                Remember session on this clinical station
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-0.5 w-full h-9 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-950/20 dark:shadow-rose-950/60 rounded-xl border border-rose-400/20 transition-all flex items-center justify-center gap-2 group"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <>
                                    <span>Sign In to {currentPortal.title}</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Form>

            {status && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}

            {/* Compliance Footer Note */}
            <div className="pt-0.5 text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span>Protected by 256-bit Encrypted Telemetry & MFA Guard</span>
            </div>
        </div>
    );
}

Login.layout = {
    title: 'Sign In to Command Center',
    description: 'Enter your credentials to access blood bank telemetry, STAT hospital orders & ministry oversight',
};



