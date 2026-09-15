export type TenantStatus =
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'TRIAL'
    | 'CANCELLED';

export interface Tenant {
    id: string;

    name: string;
    slug: string;
    code: string;

    status: TenantStatus;

    timezone: string;
    currency: string;
    country: string;

    createdAt: Date;
    updatedAt: Date;
}