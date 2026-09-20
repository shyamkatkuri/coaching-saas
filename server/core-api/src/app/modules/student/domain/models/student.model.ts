export type StudentStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED';

export interface Student {
    id: string;

    organizationId: string;
    branchId: string;

    firstName: string;
    lastName: string | null;

    email: string | null;
    phone: string | null;

    status: StudentStatus;

    createdAt: Date;
    updatedAt: Date;
}