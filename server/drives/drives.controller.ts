import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { DrivesService } from './drives.service.js';

@Controller('api/drives')
export class DrivesController {
    constructor(private readonly drivesService: DrivesService) {}

    @Get()
    getAll(@Query('status') status?: string) {
        return this.drivesService.getAll(status);
    }

    @Post()
    create(@Body() body: any) {
        return this.drivesService.create(body);
    }

    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
        return this.drivesService.updateStatus(id, body.status);
    }
}
