import {
    Injectable,
} from '@nestjs/common';

import type {
    IntegrationEventEnvelope,
} from '@coaching/contracts';

import {
    AuditDatabaseService,
} from '../database/audit-database.service';

export interface KafkaAuditMetadata {

    topic:
    string;

    partition:
    number;

    offset:
    string;
}

@Injectable()
export class AuditService {

    private readonly consumerName =
        'audit-service-v1';

    constructor(
        private readonly database:
            AuditDatabaseService,
    ) { }

    async record(
        event:
            IntegrationEventEnvelope,

        metadata:
            KafkaAuditMetadata,
    ): Promise<
        'PROCESSED'
        | 'DUPLICATE'
    > {

        const client =
            await this.database
                .pool
                .connect();

        try {

            await client.query(
                'BEGIN',
            );

            const processed =
                await client.query(
                    `
          SELECT 1

          FROM processed_events

          WHERE consumer_name = $1
            AND event_id = $2

          LIMIT 1
          `,
                    [
                        this.consumerName,
                        event.eventId,
                    ],
                );

            if (
                processed.rowCount !==
                0
            ) {

                await client.query(
                    'COMMIT',
                );

                return 'DUPLICATE';
            }

            await client.query(
                `
        INSERT INTO audit_events (
          event_id,
          event_type,
          event_version,
          topic,
          partition_number,
          kafka_offset,
          correlation_id,
          organization_id,
          branch_id,
          aggregate_type,
          aggregate_id,
          actor_user_id,
          occurred_at,
          payload
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,
          $7,$8,$9,$10,$11,$12,
          $13,$14::jsonb
        )
        `,
                [
                    event.eventId,
                    event.eventType,
                    event.version,

                    metadata.topic,
                    metadata.partition,
                    metadata.offset,

                    event.correlationId,

                    event.organizationId ??
                    null,

                    event.branchId ??
                    null,

                    event.aggregate.type,
                    event.aggregate.id,

                    event.actor
                        .applicationUserId ??
                    null,

                    event.occurredAt,

                    JSON.stringify(
                        event,
                    ),
                ],
            );

            await client.query(
                `
        INSERT INTO processed_events (
          consumer_name,
          event_id
        )
        VALUES (
          $1,
          $2
        )
        `,
                [
                    this.consumerName,
                    event.eventId,
                ],
            );

            await client.query(
                'COMMIT',
            );

            return 'PROCESSED';

        } catch (error) {

            await client.query(
                'ROLLBACK',
            );

            throw error;

        } finally {

            client.release();
        }
    }
}