import {
    Field,
    GraphQLISODateTime,
    ID,
    ObjectType,
} from '@nestjs/graphql';

@ObjectType(
    'AttendanceSession',
)
export class AttendanceSessionType {

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
    batchId!: string;

    @Field()
    sessionDate!: string;

    @Field()
    startTime!: string;

    @Field()
    endTime!: string;

    @Field()
    status!: string;
}

@ObjectType(
    'AttendanceRecord',
)
export class AttendanceRecordType {

    @Field(
        () => ID,
    )
    id!: string;

    @Field(
        () => ID,
    )
    sessionId!: string;

    @Field(
        () => ID,
    )
    enrollmentId!: string;

    @Field(
        () => ID,
    )
    studentId!: string;

    @Field()
    status!: string;

    @Field(() => String, {
        nullable: true,
    })
    remarks!:
        string | null;

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