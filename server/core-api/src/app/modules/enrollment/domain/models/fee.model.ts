export type PaymentMethod =
    | 'CASH'
    | 'UPI'
    | 'CARD'
    | 'BANK_TRANSFER';

export interface FeeSummary {

    enrollmentId: string;

    grossAmount: number;
    discountAmount: number;
    payableAmount: number;

    totalPaid: number;
    totalRefunded: number;

    balance: number;
}

export interface Payment {

    id: string;

    organizationId: string;
    branchId: string;

    enrollmentId: string;

    amount: number;

    paymentMethod:
    PaymentMethod;

    referenceNo:
    string | null;

    idempotencyKey:
    string;

    status:
    'SUCCESS';

    collectedBy:
    string | null;

    createdAt: Date;
}

export interface PaymentRefund {

    id: string;

    organizationId: string;
    branchId: string;

    paymentId: string;

    amount: number;

    reason:
    string | null;

    idempotencyKey:
    string;

    processedBy:
    string | null;

    createdAt: Date;
}