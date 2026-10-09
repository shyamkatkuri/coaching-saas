import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';

import {
    BatchApplicationService,
} from '../../application/batch-application.service';

import {
    CreateBatchDto,
} from '../dto/create-batch.dto';

import {
    UpdateBatchDto,
} from '../dto/update-batch.dto';

@Controller(
    'organizations/:organizationId/branches/:branchId/batches',
)
export class BatchController {

    constructor(
        private readonly service:
            BatchApplicationService,
    ) { }

    @Get()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'batch:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    findAll(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,
    ) {

        return this.service.findAll(
            organizationId,
            branchId,
        );
    }

    @Get(':batchId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'batch:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    findById(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('batchId')
        batchId: string,
    ) {

        return this.service.findById(
            organizationId,
            branchId,
            batchId,
        );
    }

    @Post()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'batch:create',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    create(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Body()
        dto: CreateBatchDto,
    ) {

        return this.service.create(
            organizationId,
            branchId,
            dto,
        );
    }

    @Patch(':batchId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'batch:update',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    update(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('batchId')
        batchId: string,

        @Body()
        dto: UpdateBatchDto,
    ) {

        return this.service.update(
            organizationId,
            branchId,
            batchId,
            dto,
        );
    }
}