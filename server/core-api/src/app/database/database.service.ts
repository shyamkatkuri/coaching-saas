import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService
    implements OnModuleInit, OnModuleDestroy {
    private readonly pool: Pool;

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            database: this.configService.get<string>('DB_NAME'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            max: 10,
        });
    }

    async onModuleInit(): Promise<void> {
        await this.pool.query('SELECT 1');

        console.log('tenant_db connection established');
    }

    async query<T extends QueryResultRow>(
        query: string,
        values: unknown[] = [],
    ) {
        return this.pool.query<T>(query, values);
    }

    async onModuleDestroy(): Promise<void> {
        await this.pool.end();
    }
}