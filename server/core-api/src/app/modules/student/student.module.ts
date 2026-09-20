import {
    Module,
} from '@nestjs/common';

import {
    StudentController,
} from './presentation/controllers/student.controller';

import {
    StudentApplicationService,
} from './application/student-application.service';

import {
    PostgresStudentRepository,
} from './infrastructure/persistence/postgres/postgres-student.repository';

import {
    STUDENT_REPOSITORY,
} from './domain/repositories/student.repository';

@Module({
    controllers: [
        StudentController,
    ],

    providers: [
        StudentApplicationService,

        PostgresStudentRepository,

        {
            provide:
                STUDENT_REPOSITORY,

            useExisting:
                PostgresStudentRepository,
        },
    ],
})
export class StudentModule { }