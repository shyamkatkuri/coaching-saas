import {
    Injectable,
} from '@nestjs/common';

import {
    DATABASES,
} from '../../../../../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../../../../../core/database/database-registry.service';

import type {
    Trainer,
} from '../../../domain/models/trainer.model';

import type {
    CreateTrainerData,
    TrainerRepository,
    UpdateTrainerData,
} from '../../../domain/repositories/trainer.repository';

@Injectable()
export class PostgresTrainerRepository
    implements TrainerRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    private get db() {
        return this.databases.getPool(
            DATABASES.TRAINER,
        );
    }

    async findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Trainer[]> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          status,
          created_at,
          updated_at
        FROM trainers
        WHERE organization_id = $1
          AND branch_id = $2
        ORDER BY created_at DESC
        `,
                [
                    organizationId,
                    branchId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
        trainerId: string,
    ): Promise<Trainer | null> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          status,
          created_at,
          updated_at
        FROM trainers
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        LIMIT 1
        `,
                [
                    trainerId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            result.rowCount === 0
        ) {
            return null;
        }

        return this.mapRow(
            result.rows[0],
        );
    }

    async findByIds(
        organizationId: string,
        branchId: string,
        trainerIds: string[],
    ): Promise<Trainer[]> {

        if (
            trainerIds.length === 0
        ) {
            return [];
        }

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          status,
          created_at,
          updated_at
        FROM trainers
        WHERE organization_id = $1
          AND branch_id = $2
          AND id = ANY($3::uuid[])
          AND status = 'ACTIVE'
        `,
                [
                    organizationId,
                    branchId,
                    trainerIds,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async create(
        data: CreateTrainerData,
    ): Promise<Trainer> {

        const result =
            await this.db.query(
                `
        INSERT INTO trainers (
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          employee_code,
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
          'ACTIVE'
        )
        RETURNING
          id,
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          employee_code,
          status,
          created_at,
          updated_at
        `,
                [
                    data.organizationId,
                    data.branchId,
                    data.firstName,
                    data.lastName,
                    data.email ?? null,
                    data.phone ?? null,
                    data.employee_code,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    async update(
        organizationId: string,
        branchId: string,
        trainerId: string,
        data: UpdateTrainerData,
    ): Promise<Trainer | null> {

        const existing =
            await this.findById(
                organizationId,
                branchId,
                trainerId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.db.query(
                `
        UPDATE trainers
        SET
          first_name = $4,
          last_name = $5,
          email = $6,
          phone = $7,
          status = $8,
          updated_at = NOW()
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        RETURNING
          id,
          organization_id,
          branch_id,
          first_name,
          last_name,
          email,
          phone,
          status,
          created_at,
          updated_at
        `,
                [
                    trainerId,
                    organizationId,
                    branchId,

                    data.firstName ??
                    existing.firstName,

                    data.lastName ??
                    existing.lastName,

                    data.email ??
                    existing.email,

                    data.phone ??
                    existing.phone,

                    data.status ??
                    existing.status,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    private mapRow(
        row: any,
    ): Trainer {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            firstName:
                row.first_name,

            lastName:
                row.last_name,

            email:
                row.email,

            phone:
                row.phone,

            status:
                row.status,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}