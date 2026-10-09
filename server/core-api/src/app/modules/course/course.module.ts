import {
    Module,
} from '@nestjs/common';

import {
    CourseApplicationService,
} from './application/course-application.service';

import {
    CourseLookupService,
} from './application/course-lookup.service';

import {
    COURSE_REPOSITORY,
} from './domain/repositories/course.repository';

import {
    PostgresCourseRepository,
} from './infrastructure/persistence/postgres/postgres-course.repository';

import {
    CourseController,
} from './presentation/controllers/course.controller';

@Module({
    controllers: [
        CourseController,
    ],

    providers: [
        CourseApplicationService,
        CourseLookupService,

        PostgresCourseRepository,

        {
            provide:
                COURSE_REPOSITORY,

            useExisting:
                PostgresCourseRepository,
        },
    ],

    exports: [
        CourseLookupService,
    ],
})
export class CourseModule { }