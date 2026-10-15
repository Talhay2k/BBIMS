import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { initialUnits, initialRequests, initialDonors, initialDrives, initialFacilities, initialEquipment, initialAuditLogs, initialDiscardLogs, initialAiData } from '@/components/bbims/initialData';
import { BloodUnit, RequestRecord, DonorRecord, DonationDrive, UnitStatus } from '@/components/bbims/types';
import { StatsSummary } from '@/components/bbims/StatsSummary';
import { InventoryTab } from '@/components/bbims/InventoryTab';
import { RequestsDispatchTab } from '@/components/bbims/RequestsDispatchTab';
import { CompatibilityEngineTab } from '@/components/bbims/CompatibilityEngineTab';
import { DonorsTab } from '@/components/bbims/DonorsTab';
import { DonationDrivesTab } from '@/components/bbims/DonationDrivesTab';
import { StorageFacilitiesTab } from '@/components/bbims/StorageFacilitiesTab';
import { AiForecastTab } from '@/components/bbims/AiForecastTab';
import { AuditComplianceTab } from '@/components/bbims/AuditComplianceTab';
import { BloodGroupMatrix } from '@/components/bbims/BloodGroupMatrix';
import { BbimsModals } from '@/components/bbims/BbimsModals';
import {
    LayoutGrid,
    Droplet,
    Truck,
    GitCompare,
    Users,
    Calendar,
    Building2,
    Sparkles,
    ShieldCheck,
    Plus,
    Activity,
    Hospital,
    Landmark,
} from 'lucide-react';

type TabKey = 'overview' | 'inventory' | 'requests' | 'compatibility' | 'donors' | 'drives' | 'facilities' | 'ai' | 'audit';
type PortalKey = 'all' | 'blood_bank' | 'hospital' | 'ministry';

