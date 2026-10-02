import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DonorsService } from './donors.service.js';

@Controller('api/donors')
export class DonorsController {
    constructor(private readonly donorsService: DonorsService) {}

    @Get()
    getAll(
        @Query('search') search?: string,
        @Query('bloodType') bloodType?: string,
        @Query('status') status?: string,
    ) {
        return this.donorsService.getAll(search, bloodType, status);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.donorsService.getById(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.donorsService.create(body);
    }

    @Post(':id/record-donation')
    recordDonation(
        @Param('id') id: string,
        @Body() body: { volumeMl: number; component: any; facilityId: string },
    ) {
        return this.donorsService.recordDonation(id, body);
    }
}
