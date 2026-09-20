import {
    Injectable,
} from '@nestjs/common';

import {
    DatabaseRegistryService,
} from '../../../../../core/database/database-registry.service';

import {
    DATABASES,
} from '../../../../../core/database/database.constants';

import type {
    Student,
} from '../../../domain/models/student.model';

import type {
    StudentRepository,
    CreateStudentData,
    UpdateStudentData,
} from '../../../domain/repositories/student.repository';

@Injectable()
export class PostgresStudentRepository
    implements StudentRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    private get db() {
        return this.databases.getPool(
            DATABASES.STUDENT,
        );
    }

    async findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Student[]> {

        const result =
            await this.db.query(
                `
        SELECT
            id,
            organization_id,
            branch_id,
            first_name,
            last_name,
            email,
            phone,
            status,
            created_at,
            updated_at
        FROM students
        WHERE organization_id = $1
          AND branch_id = $2
          AND status <> 'INACTIVE'
        ORDER BY
            created_at DESC
        `,
                [
                    organizationId,
                    branchId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async findById(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): Promise<Student | null> {

        const result =
            await this.db.query(
                `
        SELECT
            id,
            organization_id,
            branch_id,
            first_name,
            last_name,
            email,
            phone,
            status,
            created_at,
            updated_at
        FROM students
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        LIMIT 1
        `,
                [
                    studentId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            result.rowCount === 0
        ) {
            return null;
        }

        return this.mapRow(
            result.rows[0],
        );
    }

    async create(
        data: CreateStudentData,
    ): Promise<Student> {

        const result =
            await this.db.query(
                `
        INSERT INTO students (
            organization_id,
            branch_id,
            first_name,
            last_name,
            email,
            phone,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            'ACTIVE'
        )
        RETURNING
            id,
            organization_id,
            branch_id,
            first_name,
            last_name,
            email,
            phone,
            status,
            created_at,
            updated_at
        `,
                [
                    data.organizationId,
                    data.branchId,
                    data.firstName,
                    data.lastName ?? null,
                    data.email ?? null,
                    data.phone ?? null,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    async update(
        organizationId: string,
        branchId: string,
        studentId: string,
        data: UpdateStudentData,
    ): Promise<Student | null> {

        const existing =
            await this.findById(
                organizationId,
                branchId,
                studentId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.db.query(
                `
        UPDATE students
        SET
            first_name = $4,
            last_name = $5,
            email = $6,
            phone = $7,
            status = $8,
            updated_at = NOW()
        WHERE id = $1
          AND organization_id = $2
          AND branch_id = $3
        RETURNING
            id,
            organization_id,
            branch_id,
            first_name,
            last_name,
            email,
            phone,
            status,
            created_at,
            updated_at
        `,
                [
                    studentId,
                    organizationId,
                    branchId,

                    data.firstName ??
                    existing.firstName,

                    data.lastName ??
                    existing.lastName,

                    data.email ??
                    existing.email,

                    data.phone ??
                    existing.phone,

                    data.status ??
                    existing.status,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    private mapRow(
        row: any,
    ): Student {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            branchId:
                row.branch_id,

            firstName:
                row.first_name,

            lastName:
                row.last_name,

            email:
                row.email,

            phone:
                row.phone,

            status:
                row.status,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}