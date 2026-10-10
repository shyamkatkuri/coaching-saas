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
import { AppCacheService } from '../../../core/redis/cache/app-cache.service';
import { CacheKeyFactory } from '../../../core/redis/cache/cache-key.factory';

@Injectable()
export class CourseApplicationService {

    constructor(
        @Inject(
            COURSE_REPOSITORY,
        )
        private readonly courses: CourseRepository,

        private readonly cache: AppCacheService,

        private readonly cacheKeys: CacheKeyFactory,
    ) { }

    findAll(
        organizationId: string,
    ) {

        const key =
            this.cacheKeys
                .courses(
                    organizationId,
                );

        return this.cache
            .getOrSet(
                key,

                () =>
                    this.courses
                        .findAll(
                            organizationId,
                        ),

                /*
                 * Courses do not change
                 * frequently.
                 */
                120,
            );
    }

    async findById(organizationId: string, courseId: string,) {

        const key = this.cacheKeys.course(organizationId, courseId,);
        const course = await this.cache.getOrSet(key, () => this.courses.findById(organizationId, courseId), 120);
        if (!course) {
            throw new NotFoundException('Course not found',);
        }

        return course;
    }

    async create(
        organizationId: string,
        data:
            Omit<
                CreateCourseData,
                'organizationId'
            >,
    ) {

        const course =
            await this.courses
                .create({
                    organizationId,
                    ...data,
                });

        await this.cache
            .invalidate(
                this.cacheKeys
                    .courses(
                        organizationId,
                    ),
            );

        return course;
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

        await this.cache.invalidate(this.cacheKeys.courses(organizationId), this.cacheKeys.course(organizationId, courseId));

        return course;
    }
}