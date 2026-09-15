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

@Controller('tenants/:organizationId/branches')
export class BranchController {
    constructor(
        private readonly branchService:
            BranchApplicationService,
    ) { }

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