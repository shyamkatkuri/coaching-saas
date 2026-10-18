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

import {
    InternalServerErrorException,
} from '@nestjs/common';
import { getExecutionParams } from '../execution-request.util';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

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

        const params = getExecutionParams(context);

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
            context.getType<GqlContextType>() === 'graphql'
                ? GqlExecutionContext.create(context).getContext()?.req
                : context.switchToHttp().getRequest();

        if (!request) {
            throw new InternalServerErrorException(
                'Request is unavailable in the authorization context',
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

                const organizationIdValue = tenantParam ? params[tenantParam] : undefined;

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

                const organizationIdValue = tenantParam ? params[tenantParam] : undefined;

                const branchIdValue = branchParam ? params[branchParam] : undefined;

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