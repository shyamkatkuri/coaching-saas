import {
    Field,
    Float,
    InputType,
} from '@nestjs/graphql';

import {
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

@InputType()
export class RefundPaymentInput {

    @Field(
        () => Float,
    )
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @Field({
        nullable: true,
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @Field()
    @IsUUID()
    idempotencyKey!:
        string;
}