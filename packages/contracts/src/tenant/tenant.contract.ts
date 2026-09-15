export type TenantStatus =
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'TRIAL'
    | 'CANCELLED';

export interface TenantResponse {
    id: string;
    name: string;
    slug: string;
    code: string;
    status: TenantStatus;
    timezone: string;
    currency: string;
    country: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTenantRequest {
    name: string;
    slug: string;
    code: string;
    timezone?: string;
    currency?: string;
    country?: string;
}

export interface UpdateTenantRequest {
    name?: string;
    slug?: string;
    timezone?: string;
    currency?: string;
    country?: string;
    status?: TenantStatus;
}