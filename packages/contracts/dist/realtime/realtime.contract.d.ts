export declare const REALTIME_EVENTS: {
    readonly CONNECTED: "system.connected";
    readonly ENROLLMENT_CREATED: "enrollment.created";
    readonly ENROLLMENT_CANCELLED: "enrollment.cancelled";
    readonly ATTENDANCE_MARKED: "attendance.marked";
    readonly PAYMENT_COLLECTED: "fee.payment.collected";
    readonly PAYMENT_REFUNDED: "fee.payment.refunded";
    readonly BATCH_UPDATED: "batch.updated";
};
export type RealtimeEventName = typeof REALTIME_EVENTS[keyof typeof REALTIME_EVENTS];
export interface RealtimeEnvelope<T = unknown> {
    eventId: string;
    event: RealtimeEventName;
    version: 1;
    occurredAt: string;
    organizationId?: string;
    branchId?: string;
    data: T;
}
export interface EnrollmentCreatedRealtimeData {
    enrollmentId: string;
    studentId: string;
    batchId: string;
}
export interface AttendanceMarkedRealtimeData {
    sessionId: string;
    enrollmentId: string;
    studentId: string;
}
export interface PaymentCollectedRealtimeData {
    paymentId: string;
    enrollmentId: string;
}
export interface PaymentRefundedRealtimeData {
    paymentId: string;
    refundId: string;
}
export interface BatchUpdatedRealtimeData {
    batchId: string;
}
//# sourceMappingURL=realtime.contract.d.ts.map