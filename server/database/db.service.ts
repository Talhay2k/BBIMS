import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface BloodUnit {
    id: string;
    unitNumber: string; // e.g. "BLD-2026-8901"
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    component:
        | 'Packed Red Blood Cells'
        | 'Whole Blood'
        | 'Platelets'
        | 'Fresh Frozen Plasma'
        | 'Cryoprecipitate';
    facilityId: string;
    facilityName: string;
    location: string; // e.g. "Refrigerator 1 - Shelf B"
    temperatureZone: string; // e.g. "2°C to 6°C"
    volumeMl: number;
    collectionDate: string;
    expiryDate: string;
    status:
        | 'Available'
        | 'Reserved'
        | 'Cross-Matched'
        | 'Quarantined'
        | 'Dispatched'
        | 'Expired'
        | 'Discarded';
    donorId?: string;
    donorCode?: string;
    testingStatus: 'Tested & Passed' | 'Pending Testing' | 'Quarantine Flagged';
    notes?: string;
}

export interface DonorRecord {
    id: string;
    donorCode: string;
    fullName: string;
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email: string;
    address: string;
    lastDonationDate: string;
    eligibilityStatus:
        | 'Eligible'
        | 'Temporarily Deferred'
        | 'Permanently Deferred';
    deferralReason?: string;
    totalDonationsCount: number;
    hemoglobinGdl: number;
    bloodPressure: string;
    weightKg: number;
    notes?: string;
}

export interface RequestRecord {
    id: string;
    requestCode: string;
    hospitalName: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    requiredBloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    component: string;
    unitsRequested: number;
    unitsAssigned: string[]; // Unit IDs
    urgency: 'Emergency (Stat)' | 'Urgent' | 'Routine';
    status:
        | 'Pending'
        | 'Cross-Matched'
        | 'Approved'
        | 'Dispatched'
        | 'Completed'
        | 'Cancelled';
    requestDate: string;
    requiredByDate: string;
    dispatchTemperatureC?: number;
    courierTrackingCode?: string;
    notes?: string;
}

export interface DonationDrive {
    id: string;
    driveCode: string;
    name: string;
    organizer: string;
    location: string;
    startDate: string;
    endDate: string;
    targetUnits: number;
    collectedUnits: number;
    registeredDonorsCount: number;
    status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
    facilityId: string;
}

export interface Facility {
    id: string;
    code: string;
    name: string;
    type: 'Central Blood Bank' | 'Hospital Lab' | 'Regional Distribution Hub';
    city: string;
    phone: string;
    refrigeratorsCount: number;
    freezersCount: number;
    agitatorsCount: number;
    status: 'Operational' | 'Maintenance Warning';
}

export interface StorageEquipment {
    id: string;
    facilityId: string;
    name: string;
    type:
        | 'Refrigerator (2-6°C)'
        | 'Freezer (-30°C)'
        | 'Platelet Agitator (20-24°C)';
    currentTempC: number;
    targetTempC: number;
    status: 'Normal' | 'Warning' | 'Alarm';
    capacityUnits: number;
    occupiedUnits: number;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userStaff: string;
    action: string;
    entityType:
        | 'Inventory'
        | 'Donor'
        | 'Request'
        | 'Drive'
        | 'Facility'
        | 'System';
    entityId: string;
    details: string;
    digitalSignatureHash: string;
}

export interface DiscardLog {
    id: string;
    unitNumber: string;
    bloodType: string;
    component: string;
    discardDate: string;
    reason:
        | 'Expired'
        | 'Hemolyzed'
        | 'Test Positive (HBsAg/HIV/HCV)'
        | 'Bag Contamination/Rupture'
        | 'Storage Temp Excursion';
    performedBy: string;
    facilityName: string;
}

@Injectable()
export class DbService {
    private storageFile = path.join(process.cwd(), 'server-data.json');

