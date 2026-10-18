import {
    Injectable,
    Logger,
    OnModuleDestroy,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    Kafka,
    Producer,
} from 'kafkajs';

import type {
    PendingOutboxEvent,
} from '../outbox/outbox.types';

@Injectable()
export class KafkaProducerService
    implements OnModuleDestroy {

    private readonly logger =
        new Logger(
            KafkaProducerService.name,
        );

    private readonly producer:
        Producer;

    private connected =
        false;

    private connecting?:
        Promise<void>;

    constructor(
        config:
            ConfigService,
    ) {

        const brokers =
            config
                .getOrThrow<string>(
                    'KAFKA_BROKERS',
                )
                .split(',')
                .map(
                    broker =>
                        broker.trim(),
                );

        const clientId =
            config.get<string>(
                'KAFKA_CLIENT_ID',
            ) ??
            'coaching-core-api';

        const kafka =
            new Kafka({

                clientId,

                brokers,

                retry: {

                    retries:
                        10,
                },
            });

        this.producer =
            kafka.producer({

                /*
                 * Protects against duplicate
                 * writes caused by producer
                 * retry within the Kafka
                 * producer session.
                 *
                 * Consumer idempotency is
                 * STILL required.
                 */
                idempotent:
                    true,

                maxInFlightRequests:
                    1,

                allowAutoTopicCreation:
                    false,
            });
    }

    async publish(
        event:
            PendingOutboxEvent,
    ): Promise<void> {

        await this.ensureConnected();

        await this.producer.send({

            topic:
                event.topic,

            acks:
                -1,

            messages: [
                {

                    key:
                        event.eventKey,

                    value:
                        JSON.stringify(
                            event.payload,
                        ),

                    headers:
                        event.headers,
                },
            ],
        });
    }

    async onModuleDestroy():
        Promise<void> {

        if (
            this.connected
        ) {

            await this.producer
                .disconnect();
        }
    }

    private async ensureConnected():
        Promise<void> {

        if (
            this.connected
        ) {
            return;
        }

        if (
            this.connecting
        ) {

            return this.connecting;
        }

        this.connecting =
            this.producer
                .connect()
                .then(
                    () => {

                        this.connected =
                            true;

                        this.logger.log(
                            'Kafka producer connected',
                        );
                    },
                )
                .finally(
                    () => {

                        this.connecting =
                            undefined;
                    },
                );

        return this.connecting;
    }
}