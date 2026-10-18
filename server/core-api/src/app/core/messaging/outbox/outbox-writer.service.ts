import {
    Injectable,
} from '@nestjs/common';

import type {
    PoolClient,
} from 'pg';

import type {
    CreateOutboxEvent,
} from './outbox.types';

@Injectable()
export class OutboxWriterService {

    async write(
        client:
            PoolClient,

        event:
            CreateOutboxEvent,
    ): Promise<void> {

        await client.query(
            `
      INSERT INTO outbox_events (
        id,
        topic,
        event_key,
        event_type,
        event_version,
        payload,
        headers,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6::jsonb,
        $7::jsonb,
        'PENDING'
      )
      `,
            [
                event.id,
                event.topic,
                event.eventKey,
                event.eventType,
                event.eventVersion,

                JSON.stringify(
                    event.payload,
                ),

                JSON.stringify(
                    event.headers,
                ),
            ],
        );
    }
}