import {
    Module,
} from '@nestjs/common';

import {
    CourseModule,
} from '../course/course.module';

import {
    TrainerModule,
} from '../trainer/trainer.module';

import {
    BatchApplicationService,
} from './application/batch-application.service';

import {
    BATCH_REPOSITORY,
} from './domain/repositories/batch.repository';

import {
    PostgresBatchRepository,
} from './infrastructure/persistence/postgres/postgres-batch.repository';

import {
    BatchController,
} from './presentation/controllers/batch.controller';
import { BatchLookupService } from './application/batch-lookup.service';

@Module({
    imports: [
        CourseModule,
        TrainerModule,
    ],

    controllers: [
        BatchController,
    ],

    providers: [
        BatchApplicationService,
        BatchLookupService,
        PostgresBatchRepository,

        {
            provide:
                BATCH_REPOSITORY,

            useExisting:
                PostgresBatchRepository,
        },
    ],

    exports: [
        BatchLookupService
    ],
})
export class BatchModule { }