import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { DbService, RequestRecord } from '../database/db.service.js';

@Injectable()
export class RequestsService {
    constructor(private readonly db: DbService) {}

    getAll(status?: string, urgency?: string, search?: string) {
        let list = [...this.db.requests];

        if (status && status !== 'All') {
            list = list.filter((r) => r.status === status);
        }
        if (urgency && urgency !== 'All') {
            list = list.filter((r) => r.urgency === urgency);
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(
                (r) =>
                    r.requestCode.toLowerCase().includes(s) ||
                    r.hospitalName.toLowerCase().includes(s) ||
                    r.patientName.toLowerCase().includes(s),
            );
        }

        return list;
    }

    getById(id: string) {
        const req = this.db.requests.find((r) => r.id === id);
        if (!req)
            throw new NotFoundException(`Request with ID ${id} not found`);
        return req;
    }

    create(dto: Partial<RequestRecord>) {
        const newReq: RequestRecord = {
            id: 'req-' + Date.now(),
            requestCode:
                dto.requestCode ||
                `REQ-${Math.floor(4000 + Math.random() * 6000)}`,
            hospitalName: dto.hospitalName || 'City Medical Center',
            patientName: dto.patientName || 'Emergency Patient',
            patientAge: dto.patientAge || 45,
            patientGender: dto.patientGender || 'Male',
            requiredBloodType: dto.requiredBloodType || 'O-',
            component: dto.component || 'Packed Red Blood Cells',
            unitsRequested: dto.unitsRequested || 1,
            unitsAssigned: [],
            urgency: dto.urgency || 'Routine',
            status: 'Pending',
            requestDate: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 16),
            requiredByDate:
                dto.requiredByDate ||
                new Date(Date.now() + 86400000).toISOString().split('T')[0] +
                    ' 12:00',
            notes: dto.notes,
        };

        this.db.requests.unshift(newReq);

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Hospital Liaison',
            action: 'Blood Request Submitted',
            entityType: 'Request',
            entityId: newReq.requestCode,
            details: `Submitted request for ${newReq.unitsRequested} unit(s) of ${newReq.requiredBloodType} ${newReq.component} for ${newReq.hospitalName}. Urgency: ${newReq.urgency}.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return newReq;
    }

    crossMatchUnits(requestId: string, unitIds: string[]) {
        const req = this.getById(requestId);
        req.unitsAssigned = unitIds;
        req.status = 'Cross-Matched';

        // Update inventory units to Cross-Matched
        unitIds.forEach((uid) => {
            const unit = this.db.inventory.find((u) => u.id === uid);
            if (unit) {
                unit.status = 'Cross-Matched';
            }
        });

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Lab Specialist',
            action: 'Units Cross-Matched & Assigned',
            entityType: 'Request',
            entityId: req.requestCode,
            details: `Assigned unit(s) [${unitIds.join(', ')}] to request ${req.requestCode} for Patient ${req.patientName}. Electronic cross-match PASSED.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return req;
    }

    dispatch(requestId: string, courierCode?: string, tempC?: number) {
        const req = this.getById(requestId);
        req.status = 'Dispatched';
        req.courierTrackingCode =
            courierCode ||
            `COURIER-EXPRESS-${Math.floor(1000 + Math.random() * 9000)}`;
        req.dispatchTemperatureC = tempC || 4.2;

        req.unitsAssigned.forEach((uid) => {
            const unit = this.db.inventory.find((u) => u.id === uid);
            if (unit) {
                unit.status = 'Dispatched';
            }
        });

        this.db.auditLogs.unshift({
            id: 'log-' + Date.now(),
            timestamp: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            userStaff: 'Cold Chain Dispatcher',
            action: 'Cold Chain Dispatch Complete',
            entityType: 'Request',
            entityId: req.requestCode,
            details: `Dispatched order ${req.requestCode} to ${req.hospitalName} via ${req.courierTrackingCode}. Cold-chain temp: ${req.dispatchTemperatureC}°C.`,
            digitalSignatureHash:
                '0x' + Math.random().toString(16).substring(2, 18),
        });

        this.db.saveData();
        return req;
    }
}
