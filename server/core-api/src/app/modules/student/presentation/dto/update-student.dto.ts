import {
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

import type {
    UpdateStudentRequest,
} from '@coaching/contracts';

export class UpdateStudentDto
    implements UpdateStudentRequest {

    @IsOptional()
    @IsString()
    @Length(
        2,
        100,
    )
    firstName?: string;

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

    @IsOptional()
    @IsIn([
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
    ])
    status?:
        | 'ACTIVE'
        | 'INACTIVE'
        | 'SUSPENDED';
}