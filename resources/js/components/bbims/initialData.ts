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
} from './types';

export const initialFacilities: Facility[] = [
    {
        id: 'fac-1',
        code: 'FAC-CBB',
        name: 'Central Blood Bank & Processing Hub',
        type: 'Central Blood Bank',
        city: 'Metropolitan Medical District',
        phone: '+1 (555) 019-2831',
        refrigeratorsCount: 6,
        freezersCount: 4,
        agitatorsCount: 3,
        status: 'Operational',
        totalUnitsInStock: 1,
        availableUnits: 1,
    },
    {
        id: 'fac-2',
        code: 'FAC-CGH',
        name: 'City General Hospital Lab',
        type: 'Hospital Lab',
        city: 'Downtown Core',
        phone: '+1 (555) 014-9922',
        refrigeratorsCount: 3,
        freezersCount: 2,
        agitatorsCount: 1,
        status: 'Operational',
        totalUnitsInStock: 0,
        availableUnits: 0,
    },
    {
        id: 'fac-3',
        code: 'FAC-STJ',
        name: 'St. Jude Trauma Center Lab',
        type: 'Hospital Lab',
        city: 'Westside Emergency Wing',
        phone: '+1 (555) 018-4411',
        refrigeratorsCount: 4,
        freezersCount: 2,
        agitatorsCount: 2,
        status: 'Operational',
        totalUnitsInStock: 0,
        availableUnits: 0,
    },
];

export const initialEquipment: StorageEquipment[] = [
    {
        id: 'eq-1',
        facilityId: 'fac-1',
        name: 'Main Cold Vault Ref-01',
        type: 'Refrigerator (2-6°C)',
        currentTempC: 3.8,
        targetTempC: 4.0,
        status: 'Normal',
        capacityUnits: 250,
        occupiedUnits: 1,
    },
    {
        id: 'eq-2',
        facilityId: 'fac-1',
        name: 'Deep Plasma Freezer FZ-01',
        type: 'Freezer (-30°C)',
        currentTempC: -29.4,
        targetTempC: -30.0,
        status: 'Normal',
        capacityUnits: 180,
        occupiedUnits: 0,
    },
    {
        id: 'eq-3',
        facilityId: 'fac-1',
        name: 'Platelet Incubator AG-01',
        type: 'Platelet Agitator (20-24°C)',
        currentTempC: 22.1,
        targetTempC: 22.0,
        status: 'Normal',
        capacityUnits: 60,
        occupiedUnits: 0,
    },
    {
        id: 'eq-4',
        facilityId: 'fac-2',
        name: 'Stat Emergency Ref-02',
        type: 'Refrigerator (2-6°C)',
        currentTempC: 4.5,
        targetTempC: 4.0,
        status: 'Normal',
        capacityUnits: 100,
        occupiedUnits: 0,
    },
    {
        id: 'eq-5',
        facilityId: 'fac-3',
        name: 'Trauma Wing Ref-03',
        type: 'Refrigerator (2-6°C)',
        currentTempC: 5.8,
        targetTempC: 4.0,
        status: 'Warning',
        capacityUnits: 120,
        occupiedUnits: 0,
    },
];

export const initialDonors: DonorRecord[] = [];

export const initialUnits: BloodUnit[] = [
    {
        id: 'bld-1792404755401',
        unitNumber: 'BLD-2026-3235',
        bloodType: 'O-',
        component: 'Packed Red Blood Cells',
        facilityId: 'fac-1',
        facilityName: 'Central Blood Bank & Processing Hub',
        location: 'Main Cold Vault Ref-01 / Shelf A',
        temperatureZone: '2°C to 6°C',
        volumeMl: 450,
        collectionDate: '2026-10-19',
        expiryDate: '2026-11-23',
        status: 'Available',
        donorCode: 'DNR-1001',
        testingStatus: 'Tested & Passed',
        notes: undefined,
    },
];

export const initialRequests: RequestRecord[] = [];

export const initialDrives: DonationDrive[] = [];

export const initialAuditLogs: AuditLog[] = [
    {
        id: 'log-6ad5ed1369579',
        timestamp: '2026-10-19 10:12:35',
        userStaff: 'System Administrator',
        action: 'Blood Unit Intake Registered',
        entityType: 'Inventory',
        entityId: 'BLD-2026-3235',
        details:
            'Intake registered for O- Packed Red Blood Cells at Central Blood Bank & Processing Hub.',
        digitalSignatureHash: '0xd9c6906821a6522a',
    },
];

export const initialDiscardLogs: DiscardLog[] = [];

export const initialAiData: AiForecastData = {
    generatedAt: new Date().toISOString(),
    confidenceScore: 0.94,
    forecastingTable: [
        {
            bloodType: 'O-',
            currentStock: 1,
            projected14DayDemand: 14,
            projectedNetBalance: -13,
            status: 'Critical Deficit',
        },
        {
            bloodType: 'O+',
            currentStock: 0,
            projected14DayDemand: 28,
            projectedNetBalance: -28,
            status: 'Critical Deficit',
        },
        {
            bloodType: 'A+',
            currentStock: 0,
            projected14DayDemand: 22,
            projectedNetBalance: -22,
            status: 'Critical Deficit',
        },
        {
            bloodType: 'A-',
            currentStock: 0,
            projected14DayDemand: 8,
            projectedNetBalance: -8,
            status: 'Moderate Shortage',
        },
        {
            bloodType: 'B+',
            currentStock: 0,
            projected14DayDemand: 16,
            projectedNetBalance: -16,
            status: 'Critical Deficit',
        },
        {
            bloodType: 'B-',
            currentStock: 0,
            projected14DayDemand: 5,
            projectedNetBalance: -5,
            status: 'Moderate Shortage',
        },
        {
            bloodType: 'AB+',
            currentStock: 0,
            projected14DayDemand: 7,
            projectedNetBalance: -7,
            status: 'Moderate Shortage',
        },
        {
            bloodType: 'AB-',
            currentStock: 0,
            projected14DayDemand: 3,
            projectedNetBalance: -3,
            status: 'Moderate Shortage',
        },
    ],
    expiringRiskUnitsCount: 0,
    expiringUnitsList: [],
    recommendations: [
        {
            id: 'rec-1',
            priority: 'High',
            category: 'Urgent Donation Drive',
            text: 'Urgent demand shortfall detected. Schedule targeted mobile donor campaigns to replenish emergency reserves.',
        },
    ],
};
