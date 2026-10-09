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
    ) { }

    findAll(
        organizationId: string,
        branchId: string,
    ) {

        return this.batches.findAll(
            organizationId,
            branchId,
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
        batchId: string,
    ) {

        const batch =
            await this.batches.findById(
                organizationId,
                branchId,
                batchId,
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

        return this.batches.create({
            organizationId,
            branchId,
            ...data,
        });
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

        return batch;
    }
}