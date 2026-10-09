import {
    Injectable,
    signal,
} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TenantScopeService {

    private readonly organizationIdState =
        signal<string | null>(
            null,
        );

    private readonly branchIdState =
        signal<string | null>(
            null,
        );

    readonly organizationId =
        this.organizationIdState
            .asReadonly();

    readonly branchId =
        this.branchIdState
            .asReadonly();

    setOrganization(
        organizationId: string,
    ): void {

        this.organizationIdState
            .set(
                organizationId,
            );
    }

    setBranch(
        branchId: string,
    ): void {

        this.branchIdState
            .set(
                branchId,
            );
    }

    setScope(
        organizationId: string,
        branchId: string,
    ): void {

        this.organizationIdState
            .set(
                organizationId,
            );

        this.branchIdState
            .set(
                branchId,
            );
    }
}