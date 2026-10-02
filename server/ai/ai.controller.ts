import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service.js';

@Controller('api/ai-forecast')
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @Get()
    getForecast() {
        return this.aiService.getForecastAndRiskAnalysis();
    }
}
