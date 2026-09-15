export type BranchStatus =
    | 'ACTIVE'
    | 'INACTIVE';

export interface Branch {
    id: string;

    organizationId: string;

    name: string;
    code: string;

    addressLine1: string | null;
    addressLine2: string | null;

    city: string | null;
    state: string | null;
    postalCode: string | null;

    country: string | null;

    phone: string | null;
    email: string | null;

    status: BranchStatus;

    createdAt: Date;
    updatedAt: Date;
}