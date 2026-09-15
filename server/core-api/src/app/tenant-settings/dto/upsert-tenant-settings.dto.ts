import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class UpsertTenantSettingsDto {
    @IsOptional()
    @IsString()
    @MaxLength(30)
    dateFormat?: string;

    @IsOptional()
    @IsIn(['12_HOUR', '24_HOUR'])
    timeFormat?: string;

    @IsOptional()
    @IsIn([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
    ])
    weekStartDay?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(12)
    academicYearStartMonth?: number;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    invoicePrefix?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    invoiceNextNumber?: number;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    receiptPrefix?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    receiptNextNumber?: number;
}