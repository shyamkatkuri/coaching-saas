import type {
    FeeSummary,
    Payment,
    PaymentMethod,
    PaymentRefund,
} from '../models/fee.model';

export const FEE_REPOSITORY =
    Symbol(
        'FEE_REPOSITORY',
    );

export interface CollectPaymentData {

    organizationId: string;
    branchId: string;

    enrollmentId: string;

    amount: number;

    paymentMethod:
    PaymentMethod;

    referenceNo?: string;

    idempotencyKey: string;

    collectedBy?: string;
}

export interface RefundPaymentData {

    organizationId: string;
    branchId: string;

    paymentId: string;

    amount: number;

    reason?: string;

    idempotencyKey: string;

    processedBy?: string;
}

export interface FeeRepository {

    getSummary(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ): Promise<
        FeeSummary | null
    >;

    collectPayment(
        data:
            CollectPaymentData,
    ): Promise<Payment>;

    refundPayment(
        data:
            RefundPaymentData,
    ): Promise<
        PaymentRefund
    >;
}