import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    STUDENT_REPOSITORY,
} from '../domain/repositories/student.repository';

import type {
    StudentRepository,
} from '../domain/repositories/student.repository';

import type {
    CreateStudentDto,
} from '../presentation/dto/create-student.dto';

import type {
    UpdateStudentDto,
} from '../presentation/dto/update-student.dto';
import { AppCacheService } from '../../../core/redis/cache/app-cache.service';
import { CacheKeyFactory } from '../../../core/redis/cache/cache-key.factory';

@Injectable()
export class StudentApplicationService {

    constructor(
        @Inject(
            STUDENT_REPOSITORY,
        )
        private readonly students:
            StudentRepository,

        private readonly cache:
            AppCacheService,

        private readonly cacheKeys:
            CacheKeyFactory,
    ) { }

    findAll(
        organizationId: string,
        branchId: string,
    ) {

        const key = this.cacheKeys.batches(organizationId, branchId);
        return this.cache.getOrSet(key, () => this.students.findAll(organizationId, branchId), 30);
    }

    async findById(
        organizationId: string,
        branchId: string,
        studentId: string,
    ) {

        const key = this.cacheKeys.student(organizationId, branchId, studentId,);
        const student = await this.cache.getOrSet(key, () => this.students.findById(organizationId, branchId, studentId,), 60,);

        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
        }

        return student;
    }

    async create(
        organizationId: string,
        branchId: string,
        dto: CreateStudentDto,
    ) {

        const student = await this.students.create({
            organizationId,
            branchId,
            ...dto,
        });

        await this.cache.invalidate(this.cacheKeys.students(organizationId, branchId,),);

        return student;
    }

    async update(
        organizationId: string,
        branchId: string,
        studentId: string,
        dto: UpdateStudentDto,
    ) {

        const student =
            await this.students.update(
                organizationId,
                branchId,
                studentId,
                dto,
            );

        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
        }

        await this.cache
            .invalidate(

                this.cacheKeys.students(
                    organizationId,
                    branchId,
                ),

                this.cacheKeys.student(
                    organizationId,
                    branchId,
                    studentId,
                ),
            );

        return student;
    }
}