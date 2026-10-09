import type {
    Enrollment,
} from '../models/enrollment.model';

export const ENROLLMENT_REPOSITORY =
    Symbol(
        'ENROLLMENT_REPOSITORY',
    );

export interface CreateEnrollmentData {
    organizationId: string;
    branchId: string;

    studentId: string;

    courseId: string;
    batchId: string;

    grossFee: number;
    discountAmount: number;

    createdBy?: string;
}

export interface EnrollmentRepository {

    findById(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<Enrollment | null>;

    findByStudent(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): Promise<Enrollment[]>;

    findByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<Enrollment[]>;

    countActiveByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<number>;

    create(
        data: CreateEnrollmentData,
    ): Promise<Enrollment>;

    cancel(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<Enrollment | null>;
}