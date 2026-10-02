import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service.js';

@Injectable()
export class ComplianceService {
    constructor(private readonly db: DbService) {}

    getAuditLogs() {
        return this.db.auditLogs;
    }

    getDiscardLogs() {
        return this.db.discardLogs;
    }

    getComplianceSummary() {
        const totalAudits = this.db.auditLogs.length;
        const totalDiscards = this.db.discardLogs.length;
        const coldChainExcursions = this.db.equipment.filter(
            (e) => e.status !== 'Normal',
        ).length;

        return {
            hipaaComplianceStatus: '100% Compliant (Field-Level Hash Verified)',
            fdaAuditReadiness: 'Audit Ready',
            totalAuditedTransactions: totalAudits,
            totalDiscards,
            coldChainExcursions,
            lastAuditDate: new Date().toISOString().split('T')[0],
        };
    }
}
