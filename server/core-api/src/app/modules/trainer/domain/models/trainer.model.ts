export type TrainerStatus =
    | 'ACTIVE'
    | 'INACTIVE';

export interface Trainer {
    id: string;

    organizationId: string;
    branchId: string;

    firstName: string;
    lastName: string | null;

    email: string | null;
    phone: string | null;

    status: TrainerStatus;

    createdAt: Date;
    updatedAt: Date;
}