import React from 'react';
import { DonationDrive } from './types';
import {
    Calendar,
    MapPin,
    Users,
    Plus,
    CheckCircle,
    Clock,
    Award,
} from 'lucide-react';

interface DrivesTabProps {
    drives: DonationDrive[];
    onOpenScheduleDriveModal: () => void;
}

export const DonationDrivesTab: React.FC<DrivesTabProps> = ({
    drives,
    onOpenScheduleDriveModal,
}) => {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                        <Calendar className="h-5 w-5 text-purple-400" />
                        Donation Drive Campaigns & Outreach
                    </h2>
                    <p className="text-xs text-slate-400">
                        Schedule and track mobile collection campaigns,
                        corporate drives, and target goals.
                    </p>
                </div>

                <button
                    onClick={onOpenScheduleDriveModal}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/20 transition hover:bg-purple-500 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Schedule New Drive
                </button>
            </div>

            {/* Drives Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {drives.map((drive) => {
                    const percentage = Math.min(
                        100,
                        Math.round(
                            (drive.collectedUnits / drive.targetUnits) * 100,
                        ),
                    );
                    return (
                        <div
                            key={drive.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg"
                        >
                            <div>
                                <div className="mb-2 flex items-start justify-between gap-3">
                                    <span className="font-mono text-xs font-bold text-purple-400">
                                        {drive.driveCode}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                                            drive.status === 'Active'
                                                ? 'animate-pulse border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                : drive.status === 'Scheduled'
                                                  ? 'border-purple-500/20 bg-purple-500/10 text-purple-300'
                                                  : 'border-slate-700 bg-slate-800 text-slate-400'
                                        }`}
                                    >
                                        {drive.status}
                                    </span>
                                </div>

                                <h3 className="mb-1 text-base font-bold text-white">
                                    {drive.name}
                                </h3>
                                <p className="mb-3 text-xs font-medium text-slate-400">
                                    Organizer: {drive.organizer}
                                </p>

                                <div className="mb-4 space-y-1.5 text-xs text-slate-300">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{drive.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                        <span>
                                            {drive.startDate} to {drive.endDate}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-400">
                                            Collection Progress:
                                        </span>
                                        <strong className="text-slate-200">
                                            {drive.collectedUnits} /{' '}
                                            {drive.targetUnits} units (
                                            {percentage}%)
                                        </strong>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5 text-purple-400" />
                                    {drive.registeredDonorsCount} Donors
                                    Registered
                                </span>
                                <span className="font-semibold text-slate-300">
                                    Goal: {drive.targetUnits} units
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
