import {
    Args,
    ID,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import {
    BatchApplicationService,
} from '../../modules/batch/application/batch-application.service';

import {
    GraphqlLoadersService,
} from '../loaders/graphql-loaders.service';

import {
    BatchType,
} from '../types/batch.type';

import {
    CourseType,
} from '../types/course.type';

@Resolver(
    () =>
        BatchType,
)
export class BatchResolver {

    constructor(
        private readonly batche:
            BatchApplicationService,

        private readonly loaders:
            GraphqlLoadersService,
    ) { }

    @Query(
        () => [
            BatchType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'batch:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    batches(
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
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,
    ) {

        return this.batche
            .findAll(
                organizationId,
                branchId,
            );
    }

    @ResolveField(
        () =>
            CourseType,
        {
            nullable:
                true,
        },
    )
    course(
        @Parent()
        batch:
            BatchType,
    ) {

        return this.loaders
            .courseById
            .load({
                organizationId:
                    batch.organizationId,

                courseId:
                    batch.courseId,
            });
    }
}