import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Matches,
} from 'class-validator';

import type {
    CreateTenantRequest,
} from '@coaching/contracts';

export class CreateTenantDto
    implements CreateTenantRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @IsString()
    @Matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    )
    slug!: string;

    @IsString()
    @MaxLength(50)
    code!: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    country?: string;
}