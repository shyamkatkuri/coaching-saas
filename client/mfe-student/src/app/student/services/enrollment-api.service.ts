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
export class EnrollmentApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getByStudent(
        organizationId: string,
        branchId: string,
        studentId: string,
    ) {

        return this.http.get(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments/student/${studentId}`,
        );
    }

    getByBatch(
        organizationId: string,
        branchId: string,
        batchId: string,
    ) {

        return this.http.get(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments/batch/${batchId}`,
        );
    }

    create(
        organizationId: string,
        branchId: string,
        request: {
            studentId: string;
            batchId: string;
            grossFee: number;
            discountAmount?: number;
        },
    ) {

        return this.http.post(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments`,
            request,
        );
    }

    cancel(
        organizationId: string,
        branchId: string,
        enrollmentId: string,
    ) {

        return this.http.patch(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/enrollments/${enrollmentId}/cancel`,
            {},
        );
    }
}