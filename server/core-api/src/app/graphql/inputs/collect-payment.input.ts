import {
    Field,
    Float,
    InputType,
} from '@nestjs/graphql';

import {
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

@InputType()
export class CollectPaymentInput {

    @Field(
        () => Float,
    )
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @Field()
    @IsIn([
        'CASH',
        'UPI',
        'CARD',
        'BANK_TRANSFER',
    ])
    paymentMethod!:
        | 'CASH'
        | 'UPI'
        | 'CARD'
        | 'BANK_TRANSFER';

    @Field({
        nullable: true,
    })
    @IsOptional()
    @IsString()
    referenceNo?: string;

    @Field()
    @IsUUID()
    idempotencyKey!:
        string;
}