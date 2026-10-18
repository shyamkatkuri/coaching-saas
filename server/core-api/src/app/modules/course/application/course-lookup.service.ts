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
} from '../domain/repositories/course.repository';

@Injectable()
export class CourseLookupService {

    constructor(
        @Inject(
            COURSE_REPOSITORY,
        )
        private readonly courses:
            CourseRepository,
    ) { }

    async ensureExists(
        organizationId: string,
        courseId: string,
    ): Promise<void> {

        const course =
            await this.courses.findById(
                organizationId,
                courseId,
            );

        if (
            !course ||
            course.status !== 'ACTIVE'
        ) {
            throw new NotFoundException(
                'Course not found',
            );
        }
    }

    findMany(
        organizationId: string,
        courseIds: string[],
    ) {

        return this.courses
            .findByIds(
                organizationId,
                courseIds,
            );
    }
}