    public inventory: BloodUnit[] = [];
    public donors: DonorRecord[] = [];
    public requests: RequestRecord[] = [];
    public drives: DonationDrive[] = [];
    public facilities: Facility[] = [];
    public equipment: StorageEquipment[] = [];
    public auditLogs: AuditLog[] = [];
    public discardLogs: DiscardLog[] = [];

    constructor() {
        this.loadOrSeedData();
    }

    private loadOrSeedData() {
        if (fs.existsSync(this.storageFile)) {
            try {
                const raw = fs.readFileSync(this.storageFile, 'utf-8');
                const parsed = JSON.parse(raw);
                this.inventory = parsed.inventory || [];
                this.donors = parsed.donors || [];
                this.requests = parsed.requests || [];
                this.drives = parsed.drives || [];
                this.facilities = parsed.facilities || [];
                this.equipment = parsed.equipment || [];
                this.auditLogs = parsed.auditLogs || [];
                this.discardLogs = parsed.discardLogs || [];
                if (this.inventory.length > 0) return;
            } catch (e) {
                console.warn('Error reading server data, reseeding...', e);
            }
        }
        this.seedInitialData();
        this.saveData();
    }

    public saveData() {
        try {
            const data = {
                inventory: this.inventory,
                donors: this.donors,
                requests: this.requests,
                drives: this.drives,
                facilities: this.facilities,
                equipment: this.equipment,
                auditLogs: this.auditLogs,
                discardLogs: this.discardLogs,
            };
            fs.writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Failed to save server data:', e);
        }
    }

    private seedInitialData() {
        const now = new Date();

        const addDays = (d: number) => {
            const date = new Date(now);
            date.setDate(date.getDate() + d);
            return date.toISOString().split('T')[0];
        };

        const subDays = (d: number) => {
            const date = new Date(now);
            date.setDate(date.getDate() - d);
            return date.toISOString().split('T')[0];
        };

        this.facilities = [
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
            },
            {
                id: 'fac-4',
                code: 'FAC-RDH',
                name: 'Regional Blood Distribution Hub',
                type: 'Regional Distribution Hub',
                city: 'North County',
                phone: '+1 (555) 012-7700',
                refrigeratorsCount: 5,
                freezersCount: 3,
                agitatorsCount: 2,
                status: 'Maintenance Warning',
            },
        ];

        this.equipment = [
            {
                id: 'eq-1',
                facilityId: 'fac-1',
                name: 'Main Cold Vault Ref-01',
                type: 'Refrigerator (2-6°C)',
                currentTempC: 3.8,
                targetTempC: 4.0,
                status: 'Normal',
                capacityUnits: 250,
                occupiedUnits: 142,
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
                occupiedUnits: 98,
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
                occupiedUnits: 34,
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
                occupiedUnits: 58,
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
                occupiedUnits: 82,
            },
        ];

