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
    Edit3,
    Trash2,
    X,
    Users,
} from 'lucide-react';

interface DonorsTabProps {
    donors: DonorRecord[];
    facilities: Facility[];
    onOpenRegisterModal: () => void;
    onRecordDonation: (
        donorId: string,
        details: { volumeMl: number; component: any; facilityId: string },
    ) => void;
    onEditDonor?: (id: string, data: any) => void;
    onDeleteDonor?: (id: string) => void;
}

export const DonorsTab: React.FC<DonorsTabProps> = ({
    donors,
    facilities,
    onOpenRegisterModal,
    onRecordDonation,
    onEditDonor,
    onDeleteDonor,
}) => {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Donation intake modal state
    const [donationModalDonor, setDonationModalDonor] =
        useState<DonorRecord | null>(null);
    const [donationVolume, setDonationVolume] = useState(450);
    const [donationComponent, setDonationComponent] = useState(
        'Packed Red Blood Cells',
    );
    const [donationFacilityId, setDonationFacilityId] = useState(
        facilities[0]?.id || 'fac-1',
    );

    // Edit donor modal state
    const [editingDonor, setEditingDonor] = useState<DonorRecord | null>(null);
    const [editFullName, setEditFullName] = useState('');
    const [editBloodType, setEditBloodType] = useState<BloodType>('O+');
    const [editAge, setEditAge] = useState(30);
    const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editEligibility, setEditEligibility] = useState<string>('Eligible');
    const [editHemoglobin, setEditHemoglobin] = useState(14.0);
    const [editBloodPressure, setEditBloodPressure] = useState('120/80');
    const [editWeight, setEditWeight] = useState(70);
    const [editNotes, setEditNotes] = useState('');

    // Delete donor confirmation state
    const [deletingDonor, setDeletingDonor] = useState<DonorRecord | null>(null);

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

    const startEditingDonor = (donor: DonorRecord) => {
        setEditingDonor(donor);
        setEditFullName(donor.fullName);
        setEditBloodType(donor.bloodType);
        setEditAge(donor.age);
        setEditGender(donor.gender);
        setEditPhone(donor.phone || '');
        setEditEmail(donor.email || '');
        setEditAddress(donor.address || '');
        setEditEligibility(donor.eligibilityStatus);
        setEditHemoglobin(donor.hemoglobinGdl);
        setEditBloodPressure(donor.bloodPressure);
        setEditWeight(donor.weightKg);
        setEditNotes(donor.notes || '');
    };

    const handleSaveDonorEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDonor) return;
        onEditDonor?.(editingDonor.id, {
            fullName: editFullName,
            bloodType: editBloodType,
            age: editAge,
            gender: editGender,
            phone: editPhone,
            email: editEmail,
            address: editAddress,
            eligibilityStatus: editEligibility,
            hemoglobinGdl: editHemoglobin,
            bloodPressure: editBloodPressure,
            weightKg: editWeight,
            notes: editNotes,
        });
        setEditingDonor(null);
    };

    const handleConfirmDeleteDonor = () => {
        if (!deletingDonor) return;
        onDeleteDonor?.(deletingDonor.id);
        setDeletingDonor(null);
    };

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
                d.phone.toLowerCase().includes(s)
            );
        }
        return true;
    });

    const handleDonationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!donationModalDonor) return;

        onRecordDonation(donationModalDonor.id, {
            volumeMl: donationVolume,
            component: donationComponent,
            facilityId: donationFacilityId,
        });

        setDonationModalDonor(null);
    };

    return (
        <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg">
                <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search donor name, ID, phone number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500/50 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500/50 focus:outline-none sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-500 active:scale-95 sm:ml-auto sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Register New Donor
                    </button>
                </div>
            </div>

            {/* Donors Cards Grid */}
            {filteredDonors.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-500">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        No Donor Records Found
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                        {search || selectedType !== 'All' || selectedStatus !== 'All'
                            ? 'No donors match your search or filter criteria. Try resetting your filter.'
                            : 'No donor records exist yet. Click below to register your first blood donor.'}
                    </p>
                    {onOpenRegisterModal && (
                        <button
                            onClick={onOpenRegisterModal}
                            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-500 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Register Donor
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDonors.map((donor) => {
                    const isEligible = donor.eligibilityStatus === 'Eligible';
                    return (
                        <div
                            key={donor.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg"
                        >
                            <div>
                                {/* Header */}
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                {donor.fullName}
                                            </h3>
                                            <span className="font-mono text-[11px] text-slate-500">
                                                {donor.donorCode}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {donor.age} yrs • {donor.gender} •{' '}
                                            {donor.address}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-sm font-black text-red-600 dark:text-red-400">
                                        {donor.bloodType}
                                    </span>
                                </div>

                                {/* Contact info */}
                                <div className="mb-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{donor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="truncate">
                                            {donor.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>
                                            Last Donated:{' '}
                                            {donor.lastDonationDate ||
                                                'First-time donor'}
                                        </span>
                                    </div>
                                </div>

                                {/* Vitals */}
                                <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-950/60">
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            Hemoglobin
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {donor.hemoglobinGdl} g/dL
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            BP Status
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {donor.bloodPressure}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-slate-500 uppercase">
                                            Donations
                                        </span>
                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                            {donor.totalDonationsCount} units
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Status & Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-800/80">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                                        isEligible
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    }`}
                                >
                                    {isEligible ? (
                                        <UserCheck className="h-3.5 w-3.5" />
                                    ) : (
                                        <UserX className="h-3.5 w-3.5" />
                                    )}
                                    {donor.eligibilityStatus}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {onEditDonor && (
                                        <button
                                            onClick={() => startEditingDonor(donor)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 transition"
                                            title="Edit Donor Profile"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                    )}
                                    {onDeleteDonor && (
                                        <button
                                            onClick={() => setDeletingDonor(donor)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
                                            title="Delete Donor"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {isEligible && (
                                        <button
                                            onClick={() => setDonationModalDonor(donor)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-500/30 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
                                        >
                                            <Droplet className="h-3.5 w-3.5" />
                                            Collect
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* Record Donation Modal */}
            {donationModalDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Droplet className="h-5 w-5 text-red-500" />
                                Record Donation: {donationModalDonor.fullName} (
                                {donationModalDonor.bloodType})
                            </h3>
                            <button
                                onClick={() => setDonationModalDonor(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleDonationSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Target Storage Facility
                                </label>
                                <select
                                    value={donationFacilityId}
                                    onChange={(e) => setDonationFacilityId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    {facilities.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name} ({f.city})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Component To Process
                                </label>
                                <select
                                    value={donationComponent}
                                    onChange={(e) => setDonationComponent(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    <option value="Packed Red Blood Cells">Packed Red Blood Cells</option>
                                    <option value="Whole Blood">Whole Blood</option>
                                    <option value="Platelets">Platelets</option>
                                    <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-slate-600 dark:text-slate-400">
                                    Volume Collected (mL)
                                </label>
                                <input
                                    type="number"
                                    value={donationVolume}
                                    onChange={(e) => setDonationVolume(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setDonationModalDonor(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 cursor-pointer"
                                >
                                    Confirm Intake & Generate Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Donor Modal */}
            {editingDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Edit3 className="h-5 w-5 text-blue-500" />
                                Edit Donor Profile: {editingDonor.donorCode}
                            </h3>
                            <button
                                onClick={() => setEditingDonor(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDonorEdit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editFullName}
                                        onChange={(e) => setEditFullName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Blood Group
                                    </label>
                                    <select
                                        value={editBloodType}
                                        onChange={(e) => setEditBloodType(e.target.value as BloodType)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        {bloodTypes.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={editAge}
                                        onChange={(e) => setEditAge(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Gender
                                    </label>
                                    <select
                                        value={editGender}
                                        onChange={(e) => setEditGender(e.target.value as any)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Eligibility
                                    </label>
                                    <select
                                        value={editEligibility}
                                        onChange={(e) => setEditEligibility(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        <option value="Eligible">Eligible</option>
                                        <option value="Temporarily Deferred">Temporarily Deferred</option>
                                        <option value="Permanently Deferred">Permanently Deferred</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Hb (g/dL)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editHemoglobin}
                                        onChange={(e) => setEditHemoglobin(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Blood Pressure
                                    </label>
                                    <input
                                        type="text"
                                        value={editBloodPressure}
                                        onChange={(e) => setEditBloodPressure(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={editWeight}
                                        onChange={(e) => setEditWeight(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Residential Address
                                </label>
                                <input
                                    type="text"
                                    value={editAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Notes & Screening History
                                </label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingDonor(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Donor Confirmation Modal */}
            {deletingDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Delete Donor Profile
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Are you sure you want to permanently delete donor <strong className="text-slate-900 dark:text-slate-100">{deletingDonor.fullName}</strong> ({deletingDonor.donorCode})?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                            Warning: This removes the donor CRM record and donor screening history from the database.
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingDonor(null)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteDonor}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                            >
                                Delete Donor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
