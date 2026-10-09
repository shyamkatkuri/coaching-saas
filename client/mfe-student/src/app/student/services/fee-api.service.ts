import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class FeeApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getSummary(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ) {

        return this.http.get(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments/${enrollmentId}/fees`,
        );
    }

    collectPayment(
        organizationId: string,
        branchId: string,
        enrollmentId: string,

        request: {
            amount: number;

            paymentMethod:
            | 'CASH'
            | 'UPI'
            | 'CARD'
            | 'BANK_TRANSFER';

            referenceNo?: string;
        },

        idempotencyKey: string,
    ) {

        return this.http.post(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments/${enrollmentId}/payments`,
            request,
            {
                headers: {
                    'Idempotency-Key':
                        idempotencyKey,
                },
            },
        );
    }

    refund(
        organizationId: string,
        branchId: string,
        paymentId: string,

        request: {
            amount: number;
            reason?: string;
        },

        idempotencyKey: string,
    ) {

        return this.http.post(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/payments/${paymentId}/refunds`,
            request,
            {
                headers: {
                    'Idempotency-Key':
                        idempotencyKey,
                },
            },
        );
    }
}