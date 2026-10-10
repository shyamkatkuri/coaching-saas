import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    createClient,
} from 'redis';

@Injectable()
export class RedisService
    implements
    OnModuleInit,
    OnModuleDestroy {

    private readonly logger =
        new Logger(
            RedisService.name,
        );

    private readonly client:
        ReturnType<
            typeof createClient
        >;

    constructor(
        private readonly config:
            ConfigService,
    ) {

        const url =
            this.config
                .getOrThrow<string>(
                    'REDIS_URL',
                );

        this.client =
            createClient({
                url,

                socket: {

                    connectTimeout:
                        5_000,

                    reconnectStrategy:
                        (
                            retries:
                                number,
                        ) => {

                            return Math.min(
                                retries * 200,
                                3_000,
                            );
                        },
                },
            });

        this.client.on(
            'error',
            error => {

                this.logger.error(
                    'Redis client error',
                    error,
                );
            },
        );

        this.client.on(
            'connect',
            () => {

                this.logger.log(
                    'Redis connecting',
                );
            },
        );

        this.client.on(
            'ready',
            () => {

                this.logger.log(
                    'Redis ready',
                );
            },
        );

        this.client.on(
            'reconnecting',
            () => {

                this.logger.warn(
                    'Redis reconnecting',
                );
            },
        );
    }

    async onModuleInit():
        Promise<void> {

        try {

            if (
                !this.client.isOpen
            ) {

                await this.client
                    .connect();
            }

            const pong =
                await this.client
                    .ping();

            this.logger.log(
                `Redis health: ${pong}`,
            );

        } catch (error) {

            /*
             * IMPORTANT:
             *
             * We intentionally do not crash
             * Core API startup here.
             *
             * Read caching can gracefully
             * fall back to PostgreSQL.
             *
             * Correctness-critical operations
             * using distributed locks will
             * fail closed separately.
             */

            this.logger.error(
                'Redis unavailable during startup',
                error,
            );
        }
    }

    async onModuleDestroy():
        Promise<void> {

        try {

            if (
                this.client.isOpen
            ) {

                await this.client
                    .quit();
            }

        } catch (error) {

            this.logger.warn(
                'Redis shutdown failed',
            );
        }
    }

    isReady(): boolean {

        return (
            this.client.isOpen &&
            this.client.isReady
        );
    }

    async ping():
        Promise<string> {

        this.ensureAvailable();

        return this.client
            .ping();
    }

    async get(
        key: string,
    ): Promise<
        string | null
    > {

        this.ensureAvailable();

        return this.client.get(
            key,
        );
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ): Promise<void> {

        this.ensureAvailable();

        if (
            ttlSeconds &&
            ttlSeconds > 0
        ) {

            await this.client.set(
                key,
                value,
                {
                    EX:
                        ttlSeconds,
                },
            );

            return;
        }

        await this.client.set(
            key,
            value,
        );
    }

    async setNxPx(
        key: string,
        value: string,
        ttlMs: number,
    ): Promise<boolean> {

        this.ensureAvailable();

        const result =
            await this.client.set(
                key,
                value,
                {
                    NX: true,
                    PX: ttlMs,
                },
            );

        return (
            result === 'OK'
        );
    }

    async del(
        ...keys: string[]
    ): Promise<number> {

        this.ensureAvailable();

        if (
            keys.length === 0
        ) {
            return 0;
        }

        return this.client.del(
            keys,
        );
    }

    async increment(
        key: string,
    ): Promise<number> {

        this.ensureAvailable();

        return this.client.incr(
            key,
        );
    }

    async expireMilliseconds(
        key: string,
        milliseconds: number,
    ): Promise<boolean | number> {

        this.ensureAvailable();

        return this.client.pExpire(key, milliseconds,);
    }

    async eval(
        script: string,
        keys: string[],
        args: string[],
    ): Promise<unknown> {

        this.ensureAvailable();

        return this.client.eval(
            script,
            {
                keys,
                arguments:
                    args,
            },
        );
    }

    async getJson<T>(
        key: string,
    ): Promise<
        T | null
    > {

        const value =
            await this.get(
                key,
            );

        if (
            value === null
        ) {
            return null;
        }

        return JSON.parse(
            value,
        ) as T;
    }

    async setJson<T>(
        key: string,
        value: T,
        ttlSeconds: number,
    ): Promise<void> {

        await this.set(
            key,
            JSON.stringify(
                value,
            ),
            ttlSeconds,
        );
    }

    private ensureAvailable():
        void {

        if (
            !this.isReady()
        ) {

            throw new Error(
                'REDIS_UNAVAILABLE',
            );
        }
    }
}