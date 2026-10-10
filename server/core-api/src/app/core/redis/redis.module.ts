import {
    Global,
    Module,
} from '@nestjs/common';

import {
    APP_GUARD,
} from '@nestjs/core';

import {
    RedisService,
} from './redis.service';

import {
    AppCacheService,
} from './cache/app-cache.service';

import {
    CacheKeyFactory,
} from './cache/cache-key.factory';

import {
    DistributedLockService,
} from './lock/distributed-lock.service';

import {
    RedisRateLimitService,
} from './rate-limit/redis-rate-limit.service';

import {
    RedisRateLimitGuard,
} from './rate-limit/redis-rate-limit.guard';

@Global()
@Module({

    providers: [

        RedisService,

        AppCacheService,

        CacheKeyFactory,

        DistributedLockService,

        RedisRateLimitService,

        {
            provide:
                APP_GUARD,

            useClass:
                RedisRateLimitGuard,
        },
    ],

    exports: [

        RedisService,

        AppCacheService,

        CacheKeyFactory,

        DistributedLockService,

        RedisRateLimitService,
    ],
})
export class RedisModule { }