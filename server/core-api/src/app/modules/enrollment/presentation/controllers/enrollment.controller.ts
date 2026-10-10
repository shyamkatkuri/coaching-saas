import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';



import {
    EnrollmentApplicationService,
} from '../../application/enrollment-application.service';

import {
    CreateEnrollmentDto,
} from '../dto/create-enrollment.dto';
import type { AuthenticatedRequest } from '../../../../core/security/authentication/jwt-auth.guard';
import { RateLimit } from '../../../../core/redis/rate-limit/rate-limit.decorator';

@Controller(
    'organizations/:organizationId/branches/:branchId/enrollments',
)
export class EnrollmentController {

    constructor(
        private readonly service:
            EnrollmentApplicationService,
    ) { }

    @Post()

    @RateLimit({
        limit:
            20,

        windowMs:
            60_000,

        scope:
            'USER',

        failClosed:
            true,
    })

    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'enrollment:create',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    create(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Body()
        dto: CreateEnrollmentDto,

        @Req()
        request:
            AuthenticatedRequest,
    ) {

        return this.service.create(
            organizationId,
            branchId,
            dto,
            request.applicationUserId,
        );
    }

    @Get('student/:studentId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'enrollment:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    byStudent(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('studentId')
        studentId: string,
    ) {

        return this.service
            .findByStudent(
                organizationId,
                branchId,
                studentId,
            );
    }

    @Get('batch/:batchId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'enrollment:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    byBatch(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('batchId')
        batchId: string,
    ) {

        return this.service
            .findByBatch(
                organizationId,
                branchId,
                batchId,
            );
    }

    @Patch(':enrollmentId/cancel')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'enrollment:cancel',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    cancel(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('enrollmentId')
        enrollmentId: string,
    ) {

        return this.service.cancel(
            organizationId,
            branchId,
            enrollmentId,
        );
    }
}