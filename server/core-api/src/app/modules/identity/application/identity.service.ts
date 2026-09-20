import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    DatabaseRegistryService,
} from '../../../core/database/database-registry.service';

import {
    DATABASES,
} from '../../../core/database/database.constants';

@Injectable()
export class IdentityService {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    async getMe(
        keycloakSubject: string,
    ) {

        const db =
            this.databases.getPool(
                DATABASES.USER,
            );

        const userResult =
            await db.query(
                `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            user_type
        FROM users
        WHERE keycloak_user_id = $1
          AND status = 'ACTIVE'
        LIMIT 1
        `,
                [
                    keycloakSubject,
                ],
            );

        if (
            userResult.rowCount === 0
        ) {
            throw new UnauthorizedException(
                'Application user not found',
            );
        }

        const user =
            userResult.rows[0];

        const membershipResult =
            await db.query(
                `
        SELECT
            organization_id,
            is_primary,
            status
        FROM tenant_memberships
        WHERE user_id = $1
          AND status = 'ACTIVE'
        `,
                [
                    user.id,
                ],
            );

        const roleResult =
            await db.query(
                `
        SELECT
            ur.organization_id,
            r.code,
            r.name,
            r.scope
        FROM user_roles ur
        JOIN roles r
          ON r.id = ur.role_id
        WHERE ur.user_id = $1
          AND ur.status = 'ACTIVE'
          AND r.status = 'ACTIVE'
        `,
                [
                    user.id,
                ],
            );

        const branchResult =
            await db.query(
                `
        SELECT
            organization_id,
            branch_id
        FROM branch_memberships
        WHERE user_id = $1
          AND status = 'ACTIVE'
        `,
                [
                    user.id,
                ],
            );

        return {
            id:
                user.id,

            firstName:
                user.first_name,

            lastName:
                user.last_name,

            email:
                user.email,

            userType:
                user.user_type,

            memberships:
                membershipResult.rows,

            roles:
                roleResult.rows,

            branches:
                branchResult.rows,
        };
    }
}