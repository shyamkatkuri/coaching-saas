import {
    Injectable,
} from '@nestjs/common';

import {
    QueryResult,
    QueryResultRow,
} from 'pg';

import {
    DATABASES,
} from './database.constants';

import {
    DatabaseRegistryService,
} from './database-registry.service';

@Injectable()
export class DatabaseService {
    constructor(
        private readonly registry:
            DatabaseRegistryService,
    ) { }

    query<
        T extends QueryResultRow,
    >(
        sql: string,
        values: unknown[] = [],
    ): Promise<QueryResult<T>> {
        return this.registry.query<T>(
            DATABASES.TENANT,
            sql,
            values,
        );
    }
}