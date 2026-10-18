import {
    Logger,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    IoAdapter,
} from '@nestjs/platform-socket.io';

import {
    createAdapter,
} from '@socket.io/redis-adapter';

import {
    createClient,
} from 'redis';

import type {
    INestApplicationContext,
} from '@nestjs/common';

import type {
    ServerOptions,
} from 'socket.io';

export class RedisIoAdapter
    extends IoAdapter {

    private readonly redisLogger =
        new Logger(
            RedisIoAdapter.name,
        );

    private readonly config:
        ConfigService;

    private adapterConstructor?:
        ReturnType<
            typeof createAdapter
        >;

    constructor(
        app:
            INestApplicationContext,
    ) {

        super(app);

        this.config =
            app.get(
                ConfigService,
            );
    }

    async connectToRedis():
        Promise<void> {

        const url =
            this.config
                .getOrThrow<string>(
                    'REDIS_URL',
                );

        const pubClient =
            createClient({
                url,
            });

        const subClient =
            pubClient.duplicate();

        pubClient.on(
            'error',
            error => {

                this.redisLogger.error(
                    'Socket Redis publisher error',
                    error,
                );
            },
        );

        subClient.on(
            'error',
            error => {

                this.redisLogger.error(
                    'Socket Redis subscriber error',
                    error,
                );
            },
        );

        await Promise.all([

            pubClient
                .connect(),

            subClient
                .connect(),
        ]);

        this.adapterConstructor =
            createAdapter(
                pubClient,
                subClient,
            );

        this.redisLogger.log(
            'Socket.IO Redis adapter ready',
        );
    }

    createIOServer(
        port: number,

        options?:
            ServerOptions,
    ): any {

        const origins =
            (
                this.config
                    .get<string>(
                        'WS_ALLOWED_ORIGINS',
                    ) ??
                'http://localhost:4200'
            )
                .split(',')
                .map(
                    value =>
                        value.trim(),
                )
                .filter(Boolean);

        const server =
            super.createIOServer(
                port,

                {
                    ...options,

                    transports: [
                        'websocket',
                    ],

                    cors: {

                        origin:
                            origins,

                        credentials:
                            true,
                    },
                } as ServerOptions,
            );

        if (
            this.adapterConstructor
        ) {

            server.adapter(
                this.adapterConstructor,
            );
        }

        return server;
    }
}