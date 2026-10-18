import {
    Field,
    ID,
    InputType,
} from '@nestjs/graphql';

import {
    IsDateString,
    IsUUID,
    Matches,
} from 'class-validator';

@InputType()
export class CreateAttendanceSessionInput {

    @Field(
        () => ID,
    )
    @IsUUID()
    batchId!: string;

    @Field()
    @IsDateString()
    sessionDate!: string;

    @Field()
    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
    )
    startTime!: string;

    @Field()
    @Matches(
        /^([01]\d|2[0-3]):[0-5]\d$/,
    )
    endTime!: string;
}