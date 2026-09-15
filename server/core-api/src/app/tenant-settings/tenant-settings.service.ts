import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../tenant/tenant.repository';
import { TenantSettingsRepository } from './tenant-settings.repository';
import { UpsertTenantSettingsDto } from './dto/upsert-tenant-settings.dto';

@Injectable()
export class TenantSettingsService {
    constructor(
        private readonly repository: TenantSettingsRepository,
        private readonly tenantRepository: TenantRepository,
    ) { }

    async findByOrganizationId(
        organizationId: string,
    ) {
        const tenant =
            await this.tenantRepository.findById(
                organizationId,
            );

        if (!tenant) {
            throw new NotFoundException(
                'Tenant not found',
            );
        }

        const settings =
            await this.repository.findByOrganizationId(
                organizationId,
            );

        if (!settings) {
            throw new NotFoundException(
                'Tenant settings not found',
            );
        }

        return settings;
    }

    async upsert(
        organizationId: string,
        dto: UpsertTenantSettingsDto,
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

        const existing =
            await this.repository.findByOrganizationId(
                organizationId,
            );

        if (!existing) {
            return this.repository.create(
                organizationId,
                dto,
            );
        }

        return this.repository.update(
            organizationId,
            dto,
        );
    }
}