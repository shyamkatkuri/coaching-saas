import {
    IsIn,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

import type {
    UpdateCourseRequest,
} from '@coaching/contracts';

export class UpdateCourseDto
    implements UpdateCourseRequest {

    @IsOptional()
    @IsString()
    @Length(
        2,
        150,
    )
    name?: string;

    @IsOptional()
    @IsString()
    @Length(
        2,
        50,
    )
    code?: string;

    @IsOptional()
    @IsString()
    @Length(
        2,
        1000,
    )
    description?: string;

    @IsOptional()
    @IsIn([
        'ACTIVE',
        'INACTIVE',
    ])
    status?:
        | 'ACTIVE'
        | 'INACTIVE';
}