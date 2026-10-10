import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';


import { CoreModule } from './app/core/core.module';

import { HealthModule } from './app/health/health.module';
import { TenantModule } from './app/modules/tenant/tenant.module';
import { DatabaseModule } from './app/core/database/database.module';
import { CorrelationIdMiddleware } from './app/core/http/correlation-id.middleware';
import { StudentModule } from './app/modules/student/student.module';
import { IdentityModule } from './app/modules/identity/identity.module';
import { BatchModule } from './app/modules/batch/batch.module';
import { TrainerModule } from './app/modules/trainer/trainer.module';
import { CourseModule } from './app/modules/course/course.module';
import { EnrollmentModule } from './app/modules/enrollment/enrollment.module';
import { RedisModule } from './app/core/redis/redis.module';


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

        PORT: Joi.number().port().default(3001),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),

        USER_DB_NAME: Joi.string().required(),
        STUDENT_DB_NAME: Joi.string().required(),
        COURSE_DB_NAME: Joi.string().required(),
        TRAINER_DB_NAME: Joi.string().required(),
        BATCH_DB_NAME: Joi.string().required(),
        ENROLLMENT_DB_NAME: Joi.string().required(),

        KEYCLOAK_ISSUER: Joi.string().uri().required(),
        KEYCLOAK_AUDIENCE: Joi.string().required(),

        REDIS_URL: Joi.string().required(),
        REDIS_KEY_PREFIX: Joi.string().default('coaching-saas:v1'),
        REDIS_DEFAULT_CACHE_TTL_SECONDS: Joi.number().integer().positive().default(60),
        REDIS_LOCK_TTL_MS: Joi.number().integer().positive().default(10000),
        REDIS_LOCK_WAIT_MS: Joi.number().integer().positive().default(3000),
      }),
    }),
    RedisModule,
    CoreModule,
    DatabaseModule,
    HealthModule,
    TenantModule,
    StudentModule,
    IdentityModule,
    CourseModule,
    TrainerModule,
    BatchModule,
    EnrollmentModule
  ],
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