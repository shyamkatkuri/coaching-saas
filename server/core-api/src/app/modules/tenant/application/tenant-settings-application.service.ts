import {
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
    TENANT_SETTINGS_REPOSITORY,
} from '../domain/repositories/tenant-settings.repository';

import type {
    TenantSettingsRepository,
    UpsertTenantSettingsInput,
} from '../domain/repositories/tenant-settings.repository';

@Injectable()
export class TenantSettingsApplicationService {
    constructor(
        @Inject(TENANT_SETTINGS_REPOSITORY)
        private readonly settingsRepository:
            TenantSettingsRepository,

        @Inject(TENANT_REPOSITORY)
        private readonly tenantRepository:
            TenantRepository,
    ) { }

    /**
     * Verify that the tenant exists before
     * accessing tenant settings.
     */
    private async ensureTenantExists(
        organizationId: string,
    ): Promise<void> {
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

    /**
     * Get settings for a tenant.
     */
    async findByOrganizationId(
        organizationId: string,
    ) {
        await this.ensureTenantExists(
            organizationId,
        );

        const settings =
            await this.settingsRepository.findByOrganizationId(
                organizationId,
            );

        if (!settings) {
            throw new NotFoundException(
                'Tenant settings not found',
            );
        }

        return settings;
    }

    /**
     * Create settings if they don't exist.
     * Otherwise update the existing settings.
     */
    async upsert(
        organizationId: string,
        input: UpsertTenantSettingsInput,
    ) {
        await this.ensureTenantExists(
            organizationId,
        );

        const existing =
            await this.settingsRepository.findByOrganizationId(
                organizationId,
            );

        if (!existing) {
            return this.settingsRepository.create(
                organizationId,
                input,
            );
        }

        return this.settingsRepository.update(
            organizationId,
            input,
        );
    }
}