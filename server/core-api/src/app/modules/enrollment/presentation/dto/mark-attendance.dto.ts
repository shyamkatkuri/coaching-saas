import {
    IsIn,
    IsOptional,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';

export class MarkAttendanceDto {

    @IsUUID()
    enrollmentId!: string;

    @IsIn([
        'PRESENT',
        'ABSENT',
        'LATE',
        'EXCUSED',
    ])
    status!:
        | 'PRESENT'
        | 'ABSENT'
        | 'LATE'
        | 'EXCUSED';

    @IsOptional()
    @IsString()
    @Length(
        1,
        500,
    )
    remarks?: string;
}