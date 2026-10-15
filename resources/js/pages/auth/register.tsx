import React, { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    ArrowRight,
    Building2,
    Hospital,
    Landmark,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

type Props = {
    passwordRules: string;
};

type UserCategory = 'blood_bank' | 'hospital' | 'ministry';

export default function Register({ passwordRules }: Props) {
    const [category, setCategory] = useState<UserCategory>('blood_bank');
    const [facilityName, setFacilityName] = useState('');

    const categoryDetails = {
        blood_bank: {
            title: 'Blood Bank Vault',
            badge: 'Vault Operations',
            icon: Building2,
            color: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
            activePill: 'border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 ring-1 ring-rose-500/30',
            facilityLabel: 'Blood Bank Facility Name',
            facilityPlaceholder: 'e.g., Metro Regional Red Cross Blood Center',
            benefitText: '24/7 cold-chain telemetry, donor drives & ISBT-128 intake.',
            accentText: 'Blood Bank Vault Access',
        },
        hospital: {
            title: 'Hospital STAT Hub',
            badge: 'STAT Transfusion',
            icon: Hospital,
            color: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
            activePill: 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-500/30',
            facilityLabel: 'Hospital Network Name',
            facilityPlaceholder: 'e.g., St. Jude Emergency Trauma Center',
            benefitText: '< 3 min cross-matching, STAT emergency requisitions & stock AI.',
            accentText: 'Hospital STAT Portal',
        },
        ministry: {
            title: 'Ministry Oversight',
            badge: 'National Audit',
            icon: Landmark,
            color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
            activePill: 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30',
            facilityLabel: 'Ministry Department Name',
            facilityPlaceholder: 'e.g., National Health Ministry - Transfusion Division',
            benefitText: 'Vein-to-vein audit logs, supply heatmaps & 21 CFR compliance.',
            accentText: 'Health Ministry Oversight',
        },
    };

    const current = categoryDetails[category];
    const CategoryIcon = current.icon;

    return (
        <div className="space-y-2.5">
            <Head title="Register - BloodMatrix Enterprise" />

            {/* Form Mode Toggle */}
            <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1 border border-slate-300 dark:border-slate-800 text-xs font-semibold">
                <Link
                    href={login()}
                    className="flex-1 py-1 text-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    Sign In
                </Link>
                <button
                    type="button"
                    className="flex-1 py-1 text-center rounded-lg bg-rose-600 text-white font-bold shadow-md"
                >
                    Create Account
                </button>
            </div>

            {/* Target User Category Selector - Pill Buttons */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-rose-500" />
                        Select Organization Category
                    </Label>
                    <span className="text-[10px] text-slate-400 font-normal">Target User Access</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(categoryDetails) as UserCategory[]).map((key) => {
                        const cat = categoryDetails[key];
                        const Icon = cat.icon;
                        const isSelected = category === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setCategory(key)}
                                className={`h-8 px-2 rounded-full border text-left transition-all flex items-center justify-center gap-1.5 ${
                                    isSelected
                                        ? cat.activePill + ' font-bold shadow-sm'
                                        : 'bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-[10px] truncate">{cat.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Registration Form */}
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-2"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            {/* Organization Facility Name */}
                            <div className="space-y-0.5">
                                <Label htmlFor="facility_name" className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <CategoryIcon className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                                    {current.facilityLabel}
                                </Label>
                                <Input
                                    id="facility_name"
                                    type="text"
                                    value={facilityName}
                                    onChange={(e) => setFacilityName(e.target.value)}
                                    placeholder={current.facilityPlaceholder}
                                    className="h-8 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                />
                            </div>

                            {/* Full Name & Title */}
                            <div className="space-y-0.5">
                                <Label htmlFor="name" className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <User className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                                    Full Name & Official Title
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Dr. Alexander Vance, Chief Officer"
                                    className="h-8 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Official Work Email */}
                            <div className="space-y-0.5">
                                <Label htmlFor="email" className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                                    Official Institutional Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="a.vance@regionalhealth.org"
                                    className="h-8 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password & Confirm */}
                            <div className="grid grid-cols-2 gap-1.5">
                                <div className="space-y-0.5">
                                    <Label htmlFor="password" className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        <Lock className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="8+ chars"
                                        passwordrules={passwordRules}
                                        className="h-8 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-0.5">
                                    <Label htmlFor="password_confirmation" className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                                        Confirm
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Re-enter"
                                        passwordrules={passwordRules}
                                        className="h-8 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-rose-500 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-0.5 w-full h-9 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-950/60 rounded-xl border border-rose-400/20 transition-all flex items-center justify-center gap-2 group"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <span>Register {current.title} Account</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {/* Login Navigation Link */}
            <div className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <TextLink href={login()} tabIndex={6} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold">
                    Sign in to existing account
                </TextLink>
            </div>
        </div>
    );
}

Register.layout = {
    title: 'Enterprise Organization Signup',
    description: 'Select your clinical category (Blood Bank, Hospital, Health Ministry) to onboard',
};



