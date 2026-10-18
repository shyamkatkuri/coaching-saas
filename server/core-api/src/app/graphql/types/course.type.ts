import {
    Field,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';

@ObjectType('Course')
export class CourseType {

    @Field(
        () => ID,
    )
    id!: string;

    @Field(
        () => ID,
    )
    organizationId!: string;

    @Field(
        () => String,
    )
    name!: string;

    @Field(
        () => String,
    )
    code!: string;

    @Field(
        () => String,
        {
            nullable: true,
        },
    )
    description!:
        string | null;

    @Field(
        () => String,
    )
    status!: string;

    @Field(
        () =>
            GraphQLISODateTime,
    )
    createdAt!: Date;

    @Field(
        () =>
            GraphQLISODateTime,
    )
    updatedAt!: Date;
}