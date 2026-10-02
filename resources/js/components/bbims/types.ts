export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType =
    | 'Packed Red Blood Cells'
    | 'Whole Blood'
    | 'Platelets'
    | 'Fresh Frozen Plasma'
    | 'Cryoprecipitate';

export type UnitStatus =
    | 'Available'
    | 'Reserved'
    | 'Cross-Matched'
    | 'Quarantined'
    | 'Dispatched'
    | 'Expired'
    | 'Discarded';

export interface BloodUnit {
    id: string;
    unitNumber: string;
    bloodType: BloodType;
    component: ComponentType;
    facilityId: string;
    facilityName: string;
    location: string;
    temperatureZone: string;
    volumeMl: number;
    collectionDate: string;
    expiryDate: string;
    status: UnitStatus;
    donorId?: string;
    donorCode?: string;
    testingStatus: 'Tested & Passed' | 'Pending Testing' | 'Quarantine Flagged';
    notes?: string;
}

export interface DonorRecord {
    id: string;
    donorCode: string;
    fullName: string;
    bloodType: BloodType;
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
    requiredBloodType: BloodType;
    component: string;
    unitsRequested: number;
    unitsAssigned: string[];
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
    type: string;
    city: string;
    phone: string;
    refrigeratorsCount: number;
    freezersCount: number;
    agitatorsCount: number;
    status: 'Operational' | 'Maintenance Warning';
    totalUnitsInStock?: number;
    availableUnits?: number;
}

export interface StorageEquipment {
    id: string;
    facilityId: string;
    name: string;
    type: string;
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
    entityType: string;
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
    reason: string;
    performedBy: string;
    facilityName: string;
}

export interface AiForecastData {
    generatedAt: string;
    confidenceScore: number;
    forecastingTable: {
        bloodType: BloodType;
        currentStock: number;
        projected14DayDemand: number;
        projectedNetBalance: number;
        status:
            | 'Critical Deficit'
            | 'Moderate Shortage'
            | 'Balanced'
            | 'Surplus';
    }[];
    expiringRiskUnitsCount: number;
    expiringUnitsList: { unit: BloodUnit; daysRemaining: number }[];
    recommendations: {
        id: string;
        priority: 'High' | 'Medium' | 'Low';
        category: string;
        text: string;
    }[];
}
