import {
    Field,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';

@ObjectType(
    'Trainer',
)
export class TrainerType {

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
    lastName!: string | null;

    @Field(
        () => String,
        {
            nullable: true,
        },
    )
    email!:
        string | null;

    @Field(
        () => String,
        {
            nullable: true,
        },
    )
    phone!:
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