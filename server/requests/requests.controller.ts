import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RequestsService } from './requests.service.js';

@Controller('api/requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get()
    getAll(
        @Query('status') status?: string,
        @Query('urgency') urgency?: string,
        @Query('search') search?: string,
    ) {
        return this.requestsService.getAll(status, urgency, search);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.requestsService.getById(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.requestsService.create(body);
    }

    @Post(':id/cross-match')
    crossMatch(@Param('id') id: string, @Body() body: { unitIds: string[] }) {
        return this.requestsService.crossMatchUnits(id, body.unitIds);
    }

    @Post(':id/dispatch')
    dispatch(
        @Param('id') id: string,
        @Body() body: { courierCode?: string; tempC?: number },
    ) {
        return this.requestsService.dispatch(id, body.courierCode, body.tempC);
    }
}
