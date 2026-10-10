import {
    SetMetadata,
} from '@nestjs/common';

export const RATE_LIMIT_KEY =
    'redis-rate-limit';

export type RateLimitScope =
    | 'IP'
    | 'USER'
    | 'TENANT';

export interface RateLimitOptions {

    limit: number;

    windowMs: number;

    scope:
    RateLimitScope;

    /*
     * false:
     * Redis unavailable →
     * allow request.
     *
     * true:
     * Redis unavailable →
     * 503.
     */
    failClosed?: boolean;
}

export const RateLimit = (
    options:
        RateLimitOptions,
) =>
    SetMetadata(
        RATE_LIMIT_KEY,
        options,
    );