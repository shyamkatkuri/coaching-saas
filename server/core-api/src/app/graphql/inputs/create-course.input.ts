import {
    Field,
    InputType,
} from '@nestjs/graphql';

import {
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

@InputType()
export class CreateCourseInput {

    @Field()
    @IsString()
    @Length(
        2,
        150,
    )
    name!: string;

    @Field()
    @IsString()
    @Length(
        2,
        50,
    )
    course_code!: string;

    @Field({
        nullable: true,
    })
    @IsOptional()
    @IsString()
    description?: string;
}