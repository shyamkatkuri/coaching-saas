import { Tenant } from '../models/tenant.model';

export interface CreateTenantInput {
    name: string;
    slug: string;
    code: string;

    status: Tenant['status'];

    timezone: string;
    currency: string;
    country: string;
}

export interface UpdateTenantInput {
    name?: string;
    slug?: string;
    status?: Tenant['status'];
    timezone?: string;
    currency?: string;
    country?: string;
}

export interface TenantRepository {
    findAll(): Promise<Tenant[]>;

    findById(
        id: string,
    ): Promise<Tenant | null>;

    findBySlug(
        slug: string,
    ): Promise<Tenant | null>;

    findByCode(
        code: string,
    ): Promise<Tenant | null>;

    create(
        input: CreateTenantInput,
    ): Promise<Tenant>;

    update(
        id: string,
        input: UpdateTenantInput,
    ): Promise<Tenant | null>;
}

export const TENANT_REPOSITORY =
    Symbol('TENANT_REPOSITORY');