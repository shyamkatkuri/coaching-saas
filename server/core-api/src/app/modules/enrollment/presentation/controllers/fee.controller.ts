import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Req,
} from '@nestjs/common';

import {
    RequireAccess,
} from '../../../../core/security/authorization/require-access.decorator';

import type {
    AuthenticatedRequest,
} from '../../../../core/security/authentication/jwt-auth.guard';

import {
    FeeApplicationService,
} from '../../application/fee-application.service';

import {
    CollectPaymentDto,
} from '../dto/collect-payment.dto';

import {
    RefundPaymentDto,
} from '../dto/refund-payment.dto';
import { RateLimit } from '../../../../core/redis/rate-limit/rate-limit.decorator';

@Controller(
    'organizations/:organizationId/branches/:branchId',
)
export class FeeController {

    constructor(
        private readonly service:
            FeeApplicationService,
    ) { }

    @Get(
        'enrollments/:enrollmentId/fees',
    )
    @RateLimit({
        limit:
            100,

        windowMs:
            60_000,

        scope:
            'USER',

        failClosed:
            false,
    })
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
    summary(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Param(
            'enrollmentId',
        )
        enrollmentId: string,
    ) {

        return this.service
            .getSummary(
                organizationId,
                branchId,
                enrollmentId,
            );
    }

    @Post(
        'enrollments/:enrollmentId/payments',
    )
    @RateLimit({
        limit: 10,
        windowMs: 60_000,
        scope: 'USER',

        /*
         * Financial endpoint.
         *
         * If Redis rate-limit
         * infrastructure fails,
         * fail closed.
         */
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
    collect(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Param(
            'enrollmentId',
        )
        enrollmentId: string,

        @Headers(
            'idempotency-key',
        )
        idempotencyKey:
            string | undefined,

        @Body()
        dto:
            CollectPaymentDto,

        @Req()
        request:
            AuthenticatedRequest,
    ) {

        if (
            !idempotencyKey
        ) {
            throw new BadRequestException(
                'Idempotency-Key header is required',
            );
        }

        return this.service
            .collectPayment(
                organizationId,
                branchId,
                enrollmentId,
                dto,
                idempotencyKey,
                request
                    .applicationUserId,
            );
    }

    @Post(
        'payments/:paymentId/refunds',
    )
    @RateLimit({
        limit:
            5,

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
    refund(
        @Param(
            'organizationId',
        )
        organizationId: string,

        @Param(
            'branchId',
        )
        branchId: string,

        @Param(
            'paymentId',
        )
        paymentId: string,

        @Headers(
            'idempotency-key',
        )
        idempotencyKey:
            string | undefined,

        @Body()
        dto:
            RefundPaymentDto,

        @Req()
        request:
            AuthenticatedRequest,
    ) {

        if (
            !idempotencyKey
        ) {
            throw new BadRequestException(
                'Idempotency-Key header is required',
            );
        }

        return this.service
            .refundPayment(
                organizationId,
                branchId,
                paymentId,
                dto,
                idempotencyKey,
                request
                    .applicationUserId,
            );
    }
}