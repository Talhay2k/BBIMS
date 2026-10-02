import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';

@Controller('api/inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Get()
    getAll(
        @Query('type') type?: string,
        @Query('component') component?: string,
        @Query('status') status?: string,
        @Query('facilityId') facilityId?: string,
        @Query('search') search?: string,
    ) {
        return this.inventoryService.getAllUnits({
            type,
            component,
            status,
            facilityId,
            search,
        });
    }

    @Get('expiry-alerts')
    getExpiryAlerts() {
        return this.inventoryService.getExpiryAlerts();
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.inventoryService.getUnitById(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.inventoryService.createUnit(body);
    }

    @Put(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: any; notes?: string },
    ) {
        return this.inventoryService.updateStatus(id, body.status, body.notes);
    }
}
