export const REALTIME_EVENTS = {

    CONNECTED:
        'system.connected',

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

export type RealtimeEventName =
    typeof REALTIME_EVENTS[
    keyof typeof REALTIME_EVENTS
    ];

export interface RealtimeEnvelope<T = unknown> {

    eventId: string;

    event:
    RealtimeEventName;

    version: 1;

    occurredAt:
    string;

    organizationId?:
    string;

    branchId?:
    string;

    data: T;
}

export interface EnrollmentCreatedRealtimeData {

    enrollmentId:
    string;

    studentId:
    string;

    batchId:
    string;
}

export interface AttendanceMarkedRealtimeData {

    sessionId:
    string;

    enrollmentId:
    string;

    studentId:
    string;
}

export interface PaymentCollectedRealtimeData {

    paymentId:
    string;

    enrollmentId:
    string;
}

export interface PaymentRefundedRealtimeData {

    paymentId:
    string;

    refundId:
    string;
}

export interface BatchUpdatedRealtimeData {

    batchId:
    string;
}