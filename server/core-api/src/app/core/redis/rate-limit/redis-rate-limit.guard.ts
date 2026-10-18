import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';

import {
    Reflector,
} from '@nestjs/core';

import type {
    Request,
    Response,
} from 'express';

import {
    CacheKeyFactory,
} from '../cache/cache-key.factory';

import {
    RedisService,
} from '../redis.service';

import {
    RATE_LIMIT_KEY,
} from './rate-limit.decorator';

import type {
    RateLimitOptions,
} from './rate-limit.decorator';

import {
    RedisRateLimitService,
} from './redis-rate-limit.service';
import { getExecutionOperation, getExecutionParams, getExecutionRequest } from '../../security/execution-request.util';

interface RequestWithAuth
    extends Request {

    applicationUserId?:
    string;

    user?: {
        sub?: string;
    };
}

@Injectable()
export class RedisRateLimitGuard
    implements CanActivate {

    constructor(
        private readonly reflector:
            Reflector,

        private readonly limiter:
            RedisRateLimitService,

        private readonly redis:
            RedisService,

        private readonly keys:
            CacheKeyFactory,
    ) { }

    async canActivate(
        context:
            ExecutionContext,
    ): Promise<boolean> {

        const options =
            this.reflector
                .getAllAndOverride<
                    RateLimitOptions
                >(
                    RATE_LIMIT_KEY,
                    [
                        context.getHandler(),
                        context.getClass(),
                    ],
                );

        /*
         * No decorator →
         * this guard does nothing.
         */
        if (!options) {
            return true;
        }

        if (
            !this.redis.isReady()
        ) {

            if (
                options.failClosed
            ) {

                throw new ServiceUnavailableException(
                    'Rate limiting service unavailable',
                );
            }

            return true;
        }

        const http =
            context.switchToHttp();

        const request =
            getExecutionRequest(
                context,
            );

        const response =
            http.getResponse<
                Response
            >();

        const identity =
            this.getIdentity(
                context,
                request,
                options,
            );

        const operation =
            getExecutionOperation(
                context,
            );

        const key =
            this.keys.rateLimit(
                identity,
                operation,
            );

        const result =
            await this.limiter
                .consume(
                    key,
                    options.limit,
                    options.windowMs,
                );

        response.setHeader(
            'X-RateLimit-Limit',
            String(
                options.limit,
            ),
        );

        response.setHeader(
            'X-RateLimit-Remaining',
            String(
                result.remaining,
            ),
        );

        if (
            result.ttlMs > 0
        ) {

            response.setHeader(
                'Retry-After',
                String(
                    Math.ceil(
                        result.ttlMs /
                        1000,
                    ),
                ),
            );
        }

        if (
            !result.allowed
        ) {

            throw new HttpException(
                'Too many requests',
                HttpStatus
                    .TOO_MANY_REQUESTS,
            );
        }

        return true;
    }

    private getIdentity(
        context:
            ExecutionContext,
        request:
            RequestWithAuth,

        options:
            RateLimitOptions,
    ): string | string[] {

        switch (
        options.scope
        ) {

            case 'USER':

                return (
                    request
                        .applicationUserId ??
                    request.user?.sub ??
                    request.ip ??
                    'anonymous'
                );

            case 'TENANT':
                const params = getExecutionParams(context);
                return (params['organizationId'] ?? request.ip ?? 'unknown');

            case 'IP':
            default:

                return (
                    request.ip ??
                    'unknown'
                );
        }
    }
}