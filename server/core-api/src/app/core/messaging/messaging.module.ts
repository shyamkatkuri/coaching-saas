import {
    Global,
    Module,
} from '@nestjs/common';

import {
    ScheduleModule,
} from '@nestjs/schedule';

import {
    KafkaProducerService,
} from './kafka/kafka-producer.service';

import {
    OutboxEventFactory,
} from './outbox/outbox-event.factory';

import {
    OutboxWriterService,
} from './outbox/outbox-writer.service';

import {
    OutboxRepositoryService,
} from './outbox/outbox-repository.service';

import {
    OutboxPublisherService,
} from './outbox/outbox-publisher.service';

@Global()
@Module({

    imports: [

        ScheduleModule.forRoot(),
    ],

    providers: [

        KafkaProducerService,

        OutboxEventFactory,

        OutboxWriterService,

        OutboxRepositoryService,

        OutboxPublisherService,
    ],

    exports: [

        OutboxEventFactory,

        OutboxWriterService,
    ],
})
export class MessagingModule { }