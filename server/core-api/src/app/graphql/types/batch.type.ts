import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
} from '@nestjs/graphql';

import {
    CourseType,
} from './course.type';

@ObjectType(
    'BatchSchedule',
)
export class BatchScheduleType {

    @Field()
    dayOfWeek!: string;

    @Field()
    startTime!: string;

    @Field()
    endTime!: string;
}

@ObjectType(
    'Batch',
)
export class BatchType {

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
    courseId!: string;

    @Field()
    name!: string;

    @Field()
    code!: string;

    @Field(
        () =>
            GraphQLISODateTime,
    )
    startDate!: Date;

    @Field(
        () =>
            GraphQLISODateTime,
        {
            nullable: true,
        },
    )
    endDate!:
        Date | null;

    @Field(
        () => Int,
    )
    capacity!: number;

    @Field()
    status!: string;

    @Field(
        () => [
            ID,
        ],
    )
    trainerIds!:
        string[];

    @Field(
        () => [
            BatchScheduleType,
        ],
    )
    schedules!:
        BatchScheduleType[];

    /*
     * Resolved via DataLoader.
     */
    @Field(
        () =>
            CourseType,
        {
            nullable: true,
        },
    )
    course?:
        CourseType | null;

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