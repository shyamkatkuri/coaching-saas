import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    DATABASES,
} from '../../database/database.constants';

import {
    DatabaseRegistryService,
} from '../../database/database-registry.service';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    async getApplicationUserId(
        keycloakSubject: string,
    ): Promise<string> {
        const result =
            await this.databases.query<{
                id: string;
            }>(
                DATABASES.USER,

                `
        SELECT id
        FROM users
        WHERE keycloak_user_id = $1
          AND status = 'ACTIVE'
        LIMIT 1
        `,

                [
                    keycloakSubject,
                ],
            );

        const user =
            result.rows[0];

        if (!user) {
            throw new UnauthorizedException(
                'Authenticated identity is not linked to an active application user',
            );
        }

        return user.id;
    }

    async hasPlatformPermissions(
        userId: string,
        permissions: string[],
    ): Promise<boolean> {
        const result =
            await this.databases.query<{
                code: string;
            }>(
                DATABASES.USER,

                `
        SELECT DISTINCT
          p.code

        FROM user_roles ur

        JOIN roles r
          ON r.id = ur.role_id

        JOIN role_permissions rp
          ON rp.role_id = r.id

        JOIN permissions p
          ON p.id = rp.permission_id

        WHERE ur.user_id = $1

          AND ur.status = 'ACTIVE'

          AND r.status = 'ACTIVE'

          AND r.scope = 'PLATFORM'

          AND ur.organization_id
              IS NULL
        `,

                [
                    userId,
                ],
            );

        const available =
            new Set(
                result.rows.map(
                    row => row.code,
                ),
            );

        return permissions.every(
            permission =>
                available.has(
                    permission,
                ),
        );
    }

    async hasTenantPermissions(
        userId: string,
        organizationId: string,
        permissions: string[],
    ): Promise<boolean> {
        const platformAllowed =
            await this
                .hasPlatformPermissions(
                    userId,
                    permissions,
                );

        if (platformAllowed) {
            return true;
        }

        const membership =
            await this.databases.query(
                DATABASES.USER,

                `
        SELECT 1
        FROM tenant_memberships

        WHERE user_id = $1

          AND organization_id = $2

          AND status = 'ACTIVE'

        LIMIT 1
        `,

                [
                    userId,
                    organizationId,
                ],
            );

        if (
            (membership.rowCount ?? 0)
            === 0
        ) {
            return false;
        }

        const result =
            await this.databases.query<{
                code: string;
            }>(
                DATABASES.USER,

                `
        SELECT DISTINCT
          p.code

        FROM user_roles ur

        JOIN roles r
          ON r.id = ur.role_id

        JOIN role_permissions rp
          ON rp.role_id = r.id

        JOIN permissions p
          ON p.id = rp.permission_id

        WHERE ur.user_id = $1

          AND ur.organization_id = $2

          AND ur.status = 'ACTIVE'

          AND r.status = 'ACTIVE'

          AND r.scope = 'TENANT'
        `,

                [
                    userId,
                    organizationId,
                ],
            );

        const available =
            new Set(
                result.rows.map(
                    row => row.code,
                ),
            );

        return permissions.every(
            permission =>
                available.has(
                    permission,
                ),
        );
    }

    async hasBranchPermissions(
        userId: string,
        organizationId: string,
        branchId: string,
        permissions: string[],
    ): Promise<boolean> {
        /*
         * Platform users can access
         * branches globally if they
         * possess the permission.
         */
        if (
            await this
                .hasPlatformPermissions(
                    userId,
                    permissions,
                )
        ) {
            return true;
        }

        /*
         * Tenant-level administrators
         * can operate across branches
         * without individual branch
         * memberships.
         */
        if (
            await this
                .hasTenantPermissions(
                    userId,
                    organizationId,
                    permissions,
                )
        ) {
            return true;
        }

        /*
         * Branch-scoped users must
         * explicitly belong to the
         * requested branch.
         */
        const membership =
            await this.databases.query(
                DATABASES.USER,

                `
        SELECT 1
        FROM branch_memberships

        WHERE user_id = $1

          AND organization_id = $2

          AND branch_id = $3

          AND status = 'ACTIVE'

        LIMIT 1
        `,

                [
                    userId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            (membership.rowCount ?? 0)
            === 0
        ) {
            return false;
        }

        const result =
            await this.databases.query<{
                code: string;
            }>(
                DATABASES.USER,

                `
        SELECT DISTINCT
          p.code

        FROM user_roles ur

        JOIN roles r
          ON r.id = ur.role_id

        JOIN role_permissions rp
          ON rp.role_id = r.id

        JOIN permissions p
          ON p.id = rp.permission_id

        WHERE ur.user_id = $1

          AND ur.organization_id = $2

          AND ur.status = 'ACTIVE'

          AND r.status = 'ACTIVE'

          AND r.scope = 'BRANCH'
        `,

                [
                    userId,
                    organizationId,
                ],
            );

        const available =
            new Set(
                result.rows.map(
                    row => row.code,
                ),
            );

        return permissions.every(
            permission =>
                available.has(
                    permission,
                ),
        );
    }
}