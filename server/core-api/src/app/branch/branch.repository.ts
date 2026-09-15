import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateBranchDto } from './dto/update-branch.dto';

export interface BranchRecord {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
    phone: string | null;
    email: string | null;
    status: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class BranchRepository {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async findAllByTenant(
        organizationId: string,
    ): Promise<BranchRecord[]> {
        const result =
            await this.databaseService.query<BranchRecord>(
                `
        SELECT *
        FROM branches
        WHERE organization_id = $1
        ORDER BY created_at DESC
        `,
                [organizationId],
            );

        return result.rows;
    }

    async findById(
        organizationId: string,
        branchId: string,
    ): Promise<BranchRecord | null> {
        const result =
            await this.databaseService.query<BranchRecord>(
                `
        SELECT *
        FROM branches
        WHERE id = $1
          AND organization_id = $2
        `,
                [branchId, organizationId],
            );

        return result.rows[0] ?? null;
    }

    async findByCode(
        organizationId: string,
        code: string,
    ): Promise<BranchRecord | null> {
        const result =
            await this.databaseService.query<BranchRecord>(
                `
        SELECT *
        FROM branches
        WHERE organization_id = $1
          AND code = $2
        `,
                [organizationId, code],
            );

        return result.rows[0] ?? null;
    }

    async create(
        organizationId: string,
        input: {
            name: string;
            code: string;
            addressLine1?: string;
            addressLine2?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
            phone?: string;
            email?: string;
        },
    ): Promise<BranchRecord> {
        const result =
            await this.databaseService.query<BranchRecord>(
                `
        INSERT INTO branches (
          organization_id,
          name,
          code,
          address_line_1,
          address_line_2,
          city,
          state,
          postal_code,
          country,
          phone,
          email
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        )
        RETURNING *
        `,
                [
                    organizationId,
                    input.name,
                    input.code,
                    input.addressLine1 ?? null,
                    input.addressLine2 ?? null,
                    input.city ?? null,
                    input.state ?? null,
                    input.postalCode ?? null,
                    input.country ?? 'India',
                    input.phone ?? null,
                    input.email ?? null,
                ],
            );

        return result.rows[0];
    }

    async update(
        organizationId: string,
        branchId: string,
        input: UpdateBranchDto,
    ): Promise<BranchRecord | null> {
        const existing = await this.findById(
            organizationId,
            branchId,
        );

        if (!existing) {
            return null;
        }

        const result =
            await this.databaseService.query<BranchRecord>(
                `
        UPDATE branches
        SET
          name = $3,
          address_line_1 = $4,
          address_line_2 = $5,
          city = $6,
          state = $7,
          postal_code = $8,
          country = $9,
          phone = $10,
          email = $11,
          status = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND organization_id = $2
        RETURNING *
        `,
                [
                    branchId,
                    organizationId,
                    input.name ?? existing.name,
                    input.addressLine1 ?? existing.address_line_1,
                    input.addressLine2 ?? existing.address_line_2,
                    input.city ?? existing.city,
                    input.state ?? existing.state,
                    input.postalCode ?? existing.postal_code,
                    input.country ?? existing.country,
                    input.phone ?? existing.phone,
                    input.email ?? existing.email,
                    input.status ?? existing.status,
                ],
            );

        return result.rows[0] ?? null;
    }
}