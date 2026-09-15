import { UpdateBranchDto } from '../../presentation/dto/update-branch.dto';
import { Branch } from '../models/branch.model';

export interface CreateBranchInput {
    name: string;
    code: string;

    addressLine1?: string;
    addressLine2?: string;

    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    phone?: string;
    email?: string;
}

export interface UpdateBranchInput {
    name?: string;

    addressLine1?: string;
    addressLine2?: string;

    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    phone?: string;
    email?: string;

    status?: Branch['status'];
}

export interface BranchRepository {
    findAllByTenant(
        organizationId: string,
    ): Promise<Branch[]>;

    findById(
        organizationId: string,
        branchId: string,
    ): Promise<Branch | null>;

    findByCode(
        organizationId: string,
        code: string,
    ): Promise<Branch | null>;

    create(
        organizationId: string,
        input: CreateBranchInput,
    ): Promise<Branch>;

    update(
        organizationId: string,
        branchId: string,
        input: UpdateBranchDto,
    ): Promise<Branch | null>;
}

export const BRANCH_REPOSITORY =
    Symbol('BRANCH_REPOSITORY');