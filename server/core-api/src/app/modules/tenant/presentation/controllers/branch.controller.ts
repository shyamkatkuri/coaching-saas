import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { BranchApplicationService } from '../../application/branch-application.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { RequireAccess } from 'src/app/core/security/authorization/require-access.decorator';

@Controller('tenants/:organizationId/branches')
export class BranchController {
    constructor(
        private readonly branchService:
            BranchApplicationService,
    ) { }

    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'branch:read',
        ],
    })
    @Get()
    findAll(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,
    ) {
        return this.branchService.findAll(
            organizationId,
        );
    }

    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'branch:read',
        ],
    })
    @Get(':branchId')
    findById(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,

        @Param(
            'branchId',
            new ParseUUIDPipe(),
        )
        branchId: string,
    ) {
        return this.branchService.findById(
            organizationId,
            branchId,
        );
    }

    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'branch:create',
        ],
    })
    @Post()
    create(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,

        @Body()
        dto: CreateBranchDto,
    ) {
        return this.branchService.create(
            organizationId,
            dto,
        );
    }

    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'branch:update',
        ],
    })
    @Patch(':branchId')
    update(
        @Param(
            'organizationId',
            new ParseUUIDPipe(),
        )
        organizationId: string,

        @Param(
            'branchId',
            new ParseUUIDPipe(),
        )
        branchId: string,

        @Body()
        dto: UpdateBranchDto,
    ) {
        return this.branchService.update(
            organizationId,
            branchId,
            dto,
        );
    }
}