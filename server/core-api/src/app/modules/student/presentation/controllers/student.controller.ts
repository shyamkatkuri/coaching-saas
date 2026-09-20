import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';

import {
    StudentApplicationService,
} from '../../application/student-application.service';

import {
    CreateStudentDto,
} from '../dto/create-student.dto';

import {
    UpdateStudentDto,
} from '../dto/update-student.dto';

@Controller(
    'organizations/:organizationId/branches/:branchId/students',
)
export class StudentController {

    constructor(
        private readonly service:
            StudentApplicationService,
    ) { }

    @Get()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'student:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    findAll(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,
    ) {

        return this.service.findAll(
            organizationId,
            branchId,
        );
    }

    @Get(':studentId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'student:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    findById(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('studentId')
        studentId: string,
    ) {

        return this.service.findById(
            organizationId,
            branchId,
            studentId,
        );
    }

    @Post()
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'student:create',
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
        dto: CreateStudentDto,
    ) {

        return this.service.create(
            organizationId,
            branchId,
            dto,
        );
    }

    @Patch(':studentId')
    @RequireAccess({
        scope: 'BRANCH',

        permissions: [
            'student:update',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    update(
        @Param('organizationId')
        organizationId: string,

        @Param('branchId')
        branchId: string,

        @Param('studentId')
        studentId: string,

        @Body()
        dto: UpdateStudentDto,
    ) {

        return this.service.update(
            organizationId,
            branchId,
            studentId,
            dto,
        );
    }
}