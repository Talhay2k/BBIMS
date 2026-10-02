import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService, BloodUnit } from '../database/db.service.js';

@Injectable()
export class InventoryService {
    constructor(private readonly db: DbService) {}

    getAllUnits(query?: {
        type?: string;
        component?: string;
        status?: string;
        facilityId?: string;
        search?: string;
    }) {
        let list = [...this.db.inventory];

        if (query?.type && query.type !== 'All') {
            list = list.filter((u) => u.bloodType === query.type);
        }
        if (query?.component && query.component !== 'All') {
            list = list.filter((u) => u.component === query.component);
        }
        if (query?.status && query.status !== 'All') {
            list = list.filter((u) => u.status === query.status);
        }
        if (query?.facilityId && query.facilityId !== 'All') {
            list = list.filter((u) => u.facilityId === query.facilityId);
        }
        if (query?.search) {
            const s = query.search.toLowerCase();
            list = list.filter(
                (u) =>
                    u.unitNumber.toLowerCase().includes(s) ||
                    u.location.toLowerCase().includes(s) ||
                    u.facilityName.toLowerCase().includes(s) ||
                    (u.notes && u.notes.toLowerCase().includes(s)),
            );
        }

        return list;
    }

    getUnitById(id: string) {
        const unit = this.db.inventory.find((u) => u.id === id);
        if (!unit) throw new NotFoundException(`Unit with ID ${id} not found`);
        return unit;
    }

    createUnit(dto: Partial<BloodUnit>) {
        const facility =
            this.db.facilities.find((f) => f.id === dto.facilityId) ||
            this.db.facilities[0];
        const newUnit: BloodUnit = {
            id: 'bld-' + Date.now(),
            unitNumber:
                dto.unitNumber ||
                `BLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            bloodType: dto.bloodType || 'O+',
            component: dto.component || 'Packed Red Blood Cells',
            facilityId: facility.id,
            facilityName: facility.name,
            location: dto.location || 'Main Cold Vault Ref-01',
            temperatureZone: dto.temperatureZone || '2°C to 6°C',
            volumeMl: dto.volumeMl || 450,
            collectionDate:
                dto.collectionDate || new Date().toISOString().split('T')[0],
            expiryDate:
                dto.expiryDate ||
                new Date(Date.now() + 35 * 86400000)
                    .toISOString()
                    .split('T')[0],
            status: dto.status || 'Available',
            donorId: dto.donorId,
            donorCode: dto.donorCode,
            testingStatus: dto.testingStatus || 'Tested & Passed',
            notes: dto.notes,
        };

        this.db.inventory.unshift(newUnit);

        // Log audit
        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Lab Specialist',
            action: 'Blood Unit Registered',
            entityType: 'Inventory',
            entityId: newUnit.unitNumber,
            details: `Registered ${newUnit.bloodType} ${newUnit.component} unit (${newUnit.volumeMl}mL) at ${newUnit.facilityName}.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return newUnit;
    }

    updateStatus(id: string, status: BloodUnit['status'], notes?: string) {
        const unit = this.getUnitById(id);
        const oldStatus = unit.status;
        unit.status = status;
        if (notes) unit.notes = notes;

        // If discarded, add to discard log
        if (status === 'Discarded') {
            this.db.discardLogs.unshift({
                id: 'dsc-' + Date.now(),
                unitNumber: unit.unitNumber,
                bloodType: unit.bloodType,
                component: unit.component,
                discardDate: new Date().toISOString().split('T')[0],
                reason: 'Storage Temp Excursion',
                performedBy: 'Lab Officer',
                facilityName: unit.facilityName,
            });
        }

        // Log audit
        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Lab Specialist',
            action: `Unit Status Changed: ${oldStatus} -> ${status}`,
            entityType: 'Inventory',
            entityId: unit.unitNumber,
            details: `Updated status for ${unit.unitNumber} (${unit.bloodType}) from ${oldStatus} to ${status}. Notes: ${notes || 'None'}`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return unit;
    }

    getExpiryAlerts() {
        const today = new Date();
        const alerts = this.db.inventory.map((unit) => {
            const exp = new Date(unit.expiryDate);
            const diffDays = Math.ceil(
                (exp.getTime() - today.getTime()) / (1000 * 3600 * 24),
            );
            let riskLevel: 'Critical' | 'Warning' | 'Good' | 'Expired' = 'Good';

            if (diffDays < 0) riskLevel = 'Expired';
            else if (diffDays <= 3) riskLevel = 'Critical';
            else if (diffDays <= 7) riskLevel = 'Warning';

            return {
                unit,
                daysRemaining: diffDays,
                riskLevel,
            };
        });

        return alerts
            .filter((a) => a.riskLevel !== 'Good')
            .sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
}
