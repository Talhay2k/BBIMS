import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';
import { dashboard } from '@/routes';
import {
    initialUnits as fallbackUnits,
    initialRequests as fallbackRequests,
    initialDonors as fallbackDonors,
    initialDrives as fallbackDrives,
    initialFacilities as fallbackFacilities,
    initialEquipment as fallbackEquipment,
    initialAuditLogs as fallbackAuditLogs,
    initialDiscardLogs as fallbackDiscardLogs,
    initialAiData as fallbackAiData,
} from '@/components/bbims/initialData';
import {
    BloodUnit,
    RequestRecord,
    DonorRecord,
    DonationDrive,
    UnitStatus,
    Facility,
    StorageEquipment,
    AuditLog,
    DiscardLog,
    AiForecastData,
} from '@/components/bbims/types';
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
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Truck, Plus } from 'lucide-react';

type TabKey =
    | 'overview'
    | 'inventory'
    | 'requests'
    | 'compatibility'
    | 'donors'
    | 'drives'
    | 'facilities'
    | 'ai'
    | 'audit';
type PortalKey = 'all' | 'blood_bank' | 'hospital' | 'ministry';

interface DashboardProps {
    initialUnits?: BloodUnit[];
    initialDonors?: DonorRecord[];
    initialRequests?: RequestRecord[];
    initialDrives?: DonationDrive[];
    initialFacilities?: Facility[];
    initialEquipment?: StorageEquipment[];
    initialAuditLogs?: AuditLog[];
    initialDiscardLogs?: DiscardLog[];
    initialAiData?: AiForecastData;
}

