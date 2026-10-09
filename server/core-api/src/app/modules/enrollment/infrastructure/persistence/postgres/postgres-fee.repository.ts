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
    FeeSummary,
    Payment,
    PaymentRefund,
} from '../../../domain/models/fee.model';

import type {
    CollectPaymentData,
    FeeRepository,
    RefundPaymentData,
} from '../../../domain/repositories/fee.repository';

@Injectable()
export class PostgresFeeRepository
    implements FeeRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    private get db() {

        return this.databases.getPool(
            DATABASES.ENROLLMENT,
        );
    }

    async getSummary(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<
        FeeSummary | null
    > {

        const result =
            await this.db.query(
                `
        SELECT
          fa.enrollment_id,

          fa.gross_amount,
          fa.discount_amount,
          fa.payable_amount,

          COALESCE(
            SUM(
              CASE
                WHEN fle.entry_type =
                  'PAYMENT'
                THEN fle.credit_amount
                ELSE 0
              END
            ),
            0
          ) AS total_paid,

          COALESCE(
            SUM(
              CASE
                WHEN fle.entry_type =
                  'REFUND'
                THEN fle.debit_amount
                ELSE 0
              END
            ),
            0
          ) AS total_refunded,

          COALESCE(
            SUM(
              fle.debit_amount
            ),
            0
          )
          -
          COALESCE(
            SUM(
              fle.credit_amount
            ),
            0
          ) AS balance

        FROM fee_accounts fa

        LEFT JOIN fee_ledger_entries fle
          ON fle.enrollment_id =
             fa.enrollment_id

        WHERE fa.organization_id = $1
          AND fa.branch_id = $2
          AND fa.enrollment_id = $3

        GROUP BY
          fa.enrollment_id,
          fa.gross_amount,
          fa.discount_amount,
          fa.payable_amount
        `,
                [
                    organizationId,
                    branchId,
                    enrollmentId,
                ],
            );

        if (
            result.rowCount === 0
        ) {
            return null;
        }

        const row =
            result.rows[0];

        return {
            enrollmentId:
                row.enrollment_id,

            grossAmount:
                Number(
                    row.gross_amount,
                ),

            discountAmount:
                Number(
                    row.discount_amount,
                ),

            payableAmount:
                Number(
                    row.payable_amount,
                ),

            totalPaid:
                Number(
                    row.total_paid,
                ),

            totalRefunded:
                Number(
                    row.total_refunded,
                ),

            balance:
                Number(
                    row.balance,
                ),
        };
    }

    async collectPayment(
        data:
            CollectPaymentData,
    ): Promise<Payment> {

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            const existing =
                await client.query(
                    `
          SELECT *
          FROM payments
          WHERE organization_id = $1
            AND idempotency_key = $2
          LIMIT 1
          `,
                    [
                        data.organizationId,
                        data.idempotencyKey,
                    ],
                );

            if (
                existing.rowCount
            ) {

                const row =
                    existing.rows[0];

                if (
                    row.enrollment_id !==
                    data.enrollmentId ||
                    Number(row.amount) !==
                    data.amount ||
                    row.payment_method !==
                    data.paymentMethod
                ) {
                    throw new Error(
                        'IDEMPOTENCY_KEY_REUSED',
                    );
                }

                await client.query(
                    'COMMIT',
                );

                return this.mapPayment(
                    row,
                );
            }

            const account =
                await client.query(
                    `
          SELECT *
          FROM fee_accounts
          WHERE organization_id = $1
            AND branch_id = $2
            AND enrollment_id = $3
          FOR UPDATE
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        data.enrollmentId,
                    ],
                );

            if (
                account.rowCount === 0
            ) {
                throw new Error(
                    'FEE_ACCOUNT_NOT_FOUND',
                );
            }

            const balanceResult =
                await client.query(
                    `
          SELECT
            COALESCE(
              SUM(debit_amount),
              0
            )
            -
            COALESCE(
              SUM(credit_amount),
              0
            )
            AS balance

          FROM fee_ledger_entries
          WHERE enrollment_id = $1
          `,
                    [
                        data.enrollmentId,
                    ],
                );

            const balance =
                Number(
                    balanceResult
                        .rows[0]
                        .balance,
                );

            if (
                data.amount >
                balance
            ) {
                throw new Error(
                    'PAYMENT_EXCEEDS_BALANCE',
                );
            }

            const paymentResult =
                await client.query(
                    `
          INSERT INTO payments (
            organization_id,
            branch_id,
            enrollment_id,
            amount,
            payment_method,
            reference_no,
            idempotency_key,
            status,
            collected_by
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            'SUCCESS',
            $8
          )
          RETURNING *
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        data.enrollmentId,
                        data.amount,
                        data.paymentMethod,
                        data.referenceNo ??
                        null,
                        data.idempotencyKey,
                        data.collectedBy ??
                        null,
                    ],
                );

            const payment =
                paymentResult.rows[0];

            await client.query(
                `
        INSERT INTO fee_ledger_entries (
          organization_id,
          branch_id,
          enrollment_id,
          entry_type,
          debit_amount,
          credit_amount,
          payment_id,
          description,
          created_by
        )
        VALUES (
          $1,
          $2,
          $3,
          'PAYMENT',
          0,
          $4,
          $5,
          'Fee payment',
          $6
        )
        `,
                [
                    data.organizationId,
                    data.branchId,
                    data.enrollmentId,
                    data.amount,
                    payment.id,
                    data.collectedBy ??
                    null,
                ],
            );

            await client.query(
                'COMMIT',
            );

            return this.mapPayment(
                payment,
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

    async refundPayment(
        data:
            RefundPaymentData,
    ): Promise<
        PaymentRefund
    > {

        const client =
            await this.db.connect();

        try {

            await client.query(
                'BEGIN',
            );

            const previous =
                await client.query(
                    `
          SELECT *
          FROM payment_refunds
          WHERE organization_id = $1
            AND idempotency_key = $2
          LIMIT 1
          `,
                    [
                        data.organizationId,
                        data.idempotencyKey,
                    ],
                );

            if (
                previous.rowCount
            ) {

                const row =
                    previous.rows[0];

                if (
                    row.payment_id !==
                    data.paymentId ||
                    Number(row.amount) !==
                    data.amount
                ) {
                    throw new Error(
                        'IDEMPOTENCY_KEY_REUSED',
                    );
                }

                await client.query(
                    'COMMIT',
                );

                return this.mapRefund(
                    row,
                );
            }

            const paymentResult =
                await client.query(
                    `
          SELECT *
          FROM payments
          WHERE id = $1
            AND organization_id = $2
            AND branch_id = $3
          FOR UPDATE
          `,
                    [
                        data.paymentId,
                        data.organizationId,
                        data.branchId,
                    ],
                );

            if (
                paymentResult.rowCount ===
                0
            ) {
                throw new Error(
                    'PAYMENT_NOT_FOUND',
                );
            }

            const payment =
                paymentResult.rows[0];

            const refundsResult =
                await client.query(
                    `
          SELECT
            COALESCE(
              SUM(amount),
              0
            ) AS refunded

          FROM payment_refunds

          WHERE payment_id = $1
          `,
                    [
                        data.paymentId,
                    ],
                );

            const alreadyRefunded =
                Number(
                    refundsResult
                        .rows[0]
                        .refunded,
                );

            const maximumRefund =
                Number(
                    payment.amount,
                ) -
                alreadyRefunded;

            if (
                data.amount >
                maximumRefund
            ) {
                throw new Error(
                    'REFUND_EXCEEDS_PAYMENT',
                );
            }

            const refundResult =
                await client.query(
                    `
          INSERT INTO payment_refunds (
            organization_id,
            branch_id,
            payment_id,
            amount,
            reason,
            idempotency_key,
            processed_by
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
          )
          RETURNING *
          `,
                    [
                        data.organizationId,
                        data.branchId,
                        data.paymentId,
                        data.amount,
                        data.reason ??
                        null,
                        data.idempotencyKey,
                        data.processedBy ??
                        null,
                    ],
                );

            const refund =
                refundResult.rows[0];

            await client.query(
                `
        INSERT INTO fee_ledger_entries (
          organization_id,
          branch_id,
          enrollment_id,
          entry_type,
          debit_amount,
          credit_amount,
          payment_id,
          refund_id,
          description,
          created_by
        )
        VALUES (
          $1,
          $2,
          $3,
          'REFUND',
          $4,
          0,
          $5,
          $6,
          $7,
          $8
        )
        `,
                [
                    data.organizationId,
                    data.branchId,
                    payment.enrollment_id,
                    data.amount,
                    data.paymentId,
                    refund.id,
                    data.reason ??
                    'Payment refund',
                    data.processedBy ??
                    null,
                ],
            );

            await client.query(
                'COMMIT',
            );

            return this.mapRefund(
                refund,
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

    private mapPayment(
        row: any,
    ): Payment {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            enrollmentId:
                row.enrollment_id,

            amount:
                Number(
                    row.amount,
                ),

            paymentMethod:
                row.payment_method,

            referenceNo:
                row.reference_no,

            idempotencyKey:
                row.idempotency_key,

            status:
                row.status,

            collectedBy:
                row.collected_by,

            createdAt:
                row.created_at,
        };
    }

    private mapRefund(
        row: any,
    ): PaymentRefund {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            paymentId:
                row.payment_id,

            amount:
                Number(
                    row.amount,
                ),

            reason:
                row.reason,

            idempotencyKey:
                row.idempotency_key,

            processedBy:
                row.processed_by,

            createdAt:
                row.created_at,
        };
    }
}