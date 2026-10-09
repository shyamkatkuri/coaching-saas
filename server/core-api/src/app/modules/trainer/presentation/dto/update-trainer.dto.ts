import {
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class UpdateTrainerDto {

    @IsOptional()
    @IsString()
    @Length(
        2,
        100,
    )
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(
        7,
        20,
    )
    phone?: string;

    @IsOptional()
    @IsIn([
        'ACTIVE',
        'INACTIVE',
    ])
    status?:
        | 'ACTIVE'
        | 'INACTIVE';
}