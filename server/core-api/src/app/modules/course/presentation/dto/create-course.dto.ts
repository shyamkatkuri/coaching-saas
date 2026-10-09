import {
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

import type {
    CreateCourseRequest,
} from '@coaching/contracts';

export class CreateCourseDto implements CreateCourseRequest {

    @IsString()
    @Length(2, 150)
    name!: string;

    @IsString()
    @Length(2, 50,)
    course_code!: string;

    @IsOptional()
    @IsString()
    @Length(2, 1000,)
    description?: string;
}