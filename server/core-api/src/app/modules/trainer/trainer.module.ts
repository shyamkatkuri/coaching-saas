import {
    Module,
} from '@nestjs/common';

import {
    TrainerApplicationService,
} from './application/trainer-application.service';

import {
    TrainerLookupService,
} from './application/trainer-lookup.service';

import {
    TRAINER_REPOSITORY,
} from './domain/repositories/trainer.repository';

import {
    PostgresTrainerRepository,
} from './infrastructure/persistence/postgres/postgres-trainer.repository';

import {
    TrainerController,
} from './presentation/controllers/trainer.controller';

@Module({
    controllers: [
        TrainerController,
    ],

    providers: [
        TrainerApplicationService,
        TrainerLookupService,

        PostgresTrainerRepository,

        {
            provide:
                TRAINER_REPOSITORY,

            useExisting:
                PostgresTrainerRepository,
        },
    ],

    exports: [
        TrainerLookupService,
    ],
})
export class TrainerModule { }