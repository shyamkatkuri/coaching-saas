import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ATTENDANCE_REPOSITORY } from "../domain/repositories/attendance.repository";
import type { AttendanceRepository } from "../domain/repositories/attendance.repository";
import { ENROLLMENT_REPOSITORY, } from "../domain/repositories/enrollment.repository";
import type { EnrollmentRepository, } from "../domain/repositories/enrollment.repository";
import { BatchLookupService } from "../../batch/application/batch-lookup.service";
import { CreateAttendanceSessionDto } from "../presentation/dto/create-attendance-session.dto";
import { MarkAttendanceDto } from "../presentation/dto/mark-attendance.dto";

@Injectable()
export class AttendanceApplicationService {

    constructor(
        @Inject(
            ATTENDANCE_REPOSITORY,
        )
        private readonly attendance:
            AttendanceRepository,

        @Inject(
            ENROLLMENT_REPOSITORY,
        )
        private readonly enrollments:
            EnrollmentRepository,

        private readonly batches:
            BatchLookupService,
    ) { }

    async createSession(
        organizationId: string,
        branchId: string,
        dto:
            CreateAttendanceSessionDto,
        applicationUserId?: string,
    ) {

        await this.batches
            .getForEnrollment(
                organizationId,
                branchId,
                dto.batchId,
            );

        return this.attendance
            .createSession({
                organizationId,
                branchId,

                ...dto,

                createdBy:
                    applicationUserId,
            });
    }

    async mark(
        organizationId: string,
        branchId: string,
        sessionId: string,
        dto: MarkAttendanceDto,
        applicationUserId?: string,
    ) {

        const session =
            await this.attendance
                .getSession(
                    organizationId,
                    branchId,
                    sessionId,
                );

        if (!session) {
            throw new NotFoundException(
                'Attendance session not found',
            );
        }

        const enrollment =
            await this.enrollments
                .findById(
                    organizationId,
                    branchId,
                    dto.enrollmentId,
                );

        if (
            !enrollment ||
            enrollment.status !==
            'ACTIVE' ||
            enrollment.batchId !==
            session.batchId
        ) {
            throw new NotFoundException(
                'Active batch enrollment not found',
            );
        }

        return this.attendance.mark({
            organizationId,
            branchId,

            sessionId,

            enrollmentId:
                enrollment.id,

            studentId:
                enrollment.studentId,

            status:
                dto.status,

            remarks:
                dto.remarks,

            markedBy:
                applicationUserId,
        });
    }

    async getRecords(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ) {

        const session =
            await this.attendance
                .getSession(
                    organizationId,
                    branchId,
                    sessionId,
                );

        if (!session) {
            throw new NotFoundException(
                'Attendance session not found',
            );
        }

        return this.attendance
            .getRecords(
                organizationId,
                branchId,
                sessionId,
            );
    }
}