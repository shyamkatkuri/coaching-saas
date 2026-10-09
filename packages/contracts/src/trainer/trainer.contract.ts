export type TrainerStatus =
    | 'ACTIVE'
    | 'INACTIVE';

export interface TrainerResponse {
    id: string;

    organizationId: string;
    branchId: string;

    firstName: string;
    lastName: string | null;

    email: string | null;
    phone: string | null;

    status: TrainerStatus;

    createdAt: string;
    updatedAt: string;
}

export interface CreateTrainerRequest {
    firstName: string;

    lastName?: string;

    email?: string;
    phone?: string;
}

export interface UpdateTrainerRequest {
    firstName?: string;
    lastName?: string;

    email?: string;
    phone?: string;

    status?: TrainerStatus;
}