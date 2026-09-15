import { TenantSettings } from '../models/tenant-settings.model';

export interface UpsertTenantSettingsInput {
    dateFormat?: string;
    timeFormat?: string;
    weekStartDay?: string;

    academicYearStartMonth?: number;

    invoicePrefix?: string;
    invoiceNextNumber?: number;

    receiptPrefix?: string;
    receiptNextNumber?: number;
}

export interface TenantSettingsRepository {
    findByOrganizationId(
        organizationId: string,
    ): Promise<TenantSettings | null>;

    create(
        organizationId: string,
        input: UpsertTenantSettingsInput,
    ): Promise<TenantSettings>;

    update(
        organizationId: string,
        input: UpsertTenantSettingsInput,
    ): Promise<TenantSettings | null>;
}

export const TENANT_SETTINGS_REPOSITORY =
    Symbol('TENANT_SETTINGS_REPOSITORY');