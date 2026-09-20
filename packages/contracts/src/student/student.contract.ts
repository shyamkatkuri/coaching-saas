export type StudentStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED';

export interface StudentResponse {
    id: string;

    organizationId: string;
    branchId: string;

    firstName: string;
    lastName: string | null;

    email: string | null;
    phone: string | null;

    status: StudentStatus;

    createdAt: string;
    updatedAt: string;
}

export interface CreateStudentRequest {
    firstName: string;
    lastName?: string;

    email?: string;
    phone?: string;
}

export interface UpdateStudentRequest {
    firstName?: string;
    lastName?: string;

    email?: string;
    phone?: string;

    status?: StudentStatus;
}