export type AccessScope =
    | 'PLATFORM'
    | 'TENANT'
    | 'BRANCH';

export interface AccessRule {
    permissions: string[];

    scope: AccessScope;

    tenantParam?: string;

    branchParam?: string;
}