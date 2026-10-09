export type CourseStatus = | 'ACTIVE' | 'INACTIVE';

export interface CourseResponse {
    id: string;
    organizationId: string;
    name: string;
    course_code: string;
    description: string | null;
    status: CourseStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseRequest {
    name: string;
    course_code: string;
    description?: string;
}

export interface UpdateCourseRequest {
    name?: string;
    course_code?: string;
    description?: string;
    status?: CourseStatus;
}