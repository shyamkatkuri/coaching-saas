import {
    Args,
    Context,
    ID,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import {
    EnrollmentApplicationService,
} from '../../modules/enrollment/application/enrollment-application.service';

import {
    CreateEnrollmentInput,
} from '../inputs/create-enrollment.input';

import {
    GraphqlLoadersService,
} from '../loaders/graphql-loaders.service';

import {
    BatchType,
} from '../types/batch.type';

import {
    EnrollmentType,
} from '../types/enrollment.type';
import type { AuthenticatedRequest } from '../../core/security/authentication/jwt-auth.guard';

@Resolver(
    () =>
        EnrollmentType,
)
export class EnrollmentResolver {

    constructor(
        private readonly enrollments:
            EnrollmentApplicationService,

        private readonly loaders:
            GraphqlLoadersService,
    ) { }

    @Query(
        () => [
            EnrollmentType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'enrollment:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    enrollmentsByStudent(
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

        @Args(
            'studentId',
            {
                type:
                    () => ID,
            },
        )
        studentId:
            string,
    ) {

        return this.enrollments
            .findByStudent(
                organizationId,
                branchId,
                studentId,
            );
    }

    @Query(
        () => [
            EnrollmentType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'enrollment:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    enrollmentsByBatch(
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

        @Args(
            'batchId',
            {
                type:
                    () => ID,
            },
        )
        batchId:
            string,
    ) {

        return this.enrollments
            .findByBatch(
                organizationId,
                branchId,
                batchId,
            );
    }

    @Mutation(
        () =>
            EnrollmentType,
    )
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
    createEnrollment(
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

        @Args('input')
        input:
            CreateEnrollmentInput,

        @Context('req')
        request:
            AuthenticatedRequest,
    ) {

        return this.enrollments
            .create(
                organizationId,
                branchId,
                input,
                request
                    .applicationUserId,
            );
    }

    @ResolveField(
        () =>
            BatchType,
        {
            nullable:
                true,
        },
    )
    batch(
        @Parent()
        enrollment:
            EnrollmentType,
    ) {

        return this.loaders
            .batchById
            .load({
                organizationId:
                    enrollment
                        .organizationId,

                branchId:
                    enrollment
                        .branchId,

                batchId:
                    enrollment
                        .batchId,
            });
    }
}