import {
    Injectable,
} from '@nestjs/common';

import {
    randomUUID,
} from 'node:crypto';

import type {
    IntegrationEventEnvelope,
    IntegrationEventType,
} from '@coaching/contracts';

import type {
    CreateOutboxEvent,
} from './outbox.types';

interface CreateIntegrationEventOptions<
    T,
> {

    topic: string;

    eventType:
    IntegrationEventType;

    aggregateType:
    string;

    aggregateId:
    string;

    organizationId?:
    string;

    branchId?:
    string;

    actorUserId?:
    string | null;

    correlationId?:
    string;

    causationId?:
    string | null;

    data: T;
}

@Injectable()
export class OutboxEventFactory {

    create<T>(
        options:
            CreateIntegrationEventOptions<T>,
    ): CreateOutboxEvent {

        const eventId =
            randomUUID();

        const correlationId =
            options.correlationId ??
            randomUUID();

        const envelope:
            IntegrationEventEnvelope<T> =
        {

            eventId,

            eventType:
                options.eventType,

            version: 1,

            producer:
                'core-api',

            occurredAt:
                new Date()
                    .toISOString(),

            correlationId,

            causationId:
                options.causationId ??
                null,

            organizationId:
                options.organizationId,

            branchId:
                options.branchId,

            aggregate: {

                type:
                    options.aggregateType,

                id:
                    options.aggregateId,
            },

            actor: {

                applicationUserId:
                    options.actorUserId ??
                    null,
            },

            data:
                options.data,
        };

        return {

            id:
                eventId,

            topic:
                options.topic,

            /*
             * Events for the same aggregate
             * use the same Kafka key.
             */
            eventKey:
                options.aggregateId,

            eventType:
                options.eventType,

            eventVersion:
                1,

            payload:
                envelope,

            headers: {

                'event-id':
                    eventId,

                'event-type':
                    options.eventType,

                'event-version':
                    '1',

                'correlation-id':
                    correlationId,

                producer:
                    'core-api',
            },
        };
    }
}