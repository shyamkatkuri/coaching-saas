import {
    Module,
} from '@nestjs/common';

import {
    StudentModule,
} from '../student/student.module';

import {
    BatchModule,
} from '../batch/batch.module';

import {
    EnrollmentApplicationService,
} from './application/enrollment-application.service';

import {
    AttendanceApplicationService,
} from './application/attendance-application.service';

import {
    FeeApplicationService,
} from './application/fee-application.service';

import {
    ENROLLMENT_REPOSITORY,
} from './domain/repositories/enrollment.repository';

import {
    ATTENDANCE_REPOSITORY,
} from './domain/repositories/attendance.repository';

import {
    FEE_REPOSITORY,
} from './domain/repositories/fee.repository';

import {
    PostgresEnrollmentRepository,
} from './infrastructure/persistence/postgres/postgres-enrollment.repository';

import {
    PostgresAttendanceRepository,
} from './infrastructure/persistence/postgres/postgres-attendance.repository';

import {
    PostgresFeeRepository,
} from './infrastructure/persistence/postgres/postgres-fee.repository';

import {
    EnrollmentController,
} from './presentation/controllers/enrollment.controller';

import {
    AttendanceController,
} from './presentation/controllers/attendance.controller';

import {
    FeeController,
} from './presentation/controllers/fee.controller';

@Module({
    imports: [
        StudentModule,
        BatchModule,
    ],

    controllers: [
        EnrollmentController,
        AttendanceController,
        FeeController,
    ],

    providers: [
        EnrollmentApplicationService,
        AttendanceApplicationService,
        FeeApplicationService,

        PostgresEnrollmentRepository,
        PostgresAttendanceRepository,
        PostgresFeeRepository,

        {
            provide:
                ENROLLMENT_REPOSITORY,

            useExisting:
                PostgresEnrollmentRepository,
        },

        {
            provide:
                ATTENDANCE_REPOSITORY,

            useExisting:
                PostgresAttendanceRepository,
        },

        {
            provide:
                FEE_REPOSITORY,

            useExisting:
                PostgresFeeRepository,
        },
    ],
})
export class EnrollmentModule { }