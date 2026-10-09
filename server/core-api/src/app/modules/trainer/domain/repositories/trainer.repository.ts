import type {
    Trainer,
    TrainerStatus,
} from '../models/trainer.model';

export const TRAINER_REPOSITORY =
    Symbol(
        'TRAINER_REPOSITORY',
    );

export interface CreateTrainerData {
    organizationId: string;
    branchId: string;

    firstName: string;
    lastName?: string;

    email?: string;
    phone?: string;
    employee_code: string;
}

export interface UpdateTrainerData {
    firstName?: string;
    lastName?: string;

    email?: string;
    phone?: string;

    status?: TrainerStatus;
}

export interface TrainerRepository {

    findAll(
        organizationId: string,
        branchId: string,
    ): Promise<Trainer[]>;

    findById(
        organizationId: string,
        branchId: string,
        trainerId: string,
    ): Promise<Trainer | null>;

    findByIds(
        organizationId: string,
        branchId: string,
        trainerIds: string[],
    ): Promise<Trainer[]>;

    create(
        data: CreateTrainerData,
    ): Promise<Trainer>;

    update(
        organizationId: string,
        branchId: string,
        trainerId: string,
        data: UpdateTrainerData,
    ): Promise<Trainer | null>;
}