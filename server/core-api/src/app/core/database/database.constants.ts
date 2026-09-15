export const DATABASES = {
    TENANT: 'tenant',
    USER: 'user',
    STUDENT: 'student',
    COURSE: 'course',
    TRAINER: 'trainer',
    BATCH: 'batch',
} as const;

export type DatabaseName = typeof DATABASES[keyof typeof DATABASES];