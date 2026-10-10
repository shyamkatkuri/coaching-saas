import {
    ConflictException,
    Injectable,
    Logger,
    ServiceUnavailableException,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    randomUUID,
} from 'node:crypto';

import {
    RedisService,
} from '../redis.service';

import {
    REDIS_DEFAULTS,
} from '../redis.constants';

const RELEASE_LOCK_SCRIPT = `
if redis.call(
  'GET',
  KEYS[1]
) == ARGV[1]
then
  return redis.call(
    'DEL',
    KEYS[1]
  )
else
  return 0
end
`;

@Injectable()
export class DistributedLockService {

    private readonly logger =
        new Logger(
            DistributedLockService.name,
        );

    private readonly defaultTtlMs:
        number;

    private readonly defaultWaitMs:
        number;

    constructor(
        private readonly redis:
            RedisService,

        config:
            ConfigService,
    ) {

        this.defaultTtlMs =
            Number(
                config.get<number>(
                    'REDIS_LOCK_TTL_MS',
                ) ??
                REDIS_DEFAULTS
                    .LOCK_TTL_MS,
            );

        this.defaultWaitMs =
            Number(
                config.get<number>(
                    'REDIS_LOCK_WAIT_MS',
                ) ??
                REDIS_DEFAULTS
                    .LOCK_WAIT_MS,
            );
    }

    async withLock<T>(
        key: string,
        operation:
            () =>
                Promise<T>,
        options?: {
            ttlMs?: number;
            waitMs?: number;
        },
    ): Promise<T> {

        /*
         * Locks must fail CLOSED.
         *
         * If Redis is unavailable,
         * we cannot safely guarantee
         * cross-instance serialization.
         */

        if (
            !this.redis.isReady()
        ) {

            throw new ServiceUnavailableException(
                'Distributed coordination service is unavailable',
            );
        }

        const ttlMs =
            options?.ttlMs ??
            this.defaultTtlMs;

        const waitMs =
            options?.waitMs ??
            this.defaultWaitMs;

        const token =
            randomUUID();

        const deadline =
            Date.now() +
            waitMs;

        let acquired =
            false;

        while (
            Date.now() <
            deadline
        ) {

            try {

                acquired =
                    await this.redis
                        .setNxPx(
                            key,
                            token,
                            ttlMs,
                        );

            } catch (error) {

                throw new ServiceUnavailableException(
                    'Distributed coordination service is unavailable',
                );
            }

            if (
                acquired
            ) {
                break;
            }

            await this.sleep(
                REDIS_DEFAULTS
                    .LOCK_RETRY_DELAY_MS,
            );
        }

        if (
            !acquired
        ) {

            throw new ConflictException(
                'Another operation is currently processing this resource',
            );
        }

        try {

            return await operation();

        } finally {

            try {

                await this.redis.eval(
                    RELEASE_LOCK_SCRIPT,
                    [
                        key,
                    ],
                    [
                        token,
                    ],
                );

            } catch (error) {

                /*
                 * Do not overwrite the result
                 * of a successful DB operation.
                 *
                 * The lock also has a TTL.
                 */

                this.logger.warn(
                    `Failed to release lock: ${key}`,
                );
            }
        }
    }

    private sleep(
        milliseconds: number,
    ): Promise<void> {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds,
                ),
        );
    }
}