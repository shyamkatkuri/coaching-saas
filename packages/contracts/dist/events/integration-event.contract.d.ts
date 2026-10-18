export declare const INTEGRATION_TOPICS: {
    readonly ENROLLMENT: "coaching.enrollment.events.v1";
    readonly ATTENDANCE: "coaching.attendance.events.v1";
    readonly FEE: "coaching.fee.events.v1";
    readonly BATCH: "coaching.batch.events.v1";
    readonly AUDIT_DLQ: "coaching.audit.dlq.v1";
};
export declare const INTEGRATION_EVENT_TYPES: {
    readonly ENROLLMENT_CREATED: "enrollment.created";
    readonly ENROLLMENT_CANCELLED: "enrollment.cancelled";
    readonly ATTENDANCE_MARKED: "attendance.marked";
    readonly PAYMENT_COLLECTED: "fee.payment.collected";
    readonly PAYMENT_REFUNDED: "fee.payment.refunded";
    readonly BATCH_UPDATED: "batch.updated";
};
export type IntegrationEventType = typeof INTEGRATION_EVENT_TYPES[keyof typeof INTEGRATION_EVENT_TYPES];
export interface IntegrationEventAggregate {
    type: string;
    id: string;
}
export interface IntegrationEventActor {
    applicationUserId: string | null;
}
export interface IntegrationEventEnvelope<T = unknown> {
    eventId: string;
    eventType: IntegrationEventType;
    version: 1;
    producer: 'core-api';
    occurredAt: string;
    correlationId: string;
    causationId?: string | null;
    organizationId?: string;
    branchId?: string;
    aggregate: IntegrationEventAggregate;
    actor: IntegrationEventActor;
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
    attendanceRecordId: string;
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
//# sourceMappingURL=integration-event.contract.d.ts.map