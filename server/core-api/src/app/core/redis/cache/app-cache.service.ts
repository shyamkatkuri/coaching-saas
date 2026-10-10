import {
    Injectable,
    Logger,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    RedisService,
} from '../redis.service';

@Injectable()
export class AppCacheService {

    private readonly logger =
        new Logger(
            AppCacheService.name,
        );

    private readonly defaultTtl:
        number;

    constructor(
        private readonly redis:
            RedisService,

        config:
            ConfigService,
    ) {

        this.defaultTtl =
            Number(
                config.get<number>(
                    'REDIS_DEFAULT_CACHE_TTL_SECONDS',
                ) ??
                60,
            );
    }

    async getOrSet<T>(
        key: string,
        loader:
            () =>
                Promise<T>,
        ttlSeconds:
            number =
            this.defaultTtl,
    ): Promise<T> {

        /*
         * Cache should fail OPEN.
         *
         * Redis failure should not make
         * a normal read API unavailable.
         */

        if (
            this.redis.isReady()
        ) {

            try {

                const cached =
                    await this.redis
                        .getJson<T>(
                            key,
                        );

                if (
                    cached !== null
                ) {

                    return cached;
                }

            } catch (error) {

                this.logger.warn(
                    `Cache read failed: ${key}`,
                );
            }
        }

        const value =
            await loader();

        if (
            this.redis.isReady()
        ) {

            try {

                await this.redis
                    .setJson(
                        key,
                        value,
                        ttlSeconds,
                    );

            } catch (error) {

                this.logger.warn(
                    `Cache write failed: ${key}`,
                );
            }
        }

        return value;
    }

    async invalidate(
        ...keys: string[]
    ): Promise<void> {

        if (
            !this.redis.isReady()
        ) {
            return;
        }

        try {

            await this.redis.del(
                ...keys,
            );

        } catch (error) {

            this.logger.warn(
                'Cache invalidation failed',
            );
        }
    }
}