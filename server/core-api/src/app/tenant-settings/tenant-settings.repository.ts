import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpsertTenantSettingsDto } from './dto/upsert-tenant-settings.dto';

export interface TenantSettingsRecord {
    id: string;
    organization_id: string;
    date_format: string;
    time_format: string;
    week_start_day: string;
    academic_year_start_month: number;
    invoice_prefix: string | null;
    invoice_next_number: number;
    receipt_prefix: string | null;
    receipt_next_number: number;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class TenantSettingsRepository {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async findByOrganizationId(
        organizationId: string,
    ): Promise<TenantSettingsRecord | null> {
        const result =
            await this.databaseService.query<TenantSettingsRecord>(
                `
        SELECT *
        FROM tenant_settings
        WHERE organization_id = $1
        `,
                [organizationId],
            );

        return result.rows[0] ?? null;
    }

    async upsert(
        organizationId: string,
        input: UpsertTenantSettingsDto,
    ): Promise<TenantSettingsRecord> {
        const result =
            await this.databaseService.query<TenantSettingsRecord>(
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
          COALESCE($2, 'DD-MM-YYYY'),
          COALESCE($3, '12_HOUR'),
          COALESCE($4, 'MONDAY'),
          COALESCE($5, 6),
          $6,
          COALESCE($7, 1),
          $8,
          COALESCE($9, 1)
        )

        ON CONFLICT (organization_id)
        DO UPDATE SET
          date_format =
            COALESCE(EXCLUDED.date_format, tenant_settings.date_format),

          time_format =
            COALESCE(EXCLUDED.time_format, tenant_settings.time_format),

          week_start_day =
            COALESCE(EXCLUDED.week_start_day, tenant_settings.week_start_day),

          academic_year_start_month =
            COALESCE(
              EXCLUDED.academic_year_start_month,
              tenant_settings.academic_year_start_month
            ),

          invoice_prefix =
            COALESCE(EXCLUDED.invoice_prefix, tenant_settings.invoice_prefix),

          invoice_next_number =
            COALESCE(
              EXCLUDED.invoice_next_number,
              tenant_settings.invoice_next_number
            ),

          receipt_prefix =
            COALESCE(EXCLUDED.receipt_prefix, tenant_settings.receipt_prefix),

          receipt_next_number =
            COALESCE(
              EXCLUDED.receipt_next_number,
              tenant_settings.receipt_next_number
            ),

          updated_at = CURRENT_TIMESTAMP

        RETURNING *
        `,
                [
                    organizationId,
                    input.dateFormat ?? null,
                    input.timeFormat ?? null,
                    input.weekStartDay ?? null,
                    input.academicYearStartMonth ?? null,
                    input.invoicePrefix ?? null,
                    input.invoiceNextNumber ?? null,
                    input.receiptPrefix ?? null,
                    input.receiptNextNumber ?? null,
                ],
            );

        return result.rows[0];
    }

    async create(
        organizationId: string,
        input: UpsertTenantSettingsDto,
    ): Promise<TenantSettingsRecord> {
        const result =
            await this.databaseService.query<TenantSettingsRecord>(
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
      RETURNING *
      `,
                [
                    organizationId,
                    input.dateFormat ?? 'DD-MM-YYYY',
                    input.timeFormat ?? '12_HOUR',
                    input.weekStartDay ?? 'MONDAY',
                    input.academicYearStartMonth ?? 6,
                    input.invoicePrefix ?? null,
                    input.invoiceNextNumber ?? 1,
                    input.receiptPrefix ?? null,
                    input.receiptNextNumber ?? 1,
                ],
            );

        return result.rows[0];
    }

    async update(
        organizationId: string,
        input: UpsertTenantSettingsDto,
    ): Promise<TenantSettingsRecord | null> {
        const existing =
            await this.findByOrganizationId(
                organizationId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.databaseService.query<TenantSettingsRecord>(
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
      RETURNING *
      `,
                [
                    organizationId,
                    input.dateFormat ?? existing.date_format,
                    input.timeFormat ?? existing.time_format,
                    input.weekStartDay ?? existing.week_start_day,
                    input.academicYearStartMonth ??
                    existing.academic_year_start_month,
                    input.invoicePrefix ??
                    existing.invoice_prefix,
                    input.invoiceNextNumber ??
                    existing.invoice_next_number,
                    input.receiptPrefix ??
                    existing.receipt_prefix,
                    input.receiptNextNumber ??
                    existing.receipt_next_number,
                ],
            );

        return result.rows[0] ?? null;
    }
}