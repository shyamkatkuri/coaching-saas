import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    Reflector,
} from '@nestjs/core';

import {
    ACCESS_RULE_KEY,
} from './require-access.decorator';

import type {
    AccessRule,
} from './access-rule';

import {
    AuthorizationService,
} from './authorization.service';

import type {
    AuthenticatedRequest,
} from '../authentication/jwt-auth.guard';

@Injectable()
export class AuthorizationGuard
    implements CanActivate {
    constructor(
        private readonly reflector:
            Reflector,

        private readonly authorization:
            AuthorizationService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const rule =
            this.reflector
                .getAllAndOverride<AccessRule>(
                    ACCESS_RULE_KEY,
                    [
                        context.getHandler(),
                        context.getClass(),
                    ],
                );

        /*
         * Authentication is still
         * handled globally.
         *
         * No rule means:
         * authenticated but no
         * extra permission check.
         */
        if (!rule) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest<
                    AuthenticatedRequest
                >();

        if (!request.auth) {
            throw new UnauthorizedException(
                'Authentication context is missing',
            );
        }

        const userId =
            await this.authorization
                .getApplicationUserId(
                    request.auth.sub,
                );

        request.applicationUserId =
            userId;

        let allowed = false;

        switch (
        rule.scope
        ) {
            case 'PLATFORM':
                allowed =
                    await this.authorization
                        .hasPlatformPermissions(
                            userId,
                            rule.permissions,
                        );

                break;

            case 'TENANT': {
                const tenantParam =
                    rule.tenantParam ??
                    'organizationId';

                const organizationIdValue =
                    request.params[
                    tenantParam
                    ];

                const organizationId =
                    Array.isArray(organizationIdValue)
                        ? organizationIdValue[0]
                        : organizationIdValue;

                if (!organizationId) {
                    throw new ForbiddenException(
                        'Tenant context is missing',
                    );
                }

                allowed =
                    await this.authorization
                        .hasTenantPermissions(
                            userId,
                            organizationId,
                            rule.permissions,
                        );

                break;
            }

            case 'BRANCH': {
                const tenantParam =
                    rule.tenantParam ??
                    'organizationId';

                const branchParam =
                    rule.branchParam ??
                    'branchId';

                const organizationIdValue =
                    request.params[
                    tenantParam
                    ];

                const branchIdValue =
                    request.params[
                    branchParam
                    ];

                const organizationId =
                    Array.isArray(organizationIdValue)
                        ? organizationIdValue[0]
                        : organizationIdValue;

                const branchId =
                    Array.isArray(branchIdValue)
                        ? branchIdValue[0]
                        : branchIdValue;

                if (
                    !organizationId ||
                    !branchId
                ) {
                    throw new ForbiddenException(
                        'Tenant or branch context is missing',
                    );
                }

                allowed =
                    await this.authorization
                        .hasBranchPermissions(
                            userId,
                            organizationId,
                            branchId,
                            rule.permissions,
                        );

                break;
            }
        }

        if (!allowed) {
            throw new ForbiddenException(
                'Insufficient permissions',
            );
        }

        return true;
    }
}