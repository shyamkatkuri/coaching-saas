import {
    Field,
    ID,
    InputType,
} from '@nestjs/graphql';

import {
    IsIn,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

@InputType()
export class MarkAttendanceInput {

    @Field(
        () => ID,
    )
    @IsUUID()
    enrollmentId!: string;

    @Field()
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

    @Field({
        nullable: true,
    })
    @IsOptional()
    @IsString()
    remarks?: string;
}