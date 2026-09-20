import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import type {
    StudentResponse,
    CreateStudentRequest,
} from '@coaching/contracts';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StudentApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getStudents(
        organizationId: string,
        branchId: string,
    ) {

        const url =
            `${this.api}/organizations/${organizationId}/branches/${branchId}/students`;

        console.log(
            'Calling Student API:',
            url,
        );

        return this.http
            .get<any[]>(
                url,
            )
            .pipe(
                tap({
                    next: response =>
                        console.log(
                            'Student API success:',
                            response,
                        ),

                    error: error =>
                        console.error(
                            'Student API failed:',
                            error,
                        ),
                }),
            );
    }

    createStudent(
        organizationId: string,
        branchId: string,
        request:
            CreateStudentRequest,
    ) {

        return this.http.post<
            StudentResponse
        >(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/students`,
            request,
        );
    }
}