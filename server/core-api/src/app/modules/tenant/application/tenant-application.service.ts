import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type {
    CreateTenantRequest,
    UpdateTenantRequest,
} from '@coaching/contracts';

import * as tenantRepository from '../../tenant/domain/repositories/tenant.repository';

@Injectable()
export class TenantApplicationService {
    constructor(
        @Inject(tenantRepository.TENANT_REPOSITORY)
        private readonly tenants:
            tenantRepository.TenantRepository,
    ) { }

    findAll() {
        return this.tenants.findAll();
    }

    async findById(
        id: string,
    ) {
        const tenant =
            await this.tenants.findById(
                id,
            );

        if (!tenant) {
            throw new NotFoundException(
                'Tenant not found',
            );
        }

        return tenant;
    }

    async create(
        request: CreateTenantRequest,
    ) {
        const slug =
            request.slug.toLowerCase();

        const code =
            request.code.toUpperCase();

        if (
            await this.tenants.findBySlug(
                slug,
            )
        ) {
            throw new ConflictException(
                'Tenant slug already exists',
            );
        }

        if (
            await this.tenants.findByCode(
                code,
            )
        ) {
            throw new ConflictException(
                'Tenant code already exists',
            );
        }

        return this.tenants.create({
            name: request.name,
            slug,
            code,

            status: 'ACTIVE',

            timezone:
                request.timezone ??
                'Asia/Kolkata',

            currency:
                request.currency ??
                'INR',

            country:
                request.country ??
                'India',
        });
    }

    async update(
        id: string,
        request: UpdateTenantRequest,
    ) {
        await this.findById(id);

        if (request.slug) {
            const existing =
                await this.tenants.findBySlug(
                    request.slug,
                );

            if (
                existing &&
                existing.id !== id
            ) {
                throw new ConflictException(
                    'Tenant slug already exists',
                );
            }
        }

        return this.tenants.update(
            id,
            request,
        );
    }
}