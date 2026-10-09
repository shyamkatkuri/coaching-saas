import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    BATCH_REPOSITORY,
} from '../domain/repositories/batch.repository';

import type {
    BatchRepository,
} from '../domain/repositories/batch.repository';

@Injectable()
export class BatchLookupService {

    constructor(
        @Inject(
            BATCH_REPOSITORY,
        )
        private readonly batches:
            BatchRepository,
    ) { }

    async getForEnrollment(
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

        if (
            !batch ||
            ![
                'PLANNED',
                'ACTIVE',
            ].includes(
                batch.status,
            )
        ) {
            throw new NotFoundException(
                'Batch not found',
            );
        }

        return batch;
    }
}