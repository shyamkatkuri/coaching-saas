import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    TRAINER_REPOSITORY,
} from '../domain/repositories/trainer.repository';

import type {
    TrainerRepository,
} from '../domain/repositories/trainer.repository';

@Injectable()
export class TrainerLookupService {

    constructor(
        @Inject(
            TRAINER_REPOSITORY,
        )
        private readonly trainers:
            TrainerRepository,
    ) { }

    async ensureAllExist(
        organizationId: string,
        branchId: string,
        trainerIds: string[],
    ): Promise<void> {

        const uniqueIds =
            [
                ...new Set(
                    trainerIds,
                ),
            ];

        const trainers =
            await this.trainers
                .findByIds(
                    organizationId,
                    branchId,
                    uniqueIds,
                );

        if (
            trainers.length !==
            uniqueIds.length
        ) {
            throw new NotFoundException(
                'One or more trainers were not found',
            );
        }
    }
}