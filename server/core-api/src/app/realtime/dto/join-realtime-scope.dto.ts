import {
    IsOptional,
    IsUUID,
} from 'class-validator';

export class JoinRealtimeScopeDto {

    @IsUUID()
    organizationId!:
        string;

    @IsOptional()
    @IsUUID()
    branchId?:
        string;
}