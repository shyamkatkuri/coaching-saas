import {
    Global,
    Module,
} from '@nestjs/common';

import {
    APP_FILTER,
} from '@nestjs/core';

import {
    RequestContextService,
} from './context/request-context.service';

import {
    CorrelationIdMiddleware,
} from './http/correlation-id.middleware';

import {
    AppLoggerService,
} from './logging/app-logger.service';

import {
    DatabaseModule,
} from './database/database.module';

import {
    GlobalExceptionFilter,
} from './errors/global-exception.filter';
import { SecurityModule } from './security/security.module';

@Global()
@Module({
    imports: [
        DatabaseModule,
        SecurityModule
    ],

    providers: [
        RequestContextService,

        CorrelationIdMiddleware,

        AppLoggerService,

        {
            provide: APP_FILTER,
            useClass:
                GlobalExceptionFilter,
        },
    ],

    exports: [
        RequestContextService,

        CorrelationIdMiddleware,

        AppLoggerService,

        DatabaseModule,
    ],
})
export class CoreModule { }