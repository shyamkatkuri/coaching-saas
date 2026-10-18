import {
    Injectable,
    OnModuleDestroy,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    Pool,
} from 'pg';

@Injectable()
export class AuditDatabaseService
    implements OnModuleDestroy {

    readonly pool:
        Pool;

    constructor(
        config:
            ConfigService,
    ) {

        this.pool =
            new Pool({

                host:
                    config.getOrThrow(
                        'AUDIT_DB_HOST',
                    ),

                port:
                    Number(
                        config.getOrThrow(
                            'AUDIT_DB_PORT',
                        ),
                    ),

                database:
                    config.getOrThrow(
                        'AUDIT_DB_NAME',
                    ),

                user:
                    config.getOrThrow(
                        'AUDIT_DB_USER',
                    ),

                password:
                    config.getOrThrow(
                        'AUDIT_DB_PASSWORD',
                    ),

                max: 10,
            });
    }

    async onModuleDestroy():
        Promise<void> {

        await this.pool.end();
    }
}