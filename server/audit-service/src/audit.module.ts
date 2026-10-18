import {
    Module,
} from '@nestjs/common';

import {
    ConfigModule,
} from '@nestjs/config';

import {
    AuditDatabaseService,
} from './database/audit-database.service';

import {
    AuditService,
} from './application/audit.service';

import {
    AuditEventController,
} from './kafka/audit-event.controller';

import {
    AuditRetryFilter,
} from './kafka/audit-retry.filter';

import {
    kafkaProducerProvider,
} from './kafka/kafka-producer.provider';

@Module({

    imports: [

        ConfigModule.forRoot({
            isGlobal:
                true,
        }),
    ],

    controllers: [

        AuditEventController,
    ],

    providers: [

        AuditDatabaseService,

        AuditService,

        kafkaProducerProvider,

        AuditRetryFilter,
    ],
})
export class AuditModule { }