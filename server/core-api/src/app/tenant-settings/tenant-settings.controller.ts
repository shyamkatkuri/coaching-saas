import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
    Body,
} from '@nestjs/common';
import { TenantSettingsService } from './tenant-settings.service';
import { UpsertTenantSettingsDto } from './dto/upsert-tenant-settings.dto';

@Controller('tenants/:organizationId/settings')
export class TenantSettingsController {
    constructor(
        private readonly service: TenantSettingsService,
    ) { }

    @Get()
    findSettings(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,
    ) {
        return this.service.findByOrganizationId(
            organizationId,
        );
    }

    @Put()
    upsertSettings(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,

        @Body()
        dto: UpsertTenantSettingsDto,
    ) {
        return this.service.upsert(
            organizationId,
            dto,
        );
    }
}