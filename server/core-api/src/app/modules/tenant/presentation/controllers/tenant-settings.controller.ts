import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
} from '@nestjs/common';

import {
    TenantSettingsApplicationService,
} from '../../application/tenant-settings-application.service';

import {
    UpsertTenantSettingsDto,
} from '../dto/upsert-tenant-settings.dto';

@Controller('tenants/:organizationId/settings')
export class TenantSettingsController {
    constructor(
        private readonly service:
            TenantSettingsApplicationService,
    ) { }

    @Get()
    findByOrganizationId(
        @Param(
            'organizationId',
            ParseUUIDPipe,
        )
        organizationId: string,
    ) {
        return this.service.findByOrganizationId(
            organizationId,
        );
    }

    @Put()
    upsert(
        @Param(
            'organizationId',
            ParseUUIDPipe,
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