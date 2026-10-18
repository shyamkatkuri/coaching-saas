import {
    Field,
    ID,
    ObjectType,
} from '@nestjs/graphql';

@ObjectType(
    'Student',
)
export class StudentType {

    @Field(
        () => ID,
    )
    id!: string;

    @Field(
        () => ID,
    )
    organizationId!:
        string;

    @Field(
        () => ID,
    )
    branchId!: string;

    @Field()
    firstName!: string;

    @Field(
        () => String,
        {
            nullable: true,
        },
    )
    lastName!:
        string | null;

    @Field()
    status!: string;
}