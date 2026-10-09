import {
    ArrayNotEmpty,
    IsArray,
    IsDateString,
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

export class CreateBatchDto {

    @IsUUID()
    courseId!: string;

    @IsString()
    @Length(
        2,
        150,
    )
    name!: string;

    @IsString()
    @Length(
        2,
        50,
    )
    batch_code!: string;

    @IsDateString()
    startDate!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsInt()
    @Min(1)
    @Max(1000)
    capacity!: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(
        undefined,
        {
            each: true,
        },
    )
    trainerIds!: string[];

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({
        each: true,
    })
    @Type(
        () =>
            BatchScheduleDto,
    )
    schedules!:
        BatchScheduleDto[];
}