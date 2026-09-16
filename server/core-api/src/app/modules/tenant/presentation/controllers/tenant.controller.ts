import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';



import {
    CreateTenantDto,
} from '../dto/create-tenant.dto';
import { TenantApplicationService } from '../../application/tenant-application.service';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';

@Controller('tenants')
export class TenantController {
    constructor(
        private readonly service:
            TenantApplicationService,
    ) { }

    @RequireAccess({
        scope: 'PLATFORM',

        permissions: [
            'tenant:read',
        ],
    })
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @RequireAccess({
        scope: 'TENANT',

        tenantParam: 'id',

        permissions: [
            'tenant:read',
        ],
    })
    @Get(':id')
    findById(
        @Param(
            'id',
            ParseUUIDPipe,
        )
        id: string,
    ) {
        return this.service.findById(id);
    }

    @RequireAccess({
        scope: 'PLATFORM',
        permissions: [
            'tenant:create',
        ],
    })
    @Post()
    create(
        @Body()
        dto: CreateTenantDto,
    ) {
        return this.service.create(dto);
    }

    @RequireAccess({
        scope: 'TENANT',

        tenantParam: 'id',

        permissions: [
            'tenant:update',
        ],
    })
    @Patch(':id')
    update(
        @Param(
            'id',
            ParseUUIDPipe,
        )
        id: string,

        @Body()
        dto: UpdateTenantDto,
    ) {
        return this.service.update(
            id,
            dto as Parameters<TenantApplicationService['update']>[1],
        );
    }
}