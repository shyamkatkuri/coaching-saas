import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    TENANT_REPOSITORY,
} from '../domain/repositories/tenant.repository';

import type {
    TenantRepository,
} from '../domain/repositories/tenant.repository';

import {
    BRANCH_REPOSITORY,
} from '../domain/repositories/branch.repository';

import type {
    BranchRepository,
} from '../domain/repositories/branch.repository';
import { CreateTenantRequest, UpdateTenantRequest } from '@coaching/contracts/src/tenant/tenant.contract';
import { CreateBranchDto } from '../presentation/dto/create-branch.dto';
import { UpdateBranchDto } from '../presentation/dto/update-branch.dto';

@Injectable()
export class BranchApplicationService {
    constructor(
        @Inject(BRANCH_REPOSITORY)
        private readonly branchRepository: BranchRepository,

        @Inject(TENANT_REPOSITORY)
        private readonly tenants: TenantRepository,
    ) { }

    private async ensureTenantExists(
        organizationId: string,
    ) {
        const tenant =
            await this.tenants.findById(
                organizationId,
            );

        if (!tenant) {
            throw new NotFoundException(
                `Tenant ${organizationId} not found`,
            );
        }
    }

    async findAll(organizationId: string) {
        await this.ensureTenantExists(organizationId);

        return this.branchRepository.findAllByTenant(
            organizationId,
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
    ) {
        await this.ensureTenantExists(organizationId);

        const branch =
            await this.branchRepository.findById(
                organizationId,
                branchId,
            );

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        return branch;
    }

    async create(
        organizationId: string,
        dto: CreateBranchDto,
    ) {
        await this.ensureTenantExists(organizationId);

        const existing =
            await this.branchRepository.findByCode(
                organizationId,
                dto.code.toUpperCase(),
            );

        if (existing) {
            throw new ConflictException(
                'Branch code already exists for this tenant',
            );
        }

        return this.branchRepository.create(
            organizationId,
            {
                ...dto,
                code: dto.code.toUpperCase(),
            },
        );
    }

    async update(
        organizationId: string,
        branchId: string,
        dto: UpdateBranchDto,
    ) {
        await this.findById(
            organizationId,
            branchId,
        );

        return this.branchRepository.update(
            organizationId,
            branchId,
            dto,
        );
    }
}