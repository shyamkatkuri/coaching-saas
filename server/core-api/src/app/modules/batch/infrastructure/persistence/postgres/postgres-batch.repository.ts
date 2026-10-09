import {
    Injectable,
} from '@nestjs/common';

import type {
    PoolClient,
} from 'pg';

import {
    DATABASES,
} from '../../../../../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../../../../../core/database/database-registry.service';

import type {
    Batch,
} from '../../../domain/models/batch.model';

import type {
    BatchRepository,
    CreateBatchData,
    UpdateBatchData,
} from '../../../domain/repositories/batch.repository';

@Injectable()
export class PostgresBatchRepository
    implements BatchRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    private get db() {
        return this.databases.getPool(
            DATABASES.BATCH,
        );
    }

    async findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Batch[]> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          course_id,
          name,
          batch_code,
          start_date,
          end_date,
          capacity,
          status,
          created_at,
          updated_at
        FROM batches
        WHERE organization_id = $1
          AND branch_id = $2
        ORDER BY created_at DESC
        `,
                [
                    organizationId,
                    branchId,
                ],
            );

        const batches:
            Batch[] = [];

        for (
            const row
            of result.rows
        ) {

            batches.push(
                await this.loadDetails(
                    row,
                ),
            );
        }

        return batches;
    }

    async findById(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<Batch | null> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          course_id,
          name,
          batch_code,
          start_date,
          end_date,
          capacity,
          status,
          created_at,
          updated_at
        FROM batches
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        LIMIT 1
        `,
                [
                    batchId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            result.rowCount === 0
        ) {
            return null;
        }

        return this.loadDetails(
            result.rows[0],
        );
    }

    async create(
        data: CreateBatchData,
    ): Promise<Batch> {

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            const batchResult =
                await client.query(
                    `
          INSERT INTO batches (
            organization_id,
            branch_id,
            course_id,
            name,
            batch_code,
            start_date,
            end_date,
            capacity,
            status
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            'PLANNED'
          )
          RETURNING
            id,
            organization_id,
            branch_id,
            course_id,
            name,
            batch_code,
            start_date,
            end_date,
            capacity,
            status,
            created_at,
            updated_at
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        data.courseId,
                        data.name,
                        data.batch_code,
                        data.startDate,
                        data.endDate ?? null,
                        data.capacity,
                    ],
                );

            const row =
                batchResult.rows[0];

            await this.insertTrainers(
                client,
                row.id,
                data.trainerIds,
            );

            await this.insertSchedules(
                client,
                row.id,
                data.schedules,
            );

            await client.query(
                'COMMIT',
            );

            return this.findById(
                data.organizationId,
                data.branchId,
                row.id,
            ) as Promise<Batch>;

        } catch (error) {

            await client.query(
                'ROLLBACK',
            );

            throw error;

        } finally {

            client.release();
        }
    }

    async update(
        organizationId: string,
        branchId: string,
        batchId: string,
        data: UpdateBatchData,
    ): Promise<Batch | null> {

        const existing =
            await this.findById(
                organizationId,
                branchId,
                batchId,
            );

        if (!existing) {
            return null;
        }

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            await client.query(
                `
        UPDATE batches
        SET
          course_id = $4,
          name = $5,
          batch_code = $6,
          start_date = $7,
          end_date = $8,
          capacity = $9,
          status = $10,
          updated_at = NOW()
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        `,
                [
                    batchId,
                    organizationId,
                    branchId,

                    data.courseId ??
                    existing.courseId,

                    data.name ??
                    existing.name,

                    data.batch_code ??
                    existing.batch_code,

                    data.startDate ??
                    existing.startDate,

                    data.endDate ??
                    existing.endDate,

                    data.capacity ??
                    existing.capacity,

                    data.status ??
                    existing.status,
                ],
            );

            if (
                data.trainerIds
            ) {

                await client.query(
                    `
          DELETE FROM batch_trainers
          WHERE batch_id = $1
          `,
                    [
                        batchId,
                    ],
                );

                await this.insertTrainers(
                    client,
                    batchId,
                    data.trainerIds,
                );
            }

            if (
                data.schedules
            ) {

                await client.query(
                    `
          DELETE FROM batch_schedules
          WHERE batch_id = $1
          `,
                    [
                        batchId,
                    ],
                );

                await this.insertSchedules(
                    client,
                    batchId,
                    data.schedules,
                );
            }

            await client.query(
                'COMMIT',
            );

            return this.findById(
                organizationId,
                branchId,
                batchId,
            );

        } catch (error) {

            await client.query(
                'ROLLBACK',
            );

            throw error;

        } finally {

            client.release();
        }
    }

    private async insertTrainers(
        client: PoolClient,
        batchId: string,
        trainerIds: string[],
    ): Promise<void> {

        for (
            const trainerId
            of trainerIds
        ) {

            await client.query(
                `
        INSERT INTO batch_trainers (
          batch_id,
          trainer_id
        )
        VALUES (
          $1,
          $2
        )
        `,
                [
                    batchId,
                    trainerId,
                ],
            );
        }
    }

    private async insertSchedules(
        client: PoolClient,
        batchId: string,
        schedules:
            Array<{
                dayOfWeek: number;
                startTime: string;
                endTime: string;
            }>,
    ): Promise<void> {

        for (
            const schedule
            of schedules
        ) {

            await client.query(
                `
        INSERT INTO batch_schedules (
          batch_id,
          day_of_week,
          start_time,
          end_time
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        `,
                [
                    batchId,
                    schedule.dayOfWeek,
                    schedule.startTime,
                    schedule.endTime,
                ],
            );
        }
    }

    private async loadDetails(
        row: any,
    ): Promise<Batch> {

        const [
            trainers,
            schedules,
        ] =
            await Promise.all([
                this.db.query(
                    `
          SELECT trainer_id
          FROM batch_trainers
          WHERE batch_id = $1
          ORDER BY created_at
          `,
                    [
                        row.id,
                    ],
                ),

                this.db.query(
                    `
          SELECT
            day_of_week,
            start_time,
            end_time
          FROM batch_schedules
          WHERE batch_id = $1
          ORDER BY created_at
          `,
                    [
                        row.id,
                    ],
                ),
            ]);

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            courseId:
                row.course_id,

            name:
                row.name,

            batch_code:
                row.batch_code,

            startDate:
                row.start_date,

            endDate:
                row.end_date,

            capacity:
                row.capacity,

            status:
                row.status,

            trainerIds:
                trainers.rows.map(
                    item =>
                        item.trainer_id,
                ),

            schedules:
                schedules.rows.map(
                    item => ({
                        dayOfWeek:
                            item.day_of_week,

                        startTime:
                            item.start_time,

                        endTime:
                            item.end_time,
                    }),
                ),

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}