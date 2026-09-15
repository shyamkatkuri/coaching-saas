import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface TenantRecord {
    id: string;
    name: string;
    slug: string;
    code: string;
    status: string;
    timezone: string;
    currency: string;
    country: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class TenantRepository {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async findAll(): Promise<TenantRecord[]> {
        const result =
            await this.databaseService.query<TenantRecord>(
                `
        SELECT
          id,
          name,
          slug,
          code,
          status,
          timezone,
          currency,
          country,
          created_at,
          updated_at
        FROM organizations
        ORDER BY created_at DESC
        `,
            );

        return result.rows;
    }

    async findById(
        id: string,
    ): Promise<TenantRecord | null> {
        const result =
            await this.databaseService.query<TenantRecord>(
                `
        SELECT
          id,
          name,
          slug,
          code,
          status,
          timezone,
          currency,
          country,
          created_at,
          updated_at
        FROM organizations
        WHERE id = $1
        `,
                [id],
            );

        return result.rows[0] ?? null;
    }

    async findBySlug(
        slug: string,
    ): Promise<TenantRecord | null> {
        const result =
            await this.databaseService.query<TenantRecord>(
                `
        SELECT *
        FROM organizations
        WHERE slug = $1
        `,
                [slug],
            );

        return result.rows[0] ?? null;
    }

    async findByCode(
        code: string,
    ): Promise<TenantRecord | null> {
        const result =
            await this.databaseService.query<TenantRecord>(
                `
        SELECT *
        FROM organizations
        WHERE code = $1
        `,
                [code],
            );

        return result.rows[0] ?? null;
    }

    async create(input: {
        name: string;
        slug: string;
        code: string;
        status: string;
        timezone: string;
        currency: string;
        country: string;
    }): Promise<TenantRecord> {
        const result =
            await this.databaseService.query<TenantRecord>(
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
          $1, $2, $3, $4, $5, $6, $7
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

        return result.rows[0];
    }

    async update(
        id: string,
        input: {
            name?: string;
            slug?: string;
            status?: string;
            timezone?: string;
            currency?: string;
            country?: string;
        },
    ): Promise<TenantRecord | null> {
        const existing = await this.findById(id);

        if (!existing) {
            return null;
        }

        const result =
            await this.databaseService.query<TenantRecord>(
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
                    input.name ?? existing.name,
                    input.slug ?? existing.slug,
                    input.status ?? existing.status,
                    input.timezone ?? existing.timezone,
                    input.currency ?? existing.currency,
                    input.country ?? existing.country,
                ],
            );

        return result.rows[0] ?? null;
    }
}