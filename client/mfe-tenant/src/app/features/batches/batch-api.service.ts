import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import type {
    BatchResponse,
    CreateBatchRequest,
} from '@coaching/contracts';

@Injectable({
    providedIn: 'root',
})
export class BatchApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getBatches(
        organizationId: string,
        branchId: string,
    ) {

        return this.http.get<
            BatchResponse[]
        >(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/batches`,
        );
    }

    createBatch(
        organizationId: string,
        branchId: string,
        request:
            CreateBatchRequest,
    ) {

        return this.http.post<
            BatchResponse
        >(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/batches`,
            request,
        );
    }
}