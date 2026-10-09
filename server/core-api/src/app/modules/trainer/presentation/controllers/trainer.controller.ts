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
    TrainerApplicationService,
} from '../../application/trainer-application.service';

import {
    CreateTrainerDto,
} from '../dto/create-trainer.dto';

import {
    UpdateTrainerDto,
} from '../dto/update-trainer.dto';

@Controller(
    'organizations/:organizationId/branches/:branchId/trainers',
)
export class TrainerController {

    constructor(
        private readonly service:
            TrainerApplicationService,
    ) { }

    @Get()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'trainer:read',
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

    @Get(':trainerId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'trainer:read',
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

        @Param('trainerId')
        trainerId: string,
    ) {

        return this.service.findById(
            organizationId,
            branchId,
            trainerId,
        );
    }

    @Post()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'trainer:create',
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
        dto: CreateTrainerDto,
    ) {

        return this.service.create(
            organizationId,
            branchId,
            dto,
        );
    }

    @Patch(':trainerId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'trainer:update',
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

        @Param('trainerId')
        trainerId: string,

        @Body()
        dto: UpdateTrainerDto,
    ) {

        return this.service.update(
            organizationId,
            branchId,
            trainerId,
            dto,
        );
    }
}