import { Injectable } from '@nestjs/common';

import {
    CreateTenantInput,
    TenantRepository,
    UpdateTenantInput,
} from '../../../domain/repositories/tenant.repository';

import { Tenant } from '../../../domain/models/tenant.model';
import { DatabaseService } from 'src/app/core/database/database.service';

interface TenantRow {
    id: string;
    name: string;
    slug: string;
    code: string;
    status: Tenant['status'];
    timezone: string;
    currency: string;
    country: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class PostgresTenantRepository
    implements TenantRepository {
    constructor(
        private readonly database:
            DatabaseService,
    ) { }

    private map(
        row: TenantRow,
    ): Tenant {
        return {
            id: row.id,

            name: row.name,
            slug: row.slug,
            code: row.code,

            status: row.status,

            timezone: row.timezone,
            currency: row.currency,
            country: row.country,

            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    async findAll(): Promise<Tenant[]> {
        const result =
            await this.database.query<TenantRow>(
                `
        SELECT *
        FROM organizations
        ORDER BY created_at DESC
        `,
            );

        return result.rows.map(
            row => this.map(row),
        );
    }

    async findById(
        id: string,
    ): Promise<Tenant | null> {
        const result =
            await this.database.query<TenantRow>(
                `
        SELECT *
        FROM organizations
        WHERE id = $1
        `,
                [id],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async findBySlug(
        slug: string,
    ): Promise<Tenant | null> {
        const result =
            await this.database.query<TenantRow>(
                `
        SELECT *
        FROM organizations
        WHERE slug = $1
        `,
                [slug],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async findByCode(
        code: string,
    ): Promise<Tenant | null> {
        const result =
            await this.database.query<TenantRow>(
                `
        SELECT *
        FROM organizations
        WHERE code = $1
        `,
                [code],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async create(
        input: CreateTenantInput,
    ): Promise<Tenant> {
        const result =
            await this.database.query<TenantRow>(
                `
        INSERT INTO organizations (
          name,
          slug,
          code,
          status,
          timezone,
          currency,
          country
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *
        `,
                [
                    input.name,
                    input.slug,
                    input.code,
                    input.status,
                    input.timezone,
                    input.currency,
                    input.country,
                ],
            );

        return this.map(
            result.rows[0],
        );
    }

    async update(
        id: string,
        input: UpdateTenantInput,
    ): Promise<Tenant | null> {
        const current =
            await this.findById(id);

        if (!current) {
            return null;
        }

        const result =
            await this.database.query<TenantRow>(
                `
        UPDATE organizations
        SET
          name = $2,
          slug = $3,
          status = $4,
          timezone = $5,
          currency = $6,
          country = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
        `,
                [
                    id,

                    input.name ??
                    current.name,

                    input.slug ??
                    current.slug,

                    input.status ??
                    current.status,

                    input.timezone ??
                    current.timezone,

                    input.currency ??
                    current.currency,

                    input.country ??
                    current.country,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }
}