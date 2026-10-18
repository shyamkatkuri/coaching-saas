import {
    Args,
    Context,
    ID,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import type {
    AuthenticatedRequest,
} from '../../core/security/authentication/jwt-auth.guard';

import {
    AttendanceApplicationService,
} from '../../modules/enrollment/application/attendance-application.service';

import {
    CreateAttendanceSessionInput,
} from '../inputs/create-attendance-session.input';

import {
    MarkAttendanceInput,
} from '../inputs/mark-attendance.input';

import {
    AttendanceRecordType,
    AttendanceSessionType,
} from '../types/attendance.type';

@Resolver()
export class AttendanceResolver {

    constructor(
        private readonly attendance:
            AttendanceApplicationService,
    ) { }

    @Query(
        () => [
            AttendanceRecordType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'attendance:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    attendanceRecords(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args(
            'sessionId',
            {
                type:
                    () => ID,
            },
        )
        sessionId:
            string,
    ) {

        return this.attendance
            .getRecords(
                organizationId,
                branchId,
                sessionId,
            );
    }

    @Mutation(
        () =>
            AttendanceSessionType,
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'attendance:mark',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    createAttendanceSession(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args('input')
        input:
            CreateAttendanceSessionInput,

        @Context('req')
        request:
            AuthenticatedRequest,
    ) {

        return this.attendance
            .createSession(
                organizationId,
                branchId,
                input,
                request
                    .applicationUserId,
            );
    }

    @Mutation(
        () =>
            AttendanceRecordType,
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'attendance:mark',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    markAttendance(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args(
            'sessionId',
            {
                type:
                    () => ID,
            },
        )
        sessionId:
            string,

        @Args('input')
        input:
            MarkAttendanceInput,

        @Context('req')
        request:
            AuthenticatedRequest,
    ) {

        return this.attendance
            .mark(
                organizationId,
                branchId,
                sessionId,
                input,
                request
                    .applicationUserId,
            );
    }
}