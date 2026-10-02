import { Module } from '@nestjs/common';
import { DbService } from './database/db.service.js';
import { InventoryController } from './inventory/inventory.controller.js';
import { InventoryService } from './inventory/inventory.service.js';
import { DonorsController } from './donors/donors.controller.js';
import { DonorsService } from './donors/donors.service.js';
import { RequestsController } from './requests/requests.controller.js';
import { RequestsService } from './requests/requests.service.js';
import { DrivesController } from './drives/drives.controller.js';
import { DrivesService } from './drives/drives.service.js';
import { FacilitiesController } from './facilities/facilities.controller.js';
import { FacilitiesService } from './facilities/facilities.service.js';
import { ComplianceController } from './compliance/compliance.controller.js';
import { ComplianceService } from './compliance/compliance.service.js';
import { CompatibilityController } from './compatibility/compatibility.controller.js';
import { CompatibilityService } from './compatibility/compatibility.service.js';
import { AiController } from './ai/ai.controller.js';
import { AiService } from './ai/ai.service.js';

@Module({
    imports: [],
    controllers: [
        InventoryController,
        DonorsController,
        RequestsController,
        DrivesController,
        FacilitiesController,
        ComplianceController,
        CompatibilityController,
        AiController,
    ],
    providers: [
        DbService,
        InventoryService,
        DonorsService,
        RequestsService,
        DrivesService,
        FacilitiesService,
        ComplianceService,
        CompatibilityService,
        AiService,
    ],
})
export class AppModule {}
