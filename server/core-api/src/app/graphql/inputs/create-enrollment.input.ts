import {
    Field,
    Float,
    ID,
    InputType,
} from '@nestjs/graphql';

import {
    IsNumber,
    IsOptional,
    IsUUID,
    Min,
} from 'class-validator';

@InputType()
export class CreateEnrollmentInput {

    @Field(
        () => ID,
    )
    @IsUUID()
    studentId!: string;

    @Field(
        () => ID,
    )
    @IsUUID()
    batchId!: string;

    @Field(
        () => Float,
    )
    @IsNumber()
    @Min(0)
    grossFee!: number;

    @Field(
        () => Float,
        {
            nullable: true,
        },
    )
    @IsOptional()
    @IsNumber()
    @Min(0)
    discountAmount?: number;
}