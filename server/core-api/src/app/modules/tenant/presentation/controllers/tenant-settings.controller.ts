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
import { RequireAccess } from 'src/app/core/security/authorization/require-access.decorator';

@Controller('tenants/:organizationId/settings')
export class TenantSettingsController {
    constructor(
        private readonly service:
            TenantSettingsApplicationService,
    ) { }


    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'tenant:read',
        ],
    })
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

    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'tenant:update',
        ],
    })
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