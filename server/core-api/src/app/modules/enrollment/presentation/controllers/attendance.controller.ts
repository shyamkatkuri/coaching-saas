import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
} from '@nestjs/common';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';



import {
    AttendanceApplicationService,
} from '../../application/attendance-application.service';

import {
    CreateAttendanceSessionDto,
} from '../dto/create-attendance-session.dto';

import {
    MarkAttendanceDto,
} from '../dto/mark-attendance.dto';
import * as jwtAuthGuard from '../../../../core/security/authentication/jwt-auth.guard';

@Controller(
    'organizations/:organizationId/branches/:branchId/attendance',
)
export class AttendanceController {

    constructor(
        private readonly service:
            AttendanceApplicationService,
    ) { }

    @Post('sessions')
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
    createSession(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Body()
        dto:
            CreateAttendanceSessionDto,

        @Req()
        request:
            jwtAuthGuard.AuthenticatedRequest,
    ) {

        return this.service
            .createSession(
                organizationId,
                branchId,
                dto,
                request
                    .applicationUserId,
            );
    }

    @Put(
        'sessions/:sessionId/records',
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
    mark(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Param(
            'sessionId',
        )
        sessionId: string,

        @Body()
        dto:
            MarkAttendanceDto,

        @Req()
        request:
            jwtAuthGuard.AuthenticatedRequest,
    ) {

        return this.service.mark(
            organizationId,
            branchId,
            sessionId,
            dto,
            request
                .applicationUserId,
        );
    }

    @Get(
        'sessions/:sessionId/records',
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
    records(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Param(
            'sessionId',
        )
        sessionId: string,
    ) {

        return this.service.getRecords(
            organizationId,
            branchId,
            sessionId,
        );
    }
}