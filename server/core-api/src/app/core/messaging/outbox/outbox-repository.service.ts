import {
    Injectable,
} from '@nestjs/common';

import {
    DatabaseRegistryService,
} from '../../database/database-registry.service';

import type {
    PendingOutboxEvent,
} from './outbox.types';

@Injectable()
export class OutboxRepositoryService {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    async claim(
        databaseName: string,
        workerId: string,
        batchSize: number,
        timeoutSeconds: number,
    ): Promise<
        PendingOutboxEvent[]
    > {

        const db =
            this.databases.getPool(
                databaseName as any,
            );

        const result =
            await db.query(
                `
        WITH candidates AS (

          SELECT id

          FROM outbox_events

          WHERE
          (
              status = 'PENDING'
              AND available_at <= NOW()
          )
          OR
          (
              status = 'PROCESSING'
              AND locked_at <
                  NOW()
                  - ($3::int * INTERVAL '1 second')
          )

          ORDER BY created_at

          FOR UPDATE
          SKIP LOCKED

          LIMIT $1
        )

        UPDATE outbox_events o

        SET
          status =
            'PROCESSING',

          locked_at =
            NOW(),

          locked_by =
            $2,

          attempts =
            o.attempts + 1

        FROM candidates c

        WHERE o.id =
              c.id

        RETURNING
          o.id,
          o.topic,
          o.event_key,
          o.event_type,
          o.event_version,
          o.payload,
          o.headers,
          o.attempts
        `,
                [
                    batchSize,
                    workerId,
                    timeoutSeconds,
                ],
            );

        return result.rows.map(
            row => ({

                id:
                    row.id,

                topic:
                    row.topic,

                eventKey:
                    row.event_key,

                eventType:
                    row.event_type,

                eventVersion:
                    row.event_version,

                payload:
                    row.payload,

                headers:
                    row.headers,

                attempts:
                    row.attempts,
            }),
        );
    }

    async markPublished(
        databaseName:
            string,

        eventId:
            string,
    ): Promise<void> {

        const db =
            this.databases.getPool(
                databaseName as any,
            );

        await db.query(
            `
      UPDATE outbox_events

      SET
        status =
          'PUBLISHED',

        published_at =
          NOW(),

        locked_at =
          NULL,

        locked_by =
          NULL,

        last_error =
          NULL

      WHERE id =
            $1
      `,
            [
                eventId,
            ],
        );
    }

    async markFailed(
        databaseName:
            string,

        eventId:
            string,

        error:
            string,

        attempts:
            number,

        maxAttempts:
            number,
    ): Promise<void> {

        const db =
            this.databases.getPool(
                databaseName as any,
            );

        const terminal =
            attempts >=
            maxAttempts;

        const delaySeconds =
            Math.min(
                Math.pow(
                    2,
                    attempts,
                ),
                60,
            );

        await db.query(
            `
      UPDATE outbox_events

      SET
        status =
          $2,

        available_at =
          NOW()
          + (
              $3::int
              * INTERVAL '1 second'
            ),

        locked_at =
          NULL,

        locked_by =
          NULL,

        last_error =
          $4

      WHERE id =
            $1
      `,
            [
                eventId,

                terminal
                    ? 'FAILED'
                    : 'PENDING',

                delaySeconds,

                error.slice(
                    0,
                    4000,
                ),
            ],
        );
    }
}