import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';


import { CoreModule } from './app/core/core.module';

import { HealthModule } from './app/health/health.module';
import { TenantModule } from './app/modules/tenant/tenant.module';
import { DatabaseModule } from './app/core/database/database.module';
import { CorrelationIdMiddleware } from './app/core/http/correlation-id.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(
            'development',
            'test',
            'staging',
            'production',
          )
          .default('development'),

        PORT: Joi.number()
          .port()
          .default(3001),

        DB_HOST: Joi.string()
          .required(),

        DB_PORT: Joi.number()
          .port()
          .default(5432),

        DB_NAME: Joi.string()
          .required(),

        DB_USER: Joi.string()
          .required(),

        DB_PASSWORD: Joi.string()
          .required(),
      }),
    }),
    CoreModule,
    DatabaseModule,
    HealthModule,
    TenantModule  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({
        path: '{*path}',
        method: RequestMethod.ALL,
      });
  }
}