import {
    Args,
    ID,
    Query,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import {
    StudentApplicationService,
} from '../../modules/student/application/student-application.service';

import {
    StudentType,
} from '../types/student.type';

@Resolver(
    () =>
        StudentType,
)
export class StudentResolver {

    constructor(
        private readonly student:
            StudentApplicationService,
    ) { }

    @Query(
        () => [
            StudentType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'student:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    students(
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

        return this.student
            .findAll(
                organizationId,
                branchId,
            );
    }
}