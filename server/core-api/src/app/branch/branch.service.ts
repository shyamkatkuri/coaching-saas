import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../tenant/tenant.repository';
import { BranchRepository } from './branch.repository';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
    constructor(
        private readonly branchRepository: BranchRepository,
        private readonly tenantRepository: TenantRepository,
    ) { }

    private async ensureTenantExists(
        organizationId: string,
    ) {
        const tenant =
            await this.tenantRepository.findById(
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