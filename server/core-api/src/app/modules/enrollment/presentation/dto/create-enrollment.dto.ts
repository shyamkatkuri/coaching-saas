import {
    IsNumber,
    IsOptional,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateEnrollmentDto {

    @IsUUID()
    studentId!: string;

    @IsUUID()
    batchId!: string;

    @IsNumber()
    @Min(0)
    grossFee!: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountAmount?: number;
}