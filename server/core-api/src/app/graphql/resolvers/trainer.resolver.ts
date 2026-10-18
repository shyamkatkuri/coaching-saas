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
    TrainerApplicationService,
} from '../../modules/trainer/application/trainer-application.service';

import {
    TrainerType,
} from '../types/trainer.type';

@Resolver(
    () =>
        TrainerType,
)
export class TrainerResolver {

    constructor(
        private readonly trainer:
            TrainerApplicationService,
    ) { }

    @Query(
        () => [
            TrainerType,
        ],
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'trainer:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    trainers(
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

        return this.trainer
            .findAll(
                organizationId,
                branchId,
            );
    }
}