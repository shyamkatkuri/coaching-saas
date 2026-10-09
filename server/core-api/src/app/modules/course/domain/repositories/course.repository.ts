import type {
    Course,
    CourseStatus,
} from '../models/course.model';

export const COURSE_REPOSITORY =
    Symbol(
        'COURSE_REPOSITORY',
    );

export interface CreateCourseData {
    organizationId: string;

    name: string;
    course_code: string;

    description?: string;
}

export interface UpdateCourseData {
    name?: string;
    course_code?: string;

    description?: string;

    status?: CourseStatus;
}

export interface CourseRepository {

    findAll(
        organizationId: string,
    ): Promise<Course[]>;

    findById(
        organizationId: string,
        courseId: string,
    ): Promise<Course | null>;

    create(
        data: CreateCourseData,
    ): Promise<Course>;

    update(
        organizationId: string,
        courseId: string,
        data: UpdateCourseData,
    ): Promise<Course | null>;
}