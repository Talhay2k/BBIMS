import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service.js';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

@Injectable()
export class CompatibilityService {
    constructor(private readonly db: DbService) {}

    // RBC Compatibility Map (Recipient -> Compatible Donors)
    private rbcMatrix: Record<BloodType, BloodType[]> = {
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['O-', 'A-'],
        'A+': ['O-', 'O+', 'A-', 'A+'],
        'B-': ['O-', 'B-'],
        'B+': ['O-', 'O+', 'B-', 'B+'],
        'AB-': ['O-', 'A-', 'B-', 'AB-'],
        'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    };

    // Plasma Compatibility Map (Recipient -> Compatible Donors)
    private plasmaMatrix: Record<BloodType, BloodType[]> = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+'],
    };

    checkCompatibility(recipientBloodType: BloodType, component: string) {
        const isPlasma =
            component.toLowerCase().includes('plasma') ||
            component.toLowerCase().includes('cryo');
        const matrix = isPlasma ? this.plasmaMatrix : this.rbcMatrix;

        const compatibleTypes = matrix[recipientBloodType] || [
            recipientBloodType,
        ];

        // Find matching units in inventory
        const availableMatchingUnits = this.db.inventory.filter(
            (u) =>
                u.status === 'Available' &&
                compatibleTypes.includes(u.bloodType),
        );

        return {
            recipientBloodType,
            component,
            isPlasma,
            compatibleDonorTypes: compatibleTypes,
            compatibleUnitsCount: availableMatchingUnits.length,
            availableUnits: availableMatchingUnits,
        };
    }

    validateSpecificPair(
        recipientType: BloodType,
        donorType: BloodType,
        component: string,
    ) {
        const isPlasma =
            component.toLowerCase().includes('plasma') ||
            component.toLowerCase().includes('cryo');
        const matrix = isPlasma ? this.plasmaMatrix : this.rbcMatrix;
        const allowed = (matrix[recipientType] || []).includes(donorType);

        return {
            compatible: allowed,
            recipientType,
            donorType,
            component,
            reason: allowed
                ? `Donor type ${donorType} is COMPATIBLE with Recipient ${recipientType} for ${component}.`
                : `INCOMPATIBLE: Donor ${donorType} cannot be given to Recipient ${recipientType} for ${component}. Risk of acute hemolytic reaction!`,
        };
    }
}
