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

@Injectable()
export class StudentLookupService {

    constructor(
        @Inject(
            STUDENT_REPOSITORY,
        )
        private readonly students:
            StudentRepository,
    ) { }

    async ensureExists(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): Promise<void> {

        const student =
            await this.students.findById(
                organizationId,
                branchId,
                studentId,
            );

        if (
            !student ||
            student.status !== 'ACTIVE'
        ) {
            throw new NotFoundException(
                'Student not found',
            );
        }
    }
}