import {
    IsDateString,
    IsUUID,
    Matches,
} from 'class-validator';

export class CreateAttendanceSessionDto {
    @IsUUID()
    batchId!: string;

    @IsDateString()
    sessionDate!: string;

    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        {
            message:
                'startTime must be HH:mm format',
        },
    )
    startTime!: string;

    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        {
            message:
                'endTime must be HH:mm format',
        },
    )
    endTime!: string;
}