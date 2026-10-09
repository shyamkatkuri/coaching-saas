import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Min,
} from 'class-validator';

export class RefundPaymentDto {

    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0.01)
    amount!: number;

    @IsOptional()
    @IsString()
    @Length(
        1,
        500,
    )
    reason?: string;
}