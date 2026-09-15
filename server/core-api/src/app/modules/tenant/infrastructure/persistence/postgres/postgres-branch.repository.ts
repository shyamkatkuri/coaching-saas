import {
    Injectable,
} from '@nestjs/common';

import {
    DatabaseService,
} from '../../../../../core/database/database.service';

import type {
    Branch,
} from '../../../domain/models/branch.model';

import type {
    BranchRepository,
    CreateBranchInput,
    UpdateBranchInput,
} from '../../../domain/repositories/branch.repository';

interface BranchRow {
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

    status: Branch['status'];

    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class PostgresBranchRepository
    implements BranchRepository {
    constructor(
        private readonly database:
            DatabaseService,
    ) { }

    private map(
        row: BranchRow,
    ): Branch {
        return {
            id: row.id,

            organizationId:
                row.organization_id,

            name: row.name,
            code: row.code,

            addressLine1:
                row.address_line_1,

            addressLine2:
                row.address_line_2,

            city: row.city,
            state: row.state,

            postalCode:
                row.postal_code,

            country: row.country,

            phone: row.phone,
            email: row.email,

            status: row.status,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }

    async findAllByTenant(
        organizationId: string,
    ): Promise<Branch[]> {
        const result =
            await this.database.query<BranchRow>(
                `
        SELECT
          id,
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
          email,
          status,
          created_at,
          updated_at
        FROM branches
        WHERE organization_id = $1
        ORDER BY created_at DESC
        `,
                [
                    organizationId,
                ],
            );

        return result.rows.map(
            row => this.map(row),
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
    ): Promise<Branch | null> {
        const result =
            await this.database.query<BranchRow>(
                `
        SELECT
          id,
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
          email,
          status,
          created_at,
          updated_at
        FROM branches
        WHERE id = $1
          AND organization_id = $2
        `,
                [
                    branchId,
                    organizationId,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async findByCode(
        organizationId: string,
        code: string,
    ): Promise<Branch | null> {
        const result =
            await this.database.query<BranchRow>(
                `
        SELECT
          id,
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
          email,
          status,
          created_at,
          updated_at
        FROM branches
        WHERE organization_id = $1
          AND code = $2
        `,
                [
                    organizationId,
                    code,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async create(
        organizationId: string,
        input: CreateBranchInput,
    ): Promise<Branch> {
        const result =
            await this.database.query<BranchRow>(
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
          email,
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
          $9,
          $10,
          $11,
          'ACTIVE'
        )
        RETURNING
          id,
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
          email,
          status,
          created_at,
          updated_at
        `,
                [
                    organizationId,

                    input.name,

                    input.code.toUpperCase(),

                    input.addressLine1 ??
                    null,

                    input.addressLine2 ??
                    null,

                    input.city ??
                    null,

                    input.state ??
                    null,

                    input.postalCode ??
                    null,

                    input.country ??
                    'India',

                    input.phone ??
                    null,

                    input.email ??
                    null,
                ],
            );

        return this.map(
            result.rows[0],
        );
    }

    async update(
        organizationId: string,
        branchId: string,
        input: UpdateBranchInput,
    ): Promise<Branch | null> {
        const existing =
            await this.findById(
                organizationId,
                branchId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.database.query<BranchRow>(
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
        RETURNING
          id,
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
          email,
          status,
          created_at,
          updated_at
        `,
                [
                    branchId,
                    organizationId,

                    input.name ??
                    existing.name,

                    input.addressLine1 ??
                    existing.addressLine1,

                    input.addressLine2 ??
                    existing.addressLine2,

                    input.city ??
                    existing.city,

                    input.state ??
                    existing.state,

                    input.postalCode ??
                    existing.postalCode,

                    input.country ??
                    existing.country,

                    input.phone ??
                    existing.phone,

                    input.email ??
                    existing.email,

                    input.status ??
                    existing.status,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }
}