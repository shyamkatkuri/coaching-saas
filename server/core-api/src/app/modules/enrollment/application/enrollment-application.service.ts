import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    StudentLookupService,
} from '../../student/application/student-lookup.service';

import {
    BatchLookupService,
} from '../../batch/application/batch-lookup.service';

import {
    ENROLLMENT_REPOSITORY,
} from '../domain/repositories/enrollment.repository';

import type {
    EnrollmentRepository,
} from '../domain/repositories/enrollment.repository';

import type {
    CreateEnrollmentDto,
} from '../presentation/dto/create-enrollment.dto';

@Injectable()
export class EnrollmentApplicationService {

    constructor(
        @Inject(
            ENROLLMENT_REPOSITORY,
        )
        private readonly enrollments:
            EnrollmentRepository,

        private readonly students:
            StudentLookupService,

        private readonly batches:
            BatchLookupService,
    ) { }

    async create(
        organizationId: string,
        branchId: string,
        dto: CreateEnrollmentDto,
        applicationUserId?: string,
    ) {

        await this.students
            .ensureExists(
                organizationId,
                branchId,
                dto.studentId,
            );

        const batch =
            await this.batches
                .getForEnrollment(
                    organizationId,
                    branchId,
                    dto.batchId,
                );

        const currentCount =
            await this.enrollments
                .countActiveByBatch(
                    organizationId,
                    branchId,
                    dto.batchId,
                );

        if (
            currentCount >=
            batch.capacity
        ) {
            throw new ConflictException(
                'Batch capacity has been reached',
            );
        }

        try {

            return await this.enrollments
                .create({
                    organizationId,
                    branchId,

                    studentId:
                        dto.studentId,

                    courseId:
                        batch.courseId,

                    batchId:
                        batch.id,

                    grossFee:
                        dto.grossFee,

                    discountAmount:
                        dto.discountAmount ?? 0,

                    createdBy:
                        applicationUserId,
                });

        } catch (error: any) {

            if (
                error?.code ===
                '23505'
            ) {
                throw new ConflictException(
                    'Student is already actively enrolled in this batch',
                );
            }

            throw error;
        }
    }

    findByStudent(
        organizationId: string,
        branchId: string,
        studentId: string,
    ) {

        return this.enrollments
            .findByStudent(
                organizationId,
                branchId,
                studentId,
            );
    }

    findByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ) {

        return this.enrollments
            .findByBatch(
                organizationId,
                branchId,
                batchId,
            );
    }

    async cancel(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ) {

        const enrollment =
            await this.enrollments
                .cancel(
                    organizationId,
                    branchId,
                    enrollmentId,
                );

        if (!enrollment) {
            throw new NotFoundException(
                'Active enrollment not found',
            );
        }

        return enrollment;
    }
}