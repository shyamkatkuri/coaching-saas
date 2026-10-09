export type EnrollmentStatus =
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';

export interface Enrollment {
    id: string;

    organizationId: string;
    branchId: string;

    studentId: string;

    courseId: string;
    batchId: string;

    enrollmentNumber: string;

    enrollmentDate: string;

    status: EnrollmentStatus;

    createdBy: string | null;

    createdAt: Date;
    updatedAt: Date;
}