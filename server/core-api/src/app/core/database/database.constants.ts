export const DATABASES = {
    TENANT: 'tenant',
    USER: 'user',
    STUDENT: 'student',
    COURSE: 'course',
    TRAINER: 'trainer',
    BATCH: 'batch',
    ENROLLMENT: 'enrollment',
} as const;

export type DatabaseName = typeof DATABASES[keyof typeof DATABASES];