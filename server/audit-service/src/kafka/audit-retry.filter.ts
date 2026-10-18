import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';

import {
    KafkaContext,
} from '@nestjs/microservices';

import type {
    Producer,
} from 'kafkajs';

import {
    INTEGRATION_TOPICS,
} from '@coaching/contracts';

import {
    KAFKA_AUDIT_PRODUCER,
} from './kafka-producer.provider';

@Catch()
@Injectable()
export class AuditRetryFilter
    implements ExceptionFilter {

    private readonly logger =
        new Logger(
            AuditRetryFilter.name,
        );

    private readonly maxRetries =
        5;

    constructor(
        @Inject(
            KAFKA_AUDIT_PRODUCER,
        )
        private readonly producer:
            Producer,
    ) { }

    async catch(
        exception:
            unknown,

        host:
            ArgumentsHost,
    ) {

        const context =
            host
                .switchToRpc()
                .getContext<
                    KafkaContext
                >();

        const message =
            context.getMessage();

        const retryCount =
            this.getRetryCount(
                message.headers,
            );

        if (
            retryCount >=
            this.maxRetries
        ) {

            await this.sendToDlq(
                context,
                exception,
                retryCount,
            );

            await this.commit(
                context,
            );

            return;
        }

        try {

            await this.producer.send({

                topic:
                    context.getTopic(),

                messages: [
                    {

                        key:
                            message.key,

                        value:
                            message.value,

                        headers: {

                            ...message.headers,

                            'retry-count':
                                String(
                                    retryCount +
                                    1,
                                ),
                        },
                    },
                ],
            });

            await this.commit(
                context,
            );

        } catch (retryError) {

            this.logger.error(
                'Kafka retry republish failed',
                retryError,
            );

            /*
             * Rethrow so Kafka itself
             * does not advance offset.
             */
            throw exception;
        }
    }

    private async sendToDlq(
        context:
            KafkaContext,

        exception:
            unknown,

        retryCount:
            number,
    ): Promise<void> {

        const message =
            context.getMessage();

        await this.producer.send({

            topic:
                INTEGRATION_TOPICS
                    .AUDIT_DLQ,

            messages: [
                {

                    key:
                        message.key,

                    value:
                        message.value,

                    headers: {

                        ...message.headers,

                        'original-topic':
                            context.getTopic(),

                        'original-partition':
                            String(
                                context
                                    .getPartition(),
                            ),

                        'original-offset':
                            message.offset,

                        'retry-count':
                            String(
                                retryCount,
                            ),

                        'dlq-reason':
                            exception instanceof Error
                                ? exception.message
                                : String(
                                    exception,
                                ),
                    },
                },
            ],
        });

        this.logger.error(
            `Event sent to DLQ from ${context.getTopic()}`,
        );
    }

    private getRetryCount(
        headers:
            Record<
                string,
                any
            >
            | undefined,
    ): number {

        const value =
            headers?.[
            'retry-count'
            ];

        if (!value) {
            return 0;
        }

        return Number(
            Buffer.isBuffer(
                value,
            )
                ? value.toString()
                : value,
        ) || 0;
    }

    private async commit(
        context:
            KafkaContext,
    ) {

        const offset =
            Number(
                context
                    .getMessage()
                    .offset,
            ) +
            1;

        await context
            .getConsumer()
            .commitOffsets([
                {

                    topic:
                        context
                            .getTopic(),

                    partition:
                        context
                            .getPartition(),

                    offset:
                        String(
                            offset,
                        ),
                },
            ]);
    }
}