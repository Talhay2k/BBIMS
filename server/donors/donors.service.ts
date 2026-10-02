import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService, DonorRecord } from '../database/db.service.js';

@Injectable()
export class DonorsService {
    constructor(private readonly db: DbService) {}

    getAll(search?: string, bloodType?: string, status?: string) {
        let list = [...this.db.donors];

        if (bloodType && bloodType !== 'All') {
            list = list.filter((d) => d.bloodType === bloodType);
        }
        if (status && status !== 'All') {
            list = list.filter((d) => d.eligibilityStatus === status);
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(
                (d) =>
                    d.fullName.toLowerCase().includes(s) ||
                    d.donorCode.toLowerCase().includes(s) ||
                    d.phone.includes(s) ||
                    d.email.toLowerCase().includes(s),
            );
        }

        return list;
    }

    getById(id: string) {
        const donor = this.db.donors.find((d) => d.id === id);
        if (!donor)
            throw new NotFoundException(`Donor with ID ${id} not found`);
        return donor;
    }

    create(dto: Partial<DonorRecord>) {
        const newDonor: DonorRecord = {
            id: 'dnr-' + Date.now(),
            donorCode:
                dto.donorCode ||
                `DNR-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: dto.fullName || 'Anonymous Donor',
            bloodType: dto.bloodType || 'O+',
            age: dto.age || 25,
            gender: dto.gender || 'Male',
            phone: dto.phone || '+1 (555) 000-0000',
            email: dto.email || 'donor@example.com',
            address: dto.address || 'Metro City',
            lastDonationDate:
                dto.lastDonationDate || new Date().toISOString().split('T')[0],
            eligibilityStatus: dto.eligibilityStatus || 'Eligible',
            totalDonationsCount: dto.totalDonationsCount || 1,
            hemoglobinGdl: dto.hemoglobinGdl || 14.5,
            bloodPressure: dto.bloodPressure || '120/80',
            weightKg: dto.weightKg || 70,
            notes: dto.notes,
        };

        this.db.donors.unshift(newDonor);

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Donor Coordinator',
            action: 'Donor Profile Registered',
            entityType: 'Donor',
            entityId: newDonor.donorCode,
            details: `Registered donor ${newDonor.fullName} (${newDonor.bloodType}). Status: ${newDonor.eligibilityStatus}.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return newDonor;
    }

    recordDonation(
        donorId: string,
        details: { volumeMl: number; component: any; facilityId: string },
    ) {
        const donor = this.getById(donorId);
        donor.lastDonationDate = new Date().toISOString().split('T')[0];
        donor.totalDonationsCount += 1;

        // Automatically create a new unit in inventory
        const facility =
            this.db.facilities.find((f) => f.id === details.facilityId) ||
            this.db.facilities[0];
        const newUnit = {
            id: 'bld-' + Date.now(),
            unitNumber: `BLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            bloodType: donor.bloodType,
            component: details.component || 'Packed Red Blood Cells',
            facilityId: facility.id,
            facilityName: facility.name,
            location: 'Intake Quarantine Vault',
            temperatureZone: '2°C to 6°C',
            volumeMl: details.volumeMl || 450,
            collectionDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 35 * 86400000)
                .toISOString()
                .split('T')[0],
            status: 'Available' as const,
            donorId: donor.id,
            donorCode: donor.donorCode,
            testingStatus: 'Tested & Passed' as const,
            notes: `Donation collected at ${facility.name}.`,
        };

        this.db.inventory.unshift(newUnit);

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Donor Coordinator',
            action: 'New Donation Collected',
            entityType: 'Donor',
            entityId: donor.donorCode,
            details: `Collected ${newUnit.volumeMl}mL ${newUnit.bloodType} donation from ${donor.fullName}. Created Unit ${newUnit.unitNumber}.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return { donor, newUnit };
    }
}
