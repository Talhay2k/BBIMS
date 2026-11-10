import React, { useState } from 'react';
import { DonationDrive } from './types';
import {
    Calendar,
    MapPin,
    Users,
    Plus,
    Edit3,
    Trash2,
    X,
} from 'lucide-react';

interface DrivesTabProps {
    drives: DonationDrive[];
    onOpenScheduleDriveModal: () => void;
    onEditDrive?: (id: string, data: any) => void;
    onDeleteDrive?: (id: string) => void;
}

export const DonationDrivesTab: React.FC<DrivesTabProps> = ({
    drives,
    onOpenScheduleDriveModal,
    onEditDrive,
    onDeleteDrive,
}) => {
    // Edit Modal State
    const [editingDrive, setEditingDrive] = useState<DonationDrive | null>(null);
    const [editName, setEditName] = useState('');
    const [editOrganizer, setEditOrganizer] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');
    const [editTargetUnits, setEditTargetUnits] = useState(100);
    const [editCollectedUnits, setEditCollectedUnits] = useState(0);
    const [editRegisteredDonors, setEditRegisteredDonors] = useState(10);
    const [editStatus, setEditStatus] = useState<'Scheduled' | 'Active' | 'Completed' | 'Cancelled'>('Active');

    // Delete Modal State
    const [deletingDrive, setDeletingDrive] = useState<DonationDrive | null>(null);

    const startEditingDrive = (drive: DonationDrive) => {
        setEditingDrive(drive);
        setEditName(drive.name);
        setEditOrganizer(drive.organizer);
        setEditLocation(drive.location);
        setEditStartDate(drive.startDate);
        setEditEndDate(drive.endDate);
        setEditTargetUnits(drive.targetUnits);
        setEditCollectedUnits(drive.collectedUnits);
        setEditRegisteredDonors(drive.registeredDonorsCount);
        setEditStatus(drive.status);
    };

    const handleSaveDriveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDrive) return;
        onEditDrive?.(editingDrive.id, {
            name: editName,
            organizer: editOrganizer,
            location: editLocation,
            startDate: editStartDate,
            endDate: editEndDate,
            targetUnits: editTargetUnits,
            collectedUnits: editCollectedUnits,
            registeredDonorsCount: editRegisteredDonors,
            status: editStatus,
        });
        setEditingDrive(null);
    };

    const handleConfirmDeleteDrive = () => {
        if (!deletingDrive) return;
        onDeleteDrive?.(deletingDrive.id);
        setDeletingDrive(null);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg">
                <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Donation Drive Campaigns & Outreach
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Schedule and track mobile collection campaigns, corporate drives, and target goals.
                    </p>
                </div>

                <button
                    onClick={onOpenScheduleDriveModal}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/20 transition hover:bg-purple-700 active:scale-95 sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    Schedule New Drive
                </button>
            </div>

            {/* Drives Cards */}
            {drives.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-500">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        No Donation Drives Scheduled
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                        No community blood donation campaigns or mobile collection drives are scheduled yet. Click below to schedule a mobile drive.
                    </p>
                    <button
                        onClick={onOpenScheduleDriveModal}
                        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/20 transition hover:bg-purple-700 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Schedule New Drive
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {drives.map((drive) => {
                    const percentage = Math.min(
                        100,
                        Math.round((drive.collectedUnits / (drive.targetUnits || 1)) * 100),
                    );
                    return (
                        <div
                            key={drive.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg"
                        >
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="font-mono text-[11px] font-bold text-slate-500">
                                        {drive.driveCode}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                                                drive.status === 'Active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : drive.status === 'Scheduled'
                                                      ? 'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                      : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}
                                        >
                                            {drive.status}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
                                    {drive.name}
                                </h3>
                                <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Organizer: {drive.organizer}
                                </p>

                                <div className="mb-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                        <span>{drive.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                        <span>
                                            {drive.startDate} to {drive.endDate}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            Collection Progress:
                                        </span>
                                        <strong className="text-slate-800 dark:text-slate-200">
                                            {drive.collectedUnits} / {drive.targetUnits} units ({percentage}%)
                                        </strong>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    {drive.registeredDonorsCount} Donors Registered
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {onEditDrive && (
                                        <button
                                            onClick={() => startEditingDrive(drive)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 transition"
                                            title="Edit Campaign"
                                        >
                                            <Edit3 className="h-3 w-3" />
                                            Edit
                                        </button>
                                    )}
                                    {onDeleteDrive && (
                                        <button
                                            onClick={() => setDeletingDrive(drive)}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
                                            title="Delete Campaign"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* Edit Drive Modal */}
            {editingDrive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Edit3 className="h-5 w-5 text-blue-500" />
                                Edit Campaign: {editingDrive.driveCode}
                            </h3>
                            <button
                                onClick={() => setEditingDrive(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDriveEdit} className="space-y-3 text-xs">
                            <div>
                                <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                    Campaign / Drive Name
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Organizer
                                    </label>
                                    <input
                                        type="text"
                                        value={editOrganizer}
                                        onChange={(e) => setEditOrganizer(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editStartDate}
                                        onChange={(e) => setEditStartDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editEndDate}
                                        onChange={(e) => setEditEndDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Target Units
                                    </label>
                                    <input
                                        type="number"
                                        value={editTargetUnits}
                                        onChange={(e) => setEditTargetUnits(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Collected Units
                                    </label>
                                    <input
                                        type="number"
                                        value={editCollectedUnits}
                                        onChange={(e) => setEditCollectedUnits(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-medium text-slate-600 dark:text-slate-400">
                                        Status
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as any)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingDrive(null)}
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

            {/* Delete Drive Confirmation Modal */}
            {deletingDrive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Delete Donation Drive
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Are you sure you want to cancel and remove campaign <strong className="text-slate-900 dark:text-slate-100">{deletingDrive.name}</strong> ({deletingDrive.driveCode})?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                            Warning: This removes the scheduled outreach campaign and target goal tracking.
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingDrive(null)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteDrive}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                            >
                                Delete Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
