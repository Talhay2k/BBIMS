import React, { useState } from 'react';
import { BloodType, ComponentType, Facility, DonorRecord } from './types';
import { Droplet, FilePlus, UserPlus, Calendar } from 'lucide-react';

interface ModalsProps {
    isIntakeOpen: boolean;
    onCloseIntake: () => void;
    onAddUnit: (unitData: any) => void;

    isRequestOpen: boolean;
    onCloseRequest: () => void;
    onAddRequest: (reqData: any) => void;

    isDonorOpen: boolean;
    onCloseDonor: () => void;
    onAddDonor: (donorData: any) => void;

    isDriveOpen: boolean;
    onCloseDrive: () => void;
    onAddDrive: (driveData: any) => void;

    facilities: Facility[];
    donors: DonorRecord[];
}

export const BbimsModals: React.FC<ModalsProps> = ({
    isIntakeOpen,
    onCloseIntake,
    onAddUnit,
    isRequestOpen,
    onCloseRequest,
    onAddRequest,
    isDonorOpen,
    onCloseDonor,
    onAddDonor,
    isDriveOpen,
    onCloseDrive,
    onAddDrive,
    facilities,
    donors,
}) => {
    // Intake Form
    const [intakeBloodType, setIntakeBloodType] = useState<BloodType>('O-');
    const [intakeComponent, setIntakeComponent] = useState<ComponentType>(
        'Packed Red Blood Cells',
    );
    const [intakeFacilityId, setIntakeFacilityId] = useState(
        facilities[0]?.id || 'fac-1',
    );
    const [intakeLocation, setIntakeLocation] = useState(
        'Main Cold Vault Ref-01 / Shelf A',
    );
    const [intakeVolume, setIntakeVolume] = useState(450);
    const [intakeDonorCode, setIntakeDonorCode] = useState(
        donors[0]?.donorCode || 'DNR-1001',
    );

    // Request Form
    const [reqHospital, setReqHospital] = useState('City General Emergency ER');
    const [reqPatientName, setReqPatientName] = useState('Arthur Pendelton');
    const [reqPatientAge, setReqPatientAge] = useState(54);
    const [reqPatientGender, setReqPatientGender] = useState('Male');
    const [reqBloodType, setReqBloodType] = useState<BloodType>('O-');
    const [reqComponent, setReqComponent] = useState<ComponentType>(
        'Packed Red Blood Cells',
    );
    const [reqUnits, setReqUnits] = useState(2);
    const [reqUrgency, setReqUrgency] = useState<
        'Emergency (Stat)' | 'Urgent' | 'Routine'
    >('Emergency (Stat)');

    // Donor Form
    const [donorName, setDonorName] = useState('Claire Redfield');
    const [donorBloodType, setDonorBloodType] = useState<BloodType>('A+');
    const [donorAge, setDonorAge] = useState(32);
    const [donorGender, setDonorGender] = useState<'Male' | 'Female' | 'Other'>(
        'Female',
    );
    const [donorPhone, setDonorPhone] = useState('+1 (555) 321-9876');
    const [donorEmail, setDonorEmail] = useState('claire.redfield@example.com');
    const [donorHb, setDonorHb] = useState(14.2);
    const [donorBP, setDonorBP] = useState('118/76');
    const [donorWeight, setDonorWeight] = useState(65);

    // Drive Form
    const [driveName, setDriveName] = useState(
        'Metro Metro Center Emergency O- Drive',
    );
    const [driveOrganizer, setDriveOrganizer] = useState(
        'Regional Red Cross Chapter',
    );
    const [driveLocation, setDriveLocation] = useState('Civic Hall, Downtown');
    const [driveTarget, setDriveTarget] = useState(150);

    const handleIntakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddUnit({
            bloodType: intakeBloodType,
            component: intakeComponent,
            facilityId: intakeFacilityId,
            location: intakeLocation,
            volumeMl: Number(intakeVolume),
            donorCode: intakeDonorCode,
        });
        onCloseIntake();
    };

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddRequest({
            hospitalName: reqHospital,
            patientName: reqPatientName,
            patientAge: Number(reqPatientAge),
            patientGender: reqPatientGender,
            requiredBloodType: reqBloodType,
            component: reqComponent,
            unitsRequested: Number(reqUnits),
            urgency: reqUrgency,
        });
        onCloseRequest();
    };

    const handleDonorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddDonor({
            fullName: donorName,
            bloodType: donorBloodType,
            age: Number(donorAge),
            gender: donorGender,
            phone: donorPhone,
            email: donorEmail,
            hemoglobinGdl: Number(donorHb),
            bloodPressure: donorBP,
            weightKg: Number(donorWeight),
        });
        onCloseDonor();
    };

    const handleDriveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddDrive({
            name: driveName,
            organizer: driveOrganizer,
            location: driveLocation,
            targetUnits: Number(driveTarget),
        });
        onCloseDrive();
    };

    return (
        <>
            {/* Intake Unit Modal */}
            {isIntakeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <Droplet className="h-5 w-5 text-rose-500" />
                                Register New Blood Unit Intake
                            </h3>
                            <button
                                onClick={onCloseIntake}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <form
                            onSubmit={handleIntakeSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Blood Group
                                    </label>
                                    <select
                                        value={intakeBloodType}
                                        onChange={(e) =>
                                            setIntakeBloodType(
                                                e.target.value as BloodType,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    >
                                        {[
                                            'A+',
                                            'A-',
                                            'B+',
                                            'B-',
                                            'AB+',
                                            'AB-',
                                            'O+',
                                            'O-',
                                        ].map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Component
                                    </label>
                                    <select
                                        value={intakeComponent}
                                        onChange={(e) =>
                                            setIntakeComponent(
                                                e.target.value as ComponentType,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    >
                                        <option value="Packed Red Blood Cells">
                                            Packed Red Blood Cells
                                        </option>
                                        <option value="Whole Blood">
                                            Whole Blood
                                        </option>
                                        <option value="Platelets">
                                            Platelets
                                        </option>
                                        <option value="Fresh Frozen Plasma">
                                            Fresh Frozen Plasma
                                        </option>
                                        <option value="Cryoprecipitate">
                                            Cryoprecipitate
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Target Storage Facility
                                </label>
                                <select
                                    value={intakeFacilityId}
                                    onChange={(e) =>
                                        setIntakeFacilityId(e.target.value)
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
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Storage Vault Location
                                </label>
                                <input
                                    type="text"
                                    value={intakeLocation}
                                    onChange={(e) =>
                                        setIntakeLocation(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Volume (mL)
                                    </label>
                                    <input
                                        type="number"
                                        value={intakeVolume}
                                        onChange={(e) =>
                                            setIntakeVolume(
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Donor Code Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={intakeDonorCode}
                                        onChange={(e) =>
                                            setIntakeDonorCode(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={onCloseIntake}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-md shadow-rose-900/30 hover:bg-rose-500"
                                >
                                    Intake Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Request Modal */}
            {isRequestOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <FilePlus className="h-5 w-5 text-rose-400" />
                                Create Hospital Transfusion Request
                            </h3>
                            <button
                                onClick={onCloseRequest}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <form
                            onSubmit={handleRequestSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Hospital / Ward Name
                                </label>
                                <input
                                    type="text"
                                    value={reqHospital}
                                    onChange={(e) =>
                                        setReqHospital(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={reqPatientName}
                                        onChange={(e) =>
                                            setReqPatientName(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={reqPatientAge}
                                        onChange={(e) =>
                                            setReqPatientAge(
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Required Group
                                    </label>
                                    <select
                                        value={reqBloodType}
                                        onChange={(e) =>
                                            setReqBloodType(
                                                e.target.value as BloodType,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono font-bold text-slate-200"
                                    >
                                        {[
                                            'A+',
                                            'A-',
                                            'B+',
                                            'B-',
                                            'AB+',
                                            'AB-',
                                            'O+',
                                            'O-',
                                        ].map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Component
                                    </label>
                                    <select
                                        value={reqComponent}
                                        onChange={(e) =>
                                            setReqComponent(
                                                e.target.value as ComponentType,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    >
                                        <option value="Packed Red Blood Cells">
                                            Packed Red Blood Cells
                                        </option>
                                        <option value="Whole Blood">
                                            Whole Blood
                                        </option>
                                        <option value="Platelets">
                                            Platelets
                                        </option>
                                        <option value="Fresh Frozen Plasma">
                                            Fresh Frozen Plasma
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Units Needed
                                    </label>
                                    <input
                                        type="number"
                                        value={reqUnits}
                                        onChange={(e) =>
                                            setReqUnits(Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Urgency Classification
                                </label>
                                <select
                                    value={reqUrgency}
                                    onChange={(e) =>
                                        setReqUrgency(e.target.value as any)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-bold text-slate-200"
                                >
                                    <option value="Emergency (Stat)">
                                        Emergency (Stat Protocol)
                                    </option>
                                    <option value="Urgent">
                                        Urgent (Within 4 Hours)
                                    </option>
                                    <option value="Routine">
                                        Routine Elective Surgery
                                    </option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={onCloseRequest}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-500"
                                >
                                    Submit Transfusion Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Register Donor Modal */}
            {isDonorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <UserPlus className="h-5 w-5 text-blue-400" />
                                Register New Donor Profile
                            </h3>
                            <button
                                onClick={onCloseDonor}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <form
                            onSubmit={handleDonorSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={donorName}
                                    onChange={(e) =>
                                        setDonorName(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Blood Group
                                    </label>
                                    <select
                                        value={donorBloodType}
                                        onChange={(e) =>
                                            setDonorBloodType(
                                                e.target.value as BloodType,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono font-bold text-slate-200"
                                    >
                                        {[
                                            'A+',
                                            'A-',
                                            'B+',
                                            'B-',
                                            'AB+',
                                            'AB-',
                                            'O+',
                                            'O-',
                                        ].map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={donorAge}
                                        onChange={(e) =>
                                            setDonorAge(Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Gender
                                    </label>
                                    <select
                                        value={donorGender}
                                        onChange={(e) =>
                                            setDonorGender(
                                                e.target.value as any,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={donorPhone}
                                        onChange={(e) =>
                                            setDonorPhone(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={donorEmail}
                                        onChange={(e) =>
                                            setDonorEmail(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Hemoglobin (g/dL)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={donorHb}
                                        onChange={(e) =>
                                            setDonorHb(Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Blood Pressure
                                    </label>
                                    <input
                                        type="text"
                                        value={donorBP}
                                        onChange={(e) =>
                                            setDonorBP(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-400">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={donorWeight}
                                        onChange={(e) =>
                                            setDonorWeight(
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={onCloseDonor}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                                >
                                    Register Donor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Schedule Drive Modal */}
            {isDriveOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <Calendar className="h-5 w-5 text-purple-400" />
                                Schedule Donation Campaign
                            </h3>
                            <button
                                onClick={onCloseDrive}
                                className="text-slate-400 hover:text-white"
                            >
                                &#x2715;
                            </button>
                        </div>

                        <form
                            onSubmit={handleDriveSubmit}
                            className="space-y-3 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Campaign Title
                                </label>
                                <input
                                    type="text"
                                    value={driveName}
                                    onChange={(e) =>
                                        setDriveName(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Organizer
                                </label>
                                <input
                                    type="text"
                                    value={driveOrganizer}
                                    onChange={(e) =>
                                        setDriveOrganizer(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Venue Location
                                </label>
                                <input
                                    type="text"
                                    value={driveLocation}
                                    onChange={(e) =>
                                        setDriveLocation(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-400">
                                    Target Units Goal
                                </label>
                                <input
                                    type="number"
                                    value={driveTarget}
                                    onChange={(e) =>
                                        setDriveTarget(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={onCloseDrive}
                                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
                                >
                                    Schedule Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
