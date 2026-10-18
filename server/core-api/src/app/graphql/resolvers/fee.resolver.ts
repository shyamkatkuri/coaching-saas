import {
    Args,
    Context,
    ID,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql';

import {
    RequireAccess,
} from '../../core/security/authorization/require-access.decorator';

import {
    RateLimit,
} from '../../core/redis/rate-limit/rate-limit.decorator';

import type {
    AuthenticatedRequest,
} from '../../core/security/authentication/jwt-auth.guard';

import {
    FeeApplicationService,
} from '../../modules/enrollment/application/fee-application.service';

import {
    CollectPaymentInput,
} from '../inputs/collect-payment.input';

import {
    RefundPaymentInput,
} from '../inputs/refund-payment.input';

import {
    FeeSummaryType,
    PaymentRefundType,
    PaymentType,
} from '../types/fee.type';

@Resolver()
export class FeeResolver {

    constructor(
        private readonly fees:
            FeeApplicationService,
    ) { }

    @Query(
        () =>
            FeeSummaryType,
    )
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'fee:read',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    feeSummary(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args(
            'enrollmentId',
            {
                type:
                    () => ID,
            },
        )
        enrollmentId:
            string,
    ) {

        return this.fees
            .getSummary(
                organizationId,
                branchId,
                enrollmentId,
            );
    }

    @Mutation(
        () =>
            PaymentType,
    )
    @RateLimit({
        limit: 10,

        windowMs:
            60_000,

        scope:
            'USER',

        failClosed:
            true,
    })
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'fee:collect',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    collectFeePayment(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args(
            'enrollmentId',
            {
                type:
                    () => ID,
            },
        )
        enrollmentId:
            string,

        @Args('input')
        input:
            CollectPaymentInput,

        @Context('req')
        request:
            AuthenticatedRequest,
    ) {

        return this.fees
            .collectPayment(
                organizationId,
                branchId,
                enrollmentId,

                {
                    amount:
                        input.amount,

                    paymentMethod:
                        input.paymentMethod,

                    referenceNo:
                        input.referenceNo,
                },

                input.idempotencyKey,

                request
                    .applicationUserId,
            );
    }

    @Mutation(
        () =>
            PaymentRefundType,
    )
    @RateLimit({
        limit: 5,

        windowMs:
            60_000,

        scope:
            'USER',

        failClosed:
            true,
    })
    @RequireAccess({
        scope:
            'BRANCH',

        permissions: [
            'fee:refund',
        ],

        tenantParam:
            'organizationId',

        branchParam:
            'branchId',
    })
    refundFeePayment(
        @Args(
            'organizationId',
            {
                type:
                    () => ID,
            },
        )
        organizationId:
            string,

        @Args(
            'branchId',
            {
                type:
                    () => ID,
            },
        )
        branchId:
            string,

        @Args(
            'paymentId',
            {
                type:
                    () => ID,
            },
        )
        paymentId:
            string,

        @Args('input')
        input:
            RefundPaymentInput,

        @Context('req')
        request:
            AuthenticatedRequest,
    ) {

        return this.fees
            .refundPayment(
                organizationId,
                branchId,
                paymentId,

                {
                    amount:
                        input.amount,

                    reason:
                        input.reason,
                },

                input.idempotencyKey,

                request
                    .applicationUserId,
            );
    }
}