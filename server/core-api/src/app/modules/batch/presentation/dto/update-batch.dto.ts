import {
    IsArray,
    IsDateString,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

import {
    Type,
} from 'class-transformer';

import {
    BatchScheduleDto,
} from './batch-schedule.dto';

export class UpdateBatchDto {

    @IsOptional()
    @IsUUID()
    courseId?: string;

    @IsOptional()
    @IsString()
    @Length(
        2,
        150,
    )
    name?: string;

    @IsOptional()
    @IsString()
    @Length(
        2,
        50,
    )
    batch_code?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    capacity?: number;

    @IsOptional()
    @IsIn([
        'PLANNED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED',
    ])
    status?:
        | 'PLANNED'
        | 'ACTIVE'
        | 'COMPLETED'
        | 'CANCELLED';

    @IsOptional()
    @IsArray()
    @IsUUID(
        undefined,
        {
            each: true,
        },
    )
    trainerIds?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each: true,
    })
    @Type(
        () =>
            BatchScheduleDto,
    )
    schedules?:
        BatchScheduleDto[];
}