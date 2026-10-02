import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService, DonationDrive } from '../database/db.service.js';

@Injectable()
export class DrivesService {
    constructor(private readonly db: DbService) {}

    getAll(status?: string) {
        let list = [...this.db.drives];
        if (status && status !== 'All') {
            list = list.filter((d) => d.status === status);
        }
        return list;
    }

    create(dto: Partial<DonationDrive>) {
        const facility =
            this.db.facilities.find((f) => f.id === dto.facilityId) ||
            this.db.facilities[0];
        const newDrive: DonationDrive = {
            id: 'drv-' + Date.now(),
            driveCode:
                dto.driveCode ||
                `DRV-2026-${Math.floor(10 + Math.random() * 90)}`,
            name: dto.name || 'Blood Donation Drive',
            organizer: dto.organizer || 'Community Health Association',
            location: dto.location || 'Central Community Hall',
            startDate: dto.startDate || new Date().toISOString().split('T')[0],
            endDate:
                dto.endDate ||
                new Date(Date.now() + 86400000).toISOString().split('T')[0],
            targetUnits: dto.targetUnits || 100,
            collectedUnits: dto.collectedUnits || 0,
            registeredDonorsCount: dto.registeredDonorsCount || 0,
            status: dto.status || 'Scheduled',
            facilityId: facility.id,
        };

        this.db.drives.unshift(newDrive);

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Outreach Manager',
            action: 'Donation Drive Scheduled',
            entityType: 'Drive',
            entityId: newDrive.driveCode,
            details: `Scheduled campaign "${newDrive.name}" at ${newDrive.location}. Target: ${newDrive.targetUnits} units.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return newDrive;
    }

    updateStatus(id: string, status: DonationDrive['status']) {
        const drive = this.db.drives.find((d) => d.id === id);
        if (!drive) throw new NotFoundException(`Drive ${id} not found`);
        drive.status = status;
        this.db.saveData();
        return drive;
    }
}
