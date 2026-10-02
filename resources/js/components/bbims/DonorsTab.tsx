import React, { useState } from 'react';
import { DonorRecord, BloodType, Facility } from './types';
import {
    Search,
    Plus,
    UserCheck,
    UserX,
    Phone,
    Mail,
    Droplet,
    Heart,
    Activity,
    Calendar,
} from 'lucide-react';

interface DonorsTabProps {
    donors: DonorRecord[];
    facilities: Facility[];
    onOpenRegisterModal: () => void;
    onRecordDonation: (
        donorId: string,
        details: { volumeMl: number; component: any; facilityId: string },
    ) => void;
}

export const DonorsTab: React.FC<DonorsTabProps> = ({
    donors,
    facilities,
    onOpenRegisterModal,
    onRecordDonation,
}) => {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const [donationModalDonor, setDonationModalDonor] =
        useState<DonorRecord | null>(null);
    const [donationVolume, setDonationVolume] = useState(450);
    const [donationComponent, setDonationComponent] = useState(
        'Packed Red Blood Cells',
    );
    const [donationFacilityId, setDonationFacilityId] = useState(
        facilities[0]?.id || 'fac-1',
    );

    const bloodTypes: BloodType[] = [
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
    ];

    const filteredDonors = donors.filter((d) => {
        if (selectedType !== 'All' && d.bloodType !== selectedType)
            return false;
        if (selectedStatus !== 'All' && d.eligibilityStatus !== selectedStatus)
            return false;
        if (search) {
            const s = search.toLowerCase();
            return (
                d.fullName.toLowerCase().includes(s) ||
                d.donorCode.toLowerCase().includes(s) ||
                d.phone.includes(s) ||
                d.email.toLowerCase().includes(s)
            );
        }
        return true;
    });

    const handleRecordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!donationModalDonor) return;
        onRecordDonation(donationModalDonor.id, {
            volumeMl: Number(donationVolume),
            component: donationComponent,
            facilityId: donationFacilityId,
        });
        setDonationModalDonor(null);
    };

    return (
        <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search donor name, code, phone or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pr-4 pl-10 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500/50 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Blood Groups</option>
                        {bloodTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-rose-500/50 focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Eligible">Eligible</option>
                        <option value="Temporarily Deferred">
                            Temporarily Deferred
                        </option>
                        <option value="Permanently Deferred">
                            Permanently Deferred
                        </option>
                    </select>

                    <button
                        onClick={onOpenRegisterModal}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-500 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Register New Donor
                    </button>
                </div>
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDonors.map((donor) => {
                    const isEligible = donor.eligibilityStatus === 'Eligible';
                    return (
                        <div
                            key={donor.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg transition hover:border-slate-700"
                        >
                            <div>
                                {/* Header */}
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <span className="block font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                                            {donor.donorCode}
                                        </span>
                                        <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                            {donor.fullName}
                                            <span className="text-xs font-normal text-slate-400">
                                                ({donor.age}y, {donor.gender})
                                            </span>
                                        </h3>
                                    </div>
                                    <span className="inline-flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-sm font-black text-rose-400">
                                        {donor.bloodType}
                                    </span>
                                </div>

                                {/* Contact & Health Metrics */}
                                <div className="mb-4 space-y-1.5 text-xs text-slate-300">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{donor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="truncate">
                                            {donor.email}
                                        </span>
                                    </div>
                                </div>

                                {/* Screening details */}
                                <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-center">
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            Hemoglobin
                                        </span>
                                        <span className="text-xs font-bold text-emerald-400">
                                            {donor.hemoglobinGdl} g/dL
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            BP Status
                                        </span>
                                        <span className="text-xs font-bold text-slate-200">
                                            {donor.bloodPressure}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            Donations
                                        </span>
                                        <span className="text-xs font-bold text-purple-400">
                                            {donor.totalDonationsCount} units
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Status & Action */}
                            <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                                        isEligible
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                            : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                    }`}
                                >
                                    {isEligible ? (
                                        <UserCheck className="h-3.5 w-3.5" />
                                    ) : (
                                        <UserX className="h-3.5 w-3.5" />
                                    )}
                                    {donor.eligibilityStatus}
                                </span>

                                {isEligible && (
                                    <button
                                        onClick={() =>
                                            setDonationModalDonor(donor)
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-600/20 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-600 hover:text-white"
                                    >
                                        <Droplet className="h-3.5 w-3.5" />
                                        Collect Donation
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Record Donation Modal */}
            {donationModalDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <Droplet className="h-5 w-5 text-rose-500" />
                                Record Donation Collection
                            </h3>
                            <button
                                onClick={() => setDonationModalDonor(null)}
                                className="text-sm text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                            <p className="font-bold text-slate-300">
                                {donationModalDonor.fullName}
                            </p>
                            <p className="text-slate-400">
                                Donor Code: {donationModalDonor.donorCode} •
                                Blood Group: {donationModalDonor.bloodType}
                            </p>
                            <p className="font-medium text-emerald-400">
                                Screened Eligible • Hb:{' '}
                                {donationModalDonor.hemoglobinGdl} g/dL
                            </p>
                        </div>

                        <form
                            onSubmit={handleRecordSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Collection Facility
                                </label>
                                <select
                                    value={donationFacilityId}
                                    onChange={(e) =>
                                        setDonationFacilityId(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                >
                                    {facilities.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Component Processed
                                </label>
                                <select
                                    value={donationComponent}
                                    onChange={(e) =>
                                        setDonationComponent(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                >
                                    <option value="Packed Red Blood Cells">
                                        Packed Red Blood Cells
                                    </option>
                                    <option value="Whole Blood">
                                        Whole Blood
                                    </option>
                                    <option value="Platelets">Platelets</option>
                                    <option value="Fresh Frozen Plasma">
                                        Fresh Frozen Plasma
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-400">
                                    Volume Collected (mL)
                                </label>
                                <input
                                    type="number"
                                    value={donationVolume}
                                    onChange={(e) =>
                                        setDonationVolume(
                                            Number(e.target.value),
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setDonationModalDonor(null)}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-md shadow-rose-900/30 hover:bg-rose-500"
                                >
                                    Confirm Intake & Generate Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
