import {
    Injectable,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    Observable,
} from 'rxjs';

export interface Tenant {
    id: string;

    name: string;
    slug: string;
    code: string;

    status:
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'TRIAL'
    | 'CANCELLED';

    timezone: string;
    currency: string;
    country: string;

    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn:
        'root',
})
export class TenantApiService {
    private readonly baseUrl =
        'http://localhost:3001/api/v1';

    constructor(
        private readonly http:
            HttpClient,
    ) { }

    findAll():
        Observable<Tenant[]> {
        return this.http.get<
            Tenant[]
        >(
            `${this.baseUrl}/tenants`,
        );
    }
}