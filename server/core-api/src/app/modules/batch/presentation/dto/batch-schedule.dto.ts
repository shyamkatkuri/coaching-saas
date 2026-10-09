import {
    IsIn,
    IsString,
    Matches,
} from 'class-validator';

export class BatchScheduleDto {

    @IsIn([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
    ])
    dayOfWeek!: number;

    @IsString()
    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
    )
    startTime!: string;

    @IsString()
    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
    )
    endTime!: string;
}