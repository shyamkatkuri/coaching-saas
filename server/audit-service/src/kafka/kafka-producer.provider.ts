import {
    ConfigService,
} from '@nestjs/config';

import {
    Kafka,
} from 'kafkajs';

export const KAFKA_AUDIT_PRODUCER =
    'KAFKA_AUDIT_PRODUCER';

export const kafkaProducerProvider =
{

    provide:
        KAFKA_AUDIT_PRODUCER,

    inject: [
        ConfigService,
    ],

    useFactory:
        async (
            config:
                ConfigService,
        ) => {

            const kafka =
                new Kafka({

                    clientId:
                        'audit-retry-producer',

                    brokers:
                        config
                            .getOrThrow<string>(
                                'KAFKA_BROKERS',
                            )
                            .split(','),
                });

            const producer =
                kafka.producer();

            await producer
                .connect();

            return producer;
        },
};