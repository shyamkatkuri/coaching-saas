import {
    Injectable,
} from '@nestjs/common';

import {
    DATABASES,
} from '../../../../../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../../../../../core/database/database-registry.service';

import type {
    Course,
} from '../../../domain/models/course.model';

import type {
    CourseRepository,
    CreateCourseData,
    UpdateCourseData,
} from '../../../domain/repositories/course.repository';

@Injectable()
export class PostgresCourseRepository
    implements CourseRepository {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    private get db() {
        return this.databases.getPool(
            DATABASES.COURSE,
        );
    }

    async findAll(
        organizationId: string,
    ): Promise<Course[]> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          name,
          course_code AS code,
          description,
          status,
          created_at,
          updated_at
        FROM courses
        WHERE organization_id = $1
        ORDER BY created_at DESC
        `,
                [
                    organizationId,
                ],
            );

        return result.rows.map(
            row =>
                this.mapRow(row),
        );
    }

    async findById(
        organizationId: string,
        courseId: string,
    ): Promise<Course | null> {

        const result =
            await this.db.query(
                `
        SELECT
          id,
          organization_id,
          name,
          course_code,
          description,
          status,
          created_at,
          updated_at
        FROM courses
        WHERE id = $1
          AND organization_id = $2
        LIMIT 1
        `,
                [
                    courseId,
                    organizationId,
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
        data: CreateCourseData,
    ): Promise<Course> {

        const result =
            await this.db.query(
                `
        INSERT INTO courses (
          organization_id,
          name,
          course_code,
          description,
          status
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          'ACTIVE'
        )
        RETURNING
          id,
          organization_id,
          name,
          course_code,
          description,
          status,
          created_at,
          updated_at
        `,
                [
                    data.organizationId,
                    data.name,
                    data.course_code,
                    data.description ?? null,
                ],
            );

        return this.mapRow(
            result.rows[0],
        );
    }

    async update(
        organizationId: string,
        courseId: string,
        data: UpdateCourseData,
    ): Promise<Course | null> {

        const existing =
            await this.findById(
                organizationId,
                courseId,
            );

        if (!existing) {
            return null;
        }

        const result =
            await this.db.query(
                `
        UPDATE courses
        SET
          name = $3,
          code = $4,
          description = $5,
          status = $6,
          updated_at = NOW()
        WHERE id = $1
          AND organization_id = $2
        RETURNING
          id,
          organization_id,
          name,
          code,
          description,
          status,
          created_at,
          updated_at
        `,
                [
                    courseId,
                    organizationId,

                    data.name ??
                    existing.name,

                    data.course_code ??
                    existing.course_code,

                    data.description ??
                    existing.description,

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
    ): Course {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            name:
                row.name,

            course_code:
                row.course_code,

            description:
                row.description,

            status:
                row.status,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}