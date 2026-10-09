export type BatchStatus =
    | 'PLANNED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';

export interface BatchSchedule {
    dayOfWeek: number;

    startTime: string;
    endTime: string;
}

export interface Batch {
    id: string;

    organizationId: string;
    branchId: string;

    courseId: string;

    name: string;
    batch_code: string;

    startDate: Date;
    endDate: Date | null;

    capacity: number;

    status: BatchStatus;

    trainerIds: string[];

    schedules:
    BatchSchedule[];

    createdAt: Date;
    updatedAt: Date;
}