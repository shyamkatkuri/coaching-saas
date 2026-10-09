import type {
    Batch,
    BatchSchedule,
    BatchStatus,
} from '../models/batch.model';

export const BATCH_REPOSITORY =
    Symbol(
        'BATCH_REPOSITORY',
    );

export interface CreateBatchData {
    organizationId: string;
    branchId: string;

    courseId: string;

    name: string;
    batch_code: string;

    startDate: string;
    endDate?: string;

    capacity: number;

    trainerIds: string[];

    schedules:
    BatchSchedule[];
}

export interface UpdateBatchData {
    courseId?: string;

    name?: string;
    batch_code?: string;

    startDate?: string;
    endDate?: string;

    capacity?: number;

    status?: BatchStatus;

    trainerIds?: string[];

    schedules?:
    BatchSchedule[];
}

export interface BatchRepository {

    findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Batch[]>;

    findById(
        organizationId: string,
        branchId: string,
        batchId: string,
    ): Promise<Batch | null>;

    create(
        data: CreateBatchData,
    ): Promise<Batch>;

    update(
        organizationId: string,
        branchId: string,
        batchId: string,
        data: UpdateBatchData,
    ): Promise<Batch | null>;
}