import {
    Module,
} from '@nestjs/common';


import { IdentityController } from './presentation/identity.controller';
import { IdentityService } from './application/identity.service';
import { PostgresStudentRepository } from '../student/infrastructure/persistence/postgres/postgres-student.repository';

@Module({
    controllers: [
        IdentityController,
    ],

    providers: [
        IdentityService,
        PostgresStudentRepository
    ],
})
export class IdentityModule { }