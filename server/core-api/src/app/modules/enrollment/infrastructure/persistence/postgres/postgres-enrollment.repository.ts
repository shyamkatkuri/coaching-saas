import {
    Injectable,
} from '@nestjs/common';

import {
    DATABASES,
} from '../../../../../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../../../../../core/database/database-registry.service';

import type {
    Enrollment,
} from '../../../domain/models/enrollment.model';

import type {
    CreateEnrollmentData,
    EnrollmentRepository,
} from '../../../domain/repositories/enrollment.repository';
import {
    randomUUID,
} from 'node:crypto';
import { OutboxWriterService } from '../../../../../core/messaging/outbox/outbox-writer.service';
import { OutboxEventFactory } from '../../../../../core/messaging/outbox/outbox-event.factory';
import {
    INTEGRATION_EVENT_TYPES,
    INTEGRATION_TOPICS,
} from '@coaching/contracts';

@Injectable()
export class PostgresEnrollmentRepository
    implements EnrollmentRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,

        private readonly outbox:
            OutboxWriterService,

        private readonly eventFactory:
            OutboxEventFactory,
    ) { }

    private get db() {
        return this.databases.getPool(
            DATABASES.ENROLLMENT,
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<Enrollment | null> {

        const result =
            await this.db.query(
                `
    SELECT
      id,
      organization_id,
      branch_id,
      student_id,
      course_id,
      batch_id,
      enrollment_number,
      enrollment_date,
      status,
      created_by,
      created_at,
      updated_at
    FROM enrollments
    WHERE id = $1
      AND organization_id = $2
      AND branch_id = $3
    LIMIT 1
    `,
                [
                    enrollmentId,
                    organizationId,
                    branchId,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    async findByStudent(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): Promise<Enrollment[]> {

        const result =
            await this.db.query(
                `
        SELECT
    id,
    organization_id,
    branch_id,
    student_id,
    course_id,
    batch_id,
    enrollment_number,
    enrollment_date,
    status,
    created_by,
    created_at,
    updated_at
FROM enrollments
WHERE organization_id = $1
AND branch_id = $2
AND student_id = $3
ORDER BY enrollment_date DESC;
        `,
                [
                    organizationId,
                    branchId,
                    studentId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async findByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<Enrollment[]> {

        const result =
            await this.db.query(
                `
       SELECT
    id,
    organization_id,
    branch_id,
    student_id,
    course_id,
    batch_id,
    enrollment_number,
    enrollment_date,
    status,
    created_by,
    created_at,
    updated_at
FROM enrollments
WHERE organization_id = $1
AND branch_id = $2
AND batch_id = $3
ORDER BY enrollment_date DESC;
        `,
                [
                    organizationId,
                    branchId,
                    batchId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async countActiveByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<number> {

        const result =
            await this.db.query(
                `
        SELECT COUNT(*)::int AS count
        FROM enrollments
        WHERE organization_id = $1
          AND branch_id = $2
          AND batch_id = $3
          AND status = 'ACTIVE'
        `,
                [
                    organizationId,
                    branchId,
                    batchId,
                ],
            );

        return Number(
            result.rows[0].count,
        );
    }

    async create(
        data: CreateEnrollmentData,
    ): Promise<Enrollment> {

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            const payableAmount =
                data.grossFee -
                data.discountAmount;

            if (
                payableAmount < 0
            ) {
                throw new Error(
                    'Discount cannot exceed gross fee',
                );
            }

            const enrollmentNumber = this.generateEnrollmentNumber();

            const enrollmentResult =
                await client.query(
                    `
    INSERT INTO enrollments (
      organization_id,
      branch_id,
      student_id,
      course_id,
      batch_id,
      enrollment_number,
      status,
      created_by
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      'ACTIVE',
      $7
    )
    RETURNING *
    `,
                    [
                        data.organizationId,
                        data.branchId,
                        data.studentId,

                        data.courseId,
                        data.batchId,

                        enrollmentNumber,

                        data.createdBy ??
                        null,
                    ],
                );

            const enrollment = enrollmentResult.rows[0];

            await client.query(
                `
        INSERT INTO fee_accounts (
          organization_id,
          branch_id,
          enrollment_id,
          gross_amount,
          discount_amount,
          payable_amount
        )
        VALUES (
          $1,$2,$3,$4,$5,$6
        )
        `,
                [
                    data.organizationId,
                    data.branchId,
                    enrollment.id,
                    data.grossFee,
                    data.discountAmount,
                    payableAmount,
                ],
            );

            if (
                data.grossFee > 0
            ) {

                await client.query(
                    `
          INSERT INTO fee_ledger_entries (
            organization_id,
            branch_id,
            enrollment_id,
            entry_type,
            debit_amount,
            credit_amount,
            description,
            created_by
          )
          VALUES (
            $1,$2,$3,
            'CHARGE',
            $4,
            0,
            'Enrollment fee charge',
            $5
          )
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        enrollment.id,
                        data.grossFee,
                        data.createdBy ?? null,
                    ],
                );
            }

            if (
                data.discountAmount > 0
            ) {

                await client.query(
                    `
          INSERT INTO fee_ledger_entries (
            organization_id,
            branch_id,
            enrollment_id,
            entry_type,
            debit_amount,
            credit_amount,
            description,
            created_by
          )
          VALUES (
            $1,$2,$3,
            'DISCOUNT',
            0,
            $4,
            'Enrollment discount',
            $5
          )
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        enrollment.id,
                        data.discountAmount,
                        data.createdBy ?? null,
                    ],
                );
            }

            const integrationEvent =
                this.eventFactory.create({

                    topic:
                        INTEGRATION_TOPICS
                            .ENROLLMENT,

                    eventType:
                        INTEGRATION_EVENT_TYPES
                            .ENROLLMENT_CREATED,

                    aggregateType:
                        'Enrollment',

                    aggregateId:
                        enrollment.id,

                    organizationId:
                        enrollment.organizationId,

                    branchId:
                        enrollment.branchId,

                    actorUserId:
                        data.createdBy ??
                        null,

                    data: {

                        enrollmentId:
                            enrollment.id,

                        studentId:
                            enrollment.studentId,

                        courseId:
                            enrollment.courseId,

                        batchId:
                            enrollment.batchId,
                    },
                });

            await this.outbox.write(client, integrationEvent,);

            await client.query('COMMIT',);

            return this.mapRow(enrollment);

        } catch (error) {

            await client.query(
                'ROLLBACK',
            );

            throw error;

        } finally {

            client.release();
        }
    }

    async cancel(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<Enrollment | null> {

        //     const result =
        //         await this.db.query(
        //             `
        //   UPDATE enrollments

        //   SET
        //     status =
        //       'CANCELLED',

        //     updated_at =
        //       NOW()

        //   WHERE id = $1
        //     AND organization_id = $2
        //     AND branch_id = $3
        //     AND status = 'ACTIVE'

        //   RETURNING *
        //   `,
        //             [
        //                 enrollmentId,
        //                 organizationId,
        //                 branchId,
        //             ],
        //         );

        //     if (
        //         result.rowCount === 0
        //     ) {
        //         return null;
        //     }

        //     return this.mapRow(
        //         result.rows[0],
        //     );

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            const result =
                await client.query(
                    `
      UPDATE enrollments

      SET
        status =
          'CANCELLED',

        updated_at =
          NOW()

      WHERE id = $1
        AND organization_id = $2
        AND branch_id = $3
        AND status = 'ACTIVE'

      RETURNING *
      `,
                    [
                        enrollmentId,
                        organizationId,
                        branchId,
                    ],
                );

            if (
                result.rowCount === 0
            ) {

                await client.query('ROLLBACK');

                return null;
            }

            const enrollment =
                this.mapRow(
                    result.rows[0],
                );

            const event =
                this.eventFactory.create({

                    topic:
                        INTEGRATION_TOPICS
                            .ENROLLMENT,

                    eventType:
                        INTEGRATION_EVENT_TYPES
                            .ENROLLMENT_CANCELLED,

                    aggregateType:
                        'Enrollment',

                    aggregateId:
                        enrollment.id,

                    organizationId,

                    branchId,

                    data: {

                        enrollmentId:
                            enrollment.id,

                        studentId:
                            enrollment.studentId,

                        batchId:
                            enrollment.batchId,
                    },
                });

            await this.outbox.write(
                client,
                event,
            );

            await client.query(
                'COMMIT',
            );

            return enrollment;

        } catch (error) {

            await client.query(
                'ROLLBACK',
            );

            throw error;

        } finally {

            client.release();
        }

    }

    private mapRow(
        row: any,
    ): Enrollment {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            studentId:
                row.student_id,

            courseId:
                row.course_id,

            batchId:
                row.batch_id,

            enrollmentNumber:
                row.enrollment_number,

            enrollmentDate:
                row.enrollment_date,

            status:
                row.status,

            createdBy:
                row.created_by,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }

    private generateEnrollmentNumber():
        string {

        const today =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10,
                )
                .replace(
                    /-/g,
                    '',
                );

        const randomPart =
            randomUUID()
                .replace(
                    /-/g,
                    '',
                )
                .slice(
                    0,
                    8,
                )
                .toUpperCase();

        return (
            `ENR-${today}-${randomPart}`
        );
    }
}