        this.donors = [
            {
                id: 'dnr-1',
                donorCode: 'DNR-1001',
                fullName: 'Alexander Vance',
                bloodType: 'O-',
                age: 34,
                gender: 'Male',
                phone: '+1 (555) 234-5678',
                email: 'a.vance@example.com',
                address: '452 Pine Ave, Metro City',
                lastDonationDate: subDays(45),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 14,
                hemoglobinGdl: 15.2,
                bloodPressure: '120/78',
                weightKg: 78,
            },
            {
                id: 'dnr-2',
                donorCode: 'DNR-1002',
                fullName: 'Elena Rostova',
                bloodType: 'A+',
                age: 29,
                gender: 'Female',
                phone: '+1 (555) 345-6789',
                email: 'elena.r@example.com',
                address: '781 Birch St, Metro City',
                lastDonationDate: subDays(12),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 8,
                hemoglobinGdl: 13.8,
                bloodPressure: '115/72',
                weightKg: 64,
            },
            {
                id: 'dnr-3',
                donorCode: 'DNR-1003',
                fullName: 'Marcus Chen',
                bloodType: 'B+',
                age: 41,
                gender: 'Male',
                phone: '+1 (555) 456-7890',
                email: 'm.chen@example.com',
                address: '109 Oak Rd, North County',
                lastDonationDate: subDays(90),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 22,
                hemoglobinGdl: 16.0,
                bloodPressure: '124/80',
                weightKg: 82,
            },
            {
                id: 'dnr-4',
                donorCode: 'DNR-1004',
                fullName: 'Sarah Jenkins',
                bloodType: 'AB+',
                age: 38,
                gender: 'Female',
                phone: '+1 (555) 567-8901',
                email: 's.jenkins@example.com',
                address: '320 Maple Dr, Metro City',
                lastDonationDate: subDays(30),
                eligibilityStatus: 'Temporarily Deferred',
                deferralReason: 'Low Hemoglobin (11.5 g/dL)',
                totalDonationsCount: 5,
                hemoglobinGdl: 11.5,
                bloodPressure: '110/70',
                weightKg: 58,
            },
            {
                id: 'dnr-5',
                donorCode: 'DNR-1005',
                fullName: "David O'Connor",
                bloodType: 'O+',
                age: 46,
                gender: 'Male',
                phone: '+1 (555) 678-9012',
                email: 'doconnor@example.com',
                address: '88 West Highland Ave',
                lastDonationDate: subDays(65),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 19,
                hemoglobinGdl: 14.9,
                bloodPressure: '128/82',
                weightKg: 85,
            },
            {
                id: 'dnr-6',
                donorCode: 'DNR-1006',
                fullName: 'Aaliyah Patel',
                bloodType: 'A-',
                age: 26,
                gender: 'Female',
                phone: '+1 (555) 789-0123',
                email: 'apatel@example.com',
                address: '614 Cedar Blvd',
                lastDonationDate: subDays(110),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 6,
                hemoglobinGdl: 14.1,
                bloodPressure: '118/74',
                weightKg: 61,
            },
            {
                id: 'dnr-7',
                donorCode: 'DNR-1007',
                fullName: 'Robert Sterling',
                bloodType: 'AB-',
                age: 52,
                gender: 'Male',
                phone: '+1 (555) 890-1234',
                email: 'rsterling@example.com',
                address: '902 Valley View',
                lastDonationDate: subDays(200),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 31,
                hemoglobinGdl: 15.5,
                bloodPressure: '130/85',
                weightKg: 90,
            },
            {
                id: 'dnr-8',
                donorCode: 'DNR-1008',
                fullName: 'Maria Santos',
                bloodType: 'B-',
                age: 31,
                gender: 'Female',
                phone: '+1 (555) 901-2345',
                email: 'msantos@example.com',
                address: '221 River Rd',
                lastDonationDate: subDays(15),
                eligibilityStatus: 'Eligible',
                totalDonationsCount: 9,
                hemoglobinGdl: 13.5,
                bloodPressure: '116/75',
                weightKg: 66,
            },
        ];

