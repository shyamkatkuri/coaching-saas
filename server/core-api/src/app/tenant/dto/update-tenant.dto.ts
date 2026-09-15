import {
    IsIn,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator';

export class UpdateTenantDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    slug?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    timezone?: string;

    @IsOptional()
    @IsString()
    @Length(3, 10)
    currency?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @IsOptional()
    @IsIn([
        'ACTIVE',
        'SUSPENDED',
        'TRIAL',
        'CANCELLED',
    ])
    status?: string;
}