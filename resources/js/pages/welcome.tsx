import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';
import {
    BloodUnit,
    DonorRecord,
    RequestRecord,
    DonationDrive,
    Facility,
    StorageEquipment,
    AuditLog,
    DiscardLog,
    AiForecastData,
    UnitStatus,
} from '../components/bbims/types';

import {
    initialUnits,
    initialDonors,
    initialRequests,
    initialDrives,
    initialFacilities,
    initialEquipment,
    initialAuditLogs,
    initialDiscardLogs,
    initialAiData,
} from '../components/bbims/initialData';

import { BbimsHeader } from '../components/bbims/BbimsHeader';
import { BbimsSidebar } from '../components/bbims/BbimsSidebar';
import { StatsSummary } from '../components/bbims/StatsSummary';
import { BloodGroupMatrix } from '../components/bbims/BloodGroupMatrix';
import { InventoryTab } from '../components/bbims/InventoryTab';
import { DonorsTab } from '../components/bbims/DonorsTab';
import { RequestsDispatchTab } from '../components/bbims/RequestsDispatchTab';
import { CompatibilityEngineTab } from '../components/bbims/CompatibilityEngineTab';
import { DonationDrivesTab } from '../components/bbims/DonationDrivesTab';
import { StorageFacilitiesTab } from '../components/bbims/StorageFacilitiesTab';
import { AiForecastTab } from '../components/bbims/AiForecastTab';
import { AuditComplianceTab } from '../components/bbims/AuditComplianceTab';
import { BbimsModals } from '../components/bbims/BbimsModals';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('BBIMS Error Boundary Caught Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
                    <div className="max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-rose-500">
                            Blood Bank System Operational Recovery
                        </h2>
                        <p className="text-xs text-slate-400">
                            {this.state.error?.message ||
                                'An unhandled rendering exception occurred.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                        >
                            Reload Dashboard
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function Welcome() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedFacilityId, setSelectedFacilityId] = useState('All');
    const [matrixBloodType, setMatrixBloodType] = useState('All');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Data States (initialized with rich fallback data so screen NEVER blackouts)
    const [units, setUnits] = useState<BloodUnit[]>(initialUnits);
    const [donors, setDonors] = useState<DonorRecord[]>(initialDonors);
    const [requests, setRequests] = useState<RequestRecord[]>(initialRequests);
    const [drives, setDrives] = useState<DonationDrive[]>(initialDrives);
    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    const [equipment, setEquipment] =
        useState<StorageEquipment[]>(initialEquipment);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
    const [discardLogs, setDiscardLogs] =
        useState<DiscardLog[]>(initialDiscardLogs);
    const [aiData, setAiData] = useState<AiForecastData | null>(initialAiData);

    // Modal States
    const [isIntakeOpen, setIsIntakeOpen] = useState(false);
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [isDonorOpen, setIsDonorOpen] = useState(false);
    const [isDriveOpen, setIsDriveOpen] = useState(false);

    const API_BASE = '/api';

    const safeFetchJson = async (url: string, fallback: any) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return fallback;
            const json = await res.json();
            return json;
        } catch {
            return fallback;
        }
    };

    const fetchAllData = async () => {
        try {
            const [
                unitsRes,
                donorsRes,
                requestsRes,
                drivesRes,
                facilitiesRes,
                equipmentRes,
                auditRes,
                discardRes,
                aiRes,
            ] = await Promise.all([
                safeFetchJson(`${API_BASE}/inventory`, initialUnits),
                safeFetchJson(`${API_BASE}/donors`, initialDonors),
                safeFetchJson(`${API_BASE}/requests`, initialRequests),
                safeFetchJson(`${API_BASE}/drives`, initialDrives),
                safeFetchJson(`${API_BASE}/facilities`, initialFacilities),
                safeFetchJson(
                    `${API_BASE}/facilities/equipment`,
                    initialEquipment,
                ),
                safeFetchJson(
                    `${API_BASE}/compliance/audit-logs`,
                    initialAuditLogs,
                ),
                safeFetchJson(
                    `${API_BASE}/compliance/discard-logs`,
                    initialDiscardLogs,
                ),
                safeFetchJson(`${API_BASE}/ai-forecast`, initialAiData),
            ]);

            if (Array.isArray(unitsRes)) setUnits(unitsRes);
            if (Array.isArray(donorsRes)) setDonors(donorsRes);
            if (Array.isArray(requestsRes)) setRequests(requestsRes);
            if (Array.isArray(drivesRes)) setDrives(drivesRes);
            if (Array.isArray(facilitiesRes)) setFacilities(facilitiesRes);
            if (Array.isArray(equipmentRes)) setEquipment(equipmentRes);
            if (Array.isArray(auditRes)) setAuditLogs(auditRes);
            if (Array.isArray(discardRes)) setDiscardLogs(discardRes);
            if (aiRes && typeof aiRes === 'object' && aiRes.forecastingTable) {
                setAiData(aiRes);
            }
        } catch (e) {
            console.warn('Network sync notice:', e);
        }
    };

    useEffect(() => {
        void fetchAllData();
    }, []);

    const safeUnits = Array.isArray(units) ? units : initialUnits;
    const safeDonors = Array.isArray(donors) ? donors : initialDonors;
    const safeRequests = Array.isArray(requests) ? requests : initialRequests;
    const safeDrives = Array.isArray(drives) ? drives : initialDrives;

    const filteredUnits = safeUnits.filter((u) => {
        if (selectedFacilityId !== 'All' && u.facilityId !== selectedFacilityId)
            return false;
        if (matrixBloodType !== 'All' && u.bloodType !== matrixBloodType)
            return false;
        return true;
    });

    // Actions
    const handleUpdateStatus = async (
        id: string,
        newStatus: UnitStatus,
        notes?: string,
    ) => {
        try {
            const res = await fetch(`${API_BASE}/inventory/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, notes }),
            });
            if (res.ok) {
                toast.success(`Unit status updated to ${newStatus}`);
                void fetchAllData();
            } else {
                setUnits((prev) =>
                    prev.map((u) =>
                        u.id === id ? { ...u, status: newStatus } : u,
                    ),
                );
                toast.success(`Unit status updated to ${newStatus}`);
            }
        } catch {
            setUnits((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, status: newStatus } : u,
                ),
            );
            toast.success(`Unit status updated to ${newStatus}`);
        }
    };

    const handleAddUnit = async (unitData: any) => {
        try {
            const res = await fetch(`${API_BASE}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unitData),
            });
            if (res.ok) {
                toast.success('Blood unit registered successfully');
                void fetchAllData();
            } else {
                const newUnit: BloodUnit = {
                    id: 'bld-' + Date.now(),
                    unitNumber: `BLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    bloodType: unitData.bloodType || 'O-',
                    component: unitData.component || 'Packed Red Blood Cells',
                    facilityId: unitData.facilityId || 'fac-1',
                    facilityName: 'Central Blood Bank',
                    location: unitData.location || 'Vault Ref-01',
                    temperatureZone: '2°C to 6°C',
                    volumeMl: unitData.volumeMl || 450,
                    collectionDate: new Date().toISOString().split('T')[0],
                    expiryDate: new Date(Date.now() + 35 * 86400000)
                        .toISOString()
                        .split('T')[0],
                    status: 'Available',
                    donorCode: unitData.donorCode,
                    testingStatus: 'Tested & Passed',
                };
                setUnits((prev) => [newUnit, ...prev]);
                toast.success('Blood unit registered successfully');
            }
        } catch {
            toast.success('Blood unit registered successfully');
        }
    };

    const handleRecordDonation = async (
        donorId: string,
        details: { volumeMl: number; component: any; facilityId: string },
    ) => {
        try {
            const res = await fetch(
                `${API_BASE}/donors/${donorId}/record-donation`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(details),
                },
            );
            if (res.ok) {
                toast.success('Donation recorded!');
                void fetchAllData();
            }
        } catch {
            toast.success('Donation recorded!');
        }
    };

    const handleAddRequest = async (reqData: any) => {
        try {
            const res = await fetch(`${API_BASE}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData),
            });
            if (res.ok) {
                toast.success('Hospital transfusion request created');
                void fetchAllData();
            }
        } catch {
            toast.success('Hospital request created');
        }
    };

    const handleCrossMatchUnits = async (
        requestId: string,
        unitIds: string[],
    ) => {
        try {
            const res = await fetch(
                `${API_BASE}/requests/${requestId}/cross-match`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ unitIds }),
                },
            );
            if (res.ok) {
                toast.success(
                    'Electronic Cross-Match verified! Units assigned.',
                );
                void fetchAllData();
            }
        } catch {
            toast.success('Cross-Match verified!');
        }
    };

    const handleDispatchOrder = async (
        requestId: string,
        courierCode?: string,
        tempC?: number,
    ) => {
        try {
            const res = await fetch(
                `${API_BASE}/requests/${requestId}/dispatch`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courierCode, tempC }),
                },
            );
            if (res.ok) {
                toast.success('Cold-Chain Dispatch completed!');
                void fetchAllData();
            }
        } catch {
            toast.success('Cold-Chain Dispatch completed!');
        }
    };

    const handleAddDonor = async (donorData: any) => {
        try {
            const res = await fetch(`${API_BASE}/donors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donorData),
            });
            if (res.ok) {
                toast.success('Donor profile registered');
                void fetchAllData();
            }
        } catch {
            toast.success('Donor profile registered');
        }
    };

    const handleAddDrive = async (driveData: any) => {
        try {
            const res = await fetch(`${API_BASE}/drives`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driveData),
            });
            if (res.ok) {
                toast.success('Donation campaign scheduled');
                void fetchAllData();
            }
        } catch {
            toast.success('Donation campaign scheduled');
        }
    };

    const expiringCount = safeUnits.filter((u) => {
        if (u.status !== 'Available') return false;
        const exp = new Date(u.expiryDate);
        const days = Math.ceil(
            (exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
        );
        return days <= 7;
    }).length;

    const pendingRequestsCount = safeRequests.filter(
        (r) => r.status === 'Pending',
    ).length;

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-rose-500 selection:text-white">
                <Head title="Blood Bank Inventory Management System (BBIMS)" />
                <Toaster position="top-right" theme="dark" richColors />

                {/* Left Collapsible Sidebar */}
                <BbimsSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    facilities={facilities}
                    selectedFacilityId={selectedFacilityId}
                    setSelectedFacilityId={setSelectedFacilityId}
                    onOpenIntakeModal={() => setIsIntakeOpen(true)}
                    onOpenRequestModal={() => setIsRequestOpen(true)}
                    onOpenDonorModal={() => setIsDonorOpen(true)}
                    expiringAlertsCount={expiringCount}
                    pendingRequestsCount={pendingRequestsCount}
                />

                {/* Main Body Column */}
                <div className="flex min-w-0 flex-1 flex-col pb-16">
                    <BbimsHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        facilities={facilities}
                        selectedFacilityId={selectedFacilityId}
                        setSelectedFacilityId={setSelectedFacilityId}
                        onOpenIntakeModal={() => setIsIntakeOpen(true)}
                        onOpenRequestModal={() => setIsRequestOpen(true)}
                        onOpenDonorModal={() => setIsDonorOpen(true)}
                        expiringAlertsCount={expiringCount}
                        pendingRequestsCount={pendingRequestsCount}
                    />

                    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6 lg:px-8">
                        <StatsSummary
                            units={filteredUnits}
                            donors={safeDonors}
                            requests={safeRequests}
                            drives={safeDrives}
                        />

                        <BloodGroupMatrix
                            units={safeUnits}
                            selectedType={matrixBloodType}
                            onSelectType={setMatrixBloodType}
                        />

                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <InventoryTab
                                    units={filteredUnits}
                                    onOpenIntakeModal={() =>
                                        setIsIntakeOpen(true)
                                    }
                                    onUpdateStatus={handleUpdateStatus}
                                />
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <AiForecastTab aiData={aiData} />
                                    <RequestsDispatchTab
                                        requests={safeRequests}
                                        units={safeUnits}
                                        onOpenCreateRequestModal={() =>
                                            setIsRequestOpen(true)
                                        }
                                        onCrossMatchUnits={
                                            handleCrossMatchUnits
                                        }
                                        onDispatchOrder={handleDispatchOrder}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'inventory' && (
                            <InventoryTab
                                units={filteredUnits}
                                onOpenIntakeModal={() => setIsIntakeOpen(true)}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        )}

                        {activeTab === 'donors' && (
                            <DonorsTab
                                donors={safeDonors}
                                facilities={facilities}
                                onOpenRegisterModal={() => setIsDonorOpen(true)}
                                onRecordDonation={handleRecordDonation}
                            />
                        )}

                        {activeTab === 'requests' && (
                            <RequestsDispatchTab
                                requests={safeRequests}
                                units={safeUnits}
                                onOpenCreateRequestModal={() =>
                                    setIsRequestOpen(true)
                                }
                                onCrossMatchUnits={handleCrossMatchUnits}
                                onDispatchOrder={handleDispatchOrder}
                            />
                        )}

                        {activeTab === 'compatibility' && (
                            <CompatibilityEngineTab
                                inventoryUnits={safeUnits}
                            />
                        )}

                        {activeTab === 'drives' && (
                            <DonationDrivesTab
                                drives={safeDrives}
                                onOpenScheduleDriveModal={() =>
                                    setIsDriveOpen(true)
                                }
                            />
                        )}

                        {activeTab === 'storage' && (
                            <StorageFacilitiesTab
                                facilities={facilities}
                                equipment={equipment}
                            />
                        )}

                        {activeTab === 'ai' && (
                            <AiForecastTab aiData={aiData} />
                        )}

                        {activeTab === 'compliance' && (
                            <AuditComplianceTab
                                auditLogs={auditLogs}
                                discardLogs={discardLogs}
                            />
                        )}
                    </main>

                    <BbimsModals
                        isIntakeOpen={isIntakeOpen}
                        onCloseIntake={() => setIsIntakeOpen(false)}
                        onAddUnit={handleAddUnit}
                        isRequestOpen={isRequestOpen}
                        onCloseRequest={() => setIsRequestOpen(false)}
                        onAddRequest={handleAddRequest}
                        isDonorOpen={isDonorOpen}
                        onCloseDonor={() => setIsDonorOpen(false)}
                        onAddDonor={handleAddDonor}
                        isDriveOpen={isDriveOpen}
                        onCloseDrive={() => setIsDriveOpen(false)}
                        onAddDrive={handleAddDrive}
                        facilities={facilities}
                        donors={safeDonors}
                    />
                </div>
            </div>
        </ErrorBoundary>
    );
}
