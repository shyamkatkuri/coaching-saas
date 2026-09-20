import {
    IsEmail,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

import type {
    CreateStudentRequest,
} from '@coaching/contracts';

export class CreateStudentDto
    implements CreateStudentRequest {

    @IsString()
    @Length(
        2,
        100,
    )
    firstName!: string;

    @IsOptional()
    @IsString()
    @Length(
        1,
        100,
    )
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
}