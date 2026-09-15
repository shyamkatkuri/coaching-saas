import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    @Get()
    health() {
        return {
            status: 'UP',
            service: 'tenant-service',
        };
    }

    @Get('ready')
    async readiness() {
        await this.databaseService.query('SELECT 1');

        return {
            status: 'UP',
            database: 'tenant_db',
        };
    }
}