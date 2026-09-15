import {
    Injectable,
} from '@nestjs/common';

import {
    DatabaseService,
} from '../../../../../core/database/database.service';

import type {
    TenantSettings,
} from '../../../domain/models/tenant-settings.model';

import type {
    TenantSettingsRepository,
    UpsertTenantSettingsInput,
} from '../../../domain/repositories/tenant-settings.repository';

interface TenantSettingsRow {
    id: string;

    organization_id: string;

    date_format: string;
    time_format: string;
    week_start_day: string;

    academic_year_start_month: number;

    invoice_prefix:
    string | null;

    invoice_next_number:
    number;

    receipt_prefix:
    string | null;

    receipt_next_number:
    number;

    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class PostgresTenantSettingsRepository
    implements TenantSettingsRepository {
    constructor(
        private readonly database:
            DatabaseService,
    ) { }

    private map(
        row: TenantSettingsRow,
    ): TenantSettings {
        return {
            id: row.id,

            organizationId:
                row.organization_id,

            dateFormat:
                row.date_format,

            timeFormat:
                row.time_format,

            weekStartDay:
                row.week_start_day,

            academicYearStartMonth:
                row.academic_year_start_month,

            invoicePrefix:
                row.invoice_prefix,

            invoiceNextNumber:
                row.invoice_next_number,

            receiptPrefix:
                row.receipt_prefix,

            receiptNextNumber:
                row.receipt_next_number,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }

    async findByOrganizationId(
        organizationId: string,
    ): Promise<TenantSettings | null> {
        const result =
            await this.database.query<TenantSettingsRow>(
                `
        SELECT
          id,
          organization_id,
          date_format,
          time_format,
          week_start_day,
          academic_year_start_month,
          invoice_prefix,
          invoice_next_number,
          receipt_prefix,
          receipt_next_number,
          created_at,
          updated_at
        FROM tenant_settings
        WHERE organization_id = $1
        `,
                [
                    organizationId,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }

    async create(
        organizationId: string,
        input: UpsertTenantSettingsInput,
    ): Promise<TenantSettings> {
        const result =
            await this.database.query<TenantSettingsRow>(
                `
        INSERT INTO tenant_settings (
          organization_id,
          date_format,
          time_format,
          week_start_day,
          academic_year_start_month,
          invoice_prefix,
          invoice_next_number,
          receipt_prefix,
          receipt_next_number
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
          $9
        )
        RETURNING
          id,
          organization_id,
          date_format,
          time_format,
          week_start_day,
          academic_year_start_month,
          invoice_prefix,
          invoice_next_number,
          receipt_prefix,
          receipt_next_number,
          created_at,
          updated_at
        `,
                [
                    organizationId,

                    input.dateFormat ??
                    'DD-MM-YYYY',

                    input.timeFormat ??
                    '12_HOUR',

                    input.weekStartDay ??
                    'MONDAY',

                    input.academicYearStartMonth ??
                    6,

                    input.invoicePrefix ??
                    null,

                    input.invoiceNextNumber ??
                    1,

                    input.receiptPrefix ??
                    null,

                    input.receiptNextNumber ??
                    1,
                ],
            );

        return this.map(
            result.rows[0],
        );
    }

    async update(
        organizationId: string,
        input: UpsertTenantSettingsInput,
    ): Promise<TenantSettings | null> {
        const existing =
            await this.findByOrganizationId(
                organizationId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.database.query<TenantSettingsRow>(
                `
        UPDATE tenant_settings
        SET
          date_format = $2,
          time_format = $3,
          week_start_day = $4,
          academic_year_start_month = $5,
          invoice_prefix = $6,
          invoice_next_number = $7,
          receipt_prefix = $8,
          receipt_next_number = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE organization_id = $1
        RETURNING
          id,
          organization_id,
          date_format,
          time_format,
          week_start_day,
          academic_year_start_month,
          invoice_prefix,
          invoice_next_number,
          receipt_prefix,
          receipt_next_number,
          created_at,
          updated_at
        `,
                [
                    organizationId,

                    input.dateFormat ??
                    existing.dateFormat,

                    input.timeFormat ??
                    existing.timeFormat,

                    input.weekStartDay ??
                    existing.weekStartDay,

                    input.academicYearStartMonth ??
                    existing.academicYearStartMonth,

                    input.invoicePrefix ??
                    existing.invoicePrefix,

                    input.invoiceNextNumber ??
                    existing.invoiceNextNumber,

                    input.receiptPrefix ??
                    existing.receiptPrefix,

                    input.receiptNextNumber ??
                    existing.receiptNextNumber,
                ],
            );

        return result.rows[0]
            ? this.map(result.rows[0])
            : null;
    }
}