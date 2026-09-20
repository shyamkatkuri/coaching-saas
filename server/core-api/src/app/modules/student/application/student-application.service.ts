import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    STUDENT_REPOSITORY,
} from '../domain/repositories/student.repository';

import type {
    StudentRepository,
} from '../domain/repositories/student.repository';

import type {
    CreateStudentDto,
} from '../presentation/dto/create-student.dto';

import type {
    UpdateStudentDto,
} from '../presentation/dto/update-student.dto';

@Injectable()
export class StudentApplicationService {

    constructor(
        @Inject(
            STUDENT_REPOSITORY,
        )
        private readonly students:
            StudentRepository,
    ) { }

    findAll(
        organizationId: string,
        branchId: string,
    ) {

        return this.students.findAll(
            organizationId,
            branchId,
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
        studentId: string,
    ) {

        const student =
            await this.students.findById(
                organizationId,
                branchId,
                studentId,
            );

        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
        }

        return student;
    }

    create(
        organizationId: string,
        branchId: string,
        dto: CreateStudentDto,
    ) {

        return this.students.create({
            organizationId,
            branchId,
            ...dto,
        });
    }

    async update(
        organizationId: string,
        branchId: string,
        studentId: string,
        dto: UpdateStudentDto,
    ) {

        const student =
            await this.students.update(
                organizationId,
                branchId,
                studentId,
                dto,
            );

        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
        }

        return student;
    }
}