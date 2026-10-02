import { Controller, Get } from '@nestjs/common';
import { FacilitiesService } from './facilities.service.js';

@Controller('api/facilities')
export class FacilitiesController {
    constructor(private readonly facilitiesService: FacilitiesService) {}

    @Get()
    getAll() {
        return this.facilitiesService.getAllFacilities();
    }

    @Get('equipment')
    getEquipment() {
        return this.facilitiesService.getEquipment();
    }
}
