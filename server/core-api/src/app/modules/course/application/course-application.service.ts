import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    COURSE_REPOSITORY,
} from '../domain/repositories/course.repository';

import type {
    CourseRepository,
    CreateCourseData,
    UpdateCourseData,
} from '../domain/repositories/course.repository';

@Injectable()
export class CourseApplicationService {

    constructor(
        @Inject(
            COURSE_REPOSITORY,
        )
        private readonly courses:
            CourseRepository,
    ) { }

    findAll(
        organizationId: string,
    ) {

        return this.courses.findAll(
            organizationId,
        );
    }

    async findById(
        organizationId: string,
        courseId: string,
    ) {

        const course =
            await this.courses.findById(
                organizationId,
                courseId,
            );

        if (!course) {
            throw new NotFoundException(
                'Course not found',
            );
        }

        return course;
    }

    create(
        organizationId: string,
        data:
            Omit<
                CreateCourseData,
                'organizationId'
            >,
    ) {

        return this.courses.create({
            organizationId,
            ...data,
        });
    }

    async update(
        organizationId: string,
        courseId: string,
        data: UpdateCourseData,
    ) {

        const course =
            await this.courses.update(
                organizationId,
                courseId,
                data,
            );

        if (!course) {
            throw new NotFoundException(
                'Course not found',
            );
        }

        return course;
    }
}