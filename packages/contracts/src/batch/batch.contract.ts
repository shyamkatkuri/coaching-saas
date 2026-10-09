export type BatchStatus =
    | 'PLANNED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';

export interface BatchScheduleRequest {
    dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';

    startTime: string;
    endTime: string;
}

export interface CreateBatchRequest {
    courseId: string;

    name: string;
    code: string;

    startDate: string;
    endDate?: string;

    capacity: number;

    trainerIds: string[];

    schedules:
    BatchScheduleRequest[];
}

export interface UpdateBatchRequest {
    courseId?: string;

    name?: string;
    code?: string;

    startDate?: string;
    endDate?: string;

    capacity?: number;

    status?: BatchStatus;

    trainerIds?: string[];

    schedules?:
    BatchScheduleRequest[];
}

export interface BatchResponse {
    id: string;

    organizationId: string;
    branchId: string;

    courseId: string;

    name: string;
    code: string;

    startDate: string;
    endDate: string | null;

    capacity: number;

    status: BatchStatus;

    trainerIds: string[];

    schedules:
    BatchScheduleRequest[];

    createdAt: string;
    updatedAt: string;
}