        this.inventory = [
            // Universal O- Units
            {
                id: 'bld-1',
                unitNumber: 'BLD-2026-8901',
                bloodType: 'O-',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Main Cold Vault Ref-01 / Shelf A',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(10),
                expiryDate: addDays(25),
                status: 'Available',
                donorId: 'dnr-1',
                donorCode: 'DNR-1001',
                testingStatus: 'Tested & Passed',
                notes: 'Universal O- PRBC ready for emergency dispatch.',
            },
            {
                id: 'bld-2',
                unitNumber: 'BLD-2026-8902',
                bloodType: 'O-',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-3',
                facilityName: 'St. Jude Trauma Center Lab',
                location: 'Trauma Wing Ref-03 / Shelf 1',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(32),
                expiryDate: addDays(2),
                status: 'Available',
                donorId: 'dnr-1',
                donorCode: 'DNR-1001',
                testingStatus: 'Tested & Passed',
                notes: 'URGENT: Expiring in 2 days!',
            },
            {
                id: 'bld-3',
                unitNumber: 'BLD-2026-8903',
                bloodType: 'O-',
                component: 'Fresh Frozen Plasma',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Deep Plasma Freezer FZ-01',
                temperatureZone: '-30°C',
                volumeMl: 250,
                collectionDate: subDays(40),
                expiryDate: addDays(320),
                status: 'Available',
                donorId: 'dnr-1',
                donorCode: 'DNR-1001',
                testingStatus: 'Tested & Passed',
            },

            // A+ Units
            {
                id: 'bld-4',
                unitNumber: 'BLD-2026-8904',
                bloodType: 'A+',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Main Cold Vault Ref-01 / Shelf B',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(5),
                expiryDate: addDays(30),
                status: 'Available',
                donorId: 'dnr-2',
                donorCode: 'DNR-1002',
                testingStatus: 'Tested & Passed',
            },
            {
                id: 'bld-5',
                unitNumber: 'BLD-2026-8905',
                bloodType: 'A+',
                component: 'Platelets',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Platelet Incubator AG-01',
                temperatureZone: '20-24°C (Agitated)',
                volumeMl: 300,
                collectionDate: subDays(3),
                expiryDate: addDays(2),
                status: 'Available',
                donorId: 'dnr-2',
                donorCode: 'DNR-1002',
                testingStatus: 'Tested & Passed',
                notes: 'Platelets expire in 48 hours!',
            },
            {
                id: 'bld-6',
                unitNumber: 'BLD-2026-8906',
                bloodType: 'A+',
                component: 'Whole Blood',
                facilityId: 'fac-2',
                facilityName: 'City General Hospital Lab',
                location: 'Stat Emergency Ref-02',
                temperatureZone: '2°C to 6°C',
                volumeMl: 500,
                collectionDate: subDays(14),
                expiryDate: addDays(21),
                status: 'Cross-Matched',
                donorId: 'dnr-2',
                donorCode: 'DNR-1002',
                testingStatus: 'Tested & Passed',
            },

            // B+ Units
            {
                id: 'bld-7',
                unitNumber: 'BLD-2026-8907',
                bloodType: 'B+',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Main Cold Vault Ref-01 / Shelf C',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(8),
                expiryDate: addDays(27),
                status: 'Available',
                donorId: 'dnr-3',
                donorCode: 'DNR-1003',
                testingStatus: 'Tested & Passed',
            },
            {
                id: 'bld-8',
                unitNumber: 'BLD-2026-8908',
                bloodType: 'B+',
                component: 'Fresh Frozen Plasma',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Deep Plasma Freezer FZ-01',
                temperatureZone: '-30°C',
                volumeMl: 250,
                collectionDate: subDays(15),
                expiryDate: addDays(350),
                status: 'Available',
                donorId: 'dnr-3',
                donorCode: 'DNR-1003',
                testingStatus: 'Tested & Passed',
            },

            // AB+ Universal Plasma / Recipient
            {
                id: 'bld-9',
                unitNumber: 'BLD-2026-8909',
                bloodType: 'AB+',
                component: 'Fresh Frozen Plasma',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Deep Plasma Freezer FZ-01',
                temperatureZone: '-30°C',
                volumeMl: 250,
                collectionDate: subDays(20),
                expiryDate: addDays(345),
                status: 'Available',
                donorId: 'dnr-4',
                donorCode: 'DNR-1004',
                testingStatus: 'Tested & Passed',
                notes: 'Universal Plasma Donor unit.',
            },
            {
                id: 'bld-10',
                unitNumber: 'BLD-2026-8910',
                bloodType: 'AB+',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-2',
                facilityName: 'City General Hospital Lab',
                location: 'Stat Emergency Ref-02',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(2),
                expiryDate: addDays(33),
                status: 'Available',
                donorId: 'dnr-4',
                donorCode: 'DNR-1004',
                testingStatus: 'Tested & Passed',
            },

            // O+ Units
            {
                id: 'bld-11',
                unitNumber: 'BLD-2026-8911',
                bloodType: 'O+',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Main Cold Vault Ref-01 / Shelf A',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(12),
                expiryDate: addDays(23),
                status: 'Available',
                donorId: 'dnr-5',
                donorCode: 'DNR-1005',
                testingStatus: 'Tested & Passed',
            },
            {
                id: 'bld-12',
                unitNumber: 'BLD-2026-8912',
                bloodType: 'O+',
                component: 'Cryoprecipitate',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Deep Plasma Freezer FZ-01',
                temperatureZone: '-30°C',
                volumeMl: 150,
                collectionDate: subDays(18),
                expiryDate: addDays(347),
                status: 'Available',
                donorId: 'dnr-5',
                donorCode: 'DNR-1005',
                testingStatus: 'Tested & Passed',
            },

            // A- & AB- & B-
            {
                id: 'bld-13',
                unitNumber: 'BLD-2026-8913',
                bloodType: 'A-',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-3',
                facilityName: 'St. Jude Trauma Center Lab',
                location: 'Trauma Wing Ref-03 / Shelf 2',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(33),
                expiryDate: addDays(1),
                status: 'Available',
                donorId: 'dnr-6',
                donorCode: 'DNR-1006',
                testingStatus: 'Tested & Passed',
                notes: 'Critical Expiry: 24 hours left!',
            },
            {
                id: 'bld-14',
                unitNumber: 'BLD-2026-8914',
                bloodType: 'AB-',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-4',
                facilityName: 'Regional Blood Distribution Hub',
                location: 'Main Ref-04',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(7),
                expiryDate: addDays(28),
                status: 'Available',
                donorId: 'dnr-7',
                donorCode: 'DNR-1007',
                testingStatus: 'Tested & Passed',
            },
            {
                id: 'bld-15',
                unitNumber: 'BLD-2026-8915',
                bloodType: 'B-',
                component: 'Packed Red Blood Cells',
                facilityId: 'fac-1',
                facilityName: 'Central Blood Bank & Processing Hub',
                location: 'Main Cold Vault Ref-01 / Shelf D',
                temperatureZone: '2°C to 6°C',
                volumeMl: 450,
                collectionDate: subDays(11),
                expiryDate: addDays(24),
                status: 'Reserved',
                donorId: 'dnr-8',
                donorCode: 'DNR-1008',
                testingStatus: 'Tested & Passed',
            },
        ];