export default function Dashboard({
    initialUnits: serverUnits,
    initialDonors: serverDonors,
    initialRequests: serverRequests,
    initialDrives: serverDrives,
    initialFacilities: serverFacilities,
    initialEquipment: serverEquipment,
    initialAuditLogs: serverAuditLogs,
    initialDiscardLogs: serverDiscardLogs,
    initialAiData: serverAiData,
}: DashboardProps = {}) {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const userName = auth?.user?.name || 'System Administrator';

    // State Management initialized with server database props if available, falling back safely
    const [units, setUnits] = useState<BloodUnit[]>(
        serverUnits !== undefined ? serverUnits : fallbackUnits,
    );
    const [requests, setRequests] = useState<RequestRecord[]>(
        serverRequests !== undefined ? serverRequests : fallbackRequests,
    );
    const [donors, setDonors] = useState<DonorRecord[]>(
        serverDonors !== undefined ? serverDonors : fallbackDonors,
    );
    const [drives, setDrives] = useState<DonationDrive[]>(
        serverDrives !== undefined ? serverDrives : fallbackDrives,
    );
    const [facilities, setFacilities] = useState<Facility[]>(
        serverFacilities !== undefined ? serverFacilities : fallbackFacilities,
    );
    const [equipment, setEquipment] = useState<StorageEquipment[]>(
        serverEquipment !== undefined ? serverEquipment : fallbackEquipment,
    );
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(
        serverAuditLogs !== undefined ? serverAuditLogs : fallbackAuditLogs,
    );
    const [discardLogs, setDiscardLogs] = useState<DiscardLog[]>(
        serverDiscardLogs !== undefined ? serverDiscardLogs : fallbackDiscardLogs,
    );
    const [aiData, setAiData] = useState<AiForecastData>(
        serverAiData || fallbackAiData,
    );

    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [activePortal, setActivePortal] = useState<PortalKey>('all');
    const [selectedBloodType, setSelectedBloodType] = useState<string>('All');

    // Modals state
    const [isIntakeOpen, setIsIntakeOpen] = useState(false);
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [isDonorOpen, setIsDonorOpen] = useState(false);
    const [isDriveOpen, setIsDriveOpen] = useState(false);

    // Sync state if server props change (e.g. from Inertia page refresh or navigation)
    useEffect(() => {
        if (serverUnits !== undefined) setUnits(serverUnits);
        if (serverDonors !== undefined) setDonors(serverDonors);
        if (serverRequests !== undefined) setRequests(serverRequests);
        if (serverDrives !== undefined) setDrives(serverDrives);
        if (serverFacilities !== undefined) setFacilities(serverFacilities);
        if (serverEquipment !== undefined) setEquipment(serverEquipment);
        if (serverAuditLogs !== undefined) setAuditLogs(serverAuditLogs);
        if (serverDiscardLogs !== undefined) setDiscardLogs(serverDiscardLogs);
        if (serverAiData) setAiData(serverAiData);
    }, [
        serverUnits,
        serverDonors,
        serverRequests,
        serverDrives,
        serverFacilities,
        serverEquipment,
        serverAuditLogs,
        serverDiscardLogs,
        serverAiData,
    ]);

    // Sync tab with URL search parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as TabKey;
        if (
            tab &&
            [
                'overview',
                'inventory',
                'requests',
                'compatibility',
                'donors',
                'drives',
                'facilities',
                'ai',
                'audit',
            ].includes(tab)
        ) {
            setActiveTab(tab);
        }
    }, [usePage().url]);

    // Refresh database state from backend
    const refreshData = async () => {
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
                fetch('/api/inventory').then((r) => (r.ok ? r.json() : null)),
                fetch('/api/donors').then((r) => (r.ok ? r.json() : null)),
                fetch('/api/requests').then((r) => (r.ok ? r.json() : null)),
                fetch('/api/drives').then((r) => (r.ok ? r.json() : null)),
                fetch('/api/facilities').then((r) => (r.ok ? r.json() : null)),
                fetch('/api/facilities/equipment').then((r) =>
                    r.ok ? r.json() : null,
                ),
                fetch('/api/compliance/audit-logs').then((r) =>
                    r.ok ? r.json() : null,
                ),
                fetch('/api/compliance/discard-logs').then((r) =>
                    r.ok ? r.json() : null,
                ),
                fetch('/api/ai-forecast').then((r) => (r.ok ? r.json() : null)),
            ]);

            if (Array.isArray(unitsRes)) setUnits(unitsRes);
            if (Array.isArray(donorsRes)) setDonors(donorsRes);
            if (Array.isArray(requestsRes)) setRequests(requestsRes);
            if (Array.isArray(drivesRes)) setDrives(drivesRes);
            if (Array.isArray(facilitiesRes)) setFacilities(facilitiesRes);
            if (Array.isArray(equipmentRes)) setEquipment(equipmentRes);
            if (Array.isArray(auditRes)) setAuditLogs(auditRes);
            if (Array.isArray(discardRes)) setDiscardLogs(discardRes);
            if (aiRes) setAiData(aiRes);
        } catch (e) {
            console.warn('Sync notice:', e);
        }
    };

    // Event Handlers that persist to SQLite Database
    const handleAddUnit = async (newUnitData: any) => {
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(newUnitData),
            });
            if (res.ok) {
                const newUnit = await res.json();
                setUnits((prev) => [newUnit, ...prev]);
                setIsIntakeOpen(false);
                toast.success(
                    `Unit ${newUnit.unitNumber} (${newUnit.bloodType}) saved to database!`,
                );
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to save unit to database:', err);
        }

        // Fallback local update
        const newId = `bld-${Date.now()}`;
        const newUnit: BloodUnit = {
            id: newId,
            unitNumber: `BLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            bloodType: newUnitData.bloodType,
            component: newUnitData.component,
            facilityId: newUnitData.facilityId,
            facilityName:
                facilities.find((f) => f.id === newUnitData.facilityId)?.name ||
                'Central Vault',
            location: newUnitData.location,
            temperatureZone: '2°C to 6°C',
            volumeMl: newUnitData.volumeMl,
            collectionDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 35 * 86400000)
                .toISOString()
                .split('T')[0],
            status: 'Available',
            donorId: newUnitData.donorCode,
            donorCode: newUnitData.donorCode,
            testingStatus: 'Tested & Passed',
        };
        setUnits((prev) => [newUnit, ...prev]);
        setIsIntakeOpen(false);
    };

    const handleAddRequest = async (reqData: any) => {
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(reqData),
            });
            if (res.ok) {
                const newReq = await res.json();
                setRequests((prev) => [newReq, ...prev]);
                setIsRequestOpen(false);
                toast.success(
                    `Request ${newReq.requestCode} created and saved to database!`,
                );
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to save request to database:', err);
        }

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

    const handleAddDonor = async (donorData: any) => {
        try {
            const res = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(donorData),
            });
            if (res.ok) {
                const newDonor = await res.json();
                setDonors((prev) => [newDonor, ...prev]);
                setIsDonorOpen(false);
                toast.success(
                    `Donor ${newDonor.fullName} registered and saved to database!`,
                );
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to save donor to database:', err);
        }

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

    const handleAddDrive = async (driveData: any) => {
        try {
            const res = await fetch('/api/drives', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(driveData),
            });
            if (res.ok) {
                const newDrive = await res.json();
                setDrives((prev) => [newDrive, ...prev]);
                setIsDriveOpen(false);
                toast.success(`Campaign ${newDrive.name} saved to database!`);
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to save drive to database:', err);
        }

        const newDrive: DonationDrive = {
            id: `drv-${Date.now()}`,
            driveCode: `DRV-2026-${Math.floor(10 + Math.random() * 90)}`,
            name: driveData.name,
            organizer: driveData.organizer,
            location: driveData.location,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000)
                .toISOString()
                .split('T')[0],
            targetUnits: driveData.targetUnits,
            collectedUnits: 0,
            registeredDonorsCount: 15,
            status: 'Active',
            facilityId: facilities[0]?.id || 'fac-1',
        };
        setDrives((prev) => [newDrive, ...prev]);
        setIsDriveOpen(false);
    };

    const handleUpdateStatus = async (
        id: string,
        newStatus: UnitStatus,
        notes?: string,
    ) => {
        setUnits((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        );
        try {
            const res = await fetch(`/api/inventory/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ status: newStatus, notes }),
            });
            if (res.ok) {
                toast.success(
                    `Unit status updated to ${newStatus} in database!`,
                );
                void refreshData();
            }
        } catch (err) {
            console.error('Failed to update status in database:', err);
        }
    };

    const handleCrossMatchUnits = async (
        requestId: string,
        unitIds: string[],
    ) => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === requestId
                    ? { ...r, status: 'Cross-Matched', unitsAssigned: unitIds }
                    : r,
            ),
        );
        setUnits((prev) =>
            prev.map((u) =>
                unitIds.includes(u.id) ? { ...u, status: 'Cross-Matched' } : u,
            ),
        );
        try {
            const res = await fetch(`/api/requests/${requestId}/cross-match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ unitIds }),
            });
            if (res.ok) {
                toast.success('Cross-Match verified and saved to database!');
                void refreshData();
            }
        } catch (err) {
            console.error('Failed to save cross-match in database:', err);
        }
    };

    const handleDispatchOrder = async (
        requestId: string,
        courierCode?: string,
        tempC?: number,
    ) => {
        const req = requests.find((r) => r.id === requestId);
        if (req) {
            setRequests((prev) =>
                prev.map((r) =>
                    r.id === requestId ? { ...r, status: 'Dispatched' } : r,
                ),
            );
            setUnits((prev) =>
                prev.map((u) =>
                    req.unitsAssigned.includes(u.id)
                        ? { ...u, status: 'Dispatched' }
                        : u,
                ),
            );
        }
        try {
            const res = await fetch(`/api/requests/${requestId}/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ courierCode, tempC }),
            });
            if (res.ok) {
                toast.success('Dispatch order recorded and saved to database!');
                void refreshData();
            }
        } catch (err) {
            console.error('Failed to save dispatch in database:', err);
        }
    };

    const handleRecordDonation = async (donorId: string, details: any) => {
        setDonors((prev) =>
            prev.map((d) =>
                d.id === donorId
                    ? {
                          ...d,
                          totalDonationsCount: d.totalDonationsCount + 1,
                          lastDonationDate: new Date()
                              .toISOString()
                              .split('T')[0],
                      }
                    : d,
            ),
        );
        try {
            const res = await fetch(`/api/donors/${donorId}/record-donation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(details),
            });
            if (res.ok) {
                toast.success(
                    'Donation recorded and intake unit saved in database!',
                );
                void refreshData();
            }
        } catch (err) {
            console.error('Failed to record donation in database:', err);
        }
    };

    const handleEditUnit = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const updated = await res.json();
                setUnits((prev) => prev.map((u) => (u.id === id ? updated : u)));
                toast.success(`Unit ${updated.unitNumber} updated successfully!`);
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to update unit:', err);
        }
        setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    };

    const handleDeleteUnit = async (id: string) => {
        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                setUnits((prev) => prev.filter((u) => u.id !== id));
                toast.success('Unit removed from inventory!');
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to delete unit:', err);
        }
        setUnits((prev) => prev.filter((u) => u.id !== id));
    };

    const handleEditDonor = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/donors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const updated = await res.json();
                setDonors((prev) => prev.map((d) => (d.id === id ? updated : d)));
                toast.success(`Donor ${updated.fullName} profile updated!`);
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to update donor:', err);
        }
        setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    };

    const handleDeleteDonor = async (id: string) => {
        try {
            const res = await fetch(`/api/donors/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                setDonors((prev) => prev.filter((d) => d.id !== id));
                toast.success('Donor record removed!');
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to delete donor:', err);
        }
        setDonors((prev) => prev.filter((d) => d.id !== id));
    };

    const handleEditRequest = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const updated = await res.json();
                setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
                toast.success(`Request ${updated.requestCode} updated!`);
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to update request:', err);
        }
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    };

    const handleDeleteRequest = async (id: string) => {
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                setRequests((prev) => prev.filter((r) => r.id !== id));
                toast.success('Request cancelled and deleted!');
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to delete request:', err);
        }
        setRequests((prev) => prev.filter((r) => r.id !== id));
    };

    const handleEditDrive = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/drives/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const updated = await res.json();
                setDrives((prev) => prev.map((d) => (d.id === id ? updated : d)));
                toast.success(`Campaign ${updated.name} updated!`);
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to update drive:', err);
        }
        setDrives((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    };

    const handleDeleteDrive = async (id: string) => {
        try {
            const res = await fetch(`/api/drives/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                setDrives((prev) => prev.filter((d) => d.id !== id));
                toast.success('Campaign removed!');
                void refreshData();
                return;
            }
        } catch (err) {
            console.error('Failed to delete drive:', err);
        }
        setDrives((prev) => prev.filter((d) => d.id !== id));
    };

    const tabMeta: Record<
        TabKey,
        {
            title: string;
            badge: string;
            badgeColor: string;
            description: string;
            primaryAction?: {
                label: string;
                icon: React.ComponentType<{ className?: string }>;
                onClick: () => void;
            };
            secondaryAction?: {
                label: string;
                icon: React.ComponentType<{ className?: string }>;
                onClick: () => void;
            };
        }
    > = {
        overview: {
            title: 'BloodMatrix Command Center',
            badge: 'Live Telemetry',
            badgeColor:
                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200/60 dark:border-red-500/20',
            description: `Allied Hospital Faisalabad • Logged in as ${userName} • Sub-3 min cross-matching active`,
            primaryAction: {
                label: 'Add Unit',
                icon: Plus,
                onClick: () => setIsIntakeOpen(true),
            },
            secondaryAction: {
                label: 'STAT Order',
                icon: Truck,
                onClick: () => setIsRequestOpen(true),
            },
        },
        inventory: {
            title: 'Blood Inventory Management',
            badge: `${units.length} Units In Stock`,
            badgeColor:
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
            description:
                'Real-time cold-chain blood stock, RFID tracking, and quarantine verification',
            primaryAction: {
                label: 'Add Blood Unit',
                icon: Plus,
                onClick: () => setIsIntakeOpen(true),
            },
        },
        requests: {
            title: 'STAT Dispatch & Orders',
            badge: `${requests.filter((r) => r.status !== 'Dispatched').length} Active Orders`,
            badgeColor:
                'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
            description:
                'Emergency hospital blood requests, urgent cross-matching, and dispatch logistics',
            primaryAction: {
                label: 'New STAT Order',
                icon: Truck,
                onClick: () => setIsRequestOpen(true),
            },
        },
        compatibility: {
            title: 'Cross-Match Compatibility Engine',
            badge: 'Sub-3 Min Lab',
            badgeColor:
                'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-500/20',
            description:
                'Sub-3 min serological & algorithmic ABO/Rh recipient validation engine',
        },
        donors: {
            title: 'Donor Registry & CRM',
            badge: `${donors.length} Registered Donors`,
            badgeColor:
                'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/60 dark:border-purple-500/20',
            description:
                'Registered voluntary blood donors, medical screening, and donation records',
            primaryAction: {
                label: 'Register Donor',
                icon: Plus,
                onClick: () => setIsDonorOpen(true),
            },
        },
        drives: {
            title: 'Donation Drives & Mobile Camps',
            badge: `${drives.filter((d) => d.status === 'Active').length} Active Drives`,
            badgeColor:
                'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20',
            description:
                'Community outreach campaigns, mobile collection units, and target tracking',
            primaryAction: {
                label: 'Schedule Drive',
                icon: Plus,
                onClick: () => setIsDriveOpen(true),
            },
        },
        facilities: {
            title: 'Cold Vault Facilities & IoT',
            badge: `${facilities.length} Storage Hubs`,
            badgeColor:
                'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-500/20',
            description:
                'Central and hospital storage vaults, temperature zones, and automated equipment telemetry',
        },
        ai: {
            title: 'AI Predictive Supply Forecasting',
            badge: 'Neural Model v4.2',
            badgeColor:
                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200/60 dark:border-red-500/20',
            description:
                '7-day predictive deficit model, weather impact, and emergency demand analytics',
        },
        audit: {
            title: 'Audit Trail & Compliance',
            badge: `${auditLogs.length} Cryptographic Logs`,
            badgeColor:
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
            description:
                'Cryptographic inspection trail, discard authorizations, and quality assurance logs',
        },
    };

    const currentMeta = tabMeta[activeTab] || tabMeta.overview;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 bg-[#F8FAFC] p-3.5 sm:p-6 text-slate-900 transition-colors dark:bg-[#0B0F17] dark:text-slate-100">
            <Head title={currentMeta.title} />
            <Toaster position="top-right" richColors />

            {/* Top Unified Header & Actions */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-[#222F44] dark:bg-[#161D2A]">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            </span>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl dark:text-slate-100">
                                {currentMeta.title}
                            </h1>
                            <span
                                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${currentMeta.badgeColor}`}
                            >
                                {currentMeta.badge}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {currentMeta.description}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {currentMeta.primaryAction && (
                        <button
                            onClick={currentMeta.primaryAction.onClick}
                            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-red-700 hover:shadow-sm"
                        >
                            <currentMeta.primaryAction.icon className="h-3.5 w-3.5" />
                            <span>{currentMeta.primaryAction.label}</span>
                        </button>
                    )}
                    {currentMeta.secondaryAction && (
                        <button
                            onClick={currentMeta.secondaryAction.onClick}
                            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 hover:shadow-sm dark:border-[#222F44] dark:bg-[#0B0F17] dark:hover:bg-[#1E293B]"
                        >
                            <currentMeta.secondaryAction.icon className="h-3.5 w-3.5" />
                            <span>{currentMeta.secondaryAction.label}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Global Key Metrics Overview - Only on Command Center Overview */}
            {activeTab === 'overview' && (
                <StatsSummary
                    units={units}
                    donors={donors}
                    requests={requests}
                    drives={drives}
                />
            )}

            {/* Active Tab View */}
            <div className="flex-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <BloodGroupMatrix
                            units={units}
                            selectedType={selectedBloodType}
                            onSelectType={setSelectedBloodType}
                        />
                        <InventoryTab
                            units={units}
                            onOpenIntakeModal={() => setIsIntakeOpen(true)}
                            onUpdateStatus={handleUpdateStatus}
                            onEditUnit={handleEditUnit}
                            onDeleteUnit={handleDeleteUnit}
                        />
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <InventoryTab
                        units={units}
                        onOpenIntakeModal={() => setIsIntakeOpen(true)}
                        onUpdateStatus={handleUpdateStatus}
                        onEditUnit={handleEditUnit}
                        onDeleteUnit={handleDeleteUnit}
                    />
                )}

                {activeTab === 'requests' && (
                    <RequestsDispatchTab
                        requests={requests}
                        units={units}
                        onOpenCreateRequestModal={() => setIsRequestOpen(true)}
                        onCrossMatchUnits={handleCrossMatchUnits}
                        onDispatchOrder={handleDispatchOrder}
                        onEditRequest={handleEditRequest}
                        onDeleteRequest={handleDeleteRequest}
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
                        onEditDonor={handleEditDonor}
                        onDeleteDonor={handleDeleteDonor}
                    />
                )}

                {activeTab === 'drives' && (
                    <DonationDrivesTab
                        drives={drives}
                        onOpenScheduleDriveModal={() => setIsDriveOpen(true)}
                        onEditDrive={handleEditDrive}
                        onDeleteDrive={handleDeleteDrive}
                    />
                )}

                {activeTab === 'facilities' && (
                    <StorageFacilitiesTab
                        facilities={facilities}
                        equipment={equipment}
                    />
                )}

                {activeTab === 'ai' && <AiForecastTab aiData={aiData} />}

                {activeTab === 'audit' && (
                    <AuditComplianceTab
                        auditLogs={auditLogs}
                        discardLogs={discardLogs}
                    />
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
