import type {
    Student,
    StudentStatus,
} from '../models/student.model';

export const STUDENT_REPOSITORY =
    Symbol(
        'STUDENT_REPOSITORY',
    );

export interface CreateStudentData {
    organizationId: string;
    branchId: string;

    firstName: string;
    lastName?: string;

    email?: string;
    phone?: string;
}

export interface UpdateStudentData {
    firstName?: string;
    lastName?: string;

    email?: string;
    phone?: string;

    status?: StudentStatus;
}

export interface StudentRepository {

    findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Student[]>;

    findById(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): Promise<Student | null>;

    create(
        data: CreateStudentData,
    ): Promise<Student>;

    update(
        organizationId: string,
        branchId: string,
        studentId: string,
        data: UpdateStudentData,
    ): Promise<Student | null>;
}