import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import type {
    CreateTrainerRequest,
    TrainerResponse,
} from '@coaching/contracts';

@Injectable({
    providedIn: 'root',
})
export class TrainerApiService {

    private readonly http =
        inject(HttpClient);

    private readonly api =
        'http://localhost:3001/api/v1';

    getTrainers(
        organizationId: string,
        branchId: string,
    ) {

        return this.http.get<
            TrainerResponse[]
        >(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/trainers`,
        );
    }

    createTrainer(
        organizationId: string,
        branchId: string,
        request:
            CreateTrainerRequest,
    ) {

        return this.http.post<
            TrainerResponse
        >(
            `${this.api}/organizations/${organizationId}/branches/${branchId}/trainers`,
            request,
        );
    }
}