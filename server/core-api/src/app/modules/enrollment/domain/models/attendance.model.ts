export interface AttendanceSession {
    id: string;

    organizationId: string;
    branchId: string;

    batchId: string;

    sessionDate: string;

    startTime: string;
    endTime: string;

    status:
    | 'OPEN'
    | 'CLOSED';

    createdAt: Date;
    updatedAt: Date;
    createdBy:
    string | null;
}

export type AttendanceStatus =
    | 'PRESENT'
    | 'ABSENT'
    | 'LATE'
    | 'EXCUSED';

export interface AttendanceRecord {
    id: string;

    sessionId: string;

    enrollmentId: string;
    studentId: string;

    status: AttendanceStatus;

    remarks: string | null;

    markedBy: string | null;

    createdAt: Date;
    updatedAt: Date;
}