import {
  NestFactory,
} from '@nestjs/core';

import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

import {
  AuditModule,
} from './audit.module';

async function bootstrap() {

  const brokers =
    (
      process.env[
      'KAFKA_BROKERS'
      ] ??
      'localhost:9092'
    )
      .split(',')
      .map(
        value =>
          value.trim(),
      );

  const app =
    await NestFactory
      .createMicroservice<
        MicroserviceOptions
      >(
        AuditModule,

        {
          transport:
            Transport.KAFKA,

          options: {

            client: {

              clientId:
                process.env[
                'KAFKA_CLIENT_ID'
                ] ??
                'coaching-audit-service',

              brokers,
            },

            consumer: {

              groupId:
                process.env[
                'KAFKA_CONSUMER_GROUP'
                ] ??
                'coaching-audit-service-v1',

              allowAutoTopicCreation:
                false,
            },

            subscribe: {

              fromBeginning:
                false,
            },

            run: {

              /*
               * We commit only
               * AFTER audit_db
               * commits.
               */
              autoCommit:
                false,
            },
          },
        },
      );

  await app.listen();
}

bootstrap();