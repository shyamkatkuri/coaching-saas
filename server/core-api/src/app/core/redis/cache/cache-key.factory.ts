import {
    Injectable,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

@Injectable()
export class CacheKeyFactory {

    private readonly prefix:
        string;

    constructor(
        config:
            ConfigService,
    ) {

        this.prefix =
            config.get<string>(
                'REDIS_KEY_PREFIX',
            ) ??
            'coaching-saas:v1';
    }

    courses(
        organizationId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `courses`
        );
    }

    course(
        organizationId: string,
        courseId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `course:${courseId}`
        );
    }

    students(
        organizationId: string,
        branchId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `branch:${branchId}:` +
            `students`
        );
    }

    student(
        organizationId: string,
        branchId: string,
        studentId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `branch:${branchId}:` +
            `student:${studentId}`
        );
    }

    trainers(
        organizationId: string,
        branchId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `branch:${branchId}:` +
            `trainers`
        );
    }

    batches(
        organizationId: string,
        branchId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `branch:${branchId}:` +
            `batches`
        );
    }

    batch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `org:${organizationId}:` +
            `branch:${branchId}:` +
            `batch:${batchId}`
        );
    }

    enrollmentCapacityLock(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): string {

        return (
            `${this.prefix}:` +
            `lock:enrollment-capacity:` +
            `${organizationId}:` +
            `${branchId}:` +
            `${batchId}`
        );
    }

    rateLimit(
        identity: string | string[],
        operation: string,
    ): string {

        return (
            `${this.prefix}:` +
            `rate-limit:` +
            `${operation}:` +
            `${identity}`
        );
    }
}