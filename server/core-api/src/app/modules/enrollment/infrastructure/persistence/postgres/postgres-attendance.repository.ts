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
    AttendanceRecord,
    AttendanceSession,
} from '../../../domain/models/attendance.model';

import type {
    AttendanceRepository,
    CreateAttendanceSessionData,
    MarkAttendanceData,
} from '../../../domain/repositories/attendance.repository';
import { INTEGRATION_EVENT_TYPES, INTEGRATION_TOPICS } from '../../../../../../../../../packages/contracts/dist/events/integration-event.contract';
import { OutboxEventFactory } from '../../../../../core/messaging/outbox/outbox-event.factory';
import { OutboxWriterService } from '../../../../../core/messaging/outbox/outbox-writer.service';

@Injectable()
export class PostgresAttendanceRepository
    implements AttendanceRepository {

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

    async createSession(
        data:
            CreateAttendanceSessionData,
    ): Promise<
        AttendanceSession
    > {

        const result =
            await this.db.query(
                `
        INSERT INTO attendance_sessions (
          organization_id,
          branch_id,
          batch_id,
          session_date,
          start_time,
          end_time,
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
          'OPEN',
          $7
        )
        RETURNING
          id,
          organization_id,
          branch_id,
          batch_id,
          session_date,
          start_time,
          end_time,
          status,
          created_by,
          created_at,
          updated_at
        `,
                [
                    data.organizationId,
                    data.branchId,
                    data.batchId,
                    data.sessionDate,
                    data.startTime,
                    data.endTime,
                    data.createdBy ??
                    null,
                ],
            );

        return this.mapSession(
            result.rows[0],
        );
    }

    async getSession(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ): Promise<
        AttendanceSession | null
    > {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          batch_id,
          session_date,
          start_time,
          end_time,
          status,
          created_by,
          created_at,
          updated_at
        FROM attendance_sessions
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        LIMIT 1
        `,
                [
                    sessionId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            result.rowCount === 0
        ) {
            return null;
        }

        return this.mapSession(
            result.rows[0],
        );
    }

    async mark(
        data:
            MarkAttendanceData,
    ): Promise<
        AttendanceRecord
    > {

        const client =
            await this.db.connect();

        const result =
            await this.db.query(
                `
        INSERT INTO attendance_records (
          session_id,
          enrollment_id,
          student_id,
          status,
          remarks,
          marked_by
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )

        ON CONFLICT (
          session_id,
          enrollment_id
        )

        DO UPDATE SET
          status =
            EXCLUDED.status,

          remarks =
            EXCLUDED.remarks,

          marked_by =
            EXCLUDED.marked_by,

          updated_at =
            NOW()

        RETURNING
          id,
          session_id,
          enrollment_id,
          student_id,
          status,
          remarks,
          marked_by,
          created_at,
          updated_at
        `,
                [
                    data.sessionId,
                    data.enrollmentId,
                    data.studentId,
                    data.status,
                    data.remarks ??
                    null,
                    data.markedBy ??
                    null,
                ],
            );

        const record = this.mapRecord(
            result.rows[0],
        );

        const event =
            this.eventFactory.create({

                topic:
                    INTEGRATION_TOPICS
                        .ATTENDANCE,

                eventType:
                    INTEGRATION_EVENT_TYPES
                        .ATTENDANCE_MARKED,

                aggregateType:
                    'AttendanceRecord',

                aggregateId:
                    record.id,

                organizationId:
                    data.organizationId,

                branchId:
                    data.branchId,

                actorUserId:
                    data.markedBy ??
                    null,

                data: {

                    attendanceRecordId:
                        record.id,

                    sessionId:
                        data.sessionId,

                    enrollmentId:
                        data.enrollmentId,

                    studentId:
                        data.studentId,

                    status:
                        data.status,
                },
            });

        await this.outbox.write(client, event,);

        await client.query('COMMIT',);

        return record;
    }

    async getRecords(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ): Promise<
        AttendanceRecord[]
    > {

        const result =
            await this.db.query(
                `
        SELECT
          ar.id,
          ar.session_id,
          ar.enrollment_id,
          ar.student_id,
          ar.status,
          ar.remarks,
          ar.marked_by,
          ar.created_at,
          ar.updated_at

        FROM attendance_records ar

        JOIN attendance_sessions s
          ON s.id =
             ar.session_id

        WHERE ar.session_id = $1
          AND s.organization_id = $2
          AND s.branch_id = $3

        ORDER BY
          ar.created_at
        `,
                [
                    sessionId,
                    organizationId,
                    branchId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRecord(row),
        );
    }

    private mapSession(
        row: any,
    ): AttendanceSession {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            batchId:
                row.batch_id,

            sessionDate:
                row.session_date,

            startTime:
                row.start_time,

            endTime:
                row.end_time,

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

    private mapRecord(
        row: any,
    ): AttendanceRecord {

        return {
            id:
                row.id,

            sessionId:
                row.session_id,

            enrollmentId:
                row.enrollment_id,

            studentId:
                row.student_id,

            status:
                row.status,

            remarks:
                row.remarks,

            markedBy:
                row.marked_by,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}