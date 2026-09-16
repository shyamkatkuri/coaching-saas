import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../core/database/database.service';
import {
    Public,
} from '../core/security/authentication/public.decorator';

@Public()
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