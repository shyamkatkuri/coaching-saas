export const INTEGRATION_TOPICS = {

    ENROLLMENT:
        'coaching.enrollment.events.v1',

    ATTENDANCE:
        'coaching.attendance.events.v1',

    FEE:
        'coaching.fee.events.v1',

    BATCH:
        'coaching.batch.events.v1',

    AUDIT_DLQ:
        'coaching.audit.dlq.v1',

} as const;

export const INTEGRATION_EVENT_TYPES = {

    ENROLLMENT_CREATED:
        'enrollment.created',

    ENROLLMENT_CANCELLED:
        'enrollment.cancelled',

    ATTENDANCE_MARKED:
        'attendance.marked',

    PAYMENT_COLLECTED:
        'fee.payment.collected',

    PAYMENT_REFUNDED:
        'fee.payment.refunded',

    BATCH_UPDATED:
        'batch.updated',

} as const;

export type IntegrationEventType =
    typeof INTEGRATION_EVENT_TYPES[
    keyof typeof INTEGRATION_EVENT_TYPES
    ];

export interface IntegrationEventAggregate {

    type: string;

    id: string;
}

export interface IntegrationEventActor {

    applicationUserId:
    string | null;
}

export interface IntegrationEventEnvelope<
    T = unknown,
> {

    eventId: string;

    eventType:
    IntegrationEventType;

    version: 1;

    producer:
    'core-api';

    occurredAt:
    string;

    correlationId:
    string;

    causationId?:
    string | null;

    organizationId?:
    string;

    branchId?:
    string;

    aggregate:
    IntegrationEventAggregate;

    actor:
    IntegrationEventActor;

    data: T;
}

export interface EnrollmentCreatedEventData {

    enrollmentId: string;

    studentId: string;

    courseId: string;

    batchId: string;
}

export interface EnrollmentCancelledEventData {

    enrollmentId: string;

    studentId: string;

    batchId: string;
}

export interface AttendanceMarkedEventData {

    attendanceRecordId:
    string;

    sessionId: string;

    enrollmentId: string;

    studentId: string;

    status: string;
}

export interface PaymentCollectedEventData {

    paymentId: string;

    enrollmentId: string;
}

export interface PaymentRefundedEventData {

    refundId: string;

    paymentId: string;
}

export interface BatchUpdatedEventData {

    batchId: string;

    courseId: string;
}