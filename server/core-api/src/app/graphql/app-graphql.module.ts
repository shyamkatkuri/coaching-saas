import {
    Module,
} from '@nestjs/common';

import {
    GraphQLModule,
} from '@nestjs/graphql';

import {
    ApolloDriver,
    ApolloDriverConfig,
} from '@nestjs/apollo';

import {
    CourseModule,
} from '../modules/course/course.module';

import {
    TrainerModule,
} from '../modules/trainer/trainer.module';

import {
    StudentModule,
} from '../modules/student/student.module';

import {
    BatchModule,
} from '../modules/batch/batch.module';

import {
    EnrollmentModule,
} from '../modules/enrollment/enrollment.module';

import {
    GraphqlLoadersService,
} from './loaders/graphql-loaders.service';

import {
    CourseResolver,
} from './resolvers/course.resolver';

import {
    TrainerResolver,
} from './resolvers/trainer.resolver';

import {
    StudentResolver,
} from './resolvers/student.resolver';

import {
    BatchResolver,
} from './resolvers/batch.resolver';

import {
    EnrollmentResolver,
} from './resolvers/enrollment.resolver';

import {
    AttendanceResolver,
} from './resolvers/attendance.resolver';

import {
    FeeResolver,
} from './resolvers/fee.resolver';

@Module({
    imports: [

        CourseModule,
        TrainerModule,
        StudentModule,
        BatchModule,
        EnrollmentModule,

        GraphQLModule
            .forRoot<
                ApolloDriverConfig
            >({

                driver:
                    ApolloDriver,

                /*
                 * Code-first.
                 *
                 * Generated in memory.
                 */
                autoSchemaFile:
                    true,

                sortSchema:
                    true,

                path:
                    '/graphql',

                /*
                 * Current Nest GraphQL
                 * uses GraphiQL rather
                 * than old Playground.
                 */
                graphiql:
                    process.env
                        .NODE_ENV !==
                    'production',

                introspection:
                    process.env
                        .NODE_ENV !==
                    'production',

                context:
                    ({
                        req,
                        res,
                    }) => ({
                        req,
                        res,
                    }),
            }),
    ],

    providers: [

        GraphqlLoadersService,

        CourseResolver,
        TrainerResolver,
        StudentResolver,
        BatchResolver,
        EnrollmentResolver,
        AttendanceResolver,
        FeeResolver,
    ],
})
export class AppGraphqlModule { }