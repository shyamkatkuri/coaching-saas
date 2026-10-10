import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    CourseLookupService,
} from '../../course/application/course-lookup.service';

import {
    TrainerLookupService,
} from '../../trainer/application/trainer-lookup.service';

import {
    BATCH_REPOSITORY,
} from '../domain/repositories/batch.repository';

import type {
    BatchRepository,
    CreateBatchData,
    UpdateBatchData,
} from '../domain/repositories/batch.repository';
import { AppCacheService } from '../../../core/redis/cache/app-cache.service';
import { CacheKeyFactory } from '../../../core/redis/cache/cache-key.factory';

@Injectable()
export class BatchApplicationService {

    constructor(
        @Inject(
            BATCH_REPOSITORY,
        )
        private readonly batches:
            BatchRepository,

        private readonly courses:
            CourseLookupService,

        private readonly trainers:
            TrainerLookupService,

        private readonly cache:
            AppCacheService,

        private readonly cacheKeys:
            CacheKeyFactory,
    ) { }

    findAll(
        organizationId: string,
        branchId: string,
    ) {

        const key =
            this.cacheKeys
                .batches(
                    organizationId,
                    branchId,
                );

        return this.cache
            .getOrSet(
                key,

                () =>
                    this.batches
                        .findAll(
                            organizationId,
                            branchId,
                        ),

                /*
                 * Batches change more
                 * frequently than courses.
                 */
                30,
            );
    }

    async findById(
        organizationId: string,
        branchId: string,
        batchId: string,
    ) {

        const key =
            this.cacheKeys.batch(
                organizationId,
                branchId,
                batchId,
            );

        const batch =
            await this.cache
                .getOrSet(
                    key,

                    () =>
                        this.batches
                            .findById(
                                organizationId,
                                branchId,
                                batchId,
                            ),

                    30,
                );

        if (!batch) {

            throw new NotFoundException(
                'Batch not found',
            );
        }

        return batch;
    }

    async create(
        organizationId: string,
        branchId: string,
        data:
            Omit<
                CreateBatchData,
                | 'organizationId'
                | 'branchId'
            >,
    ) {

        await this.courses
            .ensureExists(
                organizationId,
                data.courseId,
            );

        await this.trainers
            .ensureAllExist(
                organizationId,
                branchId,
                data.trainerIds,
            );

        const batch = await this.batches.create({
            organizationId,
            branchId,
            ...data,
        });

        await this.cache.invalidate(this.cacheKeys.batches(organizationId, branchId,));

        return batch;
    }

    async update(
        organizationId: string,
        branchId: string,
        batchId: string,
        data: UpdateBatchData,
    ) {

        if (
            data.courseId
        ) {

            await this.courses
                .ensureExists(
                    organizationId,
                    data.courseId,
                );
        }

        if (
            data.trainerIds
        ) {

            await this.trainers
                .ensureAllExist(
                    organizationId,
                    branchId,
                    data.trainerIds,
                );
        }

        const batch =
            await this.batches.update(
                organizationId,
                branchId,
                batchId,
                data,
            );

        if (!batch) {
            throw new NotFoundException(
                'Batch not found',
            );
        }

        await this.cache
            .invalidate(

                this.cacheKeys.batches(
                    organizationId,
                    branchId,
                ),

                this.cacheKeys.batch(
                    organizationId,
                    branchId,
                    batchId,
                ),
            );

        return batch;
    }
}