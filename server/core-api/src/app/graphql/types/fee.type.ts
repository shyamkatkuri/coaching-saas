import {
    Field,
    Float,
    ID,
    ObjectType,
} from '@nestjs/graphql';

@ObjectType(
    'FeeSummary',
)
export class FeeSummaryType {

    @Field(
        () => ID,
    )
    enrollmentId!:
        string;

    @Field(
        () => Float,
    )
    grossAmount!: number;

    @Field(
        () => Float,
    )
    discountAmount!:
        number;

    @Field(
        () => Float,
    )
    payableAmount!:
        number;

    @Field(
        () => Float,
    )
    totalPaid!: number;

    @Field(
        () => Float,
    )
    totalRefunded!:
        number;

    @Field(
        () => Float,
    )
    balance!: number;
}

@ObjectType(
    'Payment',
)
export class PaymentType {

    @Field(
        () => ID,
    )
    id!: string;

    @Field(
        () => ID,
    )
    enrollmentId!:
        string;

    @Field(
        () => Float,
    )
    amount!: number;

    @Field()
    paymentMethod!:
        string;

    @Field(() => String, {
        nullable: true,
    })
    referenceNo!:
        string | null;

    @Field()
    status!: string;
}

@ObjectType(
    'PaymentRefund',
)
export class PaymentRefundType {

    @Field(
        () => ID,
    )
    id!: string;

    @Field(
        () => ID,
    )
    paymentId!: string;

    @Field(
        () => Float,
    )
    amount!: number;

    @Field(() => String, {
        nullable: true,
    })
    reason!:
        string | null;
}