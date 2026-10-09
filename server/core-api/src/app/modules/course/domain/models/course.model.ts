export type CourseStatus =
    | 'ACTIVE'
    | 'INACTIVE';

export interface Course {
    id: string;

    organizationId: string;

    name: string;
    course_code: string;

    description: string | null;

    status: CourseStatus;

    createdAt: Date;
    updatedAt: Date;
}