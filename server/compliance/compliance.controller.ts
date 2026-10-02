import { Controller, Get } from '@nestjs/common';
import { ComplianceService } from './compliance.service.js';

@Controller('api/compliance')
export class ComplianceController {
    constructor(private readonly complianceService: ComplianceService) {}

    @Get('audit-logs')
    getAuditLogs() {
        return this.complianceService.getAuditLogs();
    }

    @Get('discard-logs')
    getDiscardLogs() {
        return this.complianceService.getDiscardLogs();
    }

    @Get('summary')
    getSummary() {
        return this.complianceService.getComplianceSummary();
    }
}
