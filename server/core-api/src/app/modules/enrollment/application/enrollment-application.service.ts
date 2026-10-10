import {
    BadRequestException,
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
import { DistributedLockService } from '../../../core/redis/lock/distributed-lock.service';
import { CacheKeyFactory } from '../../../core/redis/cache/cache-key.factory';

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

        private readonly locks:
            DistributedLockService,

        private readonly cacheKeys:
            CacheKeyFactory,
    ) { }

    async create(
        organizationId: string,
        branchId: string,
        dto: CreateEnrollmentDto,
        applicationUserId?: string,
    ) {

        if (
            (
                dto.discountAmount ??
                0
            ) >
            dto.grossFee
        ) {

            throw new BadRequestException(
                'Discount cannot exceed gross fee',
            );
        }

        /*
         * Cross-database validation
         * can happen before taking
         * the capacity lock.
         */

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

        const lockKey =
            this.cacheKeys
                .enrollmentCapacityLock(
                    organizationId,
                    branchId,
                    dto.batchId,
                );

        return this.locks
            .withLock(
                lockKey,

                async () => {

                    /*
                     * CRITICAL:
                     *
                     * Count must happen
                     * AFTER acquiring lock.
                     */

                    const activeCount =
                        await this.enrollments
                            .countActiveByBatch(
                                organizationId,
                                branchId,
                                dto.batchId,
                            );

                    if (
                        activeCount >=
                        batch.capacity
                    ) {

                        throw new ConflictException(
                            'Batch capacity has been reached',
                        );
                    }

                    try {

                        return await this
                            .enrollments
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
                                    dto
                                        .discountAmount ??
                                    0,

                                createdBy:
                                    applicationUserId,
                            });

                    } catch (
                    error: any
                    ) {

                        if (
                            error?.code ===
                            '23505'
                        ) {

                            throw new ConflictException(
                                'Student is already actively enrolled in this batch',
                            );
                        }

                        if (
                            error?.message ===
                            'DISCOUNT_EXCEEDS_GROSS_FEE'
                        ) {

                            throw new BadRequestException(
                                'Discount cannot exceed gross fee',
                            );
                        }

                        throw error;
                    }
                },

                {
                    ttlMs:
                        10_000,

                    waitMs:
                        3_000,
                },
            );
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