import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
    Pool,
    QueryResult,
    QueryResultRow,
} from 'pg';

import {
    DATABASES,
    DatabaseName,
} from './database.constants';

import { AppLoggerService } from '../logging/app-logger.service';

@Injectable()
export class DatabaseRegistryService
    implements
    OnModuleInit,
    OnModuleDestroy {
    private readonly pools =
        new Map<DatabaseName, Pool>();

    constructor(
        private readonly config:
            ConfigService,

        private readonly logger:
            AppLoggerService,
    ) { }

    async onModuleInit(): Promise<void> {
        const tenantPool =
            new Pool({
                host:
                    this.config.getOrThrow<string>(
                        'DB_HOST',
                    ),

                port:
                    this.config.get<number>(
                        'DB_PORT',
                    ) ?? 5432,

                database:
                    this.config.getOrThrow<string>(
                        'DB_NAME',
                    ),

                user:
                    this.config.getOrThrow<string>(
                        'DB_USER',
                    ),

                password:
                    this.config.getOrThrow<string>(
                        'DB_PASSWORD',
                    ),

                max: 10,

                idleTimeoutMillis: 30_000,

                connectionTimeoutMillis: 5_000,
            });

        this.pools.set(
            DATABASES.TENANT,
            tenantPool,
        );

        await tenantPool.query(
            'SELECT 1',
        );

        this.logger.log(
            'Connected to tenant database',
            DatabaseRegistryService.name,
        );
    }

    getPool(
        name: DatabaseName,
    ): Pool {
        const pool =
            this.pools.get(name);

        if (!pool) {
            throw new Error(
                `Database pool '${name}' has not been configured`,
            );
        }

        return pool;
    }

    async query<
        T extends QueryResultRow,
    >(
        database: DatabaseName,
        sql: string,
        values: unknown[] = [],
    ): Promise<QueryResult<T>> {
        const pool =
            this.getPool(database);

        return pool.query<T>(
            sql,
            values,
        );
    }

    async onModuleDestroy(): Promise<void> {
        const pools =
            Array.from(
                this.pools.values(),
            );

        await Promise.all(
            pools.map(
                pool =>
                    pool.end(),
            ),
        );

        this.logger.log(
            'Database connections closed',
            DatabaseRegistryService.name,
        );
    }
}