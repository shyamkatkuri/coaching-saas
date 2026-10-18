import {
  ValidationPipe,
} from '@nestjs/common';

import {
  ConfigService,
} from '@nestjs/config';

import {
  NestFactory,
} from '@nestjs/core';

import {
  Logger,
} from '@nestjs/common';

import {
  RedisIoAdapter,
} from './app/realtime/redis/redis-io.adapter';

import {
  AppLoggerService,
} from './app/core/logging/app-logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
      {
        bufferLogs: true,
      },
    );

  const logger = app.get(AppLoggerService,);

  app.useLogger(
    logger,
  );

  app.setGlobalPrefix(
    'api/v1',
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted:
        true,

      transform: true,
    }),
  );

  app.enableShutdownHooks();

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:4202',
    ],

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-Id',
    ],
  });
  const config =
    app.get(
      ConfigService,
    );

  const port =
    config.get<number>(
      'PORT',
    ) ?? 3001;

  const bootstrapLogger =
    new Logger(
      'Bootstrap',
    );

  const redisRequired =
    (
      config.get<string>(
        'WS_REDIS_REQUIRED',
      ) ??
      'false'
    ) ===
    'true';

  const redisIoAdapter =
    new RedisIoAdapter(
      app,
    );

  try {

    await redisIoAdapter
      .connectToRedis();

    app.useWebSocketAdapter(
      redisIoAdapter,
    );

  } catch (error) {

    if (
      redisRequired
    ) {

      throw error;
    }

    bootstrapLogger.warn(
      'Socket.IO Redis adapter unavailable. Realtime will work only within this API instance.',
    );
  }

  await app.listen(
    port,
  );

  bootstrapLogger.log(
    `Core API running on port ${port}`,
    'Bootstrap',
  );
}

bootstrap();