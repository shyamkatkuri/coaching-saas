import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import type {
    CourseResponse,
    CreateCourseRequest,
} from '@coaching/contracts';

@Injectable({
    providedIn: 'root',
})
export class CourseApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getCourses(
        organizationId: string,
    ) {

        return this.http.get<
            CourseResponse[]
        >(
            `${this.api}/organizations/${organizationId}/courses`,
        );
    }

    createCourse(
        organizationId: string,
        request:
            CreateCourseRequest,
    ) {

        return this.http.post<
            CourseResponse
        >(
            `${this.api}/organizations/${organizationId}/courses`,
            request,
        );
    }
}