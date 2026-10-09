import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    ENROLLMENT_REPOSITORY,
} from '../domain/repositories/enrollment.repository';

import type {
    EnrollmentRepository,
} from '../domain/repositories/enrollment.repository';

import {
    FEE_REPOSITORY,
} from '../domain/repositories/fee.repository';

import type {
    FeeRepository,
} from '../domain/repositories/fee.repository';

import type {
    CollectPaymentDto,
} from '../presentation/dto/collect-payment.dto';

import type {
    RefundPaymentDto,
} from '../presentation/dto/refund-payment.dto';

@Injectable()
export class FeeApplicationService {

    constructor(
        @Inject(
            FEE_REPOSITORY,
        )
        private readonly fees:
            FeeRepository,

        @Inject(
            ENROLLMENT_REPOSITORY,
        )
        private readonly enrollments:
            EnrollmentRepository,
    ) { }

    async getSummary(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ) {

        const enrollment =
            await this.enrollments
                .findById(
                    organizationId,
                    branchId,
                    enrollmentId,
                );

        if (!enrollment) {
            throw new NotFoundException(
                'Enrollment not found',
            );
        }

        const summary =
            await this.fees
                .getSummary(
                    organizationId,
                    branchId,
                    enrollmentId,
                );

        if (!summary) {
            throw new NotFoundException(
                'Fee account not found',
            );
        }

        return summary;
    }

    async collectPayment(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
        dto:
            CollectPaymentDto,
        idempotencyKey: string,
        applicationUserId?: string,
    ) {

        const enrollment =
            await this.enrollments
                .findById(
                    organizationId,
                    branchId,
                    enrollmentId,
                );

        if (!enrollment) {
            throw new NotFoundException(
                'Enrollment not found',
            );
        }

        if (
            enrollment.status ===
            'CANCELLED'
        ) {
            throw new BadRequestException(
                'Cannot collect payment for a cancelled enrollment',
            );
        }

        try {

            return await this.fees
                .collectPayment({
                    organizationId,
                    branchId,
                    enrollmentId,

                    amount:
                        dto.amount,

                    paymentMethod:
                        dto.paymentMethod,

                    referenceNo:
                        dto.referenceNo,

                    idempotencyKey,

                    collectedBy:
                        applicationUserId,
                });

        } catch (error: any) {

            switch (
            error?.message
            ) {

                case 'FEE_ACCOUNT_NOT_FOUND':

                    throw new NotFoundException(
                        'Fee account not found',
                    );

                case 'PAYMENT_EXCEEDS_BALANCE':

                    throw new BadRequestException(
                        'Payment exceeds outstanding balance',
                    );

                case 'IDEMPOTENCY_KEY_REUSED':

                    throw new ConflictException(
                        'Idempotency key was already used for another request',
                    );

                default:

                    throw error;
            }
        }
    }

    async refundPayment(
        organizationId: string,
        branchId: string,
        paymentId: string,
        dto:
            RefundPaymentDto,
        idempotencyKey: string,
        applicationUserId?: string,
    ) {

        try {

            return await this.fees
                .refundPayment({
                    organizationId,
                    branchId,

                    paymentId,

                    amount:
                        dto.amount,

                    reason:
                        dto.reason,

                    idempotencyKey,

                    processedBy:
                        applicationUserId,
                });

        } catch (error: any) {

            switch (
            error?.message
            ) {

                case 'PAYMENT_NOT_FOUND':

                    throw new NotFoundException(
                        'Payment not found',
                    );

                case 'REFUND_EXCEEDS_PAYMENT':

                    throw new BadRequestException(
                        'Refund exceeds refundable payment amount',
                    );

                case 'IDEMPOTENCY_KEY_REUSED':

                    throw new ConflictException(
                        'Idempotency key was already used for another request',
                    );

                default:

                    throw error;
            }
        }
    }
}