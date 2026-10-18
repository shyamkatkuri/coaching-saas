import {
    Injectable,
    Logger,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    Interval,
} from '@nestjs/schedule';

import {
    hostname,
} from 'node:os';

import {
    DATABASES,
} from '../../database/database.constants';

import {
    KafkaProducerService,
} from '../kafka/kafka-producer.service';

import {
    OutboxRepositoryService,
} from './outbox-repository.service';

@Injectable()
export class OutboxPublisherService {

    private readonly logger =
        new Logger(
            OutboxPublisherService.name,
        );

    private running =
        false;

    private readonly workerId =
        `${hostname()}:${process.pid}`;

    private readonly batchSize:
        number;

    private readonly maxAttempts:
        number;

    private readonly processingTimeout:
        number;

    constructor(
        private readonly outbox:
            OutboxRepositoryService,

        private readonly kafka:
            KafkaProducerService,

        config:
            ConfigService,
    ) {

        this.batchSize =
            Number(
                config.get(
                    'OUTBOX_BATCH_SIZE',
                ) ??
                50,
            );

        this.maxAttempts =
            Number(
                config.get(
                    'OUTBOX_MAX_ATTEMPTS',
                ) ??
                20,
            );

        this.processingTimeout =
            Number(
                config.get(
                    'OUTBOX_PROCESSING_TIMEOUT_SECONDS',
                ) ??
                60,
            );
    }

    @Interval(1000)
    async publishPending():
        Promise<void> {

        if (
            this.running
        ) {
            return;
        }

        this.running =
            true;

        try {

            await this.processDatabase(
                DATABASES.ENROLLMENT,
            );

            await this.processDatabase(
                DATABASES.BATCH,
            );

        } finally {

            this.running =
                false;
        }
    }

    private async processDatabase(
        databaseName:
            string,
    ): Promise<void> {

        const events =
            await this.outbox
                .claim(
                    databaseName,
                    this.workerId,
                    this.batchSize,
                    this.processingTimeout,
                );

        for (
            const event
            of events
        ) {

            try {

                await this.kafka
                    .publish(
                        event,
                    );

                await this.outbox
                    .markPublished(
                        databaseName,
                        event.id,
                    );

            } catch (error) {

                const message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                this.logger.error(
                    `Outbox publish failed: ${event.id}`,
                    message,
                );

                await this.outbox
                    .markFailed(
                        databaseName,
                        event.id,
                        message,
                        event.attempts,
                        this.maxAttempts,
                    );
            }
        }
    }
}