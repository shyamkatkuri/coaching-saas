import {
    Injectable,
    Scope,
} from '@nestjs/common';

import DataLoader
    from 'dataloader';

import {
    CourseLookupService,
} from '../../modules/course/application/course-lookup.service';

import {
    BatchLookupService,
} from '../../modules/batch/application/batch-lookup.service';

import type {
    Course,
} from '../../modules/course/domain/models/course.model';

import type {
    Batch,
} from '../../modules/batch/domain/models/batch.model';

interface CourseKey {

    organizationId:
    string;

    courseId:
    string;
}

interface BatchKey {

    organizationId:
    string;

    branchId:
    string;

    batchId:
    string;
}

@Injectable({
    scope:
        Scope.REQUEST,
})
export class GraphqlLoadersService {

    constructor(
        private readonly courses:
            CourseLookupService,

        private readonly batches:
            BatchLookupService,
    ) { }

    readonly courseById =
        new DataLoader<
            CourseKey,
            Course | null,
            string
        >(
            async keys => {

                const groups =
                    new Map<
                        string,
                        CourseKey[]
                    >();

                for (
                    const key
                    of keys
                ) {

                    const existing =
                        groups.get(
                            key.organizationId,
                        ) ?? [];

                    existing.push(
                        key,
                    );

                    groups.set(
                        key.organizationId,
                        existing,
                    );
                }

                const resultMap =
                    new Map<
                        string,
                        Course
                    >();

                for (
                    const [
                        organizationId,
                        group,
                    ]
                    of groups
                ) {

                    const courses =
                        await this.courses
                            .findMany(
                                organizationId,

                                [
                                    ...new Set(
                                        group.map(
                                            item =>
                                                item.courseId,
                                        ),
                                    ),
                                ],
                            );

                    for (
                        const course
                        of courses
                    ) {

                        resultMap.set(
                            `${organizationId}:${course.id}`,
                            course,
                        );
                    }
                }

                return keys.map(
                    key =>
                        resultMap.get(
                            `${key.organizationId}:${key.courseId}`,
                        ) ??
                        null,
                );
            },

            {
                cacheKeyFn:
                    key =>
                        `${key.organizationId}:${key.courseId}`,
            },
        );

    readonly batchById =
        new DataLoader<
            BatchKey,
            Batch | null,
            string
        >(
            async keys => {

                const groups =
                    new Map<
                        string,
                        BatchKey[]
                    >();

                for (
                    const key
                    of keys
                ) {

                    const groupKey =
                        `${key.organizationId}:${key.branchId}`;

                    const existing =
                        groups.get(
                            groupKey,
                        ) ?? [];

                    existing.push(
                        key,
                    );

                    groups.set(
                        groupKey,
                        existing,
                    );
                }

                const resultMap =
                    new Map<
                        string,
                        Batch
                    >();

                for (
                    const group
                    of groups.values()
                ) {

                    const first =
                        group[0];

                    const batches =
                        await this.batches
                            .findMany(
                                first.organizationId,
                                first.branchId,

                                [
                                    ...new Set(
                                        group.map(
                                            item =>
                                                item.batchId,
                                        ),
                                    ),
                                ],
                            );

                    for (
                        const batch
                        of batches
                    ) {

                        resultMap.set(
                            `${batch.organizationId}:${batch.branchId}:${batch.id}`,
                            batch,
                        );
                    }
                }

                return keys.map(
                    key =>
                        resultMap.get(
                            `${key.organizationId}:${key.branchId}:${key.batchId}`,
                        ) ??
                        null,
                );
            },

            {
                cacheKeyFn:
                    key =>
                        `${key.organizationId}:${key.branchId}:${key.batchId}`,
            },
        );
}