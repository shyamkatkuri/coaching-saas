import {
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Min,
} from 'class-validator';

export class CollectPaymentDto {

    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0.01)
    amount!: number;

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

    @IsOptional()
    @IsString()
    @Length(
        1,
        150,
    )
    referenceNo?: string;
}