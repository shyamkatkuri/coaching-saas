import {
    Args,
    ID,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import {
    CourseApplicationService,
} from '../../modules/course/application/course-application.service';

import {
    CreateCourseInput,
} from '../inputs/create-course.input';

import {
    CourseType,
} from '../types/course.type';
import { CreateCourseDto } from '../../modules/course/presentation/dto/create-course.dto';

@Resolver(
    () =>
        CourseType,
)
export class CourseResolver {

    constructor(
        private readonly courses:
            CourseApplicationService,
    ) { }

    @Query(
        () => [
            CourseType,
        ],
    )
    @RequireAccess({
        scope:
            'TENANT',

        permissions: [
            'course:read',
        ],

        tenantParam:
            'organizationId',
    })
    async coursesByOrganization(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,
    ) {

        const rows = await this.courses
            .findAll(
                organizationId,
            );
        return rows.map((row) => ({
            ...row,
            code: row.course_code ? row.course_code : '',
        }));
    }

    @Query(
        () =>
            CourseType,
    )
    @RequireAccess({
        scope:
            'TENANT',

        permissions: [
            'course:read',
        ],

        tenantParam:
            'organizationId',
    })
    course(
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
            'courseId',
            {
                type:
                    () => ID,
            },
        )
        courseId:
            string,
    ) {

        return this.courses
            .findById(
                organizationId,
                courseId,
            );
    }

    @Mutation(
        () =>
            CourseType,
    )
    @RequireAccess({
        scope:
            'TENANT',

        permissions: [
            'course:create',
        ],

        tenantParam:
            'organizationId',
    })
    createCourse(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args('input')
        input:
            CreateCourseInput,
    ) {

        return this.courses
            .create(
                organizationId,
                input,
            );
    }
}