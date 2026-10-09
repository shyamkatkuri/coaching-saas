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
    CourseApplicationService,
} from '../../application/course-application.service';

import {
    CreateCourseDto,
} from '../dto/create-course.dto';

import {
    UpdateCourseDto,
} from '../dto/update-course.dto';

@Controller(
    'organizations/:organizationId/courses',
)
export class CourseController {

    constructor(
        private readonly service:
            CourseApplicationService,
    ) { }

    @Get()
    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'course:read',
        ],

        tenantParam:
            'organizationId',
    })
    findAll(
        @Param('organizationId')
        organizationId: string,
    ) {

        return this.service.findAll(
            organizationId,
        );
    }

    @Get(':courseId')
    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'course:read',
        ],

        tenantParam:
            'organizationId',
    })
    findById(
        @Param('organizationId')
        organizationId: string,

        @Param('courseId')
        courseId: string,
    ) {

        return this.service.findById(
            organizationId,
            courseId,
        );
    }

    @Post()
    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'course:create',
        ],

        tenantParam:
            'organizationId',
    })
    create(
        @Param('organizationId')
        organizationId: string,

        @Body()
        dto: CreateCourseDto,
    ) {

        return this.service.create(
            organizationId,
            dto,
        );
    }

    @Patch(':courseId')
    @RequireAccess({
        scope: 'TENANT',

        permissions: [
            'course:update',
        ],

        tenantParam:
            'organizationId',
    })
    update(
        @Param('organizationId')
        organizationId: string,

        @Param('courseId')
        courseId: string,

        @Body()
        dto: UpdateCourseDto,
    ) {

        return this.service.update(
            organizationId,
            courseId,
            dto,
        );
    }
}