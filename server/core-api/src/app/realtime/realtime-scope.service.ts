import {
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import {
    DATABASES,
} from '../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../core/database/database-registry.service';

@Injectable()
export class RealtimeScopeService {

    constructor(
        private readonly databases:
            DatabaseRegistryService,
    ) { }

    async assertOrganizationAccess(
        applicationUserId:
            string,

        organizationId:
            string,
    ): Promise<void> {

        if (
            await this.isSuperAdmin(
                applicationUserId,
            )
        ) {
            return;
        }

        const db =
            this.databases.getPool(
                DATABASES.USER,
            );

        const result =
            await db.query(
                `
        SELECT 1

        FROM tenant_memberships

        WHERE user_id = $1
          AND organization_id = $2
          AND status = 'ACTIVE'

        LIMIT 1
        `,
                [
                    applicationUserId,
                    organizationId,
                ],
            );

        if (
            result.rowCount === 0
        ) {

            throw new ForbiddenException(
                'Organization access denied',
            );
        }
    }

    async assertBranchAccess(
        applicationUserId:
            string,

        organizationId:
            string,

        branchId:
            string,
    ): Promise<void> {

        if (
            await this.isSuperAdmin(
                applicationUserId,
            )
        ) {
            return;
        }

        await this
            .assertOrganizationAccess(
                applicationUserId,
                organizationId,
            );

        const db =
            this.databases.getPool(
                DATABASES.USER,
            );

        const result =
            await db.query(
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
                    applicationUserId,
                    organizationId,
                    branchId,
                ],
            );

        if (
            result.rowCount === 0
        ) {

            throw new ForbiddenException(
                'Branch access denied',
            );
        }
    }

    private async isSuperAdmin(
        applicationUserId:
            string,
    ): Promise<boolean> {

        const db =
            this.databases.getPool(
                DATABASES.USER,
            );

        const result =
            await db.query(
                `
        SELECT 1

        FROM user_roles ur

        JOIN roles r
          ON r.id =
             ur.role_id

        WHERE ur.user_id = $1
          AND r.code =
              'SUPER_ADMIN'

        LIMIT 1
        `,
                [
                    applicationUserId,
                ],
            );

        return (
            result.rowCount !==
            0
        );
    }
}