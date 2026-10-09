import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AttendanceApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    createSession(
        organizationId: string,
        branchId: string,
        request: {
            batchId: string;
            sessionDate: string;
            startTime: string;
            endTime: string;
        },
    ) {

        return this.http.post(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/attendance/sessions`,
            request,
        );
    }

    mark(
        organizationId: string,
        branchId: string,
        sessionId: string,
        request: {
            enrollmentId: string;
            status:
            | 'PRESENT'
            | 'ABSENT'
            | 'LATE'
            | 'EXCUSED';
            remarks?: string;
        },
    ) {

        return this.http.put(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/attendance/sessions/${sessionId}/records`,
            request,
        );
    }

    records(
        organizationId: string,
        branchId: string,
        sessionId: string,
    ) {

        return this.http.get(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/attendance/sessions/${sessionId}/records`,
        );
    }
}