export default function Dashboard() {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const userName = auth?.user?.name || 'System Administrator';

    // State Management
    const [units, setUnits] = useState<BloodUnit[]>(initialUnits);
    const [requests, setRequests] = useState<RequestRecord[]>(initialRequests);
    const [donors, setDonors] = useState<DonorRecord[]>(initialDonors);
    const [drives, setDrives] = useState<DonationDrive[]>(initialDrives);
    const [facilities] = useState(initialFacilities);
    const [equipment] = useState(initialEquipment);
    const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
    const [discardLogs] = useState(initialDiscardLogs);
    const [aiData] = useState(initialAiData);

    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [activePortal, setActivePortal] = useState<PortalKey>('all');
    const [selectedBloodType, setSelectedBloodType] = useState<string>('All');

    // Modals state
    const [isIntakeOpen, setIsIntakeOpen] = useState(false);
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [isDonorOpen, setIsDonorOpen] = useState(false);
    const [isDriveOpen, setIsDriveOpen] = useState(false);

    // Sync tab with URL search parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as TabKey;
        if (tab && ['overview', 'inventory', 'requests', 'compatibility', 'donors', 'drives', 'facilities', 'ai', 'audit'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [usePage().url]);

    // Event Handlers
    const handleAddUnit = (newUnitData: any) => {
        const newId = `bld-${Date.now()}`;
        const newUnit: BloodUnit = {
            id: newId,
            unitNumber: `BLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            bloodType: newUnitData.bloodType,
            component: newUnitData.component,
            facilityId: newUnitData.facilityId,
            facilityName: facilities.find((f) => f.id === newUnitData.facilityId)?.name || 'Central Vault',
            location: newUnitData.location,
            temperatureZone: '2°C to 6°C',
            volumeMl: newUnitData.volumeMl,
            collectionDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0],
            status: 'Available',
            donorId: newUnitData.donorCode,
            donorCode: newUnitData.donorCode,
            testingStatus: 'Tested & Passed',
        };
        setUnits((prev) => [newUnit, ...prev]);
        setIsIntakeOpen(false);

        // Add audit log
        setAuditLogs((prev) => [
            {
                id: `log-${Date.now()}`,
                timestamp: new Date().toLocaleString(),
                userStaff: userName,
                action: 'Blood Unit Intake Registered',
                entityType: 'Inventory',
                entityId: newUnit.unitNumber,
                details: `Intake registered for ${newUnit.bloodType} ${newUnit.component} at ${newUnit.facilityName}.`,
                digitalSignatureHash: `0x${Math.random().toString(16).substr(2, 16)}`,
            },
            ...prev,
        ]);
    };

    const handleAddRequest = (reqData: any) => {
        const newId = `req-${Date.now()}`;
        const newReq: RequestRecord = {
            id: newId,
            requestCode: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            hospitalName: reqData.hospitalName,
            patientName: reqData.patientName,
            patientAge: reqData.patientAge,
            patientGender: reqData.patientGender,
            requiredBloodType: reqData.requiredBloodType,
            component: reqData.component,
            unitsRequested: reqData.unitsRequested,
            unitsAssigned: [],
            urgency: reqData.urgency,
            status: 'Pending',
            requestDate: new Date().toLocaleString(),
            requiredByDate: new Date(Date.now() + 7200000).toLocaleString(),
        };
        setRequests((prev) => [newReq, ...prev]);
        setIsRequestOpen(false);
    };

    const handleAddDonor = (donorData: any) => {
        const newDonor: DonorRecord = {
            id: `dnr-${Date.now()}`,
            donorCode: `DNR-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: donorData.fullName,
            bloodType: donorData.bloodType,
            age: donorData.age,
            gender: donorData.gender,
            phone: donorData.phone,
            email: donorData.email,
            address: 'Metro District',
            lastDonationDate: new Date().toISOString().split('T')[0],
            eligibilityStatus: 'Eligible',
            totalDonationsCount: 1,
            hemoglobinGdl: donorData.hemoglobinGdl,
            bloodPressure: donorData.bloodPressure,
            weightKg: donorData.weightKg,
        };
        setDonors((prev) => [newDonor, ...prev]);
        setIsDonorOpen(false);
    };

    const handleAddDrive = (driveData: any) => {
        const newDrive: DonationDrive = {
            id: `drv-${Date.now()}`,
            driveCode: `DRV-2026-${Math.floor(10 + Math.random() * 90)}`,
            name: driveData.name,
            organizer: driveData.organizer,
            location: driveData.location,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            targetUnits: driveData.targetUnits,
            collectedUnits: 0,
            registeredDonorsCount: 15,
            status: 'Active',
            facilityId: facilities[0]?.id || 'fac-1',
        };
        setDrives((prev) => [newDrive, ...prev]);
        setIsDriveOpen(false);
    };

    const handleUpdateStatus = (id: string, newStatus: UnitStatus) => {
        setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
    };

    const handleCrossMatchUnits = (requestId: string, unitIds: string[]) => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === requestId ? { ...r, status: 'Cross-Matched', unitsAssigned: unitIds } : r,
            ),
        );
        setUnits((prev) =>
            prev.map((u) => (unitIds.includes(u.id) ? { ...u, status: 'Cross-Matched' } : u)),
        );
    };

    const handleDispatchOrder = (requestId: string) => {
        const req = requests.find((r) => r.id === requestId);
        if (req) {
            setRequests((prev) =>
                prev.map((r) => (r.id === requestId ? { ...r, status: 'Dispatched' } : r)),
            );
            setUnits((prev) =>
                prev.map((u) => (req.unitsAssigned.includes(u.id) ? { ...u, status: 'Dispatched' } : u)),
            );
        }
    };

    const handleRecordDonation = (donorId: string, details: any) => {
        setDonors((prev) =>
            prev.map((d) =>
                d.id === donorId
                    ? {
                        ...d,
                        totalDonationsCount: d.totalDonationsCount + 1,
                        lastDonationDate: new Date().toISOString().split('T')[0],
                    }
                    : d,
            ),
        );
    };

    const navTabs = [
        { key: 'overview', label: 'Command Center', icon: LayoutGrid },
        { key: 'inventory', label: 'Blood Inventory', icon: Droplet, count: units.length },
        { key: 'requests', label: 'STAT Requests', icon: Truck, count: requests.filter((r) => r.status !== 'Dispatched').length },
        { key: 'compatibility', label: 'Cross-Match Engine', icon: GitCompare },
        { key: 'donors', label: 'Donor CRM', icon: Users, count: donors.length },
        { key: 'facilities', label: 'Cold Vaults', icon: Building2, count: facilities.length },
        { key: 'ai', label: 'AI Forecasting', icon: Sparkles },
        { key: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
            <Head title="BloodMatrix Command Center" />

            {/* Top Unified Header & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 dark:border-[#222F44] bg-white dark:bg-[#161D2A] p-5 sm:p-6 shadow-sm transition-colors">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            BloodMatrix Command Center
                        </h1>
                        <span className="hidden sm:inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-500/20">
                            Live Telemetry
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Allied Hospital Faisalabad • Logged in as <strong className="text-slate-800 dark:text-slate-200 font-semibold">{userName}</strong> • Sub-3 min cross-matching active
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={() => setIsIntakeOpen(true)}
                        className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Unit</span>
                    </button>
                    <button
                        onClick={() => setIsRequestOpen(true)}
                        className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#0B0F17] dark:hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 border border-slate-200 dark:border-[#222F44] cursor-pointer"
                    >
                        <Truck className="h-3.5 w-3.5" />
                        <span>STAT Order</span>
                    </button>
                </div>
            </div>

            {/* Global Key Metrics Overview */}
            <StatsSummary
                units={units}
                donors={donors}
                requests={requests}
                drives={drives}
            />

            {/* Active Tab View */}
            <div className="flex-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <BloodGroupMatrix units={units} selectedType={selectedBloodType} onSelectType={setSelectedBloodType} />
                        <InventoryTab
                            units={units}
                            onOpenIntakeModal={() => setIsIntakeOpen(true)}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <InventoryTab
                        units={units}
                        onOpenIntakeModal={() => setIsIntakeOpen(true)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}

                {activeTab === 'requests' && (
                    <RequestsDispatchTab
                        requests={requests}
                        units={units}
                        onOpenCreateRequestModal={() => setIsRequestOpen(true)}
                        onCrossMatchUnits={handleCrossMatchUnits}
                        onDispatchOrder={handleDispatchOrder}
                    />
                )}

                {activeTab === 'compatibility' && (
                    <CompatibilityEngineTab inventoryUnits={units} />
                )}

                {activeTab === 'donors' && (
                    <DonorsTab
                        donors={donors}
                        facilities={facilities}
                        onOpenRegisterModal={() => setIsDonorOpen(true)}
                        onRecordDonation={handleRecordDonation}
                    />
                )}

                {activeTab === 'drives' && (
                    <DonationDrivesTab
                        drives={drives}
                        onOpenScheduleDriveModal={() => setIsDriveOpen(true)}
                    />
                )}

                {activeTab === 'facilities' && (
                    <StorageFacilitiesTab facilities={facilities} equipment={equipment} />
                )}

                {activeTab === 'ai' && <AiForecastTab aiData={aiData} />}

                {activeTab === 'audit' && (
                    <AuditComplianceTab auditLogs={auditLogs} discardLogs={discardLogs} />
                )}
            </div>

            {/* Action Modals */}
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
                donors={donors}
            />
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};