        this.requests = [
            {
                id: 'req-1',
                requestCode: 'REQ-4091',
                hospitalName: 'St. Jude Trauma Center - ER Bay 3',
                patientName: 'Jonathan Hayes',
                patientAge: 48,
                patientGender: 'Male',
                requiredBloodType: 'O-',
                component: 'Packed Red Blood Cells',
                unitsRequested: 2,
                unitsAssigned: ['bld-1'],
                urgency: 'Emergency (Stat)',
                status: 'Cross-Matched',
                requestDate: subDays(0) + ' 13:45',
                requiredByDate: subDays(0) + ' 15:30',
                notes: 'Massive transfusion protocol activated. Patient trauma admission.',
            },
            {
                id: 'req-2',
                requestCode: 'REQ-4092',
                hospitalName: 'City General Surgical ICU',
                patientName: 'Beatrice Lawson',
                patientAge: 62,
                patientGender: 'Female',
                requiredBloodType: 'A+',
                component: 'Packed Red Blood Cells',
                unitsRequested: 1,
                unitsAssigned: ['bld-4'],
                urgency: 'Urgent',
                status: 'Pending',
                requestDate: subDays(0) + ' 11:20',
                requiredByDate: addDays(1) + ' 09:00',
                notes: 'Post-op cardiac bypass support.',
            },
            {
                id: 'req-3',
                requestCode: 'REQ-4089',
                hospitalName: 'North County Oncology Ward',
                patientName: 'Michael Chang',
                patientAge: 55,
                patientGender: 'Male',
                requiredBloodType: 'A+',
                component: 'Platelets',
                unitsRequested: 1,
                unitsAssigned: ['bld-5'],
                urgency: 'Urgent',
                status: 'Dispatched',
                requestDate: subDays(1) + ' 16:10',
                requiredByDate: subDays(0) + ' 10:00',
                dispatchTemperatureC: 21.4,
                courierTrackingCode: 'COURIER-MED-8891',
                notes: 'Chemotherapy induced thrombocytopenia.',
            },
        ];

