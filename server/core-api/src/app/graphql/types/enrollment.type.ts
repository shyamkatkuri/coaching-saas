import {
    Field,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';

import {
    BatchType,
} from './batch.type';

@ObjectType(
    'Enrollment',
)
export class EnrollmentType {

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

    @Field(
        () => ID,
    )
    studentId!: string;

    @Field(
        () => ID,
    )
    courseId!: string;

    @Field(
        () => ID,
    )
    batchId!: string;

    @Field()
    enrollmentNumber!:
        string;

    @Field()
    enrollmentDate!:
        string;

    @Field()
    status!: string;

    @Field(
        () =>
            BatchType,
        {
            nullable: true,
        },
    )
    batch?:
        BatchType | null;

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