import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service.js';
import type { BloodType } from './compatibility.service.js';

@Controller('api/compatibility')
export class CompatibilityController {
    constructor(private readonly compatibilityService: CompatibilityService) {}

    @Get('check')
    check(
        @Query('recipient') recipient: string = 'O-',
        @Query('component') component: string = 'Packed Red Blood Cells',
    ) {
        return this.compatibilityService.checkCompatibility(
            recipient as BloodType,
            component,
        );
    }

    @Post('validate')
    validate(
        @Body() body: {
            recipientType: string;
            donorType: string;
            component?: string;
        },
    ) {
        return this.compatibilityService.validateSpecificPair(
            body.recipientType as BloodType,
            body.donorType as BloodType,
            body.component || 'Packed Red Blood Cells',
        );
    }
}