        this.drives = [
            {
                id: 'drv-1',
                driveCode: 'DRV-2026-01',
                name: 'Spring Corporate Campus Blood Drive',
                organizer: 'Tech Park Health Association',
                location: 'Grand Ballroom, Innovation Tower, Metro City',
                startDate: addDays(3),
                endDate: addDays(4),
                targetUnits: 120,
                collectedUnits: 0,
                registeredDonorsCount: 84,
                status: 'Scheduled',
                facilityId: 'fac-1',
            },
            {
                id: 'drv-2',
                driveCode: 'DRV-2026-02',
                name: 'University Student Union Donor Drive',
                organizer: 'Red Cross Student Chapter',
                location: 'Student Activity Hall, State University',
                startDate: subDays(1),
                endDate: addDays(1),
                targetUnits: 90,
                collectedUnits: 42,
                registeredDonorsCount: 65,
                status: 'Active',
                facilityId: 'fac-2',
            },
            {
                id: 'drv-3',
                driveCode: 'DRV-2026-03',
                name: 'Community Center Urgent O- Collection Drive',
                organizer: 'Central Blood Bank Outreach',
                location: 'Civic Auditorium, Westside',
                startDate: subDays(10),
                endDate: subDays(9),
                targetUnits: 75,
                collectedUnits: 81,
                registeredDonorsCount: 88,
                status: 'Completed',
                facilityId: 'fac-1',
            },
        ];

        this.auditLogs = [
            {
                id: 'log-1',
                timestamp: subDays(0) + ' 13:48:12',
                userStaff: 'Dr. Sarah Lin (Lab Director)',
                action: 'Cross-Match Executed',
                entityType: 'Request',
                entityId: 'REQ-4091',
                details:
                    'Electronic cross-match verified between Recipient (O-) and Unit BLD-2026-8901 (O- PRBC). Result: COMPATIBLE.',
                digitalSignatureHash: '0x9b3f4a21e78c9012',
            },
            {
                id: 'log-2',
                timestamp: subDays(0) + ' 11:25:04',
                userStaff: 'James Miller (Technician)',
                action: 'Blood Unit Intake Registered',
                entityType: 'Inventory',
                entityId: 'BLD-2026-8910',
                details:
                    'Intake registration completed for AB+ PRBC unit collected from Donor DNR-1004. Viral marker testing NEGATIVE.',
                digitalSignatureHash: '0x4c1e82a90f3177b4',
            },
            {
                id: 'log-3',
                timestamp: subDays(1) + ' 16:15:33',
                userStaff: 'Maria Vance (Dispatch Manager)',
                action: 'Cold Chain Dispatch Initiated',
                entityType: 'Request',
                entityId: 'REQ-4089',
                details:
                    'Dispatched 1 Unit Platelets (BLD-2026-8905) to North County Oncology Ward. Transport box temp validated at 21.4°C.',
                digitalSignatureHash: '0x7a2291d4e08c3451',
            },
        ];

        this.discardLogs = [
            {
                id: 'dsc-1',
                unitNumber: 'BLD-2026-8840',
                bloodType: 'A+',
                component: 'Packed Red Blood Cells',
                discardDate: subDays(4),
                reason: 'Expired',
                performedBy: 'James Miller (Lab Tech)',
                facilityName: 'Central Blood Bank & Processing Hub',
            },
            {
                id: 'dsc-2',
                unitNumber: 'BLD-2026-8812',
                bloodType: 'B-',
                component: 'Whole Blood',
                discardDate: subDays(12),
                reason: 'Bag Contamination/Rupture',
                performedBy: 'Dr. Sarah Lin',
                facilityName: 'City General Hospital Lab',
            },
        ];
    }
}
