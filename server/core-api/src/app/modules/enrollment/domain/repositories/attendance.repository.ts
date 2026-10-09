import type {
    AttendanceRecord,
    AttendanceSession,
    AttendanceStatus,
} from '../models/attendance.model';

export const ATTENDANCE_REPOSITORY =
    Symbol('ATTENDANCE_REPOSITORY');

export interface CreateAttendanceSessionData {
    organizationId: string;
    branchId: string;

    batchId: string;

    sessionDate: string;

    startTime: string;
    endTime: string;

    createdBy?: string;
}

export interface MarkAttendanceData {
    organizationId: string;
    branchId: string;

    sessionId: string;

    enrollmentId: string;
    studentId: string;

    status: AttendanceStatus;

    remarks?: string;

    markedBy?: string;
}

export interface AttendanceRepository {
    createSession(
        data: CreateAttendanceSessionData,
    ): Promise<AttendanceSession>;

    getSession(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ): Promise<AttendanceSession | null>;

    mark(
        data: MarkAttendanceData,
    ): Promise<AttendanceRecord>;

    getRecords(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ): Promise<AttendanceRecord[]>;
}